import type { FC } from 'react';
import React from 'react';
import { AlertCircleOutline, CheckCircleOutline } from '../icons';

interface AlertOrCheckIconProps {
    status: string;
}

const AlertOrCheckIcon: FC<AlertOrCheckIconProps> = ({ status }) => {
    if (status === 'alert') {
        return (
            <div className="hw-[30px] flex inline-flex h-[22px] items-start items-center justify-start gap-1 rounded bg-red-50 px-2 py-1 text-red-500">
                <AlertCircleOutline
                    className="flex h-3.5 w-3.5 items-center justify-center p-[1.17px]"
                    strokeWidth="3"
                />
            </div>
        );
    } else if (status === 'check') {
        return (
            <div className="flex inline-flex h-[22px] w-[30px] items-start justify-start gap-1 rounded bg-green-50 px-2 py-1 text-green-500">
                <CheckCircleOutline
                    className="flex h-3.5 w-3.5 items-center justify-center p-[1.17px]"
                    strokeWidth="3"
                />
            </div>
        );
    }
    return <></>;
};

export default AlertOrCheckIcon;
