import { useTranslation } from 'react-i18next';
import { productsIndexColumns } from './constants';
import { ProductsTableRow } from './products-table-row';
import { useCallback } from 'react';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import { DataTablePagination } from './pagination';

const ProductsTable = ({
    products,
    currentPage,
    totalPages,
    setPage,
    selection,
    setSelection,
}: {
    products: ProductEntity[] | undefined;
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
    selection: string[];
    setSelection: (selection: string[]) => void;
}) => {
    const { t } = useTranslation();
    const handleCheckboxChange = useCallback(
        (id: string) => {
            if (selection.includes(id)) {
                setSelection(selection.filter((selectedId) => selectedId !== id));
                return;
            }
            setSelection([...selection, id]);
        },
        [selection, setSelection],
    );
    const handleCheckAll = useCallback(() => {
        if (!products) return;
        if (selection.length === products.length) {
            setSelection([]);
            return;
        }
        setSelection(products.map((influencer) => influencer.id));
    }, [selection, products, setSelection]);
    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b-2 border-gray-200">
                        <th className="bg-white px-4">
                            <input
                                data-testid="products-select-all"
                                className="display-none appearance-none rounded border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                                type="checkbox"
                                checked={products?.length === selection.length && selection.length > 0}
                                onChange={handleCheckAll}
                            />
                        </th>
                        {productsIndexColumns.map((column) => (
                            <th
                                key={column}
                                className="whitespace-nowrap bg-white px-6 py-3 text-left text-xs font-normal tracking-wider text-gray-500"
                            >
                                {t(`products.indexColumns.${column}`)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products?.map((product) => (
                        <ProductsTableRow
                            key={product.id}
                            product={product}
                            checked={selection.includes(product.id)}
                            onCheckboxChange={handleCheckboxChange}
                        />
                    ))}
                </tbody>
            </table>
            <DataTablePagination currentPage={currentPage} pages={totalPages} setPageIndex={setPage} />
        </div>
    );
};

export default ProductsTable;
