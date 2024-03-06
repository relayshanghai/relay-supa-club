import { createHandler } from 'src/utils/handler/create-handler';
import { GetProductRequest, ProductRequest } from './request';
import { GET, POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import ProductService from 'src/backend/domain/product/product-service';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';
import { Query } from 'src/utils/handler/decorators/api-query-decorator';

export class ProductApiHandler {
    @POST()
    @Status(httpCodes.CREATED)
    async create(@Body(ProductRequest) request: ProductRequest) {
        const response = await ProductService.getService().create(request);
        return response;
    }

    @GET()
    @Status(httpCodes.OK)
    async fetch(@Query(GetProductRequest) request: GetProductRequest) {
        const response = await ProductService.getService().fetch(request);
        return response;
    }
}

export default createHandler(ProductApiHandler);
