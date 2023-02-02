import { useTranslation } from 'react-i18next';
import { Send } from '../icons';

export default function CommentInput() {
    const { t } = useTranslation();

    return (
        <div className="bg-gray-50/50 text-xs px-3 py-3 w-full duration-300">
            <div className="flex justify-center align-center space-x-2">
                <div className="rounded-full w-6 h-6 p-1 row-center bg-primary-100 text-primary-500">
                    <div>JF</div>
                </div>
                <textarea
                    rows={1}
                    placeholder={t('campaigns.creatorModal.messagePlaceholder') as string}
                    className="textarea-field placeholder:text-xs overflow-y-auto"
                />
                <div className="group p-2 rounded-md text-gray-600  bg-gray-50 hover:bg-gray-100 border border-gray-200 duration-300 outline-none appearance-none text-center cursor-pointer">
                    <Send className="w-4 h-4 fill-tertiary-600 group-hover:fill-primary-600" />
                </div>
            </div>
        </div>
    );
}
