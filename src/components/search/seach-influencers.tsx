import { useCallback, useRef, useState } from 'react';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';
import { CreatorPlatform } from 'types';

export const SearchInfluencers = (platform: CreatorPlatform) => {
    const searchRef = useRef<any>();

    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(false);
    const [displaySearch, setDisplaySearch] = useState(false);
    useOnOutsideClick(searchRef, () => {
        setDisplaySearch(false);
    });

    const searchCreators = useCallback(
        async (term: any) => {
            setLoading(true);

            try {
                const res = await (
                    await fetch('/api/influencer-search/lookalike', {
                        method: 'post',
                        body: JSON.stringify({
                            term,
                            platform,
                        }),
                    })
                ).json();

                console.log(res.data);
                setCreators(res.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        },
        [platform],
    );

    const handleSearch = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            searchCreators(e.target.value);
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        if (value === '') setCreators([]);
    };

    return (
        <div className="w-1/3 font-medium">
            <input
                className=" placeholder-gray-400 appearance-none bg-white rounded-md block w-full px-3 py-2 border border-gray-200 ring-1 ring-gray-900 ring-opacity-5 placeholder:text-sm focus:outline-none"
                placeholder="Search for an Influencer"
                ref={searchRef}
                id="creator-search"
                autoFocus
                onChange={handleChange}
                onKeyUp={handleSearch}
            />
            <div ref={searchRef}>
                {displaySearch &&
                    creators?.map((creator, index) => <div key={index}>{creator}</div>)}
            </div>
        </div>
    );
};
