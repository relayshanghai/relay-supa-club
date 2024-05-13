import { type InfluencerSocialProfileEntity } from 'src/backend/database/influencer/influencer-social-profile-entity';
import { InfluencerSocialProfileRepository } from 'src/backend/database/influencer/influencer-social-profile-repository';
import {
    type SequenceInfluencerEntity,
    SequenceInfluencerScheduleStatus,
} from 'src/backend/database/sequence/sequence-influencer-entity';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import BoostbotService from 'src/backend/integration/boostbot/boostbot-service';
import { delay } from 'src/backend/integration/distributed-queue/distributed-queue';
import IQDataService from 'src/backend/integration/iqdata/iqdata-service';
import { UseLogger } from 'src/backend/integration/logger/decorator';
import { findMostRecentPostWithTextOrTitle } from 'src/utils/api/iqdata/extract-influencer';
import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';
import { type DeepPartial, IsNull, MoreThanOrEqual, Not } from 'typeorm';
import { type CreatorReport } from 'types';

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
    @UseLogger()
    async startSyncReport(sequenceInfluencerId: string) {
        await SequenceInfluencerRepository.getRepository().update(
            {
                id: sequenceInfluencerId,
            },
            {
                scheduleStatus: SequenceInfluencerScheduleStatus.PROCESSING,
            },
        );
        try {
            const sequenceInfluencer = await SequenceInfluencerRepository.getRepository().findOne({
                where: {
                    id: sequenceInfluencerId,
                },
                relations: ['influencerSocialProfile'],
            });
            if (!sequenceInfluencer) {
                throw new NotFoundError('Sequence Influencer not found');
            }
            const last30Days = new Date();
            last30Days.setDate(last30Days.getDate() - 30);
            const similarSequenceInfluencers = await SequenceInfluencerRepository.getRepository().findOne({
                where: {
                    email: Not(IsNull()),
                    influencerSocialProfile: {
                        id: sequenceInfluencer?.influencerSocialProfile?.id,
                    },
                    socialProfileLastFetched: MoreThanOrEqual(last30Days),
                },
            });
            if (similarSequenceInfluencers) {
                await SequenceInfluencerRepository.getRepository().update(
                    {
                        id: sequenceInfluencer.id,
                    },
                    {
                        scheduleStatus: SequenceInfluencerScheduleStatus.COMPLETED,
                        email: similarSequenceInfluencers.email,
                        tags: similarSequenceInfluencers.tags,
                        socialProfileLastFetched: similarSequenceInfluencers.socialProfileLastFetched,
                    },
                );
                return;
            }
            if (!sequenceInfluencer.influencerSocialProfile?.referenceId) {
                throw new Error('unknown reference id');
            }
            const ids = sequenceInfluencer.influencerSocialProfile.referenceId.split(':');
            const referenceId = ids.length > 1 ? ids[1] : ids[0];
            const report = await IQDataService.getService().getReportMetaData(sequenceInfluencer.platform, referenceId);
            let reportData: CreatorReport;
            if (report) {
                reportData = await IQDataService.getService().getReport(report.id);
            } else
                reportData = await IQDataService.getService().requestNewReport(
                    sequenceInfluencer.platform,
                    referenceId,
                );

            await Promise.all([
                this.syncSequenceInfluencer(sequenceInfluencer, reportData),
                awaitToError(
                    this.syncInfluencerProfile(
                        sequenceInfluencer.influencerSocialProfile as InfluencerSocialProfileEntity,
                        reportData,
                    ),
                ),
            ]);
            return;
        } catch (e) {
            await SequenceInfluencerRepository.getRepository().update(
                {
                    id: sequenceInfluencerId,
                },
                {
                    scheduleStatus: SequenceInfluencerScheduleStatus.FAILED,
                },
            );
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
    async syncInfluencerProfile(profile: InfluencerSocialProfileEntity, reportData: CreatorReport) {
        const email = reportData.user_profile.contacts.filter((value) => value.type === 'email')[0]?.value || null;
        const toUpdate: DeepPartial<InfluencerSocialProfileEntity> = {
            name:
                reportData.user_profile.fullname ||
                reportData.user_profile.username ||
                reportData.user_profile.handle ||
                reportData.user_profile.custom_name ||
                '',
            avatarUrl: reportData.user_profile.picture,
            recentPostTitle:
                reportData.user_profile.recent_posts?.find((post) => post.text || post.title)?.title ||
                reportData.user_profile.recent_posts?.find((post) => post.text || post.title)?.text ||
                '',
            recentPostUrl: reportData.user_profile.recent_posts?.find((post) => post.link)?.link || '',
            topicTags: reportData.user_profile.relevant_tags,
        };
        const post = findMostRecentPostWithTextOrTitle(reportData.user_profile.recent_posts);
        if (post.postTitle) {
            toUpdate.recentPostTitle = post.postTitle;
            toUpdate.recentPostUrl = post.postLink;
        }
        if (email) toUpdate.email = email;

        await InfluencerSocialProfileRepository.getRepository().update(
            {
                id: profile.id,
            },
            toUpdate,
        );
    }
}
