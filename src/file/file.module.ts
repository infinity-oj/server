import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { File } from './entities/file.entity';
import { QiniuClient } from './clients/qiniu.client';

@Module({
  imports: [MikroOrmModule.forFeature([File])],
  controllers: [FileController],
  providers: [FileService, QiniuClient],
  exports: [FileService],
})
export class FileModule {}
