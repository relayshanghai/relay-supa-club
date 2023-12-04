import SearchPageLegacy from 'src/components/search/search-page-legacy';
import SearchPage from 'src/components/search/search-page';
import { featNewSearchTable } from 'src/constants/feature-flags';

const Page = () => {
    return featNewSearchTable() ? <SearchPage /> : <SearchPageLegacy />;
};

export default Page;
