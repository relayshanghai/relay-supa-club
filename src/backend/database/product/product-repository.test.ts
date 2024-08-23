import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProductEntity } from './product-entity';
import type { Paginated, PaginationParam } from 'types/pagination';
import BaseRepository from '../provider/base-repository';
import ProductRepository from './product-repository';

describe('src/backend/database/product/product-repository.ts', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    describe('ProductRepository', () => {
        describe('getPaginated', () => {
            let mockedProducts: ProductEntity[];

            beforeEach(() => {
                mockedProducts = new Array(20).fill(null).map((d, i) => ({
                    id: `product_${i}`,
                    name: `product_name_${i}`,
                    brandName: `brand_name_${i}`,
                    description: `product_description_${i}`,
                    price: 100,
                    shopUrl: `https://example${i}.com`,
                    priceCurrency: 'USD',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }));
            });
            afterEach(() => {
                vi.resetAllMocks();
            });

            it('should return paginated items', async () => {
                const params: PaginationParam = {
                    page: 1,
                    size: 10,
                };

                const paginatedProducts = vi.spyOn(BaseRepository.prototype, 'getPaginated');
                paginatedProducts.mockResolvedValue({
                    items: mockedProducts.slice(0, 10),
                    page: 1,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                });
                const result = await ProductRepository.getRepository().getPaginated(params);

                expect(true).toBeTruthy();
                expect(result).toEqual({
                    items: mockedProducts.slice(0, 10).map((d) => ({
                        id: d.id,
                        name: d.name,
                        brandName: d.brandName,
                        description: d.description,
                        price: d.price,
                        shopUrl: d.shopUrl,
                        currency: d.priceCurrency,
                        createdAt: new Date(d.createdAt),
                        updatedAt: new Date(d.updatedAt),
                    })),
                    page: 1,
                    size: 10,
                    totalPages: 2,
                    totalSize: 20,
                } as Paginated<ProductEntity>);
                expect(result.items.length).toBe(10);
                expect(result.items[0].id).toBe('product_0');
                expect(result.items[9].id).toBe('product_9');
                expect(BaseRepository.prototype.getPaginated).toBeCalledWith(params, {
                    where: {
                        name: undefined,
                    },
                });
            });

            it('should return paginated items with query', async () => {
                const params: PaginationParam = {
                    page: 1,
                    size: 10,
                };

                const paginatedProducts = vi.spyOn(BaseRepository.prototype, 'getPaginated');
                paginatedProducts.mockResolvedValue({
                    items: [mockedProducts[0]].slice(0, 10),
                    page: 1,
                    size: 10,
                    totalPages: 1,
                    totalSize: 1,
                });
                const result = await ProductRepository.getRepository().getPaginated(
                    params,
                    {},
                    { name: 'product_name_0' },
                );

                expect(true).toBeTruthy();
                expect(result).toEqual({
                    items: [mockedProducts[0]].slice(0, 10).map((d) => ({
                        id: d.id,
                        name: d.name,
                        brandName: d.brandName,
                        description: d.description,
                        price: d.price,
                        shopUrl: d.shopUrl,
                        currency: d.priceCurrency,
                        createdAt: new Date(d.createdAt),
                        updatedAt: new Date(d.updatedAt),
                    })),
                    page: 1,
                    size: 10,
                    totalPages: 1,
                    totalSize: 1,
                } as Paginated<ProductEntity>);
                expect(result.items.length).toBe(1);
                expect(result.items[0].id).toBe('product_0');
                expect(result.items[0].name).toBe('product_name_0');
                expect(BaseRepository.prototype.getPaginated).toBeCalled();
            });
        });
    });
});
