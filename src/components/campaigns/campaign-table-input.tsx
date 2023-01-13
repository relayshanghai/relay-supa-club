import { forwardRef, MutableRefObject, useEffect, useState } from 'react';
import { CampaignCreatorDB } from 'src/utils/api/db';
import { Confirm, Cross } from '../icons';

function TableInput({
    objKey,
    value,
    type,
    closeModal,
    creator,
    updateCampaignCreator,
    ref
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
        //eslint-disable-next-line
        console.log(creator); //TODO: delete
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
            className="absolute group top-1/2 -left-4 -translate-y-1/2 w-48 p-2 max-w-[360px] will-change-transform h-14 z-[10]"
        >
            <form
                className="h-full flex items-center min-h-0"
                onSubmit={(e) => handleFormSubmit(e)}
            >
                <input
                    type={type}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full h-full outline-none border border-gray-200 rounded-md mr-2 p-2 resize-none text-xs text-gray-600"
                />
                <div className="flex items-center justify-end">
                    <button
                        type="submit"
                        className="h-8 w-8 column-center bg-primary-500 hover:bg-primary-700 duration-300 mr-2 cursor-pointer rounded-md"
                    >
                        <Confirm className="w-4 h-4 fill-current text-white rounded-md" />
                    </button>
                    <div
                        onClick={() => closeModal()}
                        className="h-8 w-8 column-center bg-gray-100 border border-gray-200 hover:bg-gray-200 cursor-pointer duration-300 rounded-md"
                    >
                        <Cross className="w-4 h-4 fill-current text-gray-600" />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default forwardRef(TableInput);
