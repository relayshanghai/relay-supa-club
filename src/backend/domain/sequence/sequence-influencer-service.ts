import { type CompanyEntity } from 'src/backend/database/company/company-entity';
import { InfluencerRepository } from 'src/backend/database/influencer/influencer-repository';
import { type InfluencerSocialProfileEntity } from 'src/backend/database/influencer/influencer-social-profile-entity';
import { InfluencerSocialProfileRepository } from 'src/backend/database/influencer/influencer-social-profile-repository';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import { type SequenceInfluencerEntity } from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import { SubscriptionStatus } from 'src/backend/database/subcription/subscription-entity';
import { UsageRepository } from 'src/backend/database/usages/repository';
import BoostbotService from 'src/backend/integration/boostbot/boostbot-service';
import { delay } from 'src/backend/integration/distributed-queue/distributed-queue';
import IQDataService from 'src/backend/integration/iqdata/iqdata-service';
import { logger } from 'src/backend/integration/logger';
import { UseLogger } from 'src/backend/integration/logger/decorator';
import { findMostRecentPostWithTextOrTitle } from 'src/utils/api/iqdata/extract-influencer';
import { NotFoundError } from 'src/utils/error/http-error';
import { type DeepPartial, IsNull, MoreThanOrEqual, Not, Between } from 'typeorm';
import { type CreatorReport } from 'types';
import BalanceService from '../balance/balance-service';
import { BalanceType } from 'src/backend/database/balance/balance-entity';
import { RequestContext } from 'src/utils/request-context/request-context';
import { SequenceInfluencerScheduleStatus } from 'types/v2/sequence-influencer';

export default class SequenceInfluencerService {
    public static readonly service: SequenceInfluencerService = new SequenceInfluencerService();
    static getService(): SequenceInfluencerService {
        return SequenceInfluencerService.service;
    }

    @UseLogger()
    async startScheduler() {
        const sequenceInfluencers = await SequenceInfluencerRepository.getRepository().getIdsForSyncReport();
        for (const sequenceInfluencer of sequenceInfluencers) {
            BoostbotService.getService().triggerSequenceInfluencerReport(sequenceInfluencer).then().catch();
            await delay(1000);
        }
    }

    async checkUsage(company: CompanyEntity) {
        if (!company.subscription) {
            throw new Error('Subscription not found');
        }
        if (![SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL].includes(company.subscription?.status)) {
            throw new Error('Subscription not active');
        }
        await BalanceService.getService().checkBalance(BalanceType.PROFILE, 1, company.id);
    }

    async storeUsage(company: CompanyEntity, iqDataId: string) {
        const profile = await ProfileRepository.getRepository().findOne({
            where: {
                company: {
                    id: company.id,
                },
            },
        });
        if (!profile) return;
        const endDate = new Date((company.subscription?.cancelledAt || company.subscription?.pausedAt) as Date);
        const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
        const exists = await UsageRepository.getRepository().findOne({
            where: {
                company: {
                    id: company.id,
                },
                type: 'profile',
                profile: {
                    id: profile.id,
                },
                itemId: iqDataId,
                createdAt: Between(startDate, endDate),
            },
        });
        if (exists) return;
        await Promise.all([
            BalanceService.getService().deductBalanceInProcess(BalanceType.PROFILE),
            UsageRepository.getRepository().save({
                company: {
                    id: company.id,
                },
                type: 'profile',
                profile: {
                    id: profile.id,
                },
                itemId: iqDataId,
            }),
        ]);
    }
    @UseLogger()
    async startSyncReport(sequenceInfluencerId: string) {
        try {
            const sequenceInfluencer = await SequenceInfluencerRepository.getRepository().findOne({
                where: {
                    id: sequenceInfluencerId,
                },
                relations: ['company', 'influencerSocialProfile', 'company.subscription'],
            });
            if (!sequenceInfluencer) {
                throw new NotFoundError('Sequence Influencer not found');
            }
            RequestContext.setContext({
                companyId: sequenceInfluencer.company.id,
            });
            await this.checkUsage(sequenceInfluencer.company);
            await SequenceInfluencerRepository.getRepository().update(
                {
                    id: sequenceInfluencerId,
                },
                {
                    scheduleStatus: SequenceInfluencerScheduleStatus.PROCESSING,
                },
            );
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            const similarSequenceInfluencers = await SequenceInfluencerRepository.getRepository().findOne({
                where: {
                    email: Not(IsNull()),
                    iqdataId: sequenceInfluencer.iqdataId,
                    socialProfileLastFetched: MoreThanOrEqual(last30Days),
                },
            });
            if (similarSequenceInfluencers) {
                const socialProfile = await InfluencerSocialProfileRepository.getRepository().findOne({
                    where: [
                        {
                            referenceId: `iqdata:${similarSequenceInfluencers.iqdataId}`,
                        },
                        {
                            referenceId: similarSequenceInfluencers.iqdataId,
                        },
                    ],
                });
                await SequenceInfluencerRepository.getRepository().update(
                    {
                        id: sequenceInfluencer.id,
                    },
                    {
                        scheduleStatus: SequenceInfluencerScheduleStatus.COMPLETED,
                        email: similarSequenceInfluencers.email,
                        tags: similarSequenceInfluencers.tags,
                        socialProfileLastFetched: similarSequenceInfluencers.socialProfileLastFetched,
                        influencerSocialProfile: socialProfile || sequenceInfluencer.influencerSocialProfile,
                    },
                );
                await this.storeUsage(sequenceInfluencer.company, sequenceInfluencer.iqdataId);
                return;
            }
            if (!sequenceInfluencer.iqdataId) {
                throw new Error('unknown reference id');
            }

            const ids = sequenceInfluencer.iqdataId.split(':');
            const referenceId = ids.length > 1 ? ids[1] : ids[0];
            const report = await IQDataService.getService().getReportMetaData(sequenceInfluencer.platform, referenceId);
            let reportData: CreatorReport;
            if (report) reportData = await IQDataService.getService().getReport(report.id);
            else
                reportData = await IQDataService.getService().requestNewReport(
                    sequenceInfluencer.platform,
                    referenceId,
                );
            const socialInfluencer = await this.syncInfluencerProfile(reportData, sequenceInfluencer.platform);
            if (socialInfluencer) {
                sequenceInfluencer.influencerSocialProfile = socialInfluencer;
            }
            sequenceInfluencer.influencerSocialProfile = socialInfluencer;
            await this.syncSequenceInfluencer(sequenceInfluencer, reportData);
            await this.storeUsage(sequenceInfluencer.company, sequenceInfluencer.iqdataId);

            return;
        } catch (e) {
            const err = e as Error;
            logger.error('sync error', {
                error: err,
                message: err.message,
                stack: err.stack,
            });
            await SequenceInfluencerRepository.getRepository().update(
                {
                    id: sequenceInfluencerId,
                },
                {
                    scheduleStatus: err.message.includes('limit')
                        ? SequenceInfluencerScheduleStatus.INSUFICIENT_BALANCE
                        : SequenceInfluencerScheduleStatus.FAILED,
                },
            );
            throw e;
        }
    }
    async syncSequenceInfluencer(sequenceInfluencer: SequenceInfluencerEntity, reportData: CreatorReport) {
        const tags = reportData.user_profile.relevant_tags?.map((tag) => tag.tag).slice(0, 3) || ([] as string[]);
        const email = reportData.user_profile.contacts?.filter((value) => value.type === 'email')[0]?.value || null;
        const toUpdate: DeepPartial<SequenceInfluencerEntity> = {
            scheduleStatus: SequenceInfluencerScheduleStatus.COMPLETED,
            socialProfileLastFetched: new Date(),
            avatarUrl: reportData.user_profile.picture,
            url: reportData.user_profile.url,
            influencerSocialProfile: sequenceInfluencer.influencerSocialProfile,
        };
        if (email) toUpdate.email = email;
        if (tags.length) toUpdate.tags = tags;

        await SequenceInfluencerRepository.getRepository().update(
            {
                id: sequenceInfluencer.id,
            },
            toUpdate,
        );
    }
    async syncInfluencerProfile(reportData: CreatorReport, platform: string) {
        const email = reportData.user_profile.contacts.filter((value) => value.type === 'email')[0]?.value || null;
        const toUpdate: DeepPartial<InfluencerSocialProfileEntity> = {
            name:
                reportData.user_profile.fullname ||
                reportData.user_profile.username ||
                reportData.user_profile.handle ||
                reportData.user_profile.custom_name ||
                '',
            platform: platform,

            avatarUrl: reportData.user_profile.picture,
            url: reportData.user_profile.url,
            recentPostTitle:
                reportData.user_profile.recent_posts?.find((post) => post.text || post.title)?.title ||
                reportData.user_profile.recent_posts?.find((post) => post.text || post.title)?.text ||
                '',
            recentPostUrl: reportData.user_profile.recent_posts?.find((post) => post.link)?.link || '',
            topicTags: reportData.user_profile.relevant_tags,
            data: reportData.user_profile,
        };
        const post = findMostRecentPostWithTextOrTitle(reportData.user_profile.recent_posts);
        if (post.postTitle) {
            toUpdate.recentPostTitle = post.postTitle;
            toUpdate.recentPostUrl = post.postLink;
        }
        if (email) toUpdate.email = email;
        let socialProfile = await InfluencerSocialProfileRepository.getRepository().findOne({
            where: [
                {
                    referenceId: `iqdata:${reportData.user_profile.user_id}`,
                },
                {
                    referenceId: reportData.user_profile.user_id,
                },
            ],
        });
        if (socialProfile) {
            await InfluencerSocialProfileRepository.getRepository().update(
                {
                    id: socialProfile.id,
                },
                toUpdate,
            );
        } else {
            const insertedInfluencer = await InfluencerRepository.getRepository().save({
                name: toUpdate.name,
                email: toUpdate.email,
                avatarUrl: toUpdate.avatarUrl,
                url: toUpdate.url,
                platform: toUpdate.platform,
            });
            socialProfile = await InfluencerSocialProfileRepository.getRepository().save({
                ...toUpdate,
                referenceId: `iqdata:${reportData.user_profile.user_id}`,
                influencer: insertedInfluencer,
                username: reportData.user_profile.username || reportData.user_profile.user_id || '',
            });
        }

        return socialProfile;
    }
}
