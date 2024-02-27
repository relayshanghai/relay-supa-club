import { and, eq } from 'drizzle-orm';
import { products } from 'drizzle/schema';
import { type GetProductRequest } from 'pages/api/products/request';
import awaitToError from 'src/utils/await-to-error';
import { db } from 'src/utils/database';
import { type Paginated } from 'types/pagination';

export type ProductInsert = typeof products.$inferInsert;

export type ProductUpdate = [id: string, update: Partial<typeof products.$inferSelect>];

export interface Product {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
    shopUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

export default class ProductRepository {
    public static readonly repository: ProductRepository = new ProductRepository();
    static getRepository(): ProductRepository {
        return ProductRepository.repository;
    }

    async create(companyId: string, product: Omit<ProductInsert, 'company_id'>): Promise<Product> {
        const [err, inserted] = await awaitToError(
            db()
                .insert(products)
                .values({
                    ...product,
                    company_id: companyId,
                })
                .returning(),
        );
        if (err) {
            throw err;
        }
        const returning = inserted[0];
        return {
            id: returning.id,
            name: returning.name || '',
            description: returning.description || '',
            price: returning.price || 0,
            shopUrl: returning.shop_url || '',
            currency: returning.price_currency || '',
            createdAt: new Date(returning.created_at),
            updatedAt: new Date(returning.updated_at),
        };
    }
    async getOne(companyId: string, id: string): Promise<Product> {
        const [product] = await db()
            .select()
            .from(products)
            .where(and(eq(products.id, id), eq(products.company_id, companyId)));
        if (!product) {
            throw new Error(`Product with id: ${id} does not exists`);
        }
        return {
            id: product.id,
            name: product.name || '',
            description: product.description || '',
            price: product.price || 0,
            shopUrl: product.shop_url || '',
            currency: product.price_currency || '',
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
        };
    }
    async fetch(companyId: string, request: GetProductRequest): Promise<Paginated<Product>> {
        const product = await db()
            .select()
            .from(products)
            .limit(request.size)
            .offset(request.page)
            .where(and(eq(products.company_id, companyId), eq(products.name, request.name as string)));
        const items = product.map((d) => ({
            id: d.id,
            name: d.name ?? '',
            description: d.description ?? '',
            price: d.price ?? 0,
            shopUrl: d.shop_url ?? '',
            currency: d.price_currency ?? '',
            createdAt: new Date(d.created_at),
            updatedAt: new Date(d.updated_at),
        }));
        return {
            items,
            page: request.page,
            size: request.size,
            totalPages: 0,
            totalSize: 0,
        };
    }
}
