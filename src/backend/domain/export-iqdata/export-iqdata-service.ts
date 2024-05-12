import { logger } from 'elastic-apm-node';
import { ExportBatchStatus } from 'src/backend/database/export-batches/export-batch-entity';
import { ExportBatchInfluencerRepository } from 'src/backend/database/export-batches/export-batch-influencer-repository';
import { ExportBatchRepository } from 'src/backend/database/export-batches/export-batch-repository';
import { type InfluencerSocialProfileEntity } from 'src/backend/database/influencer/influencer-social-profile-entity';
import { InfluencerSocialProfileRepository } from 'src/backend/database/influencer/influencer-social-profile-repository';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import BoostbotService from 'src/backend/integration/boostbot/boostbot-service';
import { delay } from 'src/backend/integration/distributed-queue/distributed-queue';
import IQDataService from 'src/backend/integration/iqdata/iqdata-service';
import { UseLogger } from 'src/backend/integration/logger/decorator';
import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';

export default class ExportIqdataService {
    public static readonly service: ExportIqdataService = new ExportIqdataService();
    static getService(): ExportIqdataService {
        return ExportIqdataService.service;
    }
    extractIqdataId(referenceId: string) {
        const ids = referenceId.split(':');
        if (ids.length > 1) {
            return ids[1];
        }
        return ids[0];
    }
    @UseTransaction()
    @UseLogger()
    async addInfluncerExportBatch(influencers: InfluencerSocialProfileEntity[]) {
        const existedBatchInfluencer = await ExportBatchInfluencerRepository.getRepository().getByIds(
            influencers.map((influencer) => this.extractIqdataId(influencer.referenceId)),
        );
        const influencerPlatforms: Record<string, InfluencerSocialProfileEntity[]> = influencers.reduce(
            (acc, influencer) => {
                // ignore added influencers
                if (
                    existedBatchInfluencer.find(
                        (batchInfluencer) =>
                            batchInfluencer.iqDataReferenceId === this.extractIqdataId(influencer.referenceId),
                    )
                ) {
                    return acc;
                }
                if (!acc[influencer.platform]) {
                    acc[influencer.platform] = [];
                }
                acc[influencer.platform].push({
                    ...influencer,
                    referenceId: this.extractIqdataId(influencer.referenceId),
                });
                return acc;
            },
            {} as Record<string, InfluencerSocialProfileEntity[]>,
        );
        const platformKeys = Object.keys(influencerPlatforms);
        await Promise.all(
            platformKeys.map(async (platform) => {
                const [err, exportId] = await awaitToError(
                    IQDataService.getService().createNewExport(
                        platform,
                        influencerPlatforms[platform].map((influencers) => influencers.referenceId),
                    ),
                );
                if (err) return;
                const exportBatch = await ExportBatchRepository.getRepository().save({
                    exportId: exportId,
                    status: ExportBatchStatus.PENDING,
                });
                await ExportBatchInfluencerRepository.getRepository().save([
                    ...influencerPlatforms[platform].map((influencer) => ({
                        exportBatch,
                        iqDataReferenceId: influencer.referenceId,
                    })),
                ]);
            }),
        );
    }

    @UseLogger()
    async runScheduler() {
        const exportData = await ExportBatchRepository.getRepository().getPending();
        for (let index = 0; index < exportData.length; index++) {
            const element = exportData[index];
            await delay(1000); // delay 1 second to avoid rate limit
            BoostbotService.getService()
                .triggerIQDataExport(element.exportId)
                .then((result) => {
                    logger.info(`Export ${element.exportId} has been triggered`, result);
                });
        }
    }
    @UseLogger()
    async fetchExport(exportId: string) {
        const exportBatch = await ExportBatchRepository.getRepository().findOneBy({
            exportId,
        });
        if (!exportBatch) {
            throw new NotFoundError('Export batch not found');
        }
        if (exportBatch.status === ExportBatchStatus.PROCESSING) {
            return {
                message: 'Export is already processing',
            };
        }
        await ExportBatchRepository.getRepository().update(
            {
                exportId,
            },
            {
                status: ExportBatchStatus.PROCESSING,
            },
        );
        const [err, result] = await awaitToError(IQDataService.getService().getExportResult(exportId));
        if (err) {
            logger.error(`error fetching export result ${err.message}`, {
                stack: err.stack,
                err,
            });

            await ExportBatchRepository.getRepository().update(
                {
                    exportId,
                },
                {
                    status: ExportBatchStatus.FAILED,
                },
            );
        }
        logger.info(`resultnya`, result);
        await ExportBatchRepository.getRepository().update(
            {
                exportId,
            },
            {
                status: ExportBatchStatus.COMPLETED,
                lastCompletedAt: new Date(),
                result,
            },
        );

        await Promise.all(
            result.map(async ({ account: { user_profile: profile } }) => {
                const email = profile.contacts.find((c) => c.type === 'email')?.value;
                if (!email) {
                    return;
                }
                await InfluencerSocialProfileRepository.getRepository().update(
                    {
                        referenceId: `iqdata:${profile.user_id}`,
                    },
                    {
                        email,
                    },
                );

                await SequenceInfluencerRepository.getRepository().update(
                    {
                        iqdataId: profile.user_id,
                    },
                    {
                        email,
                    },
                );
            }),
        );
        return {
            message: 'Export completed',
        };
    }
}
