import { useEffect } from 'react';
import { Confirm, Cross } from '../icons';

export default function TableInput(props: any) {
    const handleFormSubmit = (e: any) => {
        // console.log('handleFormSubmit', props.inputValue);
        e.preventDefault();
        // props?.onSubmit(props.inputValue);
    };

    useEffect(() => {
        if (props.value) props.setInputValue(props.value);
    }, [props.value, props]);

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute group top-1/2 -left-4 -translate-y-1/2 w-48 p-2 max-w-[360px] will-change-transform h-14 z-[10]"
        >
            <form
                className="h-full flex items-center min-h-0"
                onSubmit={(e) => handleFormSubmit(e)}
            >
                <input
                    type={props.type}
                    value={props.inputValue}
                    name={props.name}
                    onChange={(e) => props.setInputValue(e.target.value)}
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
                        onClick={() => props.closeModal()}
                        className="h-8 w-8 column-center bg-gray-100 border border-gray-200 hover:bg-gray-200 cursor-pointer duration-300 rounded-md"
                    >
                        <Cross className="w-4 h-4 fill-current text-gray-600" />
                    </div>
                </div>
            </form>
        </div>
    );
}
