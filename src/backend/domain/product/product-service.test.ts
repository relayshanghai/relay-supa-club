import type { Product } from 'src/backend/database/product-repository';
import ProductRepository from 'src/backend/database/product-repository';
import { RequestContext } from 'src/utils/request-context/request-context';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import ProductService from './product-service';
import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';
import type { GetProductRequest } from 'pages/api/products/request';
import type { Paginated } from 'types/pagination';

describe('src/backend/domain/product/product-service.ts', () => {
    const getContextMock = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        RequestContext.getContext = getContextMock;
        getContextMock.mockReturnValue({
            companyId: 'company_1',
            requestUrl: 'https://example.com',
        });
        ProductRepository.prototype.create = vi.fn().mockReturnValue({
            id: 'product_1',
            name: 'product_name',
            description: 'product_description',
            price: 100,
            shopUrl: 'https://example.com',
            currency: 'USD',
        });
    });
    describe('ProductService', () => {
        describe('create', () => {
            afterEach(() => {
                vi.resetAllMocks();
            });
            it('should create product when request is valid', async () => {
                const result = await ProductService.getService().create({
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    currency: 'USD',
                });
                expect(result).toEqual({
                    id: 'product_1',
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    currency: 'USD',
                });
                expect(ProductRepository.prototype.create).toBeCalledWith('company_1', {
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    currency: 'USD',
                });
            });
            it('should throw unauthorized error when company id does not exists in the request context', async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(
                    ProductService.getService().create({
                        name: 'product_name',
                        description: 'product_description',
                        price: 100,
                        shopUrl: 'https://example.com',
                        currency: 'USD',
                    }),
                );
                expect(err.message).toBe('No company id found in request context');
            });
        });
        describe('getOne', () => {
            afterEach(() => {
                vi.resetAllMocks();
            });
            it('should get product when request is valid', async () => {
                ProductRepository.prototype.getOne = vi.fn().mockReturnValue({
                    id: 'product_1',
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    currency: 'USD',
                });

                const result = await ProductService.getService().getOne('product_1');
                expect(result).toEqual({
                    id: 'product_1',
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    currency: 'USD',
                });
                expect(ProductRepository.prototype.getOne).toBeCalledWith('company_1', 'product_1');
            });
            it('should throw unauthorized error when company id does not exists in the request context', async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(ProductService.getService().getOne('product_1'));
                expect(err.message).toBe('No company id found in request context');
            });
            it('should throw error when product does not exists', async () => {
                ProductRepository.prototype.getOne = vi
                    .fn()
                    .mockRejectedValue(new NotFoundError('Product with id: product_1 does not exists'));
                const [err] = await awaitToError(ProductService.getService().getOne('product_1'));
                expect(err.message).toBe('Product with id: product_1 does not exists');
            });
        });
        describe('fetch', () => {
            let mockedProducts: Product[];

            beforeAll(() => {
                mockedProducts = new Array(20).fill(null).map((d, i) => ({
                    id: `product_${i}`,
                    name: `product_name_${i}`,
                    description: `product_description_${i}`,
                    price: 100,
                    shopUrl: `https://example${i}.com`,
                    currency: 'USD',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
            });
            afterEach(() => {
                vi.resetAllMocks();
            });

            it('should fetch product when request is valid', async () => {
                const request: GetProductRequest = {
                    page: 1,
                    size: 10,
                };

                ProductRepository.getRepository().fetch = vi.fn().mockReturnValue({
                    items: mockedProducts.slice(0, 10),
                    page: 1,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                } as Paginated<Product>);

                const result = await ProductService.getService().fetch(request);

                expect(result).toEqual({
                    items: mockedProducts.slice(0, 10),
                    page: 1,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                } as Paginated<Product>);
                expect(result.items.length).toBe(10);
                expect(result.items[0].id).toBe('product_0');
                expect(result.items[9].id).toBe('product_9');
                expect(ProductRepository.getRepository().fetch).toBeCalledWith('company_1', request);
            });

            it('should fetch product when request is valid and page is 2', async () => {
                const request: GetProductRequest = {
                    page: 2,
                    size: 10,
                };

                ProductRepository.getRepository().fetch = vi.fn().mockReturnValue({
                    items: mockedProducts.slice(10, 20),
                    page: 2,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                } as Paginated<Product>);

                const result = await ProductService.getService().fetch(request);

                expect(result).toEqual({
                    items: mockedProducts.slice(10, 20),
                    page: 2,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                } as Paginated<Product>);
                expect(result.items.length).toBe(10);
                expect(result.items[0].id).toBe('product_10');
                expect(result.items[9].id).toBe('product_19');
                expect(ProductRepository.getRepository().fetch).toBeCalledWith('company_1', request);
            });

            it('should filtered by name when request is valid', async () => {
                const request: GetProductRequest = {
                    page: 1,
                    size: 10,
                    name: 'product_name_1',
                };

                ProductRepository.getRepository().fetch = vi.fn().mockReturnValue({
                    items: [mockedProducts[1]],
                    page: 1,
                    size: 10,
                    totalPages: 1,
                    totalSize: 1,
                } as Paginated<Product>);

                const result = await ProductService.getService().fetch(request);

                expect(result).toEqual({
                    items: [mockedProducts[1]],
                    page: 1,
                    size: 10,
                    totalPages: 1,
                    totalSize: 1,
                } as Paginated<Product>);
                expect(result.items.length).toBe(1);
                expect(result.items[0].id).toBe('product_1');
                expect(ProductRepository.getRepository().fetch).toBeCalledWith('company_1', request);
            });

            it('should throw unauthorized error when company id does not exists in the request context', async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(ProductService.getService().fetch({ page: 1, size: 10 }));
                expect(err.message).toBe('No company id found in request context');
            });

            it('should throw error when product does not exists', async () => {
                const request: GetProductRequest = {
                    page: 1,
                    size: 10,
                };
                ProductRepository.getRepository().fetch = vi.fn().mockReturnValue({
                    items: [],
                    page: 1,
                    size: 10,
                    totalPages: 0,
                    totalSize: 0,
                } as Paginated<Product>);
                const [, result] = await awaitToError(ProductService.getService().fetch({ page: 1, size: 10 }));
                expect(result.items).toEqual([]);
                expect(result.items.length).toBe(0);
                expect(ProductRepository.getRepository().fetch).toBeCalledWith('company_1', request);
            });
        });
    });
});
