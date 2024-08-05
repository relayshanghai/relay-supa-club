interface LabelProps {
    label: string;
    value: string;
}

const Label: React.FC<LabelProps> = ({ label, value }) => {
    return (
        <div className="flex w-full flex-col items-start gap-2">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="w-full rounded-lg border px-3 py-2 text-sm font-medium text-gray-700">{value}</p>
        </div>
    );
};

export default Label;
