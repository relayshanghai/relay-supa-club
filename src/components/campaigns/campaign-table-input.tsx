import type { MutableRefObject } from 'react';
import { forwardRef, useEffect, useState } from 'react';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import { Confirm, Cross } from '../icons';

function TableInput({
    objKey,
    value,
    type,
    closeModal,
    creator,
    updateCampaignCreator,
    ref,
}: {
    objKey: string;
    value: string;
    type: string;
    closeModal: () => void;
    updateCampaignCreator: (creator: CampaignCreatorDB) => void;
    creator: CampaignCreatorDB;
    ref: MutableRefObject<null>;
}) {
    const [inputValue, setInputValue] = useState<string>('');

    const handleFormSubmit = (e: any) => {
        creator = { ...creator, [objKey]: inputValue };
        e.preventDefault();
        updateCampaignCreator(creator);
    };

    useEffect(() => {
        if (value) setInputValue(value);
    }, [value]);

    return (
        <div
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            className="group absolute -left-4 top-1/2 z-[10] h-14 w-fit min-w-[200px] max-w-[360px] -translate-y-1/2 p-2 will-change-transform"
        >
            <form className="flex h-full min-h-0 items-center" onSubmit={(e) => handleFormSubmit(e)}>
                <input
                    type={type}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="mr-2 h-full w-full resize-none rounded-md border border-gray-200 p-2 text-xs text-gray-600 outline-none"
                />
                <div className="flex items-center justify-end">
                    <button
                        type="submit"
                        className="column-center mr-2 h-8 w-8 cursor-pointer rounded-md bg-primary-500 duration-300 hover:bg-primary-700"
                    >
                        <Confirm className="h-4 w-4 rounded-md fill-current text-white" />
                    </button>
                    <div
                        onClick={() => closeModal()}
                        className="column-center h-8 w-8 cursor-pointer rounded-md border border-gray-200 bg-gray-100 duration-300 hover:bg-gray-200"
                    >
                        <Cross className="h-4 w-4 fill-current text-gray-600" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default forwardRef(TableInput);
