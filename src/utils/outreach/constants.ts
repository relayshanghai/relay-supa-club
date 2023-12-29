import { z } from 'zod';

export const MAILBOX_PATH_ALL = '[Gmail]/All Mail';

export const THREAD_STATUS = z.enum(['unopened', 'unreplied', 'replied']);

export type THREAD_STATUS = z.infer<typeof THREAD_STATUS>;

export type MESSAGE_TYPES = 'Sent' | 'Reply' | 'New' | 'Trash' | 'Draft';
