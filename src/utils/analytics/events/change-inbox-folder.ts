import type { TriggerEvent } from '../types';

export const CHANGE_INBOX_FOLDER = 'Change Inbox Folder';

export type ChangeInboxFolderPayload = {
    sequence_email_address: string;
    current_email_folder: string;
    selected_email_folder: string;
    total_unread_emails: number;
};

export const ChangeInboxFolder = (trigger: TriggerEvent, value?: ChangeInboxFolderPayload) =>
    trigger(CHANGE_INBOX_FOLDER, { ...value });

ChangeInboxFolder.eventName = <typeof CHANGE_INBOX_FOLDER>CHANGE_INBOX_FOLDER;
