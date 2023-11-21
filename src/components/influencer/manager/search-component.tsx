import { Search } from 'src/components/icons';

export const SearchComponent = ({
    searchTerm,
    placeholder,
    onSetSearch,
}: {
    searchTerm: string;
    placeholder: string;
    onSetSearch: (term: string) => void;
}) => {
    return (
        <section
            className={`relative flex flex-row items-center rounded-md border border-gray-200 bg-white text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
        >
            <Search className="absolute left-2 top-2 h-6 w-6 fill-gray-500" />
            <input
                className="ml-6 w-[350px] appearance-none rounded border border-transparent bg-white px-3 py-2 font-medium text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                placeholder={placeholder}
                data-testid="input-keywords"
                onChange={(e) => onSetSearch(e.target.value)}
                value={searchTerm}
            />
        </section>
    );
};
