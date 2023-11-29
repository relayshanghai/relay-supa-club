import type { FC } from 'react';
import React from 'react';
import { AlertCircleOutline, CheckCircleOutline } from '../icons';

interface AlertOrCheckIconProps {
    status: string;
}

const AlertOrCheckIcon: FC<AlertOrCheckIconProps> = ({ status }) => {
    if (status === 'alert') {
        return (
            <div className="flex h-4 w-5 items-center justify-center rounded bg-red-50 p-1 text-red-500">
                <AlertCircleOutline className="h-3 w-3" strokeWidth="1.5" />
            </div>
        );
    } else if (status === 'check') {
        return (
            <div className="flex h-4 w-5 items-center justify-center rounded bg-green-50 p-1 text-green-500">
                <CheckCircleOutline className="h-3 w-3" strokeWidth="1.5" />
            </div>
        );
    }
    return <></>;
};

export default AlertOrCheckIcon;
