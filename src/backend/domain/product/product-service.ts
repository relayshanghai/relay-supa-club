import type { GetProductRequest, ProductRequest } from 'pages/api/products/request';
import { CompanyIdRequired } from '../decorators/company-id';
import type { GetProductResponse } from 'pages/api/products/response';
import { RequestContext } from 'src/utils/request-context/request-context';
import ProductRepository from 'src/backend/database/product/product-repository';
import { type FindOptionsWhere, Like } from 'typeorm';
import { ProductEntity } from 'src/backend/database/product/product-entity';
import type { CompanyEntity } from 'src/backend/database/company/company-entity';
import { type Paginated } from 'types/pagination';

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
    async getOne(id: string): Promise<GetProductResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const product = await ProductRepository.getRepository().findOneBy({
            id,
            company: {
                id: companyId,
            },
        });
        if (!product) {
            throw new Error(`Product with id: ${id} does not exists`);
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
        const where: FindOptionsWhere<ProductEntity> = {
            company: {
                id: companyId,
            },
        };
        if (request.name) {
            where.name = Like(`%${request.name}%`);
        }
        const products = await ProductRepository.getRepository().find({
            where,
            skip: (request.page - 1) * request.size,
            take: request.size,
        });
        const totalSize = await ProductRepository.getRepository().count({
            where,
        });
        const totalPages = Math.ceil(totalSize / request.size);

        const items = products.map((d) => ({
            id: d.id,
            name: d.name ?? '',
            description: d.description ?? '',
            price: d.price ?? 0,
            shopUrl: d.shopUrl ?? '',
            currency: d.priceCurrency ?? '',
            createdAt: new Date(d.createdAt),
            updatedAt: new Date(d.updatedAt),
        }));
        return {
            items,
            page: request.page,
            size: request.size,
            totalPages,
            totalSize,
        };
    }
}
