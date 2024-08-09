import { useTranslation } from "react-i18next";

export interface TablePaginationProps {
    page: number;
    totalPages: number;
    size: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
}
export default function TablePagination({
    page, totalPages, onPageChange, loading
}: TablePaginationProps) {
    const nextPage = () => {
        if (page < totalPages) {
            onPageChange(page + 1)
        }
    }
    const prevPage = () => {
        if (page > 1) {
            onPageChange(page - 1)
        }
    }
    const renderPageNumbers = () => {
        const pageNumbers = [];
        const pageNumberComponent = (p: number) => 
            <button className="w-10 h-10 relative rounded-lg" onClick={() => onPageChange(p)}>
               <div className="w-10 h-10 p-2 left-0 top-0 absolute rounded-lg justify-center items-center inline-flex">
               <div className={`text-center text-violet-600 text-sm font-['Poppins'] ${page === p ? 'font-bold underline': 'font-normal'} leading-normal tracking-tight`}>{p}</div>
               </div>
           </button> 
        const deviderComponent = () =>
            <div className="w-10 h-10 relative rounded-lg">
                <div className="w-10 h-10 p-2 left-0 top-0 absolute rounded-lg justify-center items-center inline-flex">
                <div className="text-center text-violet-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">...</div>
                </div>
            </div>  
        if (totalPages <= 10) {
            // Show all pages if totalPages <= 6
            for (let i = 1; i <= totalPages; i++) {
              pageNumbers.push(
                pageNumberComponent(i)
              );
            }
          } else {
            // Show first 3 pages
            for (let i = 1; i <= 3; i++) {
              pageNumbers.push(
                pageNumberComponent(i)
              );
            }
            if (page === 3 || page === 4) {
                pageNumbers.push(
                    pageNumberComponent(4)
                );
            }
            if (page === 4) {
                pageNumbers.push(
                    pageNumberComponent(5)
                );
            }
            // Ellipsis and middle pages
            if (page > 4 && page < totalPages - 3) {
              pageNumbers.push(
                deviderComponent()
            );
              for (let i = page - 1; i <= page + 1; i++) {
                pageNumbers.push(
                    pageNumberComponent(i)
                );
              }
              pageNumbers.push(deviderComponent())
            } else {
              pageNumbers.push(
                deviderComponent()
            );
            }
            
            if (page === totalPages - 3) {
                pageNumbers.push(
                    pageNumberComponent(totalPages-4)
                );
            }
            if (page === totalPages - 2 || page === totalPages - 3) {
                pageNumbers.push(
                    pageNumberComponent(totalPages-3)
                );
            }
            // Show last 3 pages
            for (let i = totalPages - 2; i <= totalPages; i++) {
              pageNumbers.push(
                pageNumberComponent(i)
              );
            }
          }
      
          return pageNumbers;
    }
    const { t } = useTranslation()
    return <div className={`h-12 px-2 py-1 bg-[#fefefe] border border-gray-200 justify-center items-center gap-3 inline-flex w-full ${loading && 'animate-pulse'}`}>
    <div className="grow shrink basis-0 h-6 justify-start items-center flex">
      <button onClick={() => prevPage()} className="justify-center items-center gap-1.5 flex">
        <div className="w-5 h-5 relative" />
        <div className="text-violet-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{t('manager.previous')}</div>
      </button>
    </div>
    <div className="justify-start items-start gap-0.5 flex">
      {
        renderPageNumbers()
      }
    </div>
    <div onClick={() => nextPage()} className="grow shrink basis-0 h-6 justify-end items-center flex">
      <button className="justify-center items-center gap-1.5 flex">
        <div className="text-violet-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">{t('manager.next')}</div>
        <div className="w-5 h-5 relative" />
      </button>
    </div>
  </div>
} 