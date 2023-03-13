import { useTranslation } from 'react-i18next';
import type { CampaignWithCompanyCreators } from 'src/utils/api/db';
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
            <div className="mb-4 sm:mr-4 sm:mb-0 sm:w-3/5">
                <div className="mb-4 w-full rounded-lg bg-white p-4 text-sm text-tertiary-600">
                    <h3 className="mb-2 font-semibold">
                        {t('campaigns.show.activities.info.projectDescription')}
                    </h3>
                    <p>{currentCampaign.description}</p>
                </div>
                {/* Campaign Images Gallery */}
                <div className="mb-4 w-full rounded-lg bg-white p-4 text-sm text-tertiary-600">
                    <h3 className="mb-4 font-semibold">{t('campaigns.show.campaignMedia')}</h3>
                    {currentCampaign && media ? (
                        <div className="mb-6 flex flex-wrap">
                            {media.map((photo, index) => (
                                <div
                                    key={index}
                                    className="mr-3 mb-3 box-border h-20 w-20 flex-shrink-0 rounded-md"
                                >
                                    <img
                                        src={photo?.url}
                                        alt=""
                                        className="h-full w-full rounded-md object-cover"
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
                <div className="mb-4 w-full rounded-lg bg-white p-4 text-sm text-tertiary-600">
                    <div className="mb-4">
                        <h3 className="mb-2 font-semibold">
                            {t('campaigns.show.targetGeographic')}
                        </h3>
                        <div className="flex h-7">
                            {targetLocations.length > 0 &&
                                targetLocations.map((tag, index) => (
                                    <p
                                        key={index}
                                        className="mr-1 mb-1 rounded-md bg-tertiary-100 px-2 py-1 text-xs text-tertiary-600"
                                    >
                                        {tag}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2 font-semibold">
                            {t('campaigns.show.typeOfPromotion')}
                        </h3>
                        <div className="flex h-7">
                            {promoTypes.length > 0 &&
                                promoTypes.map((promoType, index) => (
                                    <p
                                        key={index}
                                        className="mr-1 mb-1 rounded-md bg-tertiary-100 px-2 py-1 text-xs text-tertiary-600"
                                    >
                                        {promoType}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h3 className="mb-2 font-semibold">
                            {t('campaigns.show.activities.info.campaignBudget')}
                        </h3>
                        <p className="font-semi text-sm text-tertiary-600">
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
                <div className="mb-4 w-full rounded-lg bg-white p-4 text-sm text-tertiary-600">
                    <div className="mb-2">
                        <h3 className="mb-2 text-sm font-semibold text-gray-600">
                            {t('campaigns.show.productName')}
                        </h3>
                        <p className="flex flex-wrap text-sm text-gray-600">
                            {currentCampaign.product_name || 'No product name set'}
                        </p>
                    </div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-600">
                        {t('campaigns.show.productLink')}
                    </h3>
                    <a
                        href={currentCampaign.product_link || '#'}
                        target="_blank"
                        className="mb-1 cursor-pointer break-words text-sm text-primary-500 duration-300 hover:text-primary-700"
                        rel="noopener noreferrer"
                    >
                        {currentCampaign.product_link}
                    </a>
                </div>
            </div>
        </div>
    );
}
