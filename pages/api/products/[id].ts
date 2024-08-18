import { createHandler } from 'src/utils/handler/create-handler';
import { DELETE, GET, PUT, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import ProductService from 'src/backend/domain/product/product-service';
import { ProductRequest } from './request';
import { Path } from 'src/utils/handler/decorators/api-path-decorator';
import { Body } from 'src/utils/handler/decorators/api-body-decorator';

export class ProductApiHandler {
    @GET()
    @Status(httpCodes.OK)
    async create(@Path('id') id: string) {
        const response = await ProductService.getService().getOne(id);
        return response;
    }

    @PUT()
    @Status(httpCodes.OK)
    async update(@Body(ProductRequest) request: ProductRequest, @Path('id') id: string) {
        const response = await ProductService.getService().update(request, id);
        return response;
    }

    @DELETE()
    @Status(httpCodes.OK)
    async delete(@Path('id') id: string) {
        const response = await ProductService.getService().delete(id);
        return response;
    }
}

export default createHandler(ProductApiHandler);
