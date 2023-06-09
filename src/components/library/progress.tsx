import type { PropsWithChildren, HTMLAttributes, DetailedHTMLProps } from 'react';

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    label?: string;
    height?: 'small' | 'medium' | 'large';
    percentage?: number;
}
export type ProgressProps = PropsWithChildren<Props>;

/** Progress bar component.
 * @param label - optional label to display on the progress bar, use with size 'medium' or 'large'
 * @param height - required
 * @param percentage - required percentage showing the colored portion of the progress bar
 */

export const Progress = ({ label, className, height, percentage }: ProgressProps) => {
    const heightClass = height === 'small' ? 'h-1.5' : height === 'medium' ? 'h-4' : 'h-8';

    return (
        <div className={`flex ${heightClass} w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
            <div
                className="flex flex-col justify-center overflow-hidden bg-primary-500 text-center text-xs text-white"
                style={{ width: `${percentage}%` }}
            >
                {label && label}
            </div>
        </div>
    );
};
