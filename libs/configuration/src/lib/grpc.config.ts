import { GrpcOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsString } from 'class-validator';
import { join } from 'path';

export enum GRPC_SERVICES {
  AUTHORIZER_SERVICE = 'AUTHORIZER_SERVICE',
  USER_ACCESS_SERVICE = 'USER_ACCESS_SERVICE',
}

export class GrpcConfiguration {
  @IsNotEmpty()
  @IsString()
  GRPC_AUTHORIZER_SERVICE: GrpcOptions & { name: GRPC_SERVICES };

  @IsNotEmpty()
  @IsString()
  GRPC_USER_ACCESS_SERVICE: GrpcOptions & { name: GRPC_SERVICES };

  constructor() {
    this.GRPC_AUTHORIZER_SERVICE = GrpcConfiguration.setValue({
      Key: GRPC_SERVICES.AUTHORIZER_SERVICE,
      protoPath: ['./proto/authorizer.proto'],
      host: process.env['AUTHORIZER_SERVICE_HOST'] || 'localhost',
      post: Number(process.env['AUTHORIZER_SERVICE_PORT']) || 5100,
    });
    this.GRPC_USER_ACCESS_SERVICE = GrpcConfiguration.setValue({
      Key: GRPC_SERVICES.USER_ACCESS_SERVICE,
      protoPath: ['./proto/user-access.proto'],
      host: process.env['USER_ACCESS_SERVICE_HOST'] || 'localhost',
      post: Number(process.env['USER_ACCESS_SERVICE_PORT']) || 5101,
    });
  }

  private static setValue({
    Key,
    protoPath,
    post,
    host,
  }: {
    Key: GRPC_SERVICES;
    protoPath: string | string[];
    post?: number;
    host?: string;
  }): GrpcOptions & { name: GRPC_SERVICES } {
    return {
      name: Key,
      transport: Transport.GRPC,
      options: {
        url: `${host}:${post}`,
        package: 'package',
        protoPath: Array.isArray(protoPath)
          ? protoPath.map((path) => join(__dirname, path))
          : join(__dirname, protoPath),
      },
    };
  }
}
