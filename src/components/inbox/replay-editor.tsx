import { Button } from '../button';
import { InputTextArea } from '../textarea';

export const ReplayEditor = () => {
    const handleSubmit = () => {
        //eslint-disable-next-line
        console.log('submit');
    };
    return (
        <div className="relative">
            <InputTextArea
                label=""
                className="h-36 rounded-md border-gray-200 placeholder:text-xs"
                placeholder="Reply here.."
                // value={productDescription}
                onChange={(e) => {
                    //eslint-disable-next-line
                    console.log(e.target.value);
                }}
            />
            <Button className="absolute bottom-2 left-2" type="submit" onChange={handleSubmit}>
                Send
            </Button>
        </div>
    );
};
