import { products } from "drizzle/schema";
import awaitToError from "src/utils/await-to-error";
import { db } from "src/utils/database";

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
        }
    }
}