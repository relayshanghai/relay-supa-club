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
}
export default function Select(props: SelectProps) {
    return (
        <label className="flex w-full flex-col text-sm text-gray-800">
            <div className="text-sm font-medium text-gray-700">
                {props.label}
                {props.required ? <span className="ml-1 text-xs text-primary-500">*</span> : null}
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
