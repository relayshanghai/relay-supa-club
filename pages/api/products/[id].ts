import { createHandler } from 'src/utils/handler/create-handler';
import { GET, Path, Status } from 'src/utils/handler/decorators/api-decorator';
import httpCodes from 'src/constants/httpCodes';
import ProductService from 'src/backend/domain/product/product-service';

export class ProductApiHandler {
    @GET()
    @Status(httpCodes.OK)
    async create(@Path('id') id: string) {
        const response = await ProductService.getService().getOne(id);
        return response;
    }
}

export default createHandler(ProductApiHandler);