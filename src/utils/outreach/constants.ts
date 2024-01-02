import { z } from 'zod';

export const MAILBOX_PATH_ALL = '[Gmail]/All Mail';

export const THREAD_STATUS = z.enum(['unopened', 'unreplied', 'replied']);

export type THREAD_STATUS = z.infer<typeof THREAD_STATUS>;

export const FUNNEL_STATUS = z.enum([
    'To Contact',
    'In Sequence',
    'Ignored',
    'Negotiating',
    'Confirmed',
    'Shipped',
    'Rejected',
    'Received',
    'Content Approval',
    'Posted',
]);

export type FUNNEL_STATUS = z.infer<typeof FUNNEL_STATUS>;

export type MESSAGE_TYPES = 'Sent' | 'Reply' | 'New' | 'Trash' | 'Draft';
