/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'src/components/button';
import { formatter } from 'src/utils/formatter';

export type SearchResultItem = {
    account: {
        user_profile: {
            user_id: string;
            username?: string;
            fullname?: string;
            custom_name?: string;
            url: string;
            picture: string;
            is_verified: true;
            followers: number;
            engagements: number;
            engagement_rate: number;
            avg_views: number;
        };
        audience_source: string;
    };
    match: {};
};

export const SearchResultRow = ({ item }: { item?: SearchResultItem }) => {
    const placeholder = !item;
    const handle = !placeholder
        ? item.account.user_profile.username ||
          item.account.user_profile.custom_name ||
          item.account.user_profile.fullname
        : '';
    const [rowHovered, setRowHovered] = useState(false);

    return (
        <tr
            className={`${placeholder ? 'bg-gray-50' : ''} relative`}
            onMouseEnter={() => setRowHovered(true)}
            onMouseLeave={() => setRowHovered(false)}
        >
            {rowHovered && !placeholder && (
                <div
                    className="absolute flex right-28 -top-3"
                    onMouseEnter={() => setRowHovered(true)}
                >
                    <div className="flex space-x-4">
                        <Button variant="secondary">Add To Campaign</Button>
                        <Button variant="secondary">Lookalike</Button>
                        <Button>Analyze</Button>
                        <Button>Favorite</Button>
                        <Button>Share</Button>
                    </div>
                </div>
            )}
            <td className="py-2 px-4 flex flex-row items-center space-x-2">
                {!placeholder ? (
                    <>
                        <img
                            src={`https://image-cache.brainchild-tech.cn/?link=${item.account.user_profile.picture}`}
                            className="w-12 h-12"
                            alt={handle}
                        />
                        <div>
                            <div className="font-bold whhitespace-nowrap">
                                {item.account.user_profile.fullname}
                            </div>
                            <div className="text-primary-500 text-sm">
                                {handle ? `@${handle}` : null}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 rounded-full bg-gray-100" />
                        <div className="space-y-2">
                            <div className="font-bold bg-gray-100 w-40 h-4" />
                            <div className="text-primary-500 text-sm bg-gray-100 w-20 h-4" />
                        </div>
                        <div className="absolute top-0 left-0 translate-x-1/2 translate-y-1/2 p-2 text-sm">
                            <Link href="/account" passHref>
                                <a className="text-primary-500">
                                    Upgrade your subscription plan, to view more results.
                                </a>
                            </Link>
                        </div>
                    </>
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(item.account.user_profile.followers)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(item.account.user_profile.engagements)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(item.account.user_profile.engagement_rate)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
            <td className="text-sm">
                {!placeholder ? (
                    formatter(item.account.user_profile.avg_views)
                ) : (
                    <div className="text-primary-500 text-sm bg-gray-100 w-10 h-4" />
                )}
            </td>
        </tr>
    );
};
