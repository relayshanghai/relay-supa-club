import { useApiClient } from 'src/utils/api-client/request';
import awaitToError from 'src/utils/await-to-error';
import useSWR from 'swr';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import { type Paginated } from 'types/pagination';
import { useState } from 'react';
import { type GetProductRequest } from 'pages/api/products/request';

export type CreateProductPayload = {
    name: string;
    description: string;
    price: number;
    shopUrl: string;
    currency: string;
};

export const useProducts = () => {
    const { apiClient, loading, error } = useApiClient();
    const [params, setParams] = useState<GetProductRequest>({
        page: 1,
        size: 10,
        name: '',
        category: '',
    });
    const { data: products, mutate: getProducts } = useSWR([params, '/products'], async ([p]) => {
        const query = new URLSearchParams(p as any).toString();
        const [err, res] = await awaitToError(
            apiClient.get<Paginated<ProductEntity>>(`/products?${query}`).then((res) => res.data),
        );
        if (err) return;
        return res;
    });
    const createProduct = async (payload: CreateProductPayload) => {
        const [err, res] = await awaitToError(apiClient.post<ProductEntity>('/products', payload));
        if (err) throw err;
        return res.data;
    };
    const updateProduct = async (id: string) => {
        const [err, res] = await awaitToError(apiClient.put(`/products/${id}`));
        if (err) throw err;
        return res.data;
    };
    const getProduct = async (id: string) => {
        const [err, res] = await awaitToError(apiClient.get(`/products/${id}`));
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
        getProduct,
        setParams,
    };
};
