import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

import { InjectRepository } from '@mikro-orm/nestjs';
import { File } from './entities/file.entity';
import { EntityRepository } from '@mikro-orm/core';
import { v4 as UUID } from 'uuid';
import { QiniuClient } from './clients/qiniu.client';

@Injectable()
export class FileService {
  constructor(
    private readonly qiniuClient: QiniuClient,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>, // private readonly configService: ConfigService,
  ) { }

  /**
   * Sign a upload request for given size. The alternative MinIO endpoint for user will be used in the POST URL.
   */
  async signUploadRequest(minSize?: number, maxSize?: number) {
    const uuid = UUID();
    const qiniu = await this.qiniuClient.signUploadLink(uuid);

    return {
      ...qiniu,
      uuid,
      method: 'POST',
      fileFieldName: 'file',
    };
  }

  async signDownloadUrl(key: string): Promise<any> {
    const qiniuInfo = await this.qiniuClient.stat(key)
    return this.qiniuClient.signDownloadLink(key);
  }

  async createFile(uuid: string, size: number) {
    const file = new File()
    file.uuid = uuid;
    file.size = size;
    file.uploadTime = new Date();
    await this.fileRepository.persistAndFlush(file)
    return file;
  }

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  async findOne(key: string) {
    return await this.signDownloadUrl(key);
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
