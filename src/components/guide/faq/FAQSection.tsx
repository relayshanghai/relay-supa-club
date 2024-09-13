import CreatorSearchSection from './CreatorsSearchSection';
import DiscoverSection from './DiscoverySection';
import FreeTrialSection from './FreeTrialSection';

const FAQSection = ({ locale = 'en' }) => {
    return (
        <div className="">
            <div className="mx-auto max-w-7xl px-8 py-10">
                <div className="w-3/4">
                    <h1 className="text-3xl">FAQs</h1>
                    <h3 className="text-lg">
                        {locale === 'en'
                            ? 'Everything you need to know about the product and billing. Can’t find the answer you’re looking for?'
                            : '关于产品和账单的一切信息。如果找不到您需要的答案?'}
                        <a
                            href="javascript:void(0)"
                            className="text-navy-500 underline"
                            onClick={() => window.$chatwoot?.toggle()}
                        >
                            {locale === 'en' ? 'Please chat to our friendly team.' : '请与我们的团队联系。'}
                        </a>
                    </h3>
                </div>
            </div>
            <FreeTrialSection locale={locale} />
            <CreatorSearchSection locale={locale} />
            <DiscoverSection locale={locale} />
        </div>
    );
};

export default FAQSection;
