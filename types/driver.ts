import { type DriveStep } from 'driver.js';

export type DriverIntros = {
    // any string as key and DriveStep[] as value
    [key: string]: DriveStep[];
};
