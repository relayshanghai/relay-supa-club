import { isValidUrl } from 'src/utils/utils';
import type { CreatorReportContact } from 'types';
import { SocialMediaIcon } from '../common/social-media-icon';

export const SocialCard = ({ contact }: { contact: CreatorReportContact }) => {
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

    return (
        <div className="mb-2 w-full px-6">
            <div className="flex w-full overflow-hidden rounded-xl bg-white p-4">
                <a {...getHref(contact)} className="flex items-center">
                    <div className="mr-2 h-10 w-10 ">
                        <SocialMediaIcon platform={contact.type} />
                    </div>

                    <div className="ml-2">
                        <p className="-mb-1 cursor-pointer truncate font-semibold text-gray-600 duration-300 hover:text-primary-500">
                            {contact.value}
                        </p>
                        <p className="text-sm text-gray-600">{contact.type}</p>
                    </div>
                </a>
            </div>
        </div>
    );
};
