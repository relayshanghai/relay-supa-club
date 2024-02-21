import ProductRepository from "src/backend/database/product-repository";
import { RequestContext } from "src/utils/request-context/request-context";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductService from "./product-service";
import awaitToError from "src/utils/await-to-error";

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
            })
            it('should throw unauthorized error when company id does not exists in the request context', async () => {
                getContextMock.mockReturnValue({})
                const [err] = await awaitToError( ProductService.getService().create({
                    name: 'product_name',
                    description: 'product_description',
                    price: 100,
                    shopUrl: 'https://example.com',
                    currency: 'USD',
                }))
                expect(err.message).toBe('No company id found in request context');

            })
        })
    })
})