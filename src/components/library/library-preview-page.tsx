import { useState } from 'react';
import * as library from './index';
import { Input } from '../input';
import { Button } from '../button';

const Buttons = () => (
    <div className="m-5">
        <h2 className="text-lg font-bold"> Buttons</h2>
        <div className="m-5 flex flex-wrap space-x-3 bg-slate-100 p-5">
            <Button variant="primary">primary</Button>
            <Button variant="secondary">secondary</Button>
            <Button variant="ghost">ghost</Button>
            <Button variant="neutral">neutral</Button>
        </div>
    </div>
);

const Badges = () => (
    <div className="m-5">
        <h2 className="text-lg font-bold"> Badges</h2>
        <p>Solid 3 sizes, squished Chinese for no wrap test </p>
        <div className="m-5 flex flex-wrap space-x-3 bg-slate-100 p-5">
            <library.Badge size="small">Small</library.Badge>

            <library.Badge size="medium">Medium</library.Badge>

            <library.Badge size="large">Large</library.Badge>

            <div className="w-3">
                <library.Badge size="medium">中文</library.Badge>
            </div>
        </div>
        <p>
            Soft 3, fully rounded, 3 sizes. For fully round you need to specifically set a height and width. around 5
            for one number and 8 for 2
        </p>
        <div className="m-5 flex flex-wrap space-x-3 bg-slate-100 p-5">
            <library.Badge variant="soft" roundSize={5}>
                1
            </library.Badge>
            <library.Badge variant="soft" roundSize={8}>
                22
            </library.Badge>

            <library.Badge variant="soft" roundSize={10}>
                123
            </library.Badge>
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

const Inputs = () => {
    const [value, setValue] = useState('');
    return (
        <div className="m-5">
            <h2 className="text-lg font-bold"> Inputs</h2>
            <p>default(type: text), required, error message, password input </p>
            <div className="m-5 flex flex-wrap space-x-8 bg-slate-100 p-5">
                <div className="w-48">
                    <Input label="Text" type="text" placeholder="placeholder" value="" />
                </div>
                <div className="w-48">
                    <Input
                        error="required with error message"
                        label="Email"
                        type="email"
                        placeholder="hello@relay.club"
                        value=""
                        required
                    />
                </div>
                <div className="w-48">
                    <Input label="label" type="password" placeholder="password" value="" />
                </div>
            </div>
            <h2 className="text-lg font-bold"> Table Input</h2>
            <table>
                <tr>
                    <library.TableInlineInput
                        value={value}
                        onSubmit={async (newValue) => setValue(newValue)}
                        textPromptForMissingValue="Enter a value"
                    />
                </tr>
            </table>
        </div>
    );
};

const Tabs = () => {
    const [currentTab, setCurrentTab] = useState('tab1');
    const tabs = [
        {
            label: 'Tab 1',
            value: 'tab1',
            afterElement: (
                <library.Badge variant="soft" roundSize={5}>
                    3
                </library.Badge>
            ),
        },
        {
            label: 'Tab 2',
            value: 'tab2',
            afterElement: (
                <library.Badge variant="soft" roundSize={5}>
                    33
                </library.Badge>
            ),
        },
        { label: 'Tab 3', value: 'tab3' },
    ];
    return (
        <div className="m-5">
            <h2 className="text-lg font-bold"> Tabs</h2>
            <p>default </p>
            <div className="m-5 flex flex-wrap space-x-8 bg-slate-100 p-5">
                <library.Tabs currentTab={currentTab} tabs={tabs} setCurrentTab={setCurrentTab} />
            </div>
        </div>
    );
};

export const SelectMultipleDropdowns = () => {
    const [selectedOptions, setSelectedOptions] = useState<library.CommonStatusType[]>([]);

    const options = {
        option1: {
            label: 'Option 1',
            value: 10,
            style: 'bg-blue-100 text-blue-500',
        },
        option2: {
            label: 'Option 2',
            style: 'bg-primary-100 text-primary-500',
        },
        option3: {
            label: 'Option 3',
            value: 30,
        },
    };

    return (
        <div className="m-5">
            <h2 className="text-lg font-bold"> Select Multiple Dropdown</h2>
            <p>Click to expand </p>
            <p>Input options have to have label elements. Value and Style optional </p>
            <p>Styled and unstyled options available </p>
            <div className="m-5 flex flex-wrap space-x-8 bg-slate-100 p-5">
                <library.SelectMultipleDropdown
                    text="sample"
                    options={options}
                    selectedOptions={selectedOptions}
                    setSelectedOptions={(options) => {
                        setSelectedOptions(options);
                    }}
                    translationPath="manager"
                />
            </div>
        </div>
    );
};

const AccordionAndFaq = () => {
    const content = [
        {
            title: "Q: What's the best thing about Switzerland?",
            detail: "A: I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.\nAnother line. Does the line break work?",
        },
        {
            title: "Q: What's the best thing about mars?",
            detail: 'A: The mountains are a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
        },
    ];

    const title = 'Your Frequently Asked Questions';
    const [modalOpen, setModalOpen] = useState(false);
    const props = {
        content,
        title,
        getMoreInfoButtonText: 'Get More Info',
        getMoreInfoButtonAction: () => {
            alert('get more info');
        },
        visible: modalOpen,
        onClose: () => setModalOpen(false),
        modalName: 'Example FAQ',
        type: 'FAQ',
        source: 'Library',
    };
    return (
        <div className="m-5">
            <h2 className="text-lg font-bold"> Accordion and FAQ</h2>
            <p>Accordion, FAQ</p>
            <div className="m-5 flex flex-col space-y-3 bg-slate-100 p-5">
                <library.Accordion {...props} />
                <Button onClick={() => setModalOpen(true)}>Open FAQ Modal</Button>
                <library.FaqModal {...props} />
            </div>
        </div>
    );
};

const LibraryPage = () => (
    <>
        <Buttons />
        <Badges />
        <Tooltips />
        <Switches />
        <ProgressBars />
        <Inputs />
        <Tabs />
        <SelectMultipleDropdowns />
        <AccordionAndFaq />
    </>
);

export default LibraryPage;
