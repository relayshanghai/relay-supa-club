import { useState } from 'react';
import * as library from './index';

const Badges = () => (
    <div className="m-5">
        <h2 className="text-lg font-bold"> Badges</h2>
        <p>Primary, Solid, Rounded, 3 sizes</p>
        <div className="m-5 flex flex-wrap space-x-3 bg-slate-200 p-5">
            <library.Badge size="small">Small</library.Badge>

            <library.Badge size="medium">Medium</library.Badge>

            <library.Badge size="large">Large</library.Badge>
        </div>
    </div>
);

const Tooltips = () => (
    <div className="m-5">
        <h2 className="text-lg font-bold"> Tooltips</h2>
        <p>default, with content</p>
        <div className="m-5 flex flex-wrap space-x-3 bg-slate-200 p-5">
            <library.Tooltip content="explaining this and that">
                <library.Badge className="hs-tooltip-toggle"> Hover Me</library.Badge>
            </library.Tooltip>
            <library.Tooltip
                content="explaining this"
                detail="and also another thing. Perhaps a few more things. While we are at it one more thing. "
            >
                <library.Badge className="hs-tooltip-toggle"> With Details</library.Badge>
            </library.Tooltip>
        </div>
    </div>
);

const Switches = () => {
    const [checked, setChecked] = useState(false);
    return (
        <div className="m-5">
            <h2 className="text-lg font-bold"> Switches</h2>
            <p>default (live), checked, disabled, with descriptions, </p>
            <div className="m-5 flex flex-wrap space-x-3 bg-slate-200 p-5">
                <library.Switch
                    checked={checked}
                    onChange={(e) => {
                        setChecked(e.target.checked);
                    }}
                />
                <library.Switch checked={true} onChange={() => null} />
                <library.Switch disabled={true} checked={false} onChange={() => null} />
                <library.Switch disabled checked={true} onChange={() => null} />
            </div>
        </div>
    );
};

const LibraryPage = () => (
    <>
        <Badges />
        <Tooltips />
        <Switches />
    </>
);

export default LibraryPage;
