import type { GetProductRequest, ProductRequest } from 'pages/api/products/request';
import { CompanyIdRequired } from '../decorators/company-id';
import type { GetProductResponse } from 'pages/api/products/response';
import { RequestContext } from 'src/utils/request-context/request-context';
import ProductRepository from 'src/backend/database/product/product-repository';
import { ProductEntity } from 'src/backend/database/product/product-entity';
import type { CompanyEntity } from 'src/backend/database/company/company-entity';
import { type Paginated } from 'types/pagination';
import { NotFoundError } from 'src/utils/error/http-error';

export default class ProductService {
    public static readonly service: ProductService = new ProductService();
    static getService(): ProductService {
        return ProductService.service;
    }
    @CompanyIdRequired()
    async create(request: ProductRequest): Promise<GetProductResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const product = new ProductEntity();
        product.name = request.name;
        product.description = request.description;
        product.price = request.price;
        product.shopUrl = request.shopUrl;
        product.priceCurrency = request.currency;
        product.company = {
            id: companyId,
        } as CompanyEntity;
        const response = await ProductRepository.getRepository().save(product);
        const currency = response.priceCurrency as string;
        delete response.priceCurrency;
        return { ...response, currency } as GetProductResponse;
    }
    @CompanyIdRequired()
    async update(request: ProductRequest, id: string): Promise<GetProductResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const product = await ProductRepository.getRepository().findOneBy({
            id,
            company: {
                id: companyId,
            },
        });
        if (!product) {
            throw new NotFoundError(`Product with id: ${id} does not exists`);
        }
        const c = request.currency;
        const newProduct = {
            ...product,
            name: request.name,
            description: request.description,
            price: request.price,
            shopUrl: request.shopUrl,
            priceCurrency: c,
        };
        const response = await ProductRepository.getRepository().save(newProduct);
        const currency = response.priceCurrency;
        delete (response as { priceCurrency?: unknown }).priceCurrency;
        return {
            ...response,
            company: {
                id: companyId,
            },
            currency,
        } as GetProductResponse;
    }
    @CompanyIdRequired()
    async getOne(id: string): Promise<GetProductResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const product = await ProductRepository.getRepository().findOneBy({
            id,
            company: {
                id: companyId,
            },
        });
        if (!product) {
            throw new NotFoundError(`Product with id: ${id} does not exists`);
        }
        return {
            id: product.id,
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            shopUrl: product.shopUrl || '',
            currency: product.priceCurrency || '',
            createdAt: new Date(product.createdAt),
            updatedAt: new Date(product.updatedAt),
        };
    }
    @CompanyIdRequired()
    async fetch(request: GetProductRequest): Promise<Paginated<GetProductResponse>> {
        const companyId = RequestContext.getContext().companyId as string;
        const items = await ProductRepository.getRepository().getPaginated(
            {
                page: request.page,
                size: request.size,
            },
            {
                where: {
                    company: {
                        id: companyId,
                    },
                },
            },
            {
                name: request.name,
            },
        );
        return items as Paginated<GetProductResponse>;
    }
    @CompanyIdRequired()
    async delete(id: string): Promise<void> {
        const companyId = RequestContext.getContext().companyId as string;
        const product = await ProductRepository.getRepository().findOneBy({
            id,
            company: {
                id: companyId,
            },
        });
        if (!product) {
            throw new NotFoundError(`Product with id: ${id} does not exists`);
        }
        await ProductRepository.getRepository().delete({
            id,
        });
    }
}
