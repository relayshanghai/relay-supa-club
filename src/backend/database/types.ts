import type { sequenceEmails } from 'drizzle/schema';

export type SequenceEmailUpdate = [id: string, update: Partial<typeof sequenceEmails.$inferSelect>];
