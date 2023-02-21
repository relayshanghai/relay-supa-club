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
        <div className="">
            <input
                className="w-full border border-gray-200 text-gray-600 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
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
