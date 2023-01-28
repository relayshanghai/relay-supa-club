import { useTranslation } from 'react-i18next';
import { CampaignWithCompanyCreators } from 'src/utils/api/db';
import { toCurrency } from 'src/utils/utils';

export default function CampaignDetails({
    currentCampaign,
    media,
}: {
    currentCampaign: CampaignWithCompanyCreators;
    media: { url: string; name: string }[];
}) {
    const { t } = useTranslation();
    const targetLocations = currentCampaign.target_locations || [];
    const promoTypes = currentCampaign.promo_types || [];

    return (
        <div className="sm:flex">
            <div className="sm:w-3/5 mb-4 sm:mr-4 sm:mb-0">
                <div className="bg-white rounded-lg text-tertiary-600 text-sm p-4 w-full mb-4">
                    <h3 className="font-semibold mb-2">
                        {t('campaigns.show.activities.info.projectDescription')}
                    </h3>
                    <p>{currentCampaign.description}</p>
                </div>
                {/* Campaign Images Gallery */}
                <div className="bg-white rounded-lg text-tertiary-600 text-sm p-4 w-full mb-4">
                    <h3 className="font-semibold mb-4">{t('campaigns.show.campaignMedia')}</h3>
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
                        <h3 className="font-semibold mb-2">
                            {t('campaigns.show.targetGeographic')}
                        </h3>
                        <div className="flex h-7">
                            {targetLocations.length > 0 &&
                                targetLocations.map((tag, index) => (
                                    <p
                                        key={index}
                                        className="bg-tertiary-100 rounded-md px-2 py-1 text-xs text-tertiary-600 mr-1 mb-1"
                                    >
                                        {tag}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">
                            {t('campaigns.show.typeOfPromotion')}
                        </h3>
                        <div className="flex h-7">
                            {promoTypes.length > 0 &&
                                promoTypes.map((promoType, index) => (
                                    <p
                                        key={index}
                                        className="bg-tertiary-100 rounded-md px-2 py-1 text-xs text-tertiary-600 mr-1 mb-1"
                                    >
                                        {promoType}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">
                            {t('campaigns.show.activities.info.campaignBudget')}
                        </h3>
                        <p className="text-sm font-semi text-tertiary-600">
                            {currentCampaign.budget_cents &&
                                currentCampaign.budget_currency &&
                                toCurrency(
                                    currentCampaign.budget_cents,
                                    currentCampaign.budget_currency,
                                )}
                        </p>
                    </div>
                </div>

                {/* Campaign Product*/}
                <div className="bg-white rounded-lg text-tertiary-600 text-sm p-4 w-full mb-4">
                    <div className="mb-2">
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">
                            {t('campaigns.show.productName')}
                        </h3>
                        <p className="flex flex-wrap text-sm text-gray-600">
                            {currentCampaign.product_name || 'No product name set'}
                        </p>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                        {t('campaigns.show.productLink')}
                    </h3>
                    <a
                        href={currentCampaign.product_link || '#'}
                        target="_blank"
                        className="text-sm text-primary-500 hover:text-primary-700 duration-300 mb-1 cursor-pointer break-words"
                        rel="noopener noreferrer"
                    >
                        {currentCampaign.product_link}
                    </a>
                </div>
            </div>
        </div>
    );
}
