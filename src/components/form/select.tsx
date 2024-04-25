import { Question } from '../icons';
import { Tooltip } from '../library';

export interface SelectValue {
    value: string;
    label: string;
}
export interface SelectProps {
    onChange: (value: string) => void;
    value: string;
    options: SelectValue[];
    label: string;
    required?: boolean;
    isRelative?: boolean;
    hint: string;
}
export default function Select(props: SelectProps) {
    return (
        <label className="flex w-full flex-col text-sm text-gray-800">
            <div className="flex text-sm font-medium text-gray-700">
                <div>
                    {props.hint ? (
                        <Tooltip content={props.hint} position="bottom-right">
                            <div className="flex text-sm">
                                <div>{props.label}</div>

                                <Question className="h-1/8 w-1/8 stroke-gray-400" />
                            </div>
                        </Tooltip>
                    ) : (
                        <div>{props.label}</div>
                    )}
                    {props.required ? <span className="ml-1 text-xs text-primary-500">*</span> : null}
                </div>
            </div>
            <div className={`${props.isRelative ? 'relative' : ''}`}>
                <select
                    className="my-2 block w-full appearance-none rounded-md border border-transparent bg-white px-3 py-2 placeholder-gray-400 shadow ring-1 ring-opacity-5 "
                    value={props.value}
                    onChange={(e) => {
                        const value = e.target.value as string;
                        props.onChange(value);
                    }}
                >
                    {props.options.map((option) => (
                        <option key={option.label} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </label>
    );
}
