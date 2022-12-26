import { isValidUrl } from 'src/utils/utils';
import { CreatorReportContact } from 'types';
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
                : ''
    });

    return (
        <div className="bg-white rounded-xl p-4 flex w-full lg:w-1/2">
            <a {...getHref(contact)} className="flex items-center">
                <div className="w-10 h-10 mr-2">
                    <SocialMediaIcon platform={contact.type} />
                </div>

                <div className="ml-2">
                    <p className="text-gray-600 font-semibold -mb-1 hover:text-primary-500 duration-300 cursor-pointer">
                        {contact.value}
                    </p>
                    <p className="text-gray-600 text-sm">{contact.type}</p>
                </div>
            </a>
        </div>
    );
};
