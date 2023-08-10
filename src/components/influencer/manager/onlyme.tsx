import { Switch } from 'src/components/library';

export const OnlyMe = ({ state, onSwitch }: { state: boolean; onSwitch: (state: boolean) => void }) => {
    return (
        <div className="flex flex-row items-center gap-2 text-gray-500">
            <p>View only mine</p>
            <Switch checked={state} onChange={(e) => onSwitch(e.target.checked)} />
        </div>
    );
};
