import { createHandler } from 'src/utils/handler/create-handler';
import { ProductRequest } from './request';
import { Body, POST, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import ProductService from 'src/backend/domain/product/product-service';

export class ProductApiHandler {
    @POST()
    @Status(httpCodes.CREATED)
    async create(@Body(ProductRequest) request: ProductRequest) {
        const response = await ProductService.getService().create(request);
        return response;
    }
}

export default createHandler(ProductApiHandler);
