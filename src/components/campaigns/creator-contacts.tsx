import { useReport } from 'src/hooks/use-report';
import type { CampaignCreatorDB } from 'src/utils/api/db';
import type { CreatorReportContact } from 'types';
import { SocialMediaIcon } from '../common/social-media-icon';
import { isValidUrl } from 'src/utils/utils';
import ContactsSkeleton from './creator-contacts-skeleton';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Button } from '../button';

const getHref = (contact: CreatorReportContact) => ({
    target: '_blank',
    rel: 'noreferrer',
    href:
        contact.type === 'email'
            ? 'mailto:' + contact.formatted_value
            : isValidUrl(contact.formatted_value)
            ? contact.formatted_value
            : '',
});

export const CreatorContacts = (creator: CampaignCreatorDB) => {
    const { report, loading, usageExceeded } = useReport({
        platform: creator.platform,
        creator_id: creator.creator_id,
    });
    const { t } = useTranslation();

    return (
        <div>
            {loading ? (
                <div>
                    <ContactsSkeleton />
                </div>
            ) : usageExceeded ? (
                <div>
                    <Link href="/upgrade">
                        <Button>{t('account.subscription.upgradeSubscription')}</Button>
                    </Link>
                </div>
            ) : (
                <div>
                    {report && report.user_profile.contacts?.length > 0 ? (
                        <div className="py-6">
                            <div className="flex">
                                {report?.user_profile.contacts?.map((contact, index) => (
                                    <div key={index} className="group/item">
                                        <a {...getHref(contact)} className="relative flex">
                                            <div className="mr-1 h-4 w-4 group-hover:opacity-80">
                                                <SocialMediaIcon platform={contact.type} />
                                            </div>
                                            <div className="group/text invisible absolute inset-x-0 -bottom-6 mt-1 text-xs text-primary-500 group-hover/item:visible group-hover/edit:opacity-100">
                                                {contact.value}
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="tex text-xs text-tertiary-600">-</div>
                    )}
                </div>
            )}
        </div>
    );
};
