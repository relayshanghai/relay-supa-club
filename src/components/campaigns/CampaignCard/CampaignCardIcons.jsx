import { ChartBarIcon, PencilSquareIcon } from '@heroicons/react/20/solid';

export default function CampaignCardIcons({ goToCampaignShow, goToCampaignEdit }) {
    return (
        <div className="flex items-center absolute bottom-2 right-0">
            <div
                onClick={goToCampaignShow}
                className="flex items-center justify-center w-7 h-7 bg-primary-500 bg-opacity-10 hover:bg-opacity-20 duration-300 text-sm text-primary-500 font-semibold rounded-md mr-2 cursor-pointer"
            >
                <ChartBarIcon name="stats" className="w-4 h-4 fill-current text-primary-500" />
            </div>
            <div
                onClick={goToCampaignEdit}
                className="flex items-center justify-center w-7 h-7 bg-primary-500 bg-opacity-10 hover:bg-opacity-20 duration-300 text-sm text-primary-500 font-semibold rounded-md mr-2 cursor-pointer"
            >
                <PencilSquareIcon name="edit" className="w-4 h-4 fill-current text-primary-500" />
            </div>
        </div>
    );
}
