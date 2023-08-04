import Link from 'next/link';
import React from 'react';

interface InfluencerRowProps {
    index: number;
    creator: any;
}

export const InfluencerRow = ({ index, creator }: InfluencerRowProps) => {
    return (
        <tr key={creator.id + index} className="group text-xs hover:bg-primary-50">
            {Object.keys(creator).map((creatorfields) => {
                return (
                    creatorfields !== 'id' && (
                        <td
                            key={creatorfields}
                            className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900"
                        >
                            {creatorfields === 'info' ? (
                                <div className="flex flex-row items-center gap-2">
                                    <div>
                                        <img
                                            className="inline-block h-10 w-10 bg-slate-500"
                                            src={creator[creatorfields].image}
                                            alt=""
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-lg text-primary-500">{creator[creatorfields].name}</p>
                                        <Link
                                            className="font-normal text-gray-500"
                                            href={creator[creatorfields].handle}
                                        >
                                            {creator[creatorfields].handle}
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                creator[creatorfields]
                            )}
                        </td>
                    )
                );
            })}
            <td>INBOX</td>
        </tr>
    );
};
