import type { ProductRequest } from "pages/api/products/request";
import { CompanyIdRequired } from "../decorators/company-id";
import type { GetProductResponse } from "pages/api/products/response";
import ProductRepository from "src/backend/database/product-repository";
import { RequestContext } from "src/utils/request-context/request-context";

export default class ProductService {
    public static readonly service: ProductService = new ProductService();
    static getService(): ProductService {
        return ProductService.service;
    }
    @CompanyIdRequired()
    async create(request: ProductRequest): Promise<GetProductResponse> {
        const companyId = RequestContext.getContext().companyId as string;
        const response = await ProductRepository.getRepository().create(companyId, request);
        return response;
    }
}