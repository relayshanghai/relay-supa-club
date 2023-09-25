import type { TriggerEvent } from '../types';

export const UPDATE_PROFILE_INFO = 'Update Profile Info';

export type UpdateProfileInfoPayload = {
    info_type: 'Profile' | 'Company';
    info_name: string;
};

export const UpdateProfileInfo = (trigger: TriggerEvent, value?: UpdateProfileInfoPayload) =>
    trigger(UPDATE_PROFILE_INFO, { ...value });

export type UpdateProfileInfo = typeof UpdateProfileInfo;

UpdateProfileInfo.eventName = <typeof UPDATE_PROFILE_INFO>UPDATE_PROFILE_INFO;
