import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import { type Paginated } from 'types/pagination';
import { type GetProductRequest } from 'pages/api/products/request';
import { useProductStore } from 'src/store/reducers/product';

export type CreateProductPayload = {
    brandName: string;
    name: string;
    description: string;
    price: number;
    shopUrl: string;
    currency: string;
};

export const useProducts = () => {
    const { setProducts, list: products, setProduct, item: product } = useProductStore();
    const { apiClient, loading, error } = useApiClient();
    const getProducts = async (params?: Partial<GetProductRequest>) => {
        params = {
            page: 1,
            size: 1000,
            ...params,
        };
        const query = new URLSearchParams(params as any).toString();
        const [err, res] = await awaitToError(
            apiClient.get<Paginated<ProductEntity>>(`/products?${query}`).then((res) => res.data),
        );
        if (err) return;
        setProducts(res);
        return res;
    };
    const createProduct = async (payload: CreateProductPayload) => {
        const [err, res] = await awaitToError(apiClient.post<ProductEntity>('/products', payload));
        if (err) throw err;
        return res.data;
    };
    const updateProduct = async (id: string, payload: CreateProductPayload) => {
        const [err, res] = await awaitToError(apiClient.put(`/products/${id}`, payload));
        if (err) throw err;
        return res.data;
    };
    const getProduct = async (id: string) => {
        const [err, res] = await awaitToError(apiClient.get(`/products/${id}`));
        if (err) throw err;
        return res.data;
    };
    const deleteProduct = async (id: string) => {
        const [err, res] = await awaitToError(apiClient.delete(`/products/${id}`));
        if (err) throw err;
        return res.data;
    };
    return {
        loading,
        error,
        products,
        getProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        setProduct,
        product,
    };
};
