import { LanguageToggle } from 'src/components/common/language-toggle';
import { Title } from 'src/components/title';

const ConfirmAlipayPaymentPage = () => {
    return (
        <div className="h-screen">
            <div className="mb-3 flex w-full items-center justify-between p-5">
                <Title open={true} />
                <LanguageToggle />
            </div>
            <div className="flex h-full flex-col justify-center pb-32 text-center">this is the redirected page</div>
        </div>
    );
};

export default ConfirmAlipayPaymentPage;
