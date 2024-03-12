import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'shadcn/components/ui/input';
import { Search } from 'src/components/icons';

export default function ThreadListInputSearch({ onSearch }: { onSearch?: (searchTerm: string) => void }) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const { t } = useTranslation();
    const triggerSearch = () => {
        onSearch && onSearch(searchTerm);
    };
    return (
        <div
            data-testid="search"
            className="flex h-9 w-full flex-row items-center justify-between rounded-md border border-gray-200 bg-white px-2 shadow"
        >
            <Search className="h-5 w-5 fill-gray-400" />
            <Input
                data-testid="search-input"
                className="focus:ring-none focus-visible:ring-none border-none text-xs shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                placeholder={t('inbox.searchPlaceholder') || 'Search inbox'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        triggerSearch();
                    }
                }}
                onBlur={triggerSearch}
            />
        </div>
    );
}
