import { useTranslation } from 'react-i18next';
import { CreatorReport } from 'types';
import { SocialCard } from './creator-social-card';

export const CreatorOverview = ({ report }: { report: CreatorReport }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-wrap">
            {/* TODO: KOL economics */}
            <div className="mb-4">
                <div className="font-semibold text-gray-600 mb-2">
                    {t('creators.show.description')}
                </div>
                <div
                    className="bg-white rounded-lg p-4 text-sm text-tertiary-600"
                    style={{ whiteSpace: 'break-spaces' }}
                >
                    {report.user_profile.description}
                </div>
            </div>

            {report.user_profile.contacts && (
                <div className="mb-4">
                    <div className="font-semibold text-gray-600 mb-2">
                        {t('creators.show.socialLinks')}{' '}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {report.user_profile.contacts.map((contact, index) => (
                            <SocialCard contact={contact} key={index} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
