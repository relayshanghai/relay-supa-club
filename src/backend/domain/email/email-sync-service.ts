import EmailEngineService from 'src/backend/integration/email-engine/email-engine';
import KVService from 'src/backend/integration/kv';
import dayjs from 'dayjs';
import { arrayChunk } from 'src/utils/chunk';
import type { SearchResponseMessage } from 'src/backend/integration/email-engine/account-search-types';
import ThreadRepository from 'src/backend/database/thread/thread-repository';
import EmailRepository from 'src/backend/database/thread/email-repository';
import { EmailEntity } from 'src/backend/database/thread/email-entity';
import EmailHelperService from './email-helper-service';
import { ThreadEntity, ThreadStatus } from 'src/backend/database/thread/thread-entity';
import SequenceInfluencerRepository from 'src/backend/database/sequence/sequence-influencer-repository';
import { UseTransaction } from 'src/backend/database/provider/transaction-decorator';
import { ProfileRepository } from 'src/backend/database/profile/profile-repository';
import { NotFoundError } from 'src/utils/error/http-error';
import type { ThreadContactEntity } from 'src/backend/database/thread/email-contact-entity';
import awaitToError from 'src/utils/await-to-error';
import EmailContactRepository from 'src/backend/database/thread/email-contact-repository';
import ThreadContactRepository from 'src/backend/database/thread/thread-contact-repository';
import { RequestContext } from 'src/utils/request-context/request-context';
import type { ProfileEntity } from 'src/backend/database/profile/profile-entity';
import { UseLogger } from 'src/backend/integration/logger/decorator';
import { logger } from 'src/backend/integration/logger';
import BoostbotService from 'src/backend/integration/boostbot/boostbot-service';

export default class EmailSyncService {
    static service = new EmailSyncService();
    static getService = () => EmailSyncService.service;

    @UseTransaction()
    @UseLogger()
    private async syncEmail(emailEngineAccountId: string, threadId: string, emails: SearchResponseMessage[]) {
        emails = emails.sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
        let thread = await ThreadRepository.getRepository().findOne({
            where: {
                threadId,
            },
            relations: ['emails', 'contacts', 'contacts.emailContact', 'sequenceInfluencer'],
        });
        let newEmails: SearchResponseMessage[];
        if (!thread) {
            logger.info(`no thread, will create new one`, { threadId, emailEngineAccountId });
            // ge sequence influencer by id
            const sequenceInfluencer = await SequenceInfluencerRepository.getRepository().getSequenceInfluencerByEmail(
                ...emails.map((e) => [...e.to.map((e) => e.address)].flat()).flat(),
            );
            if (!sequenceInfluencer) {
                logger.info(`no influencer`, { threadId, emailEngineAccountId });
                return;
            }
            newEmails = emails;
            thread = new ThreadEntity();
            thread.threadId = threadId;
            thread.sequenceInfluencer = sequenceInfluencer;
            thread.emailEngineAccountId = emailEngineAccountId;
            thread.createdAt = new Date();
            thread.threadStatus = ThreadStatus.UNOPENED;
            await ThreadRepository.getRepository().save(thread);
            thread = await ThreadRepository.getRepository().findOne({
                where: {
                    threadId,
                },
                relations: ['emails', 'contacts', 'contacts.emailContact', 'sequenceInfluencer'],
            });
        } else {
            logger.info(`thread exists`, { threadId, emailEngineAccountId });
            const existedEmails = emails.filter((email) =>
                thread?.emails?.find((e) => e.emailEngineMessageId === email.messageId),
            );
            await EmailRepository.getRepository().updateByEmailEngineMessageIds(
                existedEmails.map((e) => e.id),
                {
                    deletedAt: undefined,
                },
            );
            newEmails = emails.filter(
                (email) => !thread?.emails?.find((e) => e.emailEngineMessageId === email.messageId),
            );
        }

        const threadContacts: ThreadContactEntity[] = [];
        const entities = await Promise.all(
            newEmails.map(async (email) => {
                const message = await EmailEngineService.getService().getAccountMessageById(
                    emailEngineAccountId,
                    email.id,
                );
                const [, type] = await awaitToError(EmailHelperService.getService().getMessageType(message));
                if (!type || type?.type === 'Draft') return;
                const entity = new EmailEntity();
                entity.emailEngineMessageId = email.emailId;
                entity.emailEngineId = email.id;
                entity.thread = thread as ThreadEntity;
                entity.createdAt = new Date(email.date);
                entity.updatedAt = new Date(email.date);
                entity.data = message;
                entity.emailEngineAccountId = emailEngineAccountId;
                entity.sender = EmailHelperService.getService().stringifyContacts(message.sender);
                entity.recipients = EmailHelperService.getService().stringifyContacts(...message.to);
                const emailContacts = EmailHelperService.getService().getMessageContacts(message);
                if (
                    !thread?.contacts?.find((c) =>
                        emailContacts.find((ec) => ec.emailContact.address === c.emailContact.address),
                    )
                ) {
                    for (const emailContact of emailContacts) {
                        // avoid duplicates
                        if (threadContacts.find((c) => c.emailContact.address !== emailContact.emailContact.address))
                            threadContacts.push(emailContact);
                    }
                }
                return entity;
            }),
        );
        const existedContact = await EmailContactRepository.getRepository().getAllByAddresses(
            threadContacts.map((e) => e.emailContact.address),
        );
        const newThreadContacts = threadContacts.filter(
            (e) => !existedContact.find((c) => c.address === e.emailContact.address),
        );
        const existedThreadContact = threadContacts.reduce((acc, tc) => {
            const contact = existedContact.find((c) => c.address !== tc.emailContact.address);
            if (contact) {
                tc.emailContact = contact;
                tc.thread = thread as ThreadEntity;
                acc.push(tc);
            }
            return acc;
        }, [] as ThreadContactEntity[]);
        await Promise.all([
            EmailRepository.getRepository().upsert(entities.filter((e) => e) as EmailEntity[], {
                conflictPaths: ['emailEngineId'],
            }),
            EmailContactRepository.getRepository().upsert(
                newThreadContacts.map((contact) => contact.emailContact),
                {
                    conflictPaths: ['address'],
                },
            ),
        ]);
        const savedEmailContacts = await EmailContactRepository.getRepository().getAllByAddresses(
            newThreadContacts.map((e) => e.emailContact.address),
        );
        const toUpdate: Partial<ThreadEntity> = {
            deletedAt: undefined,
        };
        const profile = RequestContext.getContext().profile as ProfileEntity;
        if (newEmails.length > 0) {
            const lastEmail = newEmails[newEmails.length - 1];

            if (lastEmail.from?.address !== profile.sequenceSendEmail) {
                toUpdate.lastReplyDate = new Date(newEmails[newEmails.length - 1].date);
                toUpdate.lastReplyId = newEmails[newEmails.length - 1].id;
            }
        }

        await Promise.all([
            ThreadContactRepository.getRepository().save([
                ...newThreadContacts
                    .map((contact) => {
                        return {
                            ...contact,
                            emailContact: savedEmailContacts.find((c) => contact.emailContact?.address === c.address),
                        };
                    })
                    .filter((e) => e.emailContact),
                ...existedThreadContact,
            ]),
            ThreadRepository.getRepository().update({ threadId: thread?.threadId }, toUpdate),
        ]);
    }
    @UseLogger()
    async syncEmailByAccountId(emailEngineAccountId: string) {
        const profile = await ProfileRepository.getRepository().findOneBy({
            emailEngineAccountId,
        });
        if (!profile) {
            throw new NotFoundError('No profile');
        }
        RequestContext.setContext({
            profile,
        });
        const kvKey = `email-sync-${emailEngineAccountId}`;
        const lastSyncDate = await KVService.getService().get<string>(kvKey);
        const currentDate = dayjs();
        const emails = await EmailEngineService.getService().getAllEmailsByAccountId(emailEngineAccountId, {
            page: 0,
            search: {
                since: lastSyncDate,
            },
        });

        const [threads, groupEmailThreads]: [string[], Record<string, SearchResponseMessage[]>] = emails.reduce(
            (acc, email) => {
                if (!acc[1][email.threadId]) {
                    acc[1][email.threadId] = [];
                    acc[0].push(email.threadId);
                }
                if (acc[1][email.threadId].find((e) => e.id === email.id)) return acc;
                acc[1][email.threadId].push(email);
                return acc;
            },
            [[] as string[], {} as Record<string, SearchResponseMessage[]>],
        );
        // chunk threads to 10 per process
        const chunkedThreads = arrayChunk(threads, 10);
        for (const chunk of chunkedThreads)
            await Promise.all(
                chunk.map((threadId) => this.syncEmail(emailEngineAccountId, threadId, groupEmailThreads[threadId])),
            );

        await KVService.getService().set(kvKey, currentDate.format('YYYY-MM-DD')).catch();
    }

    @UseLogger()
    async syncEmails() {
        const accounts = await EmailEngineService.getService().getAllAccounts();
        await Promise.all(accounts.map(({ account }) => BoostbotService.getService().triggerSyncEmailAccount(account)));
    }
}
