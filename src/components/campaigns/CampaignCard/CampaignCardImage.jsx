import Image from 'next/image';

export default function CampaignCardImage({ campaign }) {
    return (
        <div className="rounded-lg h-48 w-full mb-2 relative">
            <Image
                src={'/image404.png'}
                alt="card-image"
                width={300}
                height={200}
                className="w-full h-full object-cover rounded-lg"
            />
            <div className="flex flex-wrap mb-1 absolute bottom-0 left-2">
                {!!campaign?.tag_list?.length &&
                    campaign?.tag_list.map((tag, index) => (
                        <div
                            key={index}
                            className="bg-tertiary-50 rounded-md px-2 py-1 text-xs text-tertiary-600 mr-1 mb-1 flex-shrink-0"
                        >
                            {tag}
                        </div>
                    ))}
            </div>
            <div className="bg-primary-50 text-primary-500 rounded-md px-2 py-1 text-xs inline-block absolute top-2 right-2">
                {campaign?.status}
            </div>
        </div>
    );
}
