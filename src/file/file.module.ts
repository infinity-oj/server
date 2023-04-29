import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { File } from './entities/file.entity';
import { QiniuClient } from './clients/qiniu.client';
import { MinioClient } from './clients/minio.client';

@Module({
  imports: [MikroOrmModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService, QiniuClient, MinioClient],
  exports: [FileService],
})
export class FileModule {}
