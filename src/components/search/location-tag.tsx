import React from 'react';
import { useSearch } from 'src/hooks/use-search';
import type { LocationWeighted } from 'types';

export type LocationTagProps = {
    onClick?: () => void;
};

const LocationTag: React.FC<LocationTagProps> = ({ onClick, ...item }: LocationTagProps) => {
    const { audienceLocation, setAudienceLocation } = useSearch();

    const selected = audienceLocation.find((country) => country.id === (item as LocationWeighted).id);

    if (!selected) return null;

    return (
        <div
            className="flex cursor-pointer flex-row items-center whitespace-nowrap rounded bg-gray-100 pl-2 pr-0 text-gray-900 hover:bg-gray-200"
            key={(item as LocationWeighted).id}
            onClick={onClick}
        >
            {(item as LocationWeighted).title}
            <select
                value={selected.weight}
                className="ml-2 rounded-md border-gray-300 bg-gray-100 py-0 pl-2 pr-5"
                onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onChange={(e: any) => {
                    const clone = audienceLocation.slice();
                    const index = audienceLocation.indexOf(selected);

                    if (index !== -1) {
                        clone[index] = { ...selected, weight: e.target.value };
                        setAudienceLocation(clone);
                    }
                }}
            >
                {Array.from(Array(11)).map((_, i) => {
                    const val = i === 0 ? 1 : i * 5;
                    return <option value={val} key={val}>{`>${val}%`}</option>;
                })}
            </select>
        </div>
    );
};

export default LocationTag;
