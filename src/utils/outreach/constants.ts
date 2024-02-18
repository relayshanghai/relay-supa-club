import { z } from 'zod';

export const MAILBOX_PATH_ALL = '[Gmail]/All Mail';

export const THREAD_STATUS = z.enum(['unopened', 'unreplied', 'replied']);

export type THREAD_STATUS = z.infer<typeof THREAD_STATUS>;

export const FUNNEL_STATUS_VALUES = [
    'To Contact',
    'In Sequence',
    'Ignored',
    'Negotiating',
    'Confirmed',
    'Shipped',
    'Rejected',
    'Received',
    'Completed',
    'Content Approval',
    'Posted',
] as const;

export const FUNNEL_STATUS = z.enum(FUNNEL_STATUS_VALUES);

export type FUNNEL_STATUS = z.infer<typeof FUNNEL_STATUS>;

export type MESSAGE_TYPES = 'Sent' | 'Reply' | 'New' | 'Trash' | 'Draft' | 'Warmup' | 'Forward';

export type EMAIL_CONTACT_TYPE = 'from' | 'to' | 'cc' | 'bcc';

/**
 * The type of contact in the thread
 *
 * - `user`: an application user (with an email engine account)
 * - `influencer`: the target influencer
 * - `participant`: any other contacts in the thread
 * - `cc`: participants that are cc'ed
 * - `bcc`: participants that are bcc'ed
 */
export type THREAD_CONTACT_TYPE = 'user' | 'influencer' | 'participant' | 'cc' | 'bcc';
