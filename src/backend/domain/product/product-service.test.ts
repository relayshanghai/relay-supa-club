import { RequestContext } from 'src/utils/request-context/request-context';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ProductService from './product-service';
import awaitToError from 'src/utils/await-to-error';
import { NotFoundError } from 'src/utils/error/http-error';
import type { GetProductRequest, ProductRequest } from 'pages/api/products/request';
import type { Paginated } from 'types/pagination';
import ProductRepository from 'src/backend/database/product/product-repository';
import type { ProductEntity } from 'src/backend/database/product/product-entity';

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
                const findOneByProductMock = vi.spyOn(ProductRepository.getRepository(), 'save');
                findOneByProductMock.mockResolvedValue({
                    id: 'product_1',
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    priceCurrency: 'USD',
                } as ProductEntity);
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
                expect(ProductRepository.getRepository().save).toBeCalledWith({
                    company: { id: 'company_1' },
                    createdAt: undefined,
                    description: 'product_description',
                    id: undefined,
                    name: 'product_name',
                    price: 100,
                    priceCurrency: 'USD',
                    shopUrl: 'https://example.com',
                    updatedAt: undefined,
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
                const mockData = {
                    id: 'product_1',
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    priceCurrency: 'USD',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as unknown as ProductEntity;
                const findOneByProductMock = vi.spyOn(ProductRepository.getRepository(), 'findOneBy');
                findOneByProductMock.mockResolvedValue(mockData);

                const result = await ProductService.getService().getOne('product_1');
                expect(result).toEqual({
                    id: 'product_1',
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    currency: 'USD',
                    createdAt: mockData.createdAt,
                    updatedAt: mockData.updatedAt,
                });
                expect(ProductRepository.getRepository().findOneBy).toBeCalledWith({
                    id: 'product_1',
                    company: {
                        id: 'company_1',
                    },
                });
            });
            it('should throw unauthorized error when company id does not exists in the request context', async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(ProductService.getService().getOne('product_1'));
                expect(err.message).toBe('No company id found in request context');
            });
            it('should throw error when product does not exists', async () => {
                const findOneByProductMock = vi.spyOn(ProductRepository.getRepository(), 'findOneBy');
                findOneByProductMock.mockRejectedValue(new NotFoundError('Product with id: product_1 does not exists'));
                const [err] = await awaitToError(ProductService.getService().getOne('product_1'));
                expect(err.message).toBe('Product with id: product_1 does not exists');
            });
        });
        describe('fetch', () => {
            let mockedProducts: ProductEntity[];

            beforeEach(() => {
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

                const paginatedProducts = vi.spyOn(ProductRepository.getRepository(), 'getPaginated');
                paginatedProducts.mockResolvedValue({
                    items: mockedProducts.slice(0, 10),
                    page: 1,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                });
                const result = await ProductService.getService().fetch(request);

                expect(result).toEqual({
                    items: mockedProducts.slice(0, 10),
                    page: 1,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                } as Paginated<ProductEntity>);
                expect(result.items.length).toBe(10);
                expect(result.items[0].id).toBe('product_0');
                expect(result.items[9].id).toBe('product_9');
                expect(ProductRepository.getRepository().getPaginated).toBeCalledWith(
                    request,
                    {
                        where: {
                            company: {
                                id: 'company_1',
                            },
                        },
                    },
                    {
                        name: undefined,
                    },
                );
            });

            it('should fetch product when request is valid and page is 2', async () => {
                const request: GetProductRequest = {
                    page: 2,
                    size: 10,
                };

                const paginatedProducts = vi.spyOn(ProductRepository.getRepository(), 'getPaginated');
                paginatedProducts.mockResolvedValue({
                    items: mockedProducts.slice(10, 20),
                    page: 2,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                });
                const result = await ProductService.getService().fetch(request);

                expect(result).toEqual({
                    items: mockedProducts.slice(10, 20),
                    page: 2,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                } as Paginated<ProductEntity>);
                expect(result.items.length).toBe(10);
                expect(result.items[0].id).toBe('product_10');
                expect(result.items[9].id).toBe('product_19');
                expect(ProductRepository.getRepository().getPaginated).toBeCalledWith(
                    request,
                    {
                        where: {
                            company: {
                                id: 'company_1',
                            },
                        },
                    },
                    {
                        name: undefined,
                    },
                );
            });

            it('should filtered by name when request is valid', async () => {
                const request: GetProductRequest = {
                    page: 1,
                    size: 10,
                    name: 'product_name_1',
                };

                const paginatedProducts = vi.spyOn(ProductRepository.getRepository(), 'getPaginated');
                paginatedProducts.mockResolvedValue({
                    items: [
                        {
                            id: 'product_1',
                            name: 'product_name_1',
                            description: 'product_description_1',
                            price: 100,
                            shopUrl: 'https://example1.com',
                            currency: 'USD',
                            createdAt: mockedProducts[1].createdAt,
                            updatedAt: mockedProducts[1].updatedAt,
                        } as unknown as ProductEntity,
                    ],
                    page: 1,
                    size: 10,
                    totalPages: 1,
                    totalSize: 1,
                });
                const result = await ProductService.getService().fetch(request);

                expect(result.items.length).toBe(1);
                expect(result.items[0].id).toBe('product_1');
                expect(ProductRepository.getRepository().getPaginated).toBeCalledWith(
                    { page: request.page, size: request.size },
                    {
                        where: {
                            company: {
                                id: 'company_1',
                            },
                        },
                    },
                    {
                        name: request.name,
                    },
                );
            });

            it('should throw unauthorized error when company id does not exists in the request context', async () => {
                getContextMock.mockReturnValue({});
                const [err] = await awaitToError(ProductService.getService().fetch({ page: 1, size: 10 }));
                expect(err.message).toBe('No company id found in request context');
            });

            it('return empty array when product does not exists', async () => {
                const request: GetProductRequest = {
                    page: 1,
                    size: 10,
                };

                const paginatedProducts = vi.spyOn(ProductRepository.getRepository(), 'getPaginated');
                paginatedProducts.mockResolvedValue({
                    items: [],
                    page: 1,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                });
                const result = await ProductService.getService().fetch(request);

                expect(result.items).toEqual([]);
                expect(result.items.length).toBe(0);
                expect(ProductRepository.getRepository().getPaginated).toBeCalledWith(
                    request,
                    {
                        where: {
                            company: {
                                id: 'company_1',
                            },
                        },
                    },
                    {
                        name: undefined,
                    },
                );
            });
        });

        describe('update', () => {
            it('should update product when request is valid', async () => {
                const request: ProductRequest = {
                    name: 'new_product_name',
                    description: 'new_product_description',
                    price: 200,
                    shopUrl: 'https://example.com/new',
                    currency: 'USD',
                };
                const companyId = 'company_1';
                const productId = 'product_1';

                const findOneByProductMock = vi.spyOn(ProductRepository.getRepository(), 'findOneBy');
                findOneByProductMock.mockResolvedValue({
                    id: productId,
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    priceCurrency: 'USD',
                    company: {
                        id: companyId,
                    },
                } as ProductEntity);

                const saveProductMock = vi.spyOn(ProductRepository.getRepository(), 'save');
                saveProductMock.mockResolvedValue({
                    id: productId,
                    name: 'new_product_name',
                    description: 'new_product_description',
                    price: 200,
                    shopUrl: 'https://example.com/new',
                    priceCurrency: 'USD',
                    company: {
                        id: companyId,
                    },
                } as ProductEntity);

                const result = await ProductService.getService().update(request, productId);

                expect(result).toEqual({
                    id: productId,
                    name: 'new_product_name',
                    description: 'new_product_description',
                    price: 200,
                    shopUrl: 'https://example.com/new',
                    currency: 'USD',
                    company: {
                        id: companyId,
                    },
                });
                expect(ProductRepository.getRepository().findOneBy).toBeCalledWith({
                    id: productId,
                    company: {
                        id: companyId,
                    },
                });
                expect(ProductRepository.getRepository().save).toBeCalledWith({
                    id: productId,
                    name: 'new_product_name',
                    description: 'new_product_description',
                    price: 200,
                    shopUrl: 'https://example.com/new',
                    priceCurrency: 'USD',
                    company: {
                        id: companyId,
                    },
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
    });
});
