import { CampaignWithCompanyCreators } from 'types';
import { useTranslation } from 'react-i18next';

export default function CampaignDetails({
    currentCampaign,
    media
}: {
    currentCampaign: CampaignWithCompanyCreators;
    media: { url: string; name: string }[];
}) {
    const { t } = useTranslation();
    const targetLocations = currentCampaign.target_locations || [];
    const promoTypes = currentCampaign.promo_types || [];

    const currencyFormat = (num: number | null) =>
        `${num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;

    return (
        <div className="sm:flex">
            <div className="sm:w-3/5 mb-4 sm:mr-4 sm:mb-0">
                <div className="bg-white rounded-lg text-tertiary-600 text-sm p-4 w-full mb-4">
                    <div className="font-semibold mb-2">
                        {t('campaigns.show.activities.info.projectDescription')}
                    </div>
                    {currentCampaign.description}
                </div>
                {/* Campaign Images Gallery */}
                <div className="bg-white rounded-lg text-tertiary-600 text-sm p-4 w-full mb-4">
                    <div className="font-semibold mb-4">{t('campaigns.show.campaignMedia')}</div>
                    {currentCampaign && media ? (
                        <div className="flex flex-wrap mb-6">
                            {media.map((photo, index) => (
                                <div
                                    key={index}
                                    className="w-20 h-20 box-border rounded-md mr-3 mb-3 flex-shrink-0"
                                >
                                    <img
                                        src={photo?.url}
                                        alt=""
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>{t('campaigns.show.noImages')}</div>
                    )}
                </div>
            </div>
            <div className="sm:w-2/5">
                {/* Campaign Summary*/}
                <div className="bg-white rounded-lg text-tertiary-600 text-sm p-4 w-full mb-4">
                    <div className="mb-4">
                        <div className="font-semibold mb-2">
                            {t('campaigns.show.targetGeographic')}
                        </div>
                        <div className="flex h-7">
                            {targetLocations.length > 0 &&
                                targetLocations.map((tag, index) => (
                                    <div
                                        key={index}
                                        className="bg-tertiary-100 rounded-md px-2 py-1 text-xs text-tertiary-600 mr-1 mb-1"
                                    >
                                        {tag}
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="font-semibold mb-2">
                            {t('campaigns.show.typeOfPromotion')}
                        </div>
                        <div className="flex h-7">
                            {promoTypes.length > 0 &&
                                promoTypes.map((promoType, index) => (
                                    <div
                                        key={index}
                                        className="bg-tertiary-100 rounded-md px-2 py-1 text-xs text-tertiary-600 mr-1 mb-1"
                                    >
                                        {promoType}
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="font-semibold mb-2">
                            {t('campaigns.show.activities.info.campaignBudget')}
                        </div>
                        <div className="text-sm font-semi text-tertiary-600">
                            {currencyFormat(currentCampaign.budget_cents) || '-'}{' '}
                            {currentCampaign.budget_currency}
                        </div>
                    </div>
                </div>

                {/* Campaign Product*/}
                <div className="bg-white rounded-lg text-tertiary-600 text-sm p-4 w-full mb-4">
                    <div className="mb-2">
                        <div className="text-sm font-semibold text-gray-600 mb-2">
                            {t('campaigns.show.productName')}
                        </div>
                        <div className="flex flex-wrap text-sm text-gray-600">
                            {currentCampaign?.product_name || 'No product name set'}
                        </div>
                    </div>
                    <div className="text-sm font-semibold text-gray-600 mb-2">
                        {t('campaigns.show.productLink')}
                    </div>
                    <a
                        href={currentCampaign?.product_link || '#'}
                        target="_blank"
                        className="text-sm text-primary-500 hover:text-primary-700 duration-300 mb-1 cursor-pointer break-words"
                        rel="noreferrer"
                    >
                        {currentCampaign?.product_link}
                    </a>
                </div>
            </div>
        </div>
    );
}
