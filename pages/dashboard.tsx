import SearchPageLegacy from 'src/components/search/search-page-legacy';
import SearchPage from 'src/components/search/search-page';
import { featNewSearchTable } from 'src/constants/feature-flags';
import { useUser } from 'src/hooks/use-user';

const Page = () => {
    const { profile } = useUser();

    return profile?.created_at && !featNewSearchTable(new Date(profile.created_at)) ? (
        <SearchPageLegacy />
    ) : (
        <SearchPage />
    );
};

export default Page;
