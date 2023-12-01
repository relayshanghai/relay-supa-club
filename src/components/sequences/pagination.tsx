import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/button';
import { getPaginationItems } from '../boostbot/table/helper';
import PageLink from '../boostbot/table/pagelink';

interface DataTablePaginationProps {
    pages: number;
    currentPage: number;
    setPageIndex: any;
}
const canGoNext = (currentPage: number, lastPage: number) => {
    return currentPage + 1 > lastPage == true;
};

const canGoPrev = (currentPage: number) => {
    return currentPage - 1 < 1 == true;
};

export function DataTablePagination({ pages, currentPage, setPageIndex }: DataTablePaginationProps) {
    const { t } = useTranslation();
    const pageNumbers = getPaginationItems(currentPage + 1, pages, 11);

    return (
        <div className="flex w-full justify-between px-0">
            <div>
                <Button
                    variant="neutral"
                    className="flex h-8 w-32 items-center justify-center !py-0 px-2 text-sm font-medium text-primary-500 disabled:text-gray-400"
                    onClick={() => setPageIndex(currentPage - 1)}
                    disabled={canGoPrev(currentPage)}
                >
                    <ArrowLeftIcon
                        className={`mr-2 h-4 w-4 ${
                            canGoPrev(currentPage) == false ? 'fill-primary-500' : 'fill-gray-400'
                        }`}
                    />
                    {t('manager.previous')}
                </Button>
            </div>

            <div className="flex w-[300px] flex-row justify-center ">
                {pageNumbers.map((pageNum, idx) => (
                    <PageLink
                        className="mx-2 flex items-center text-sm text-primary-600"
                        key={idx}
                        active={currentPage === pageNum}
                        disabled={isNaN(pageNum)}
                        onClick={() => setPageIndex(pageNum)}
                    >
                        {!isNaN(pageNum) ? pageNum : '...'}
                    </PageLink>
                ))}
            </div>

            <div className="flex items-center ">
                <Button
                    variant="neutral"
                    className="flex h-8 w-32 items-center justify-center border-transparent !py-0 px-2 text-sm font-medium text-primary-500 disabled:text-gray-400"
                    onClick={() => setPageIndex(currentPage + 1)}
                    disabled={canGoNext(currentPage, pages)}
                >
                    {t('manager.next')}
                    <ArrowRightIcon
                        className={`ml-2 h-4 w-4 ${
                            canGoNext(currentPage, pages) == false ? 'fill-primary-500' : 'fill-gray-400'
                        }`}
                    />
                </Button>
            </div>
        </div>
    );
}
