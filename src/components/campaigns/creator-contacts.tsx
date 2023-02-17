import { useEffect } from 'react';
import { useReport } from 'src/hooks/use-report';
import { CampaignCreatorDB } from 'src/utils/api/db';
import { CreatorReportContact } from 'types';
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
    const { getOrCreateReport, report, loading, usageExceeded, gettingReport } = useReport();
    const { t } = useTranslation();

    useEffect(() => {
        if (creator && !report && !usageExceeded && !gettingReport) {
            getOrCreateReport(creator.platform, creator.creator_id);
        }
    }, [creator, report, usageExceeded, gettingReport, getOrCreateReport]);

    return (
        <div>
            {loading ? (
                <div>
                    <ContactsSkeleton />
                </div>
            ) : usageExceeded ? (
                <div>
                    <Link href="/pricing">

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
                                        <a {...getHref(contact)} className="flex relative">
                                            <div className="w-4 h-4 group-hover:opacity-80 mr-1">
                                                <SocialMediaIcon platform={contact.type} />
                                            </div>
                                            <div className="mt-1 group/text invisible group-hover/item:visible group-hover/edit:opacity-100 absolute inset-x-0 -bottom-6 text-xs text-primary-500">
                                                {contact.value}
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-xs tex text-tertiary-600">-</div>
                    )}
                </div>
            )}
        </div>
    );
};
