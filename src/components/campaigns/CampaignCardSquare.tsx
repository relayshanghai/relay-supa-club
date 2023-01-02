import Link from 'next/link';
import Image from 'next/image';
import { ChartBarIcon, PencilSquareIcon } from '@heroicons/react/20/solid';
import {
    useState,
    useEffect,
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactFragment,
    ReactNode,
    ReactPortal
} from 'react';
import { supabase } from 'src/utils/supabase-client';
import { t } from 'i18next';

export default function CampaignCardSquare({ campaign }: { campaign: any }) {
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const getFiles = async () => {
            const getFilePath = (filename: string) => {
                const { publicURL } = supabase.storage
                    .from('images')
                    .getPublicUrl(`campaigns/${campaign?.id}/${filename}`);
                return publicURL;
            };

            const { data } = await supabase.storage
                .from('images')
                .list(`campaigns/${campaign?.id}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (data?.[0]?.name) {
                const imageUrl = `${getFilePath(data?.[0]?.name)}`;
                setCoverImageUrl(imageUrl);
            }
        };
        if (campaign) {
            getFiles();
        }
    }, [campaign]);

    return (
        <Link href={`/campaigns/${campaign.id}`} passHref>
            <a>
                <div className="bg-white rounded-lg h-80 relative cursor-pointer sm:hover:shadow-lg duration-300">
                    {/* -- Campaign Card Image -- */}
                    <div className="rounded-lg h-48 w-full mb-2 relative">
                        <Image
                            src={coverImageUrl || '/image404.png'}
                            alt="card-image"
                            layout="fill"
                            objectFit="cover"
                            sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                            className="w-full h-full rounded-lg"
                        />
                        <div className="flex flex-wrap mb-1 absolute bottom-0 left-2">
                            {!!campaign?.tag_list?.length &&
                                campaign?.tag_list.map(
                                    (
                                        tag:
                                            | string
                                            | number
                                            | boolean
                                            | ReactElement<any, string | JSXElementConstructor<any>>
                                            | ReactFragment
                                            | ReactPortal
                                            | Iterable<ReactNode>
                                            | null
                                            | undefined,
                                        index: Key | null | undefined
                                    ) => (
                                        <div
                                            key={index}
                                            className="bg-tertiary-50/60 rounded-md inline-block leading-sm items-center px-2 py-1 text-xs text-tertiary-600 mr-1 mb-1 flex-shrink-0"
                                        >
                                            {tag}
                                        </div>
                                    )
                                )}
                        </div>
                        <div className="bg-primary-50/60 text-primary-500 rounded-md px-2 py-1 text-xs inline-block absolute top-2 right-2">
                            {t(`campaigns.show.status.${campaign?.status}`)}
                        </div>
                    </div>
                    <div className="px-2">
                        {/* -- Campaign Card Text -- */}
                        <div>
                            <div className="text-sm text-tertiary-600 font-semibold">
                                {campaign.name}
                            </div>
                            <div className="text-xs text-tertiary-600 mb-2">
                                {campaign?.companies?.name}
                            </div>
                            <div className="flex items-center flex-wrap">
                                TODO: fix the counts and switch tabs on next PR
                                {campaign?.status_counts &&
                                    Object.entries(campaign?.status_counts).map((status, index) => (
                                        <Link key={index} href={`/campaigns/${campaign.id}`}>
                                            <div className="flex items-center text-xs px-1 py-0.5 bg-primary-100 text-gray-600 hover:text-primary-500 duration-300 bg-opacity-60 border border-gray-100 rounded-md mr-2 mb-2">
                                                <div className="mr-1">
                                                    {t('campaigns.show.changeStatus')}
                                                </div>
                                                {/* <div>{status[1]}</div> */}
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                        {/* -- Campaign Card Icons -- */}
                        <div className="flex items-center absolute bottom-2 right-0">
                            <div className="flex items-center justify-center w-7 h-7 bg-primary-500 bg-opacity-10 hover:bg-opacity-20 duration-300 text-sm text-primary-500 font-semibold rounded-md mr-2 cursor-pointer">
                                <Link href={`/campaigns/${campaign.id}`}>
                                    <ChartBarIcon
                                        name="stats"
                                        className="w-4 h-4 fill-current text-primary-500"
                                    />
                                </Link>
                            </div>
                            <div className="flex items-center justify-center w-7 h-7 bg-primary-500 bg-opacity-10 hover:bg-opacity-20 duration-300 text-sm text-primary-500 font-semibold rounded-md mr-2 cursor-pointer">
                                <Link href={`/campaigns/form/${campaign.id}`}>
                                    <PencilSquareIcon
                                        name="edit"
                                        className="w-4 h-4 fill-current text-primary-500"
                                    />
                                </Link>
                            </div>
                        </div>
                        {/* -- Campaign Card Icons Ends -- */}
                    </div>
                </div>
            </a>
        </Link>
    );
}
