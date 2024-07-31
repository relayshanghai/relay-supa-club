import { type ProductEntity } from 'src/backend/database/product/product-entity';

export const ProductsTableRow = ({
    product,
    onCheckboxChange,
    checked,
}: {
    product: ProductEntity;
    onCheckboxChange: (id: string) => void;
    checked: boolean;
}) => {
    const handleChange = () => {
        onCheckboxChange(product.id);
    };
    return (
        <>
            <tr className="border-b-2 border-gray-200 bg-white">
                <td className="display-none items-center whitespace-nowrap text-center align-middle">
                    <input
                        data-testid="product-checkbox"
                        className="select-none appearance-none rounded-sm border-gray-300 checked:text-primary-500 focus:ring-2 focus:ring-primary-500"
                        checked={checked}
                        onChange={handleChange}
                        type="checkbox"
                    />
                </td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{product.name}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{product.description}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{product.price}</td>
                <td className="whitespace-nowrap px-6 py-3 text-gray-700">{product.shopUrl}</td>
                <td className="flex items-center gap-2 whitespace-nowrap px-6 py-3 text-gray-700">Fill</td>
            </tr>
        </>
    );
};
