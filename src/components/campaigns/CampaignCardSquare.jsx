import Link from 'next/link';
import { useRouter } from 'next/router';
import CampaignCardIcons from './CampaignCard/CampaignCardIcons';
import CampaignCardText from './CampaignCard/CampaignCardText';
import CampaignCardImage from './CampaignCard/CampaignCardImage';
// import { trackEvent } from '@/libs/segment/Events';

export default function CampaignCardSquare({ campaign }) {
    // const { t } = useTranslation();
    const router = useRouter();

    const goToCampaignShow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        trackEvent('Campaign Stats Clicked', {
            ...campaign,
            component: 'Campaign Card'
        });
        // router.push(`/dashboard/campaigns/${campaign.slug}`);
    };

    const goToCampaignEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        trackEvent('Campaign Edit Clicked', {
            ...campaign,
            component: 'Campaign Card'
        });
        // router.push(`/dashboard/campaigns/formv2?campaign=${campaign.slug}`);
    };

    const handleNavigateToCampaign = () => {
        trackEvent('Campaign Card Clicked', {
            ...campaign
        });
    };

    return (
        <Link href={`/dashboard/campaigns/${campaign.slug}`}>
            <a onClick={() => handleNavigateToCampaign()}>
                <div className="bg-white rounded-lg h-80 relative cursor-pointer sm:hover:shadow-lg duration-300">
                    <CampaignCardImage campaign={campaign} />
                    <div className="px-2">
                        <CampaignCardText campaign={campaign} />
                        <CampaignCardIcons
                            goToCampaignShow={goToCampaignShow}
                            goToCampaignEdit={goToCampaignEdit}
                        />
                    </div>
                </div>
            </a>
        </Link>
    );
}
