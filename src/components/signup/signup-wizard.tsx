import type { ReactNode } from 'react';
import { Progress } from '../library';

export const FormWizard = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className="w-80">
            <Progress height="small" percentage={20} className="mb-2" />
            <div className="flex flex-col rounded shadow-sm">
                <div className="border-b-gray-100 bg-gray-100 p-5 font-semibold text-gray-500">{title}</div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
};
