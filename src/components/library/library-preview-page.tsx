import { useState } from 'react';
import * as library from './index';

const Badges = () => (
    <div className="m-5">
        <h2 className="text-lg font-bold"> Badges</h2>
        <p>Primary, Solid, Rounded, 3 sizes, squished Chinese for no wrap test </p>
        <div className="m-5 flex flex-wrap space-x-3 bg-slate-100 p-5">
            <library.Badge size="small">Small</library.Badge>

            <library.Badge size="medium">Medium</library.Badge>

            <library.Badge size="large">Large</library.Badge>

            <div className="w-3">
                <library.Badge size="medium">中文</library.Badge>
            </div>
        </div>
    </div>
);

const Tooltips = () => (
    <div className="m-5">
        <h2 className="text-lg font-bold"> Tooltips</h2>
        <p>default, with content</p>
        <div className="m-5 flex space-x-3 bg-slate-100 p-5">
            <library.Tooltip content="explaining this and that" position="top-right">
                <library.Badge>{`Hover Me (top-right)`}</library.Badge>
            </library.Tooltip>

            <library.Tooltip
                content="explaining this"
                detail="and also another thing. Perhaps a few more things. While we are at it one more thing. "
                position="top-left"
            >
                <library.Badge>{`With Details (top-left)`}</library.Badge>
            </library.Tooltip>

            <library.Tooltip content="explaining this" position="bottom-left">
                <library.Badge>Hover bottom left</library.Badge>
            </library.Tooltip>
            <library.Tooltip content="explaining this" position="bottom-right">
                <library.Badge>Hover bottom right</library.Badge>
            </library.Tooltip>

            <library.Tooltip content="explaining this" position="right">
                <library.Badge>Hover position right</library.Badge>
            </library.Tooltip>

            <library.Tooltip content="explaining this" position="left">
                <library.Badge>Hover position left</library.Badge>
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
            <div className="m-5 flex flex-wrap space-x-3 bg-slate-100 p-5">
                <library.Switch
                    checked={checked}
                    onChange={(e) => {
                        setChecked(e.target.checked);
                    }}
                />
                <library.Switch checked={true} onChange={() => null} />
                <library.Switch disabled={true} checked={false} onChange={() => null} />
                <library.Switch disabled checked={true} onChange={() => null} />
                <library.Switch checked={true} onChange={() => null} beforeLabel="label before" />
                <library.Switch checked={true} onChange={() => null} afterLabel="after" />
            </div>
        </div>
    );
};

const ProgressBars = () => {
    return (
        <div className="m-5">
            <h2 className="text-lg font-bold"> Progress Bars</h2>
            <p>default, labeled, height options, </p>
            <div className="m-5 flex flex-col space-y-3 bg-slate-100 p-5">
                <library.Progress height="small" percentage={20} />
                <library.Progress height="medium" percentage={30} label="30%" />
                <library.Progress height="large" percentage={50} label="50%" />
            </div>
        </div>
    );
};

const LibraryPage = () => (
    <>
        <Badges />
        <Tooltips />
        <Switches />
        <ProgressBars />
    </>
);

export default LibraryPage;
