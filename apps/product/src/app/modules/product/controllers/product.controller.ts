import { MessagePattern } from '@nestjs/microservices';
import { Controller, UseInterceptors } from '@nestjs/common';

import {
  CreateProductTcpRequest,
  ProductTcpResponse,
} from '@common/interfaces/tcp/product';
import { ProductService } from '../services/product.service';
import { RequestParam } from '@common/decorators/request-param.decorator';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { TcpLoggingInterceptor } from '@common/interceptors/tcp-logging.interceptor';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.CREATE)
  async create(
    @RequestParam() params: CreateProductTcpRequest,
  ): Promise<Response<ProductTcpResponse>> {
    const result = await this.productService.create(params);
    return Response.success<ProductTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.GET_ALL)
  async getAll(): Promise<Response<ProductTcpResponse[]>> {
    const result = await this.productService.getAll();
    return Response.success<ProductTcpResponse[]>(result);
  }
}
