import { useTranslation } from 'react-i18next';

export interface TablePaginationProps {
    page: number;
    totalPages: number;
    size: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
}
export default function TablePagination({ page, totalPages, onPageChange, loading }: TablePaginationProps) {
    const nextPage = () => {
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };
    const prevPage = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const pageNumberComponent = (p: number) => (
            <button className="relative h-10 w-10 rounded-lg" onClick={() => onPageChange(p)}>
                <div className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-lg p-2">
                    <div
                        className={`text-center font-['Poppins'] text-sm text-violet-600 ${
                            page === p ? 'font-bold underline' : 'font-normal'
                        } leading-normal tracking-tight`}
                    >
                        {p}
                    </div>
                </div>
            </button>
        );
        const deviderComponent = () => (
            <div className="relative h-10 w-10 rounded-lg">
                <div className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-lg p-2">
                    <div className="text-center font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-violet-600">
                        ...
                    </div>
                </div>
            </div>
        );
        if (totalPages <= 10) {
            // Show all pages if totalPages <= 6
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(pageNumberComponent(i));
            }
        } else {
            // Show first 3 pages
            for (let i = 1; i <= 3; i++) {
                pageNumbers.push(pageNumberComponent(i));
            }
            if (page === 3 || page === 4) {
                pageNumbers.push(pageNumberComponent(4));
            }
            if (page === 4) {
                pageNumbers.push(pageNumberComponent(5));
            }
            // Ellipsis and middle pages
            if (page > 4 && page < totalPages - 3) {
                pageNumbers.push(deviderComponent());
                for (let i = page - 1; i <= page + 1; i++) {
                    pageNumbers.push(pageNumberComponent(i));
                }
                pageNumbers.push(deviderComponent());
            } else {
                pageNumbers.push(deviderComponent());
            }

            if (page === totalPages - 3) {
                pageNumbers.push(pageNumberComponent(totalPages - 4));
            }
            if (page === totalPages - 2 || page === totalPages - 3) {
                pageNumbers.push(pageNumberComponent(totalPages - 3));
            }
            // Show last 3 pages
            for (let i = totalPages - 2; i <= totalPages; i++) {
                pageNumbers.push(pageNumberComponent(i));
            }
        }

        return pageNumbers;
    };
    const { t } = useTranslation();
    return (
        <div
            className={`inline-flex h-12 w-full items-center justify-center gap-3 border border-gray-200 bg-[#fefefe] px-2 py-1 ${
                loading && 'animate-pulse'
            }`}
        >
            <div className="flex h-6 shrink grow basis-0 items-center justify-start">
                <button onClick={() => prevPage()} className="flex items-center justify-center gap-1.5">
                    <div className="relative h-5 w-5" />
                    <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-violet-600">
                        {t('manager.previous')}
                    </div>
                </button>
            </div>
            <div className="flex items-start justify-start gap-0.5">{renderPageNumbers()}</div>
            <div onClick={() => nextPage()} className="flex h-6 shrink grow basis-0 items-center justify-end">
                <button className="flex items-center justify-center gap-1.5">
                    <div className="font-['Poppins'] text-sm font-medium leading-normal tracking-tight text-violet-600">
                        {t('manager.next')}
                    </div>
                    <div className="relative h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
