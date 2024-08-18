import { Input } from 'shadcn/components/ui/input';
import { Search } from 'src/components/icons';
import { useState } from 'react';

export const SearchBar = ({
    placeholder,
    onSearch,
}: {
    placeholder: string;
    onSearch: (searchTerm: string) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    return (
        <div className="flex h-9 w-full flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-2 shadow">
            <Search className="h-5 w-5 fill-gray-400" />
            <Input
                className="focus:ring-none focus-visible:ring-none border-none text-xs shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSearch(searchTerm);
                    }
                }}
                onBlur={() => onSearch(searchTerm)}
            />
        </div>
    );
};
