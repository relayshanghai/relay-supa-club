import { InputTextArea } from '../textarea';

export const ReplayEditor = () => {
    return (
        <div>
            <InputTextArea
                label=""
                className="h-32 rounded-md border-gray-200"
                placeholder="Reply here.."
                // value={productDescription}
                onChange={(e) => {
                    //eslint-disable-next-line
                    console.log(e.target.value);
                }}
            />
        </div>
    );
};
