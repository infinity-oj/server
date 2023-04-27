import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

import { Client as MinioClient } from 'minio';
import { InjectRepository } from '@mikro-orm/nestjs';
import { File } from './entities/file.entity';
import { EntityRepository } from '@mikro-orm/core';
import { v4 as UUID } from 'uuid';
import { QiniuClient } from './clients/qiniu.client';

@Injectable()
export class FileService {
  private readonly minioClient: MinioClient;
  private readonly bucket: string;

  constructor(
    private readonly qiniuClient: QiniuClient,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>, // private readonly configService: ConfigService,
  ) {
    // const config = this.configService.services.minio;
    // const commonOptions: Pick<
    //   ClientOptions,
    //   'accessKey' | 'secretKey' | 'region'
    // > = {
    //   accessKey: config.accessKey,
    //   secretKey: config.secretKey,
    //   region: 'us-east-1',
    // };

    this.minioClient = new MinioClient({
      endPoint: process.env.MINIO_HOST,
      port: Number(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USESSL === 'true',
      accessKey: process.env.MINIO_USER,
      secretKey: process.env.MINIO_PASSWORD,
    });
    this.bucket = process.env.MINIO_BUCKET;
  }

  fileExistsInMinio(uuid: string): Promise<boolean> {
    return new Promise((resolve) =>
      this.minioClient
        .statObject(this.bucket, uuid)
        .then(() => resolve(true))
        .catch(() => resolve(false)),
    );
  }

  /**
   * Sign a upload request for given size. The alternative MinIO endpoint for user will be used in the POST URL.
   */
  async signUploadRequest(minSize?: number, maxSize?: number) {
    const signer = this.minioClient;
    const uuid = UUID();
    const policy = signer.newPostPolicy();
    policy.setBucket(this.bucket);
    policy.setKey(uuid);
    policy.setExpires(new Date(Date.now() + 24 * 30 * 1000));
    if (minSize != null || maxSize != null) {
      policy.setContentLengthRange(minSize || 0, maxSize || 0);
    }
    const policyResult = await signer.presignedPostPolicy(policy);

    return {
      uuid,
      method: 'POST',
      url: policyResult.postURL,
      extraFormData: policyResult.formData,
      fileFieldName: 'file',
    };
  }

  async signDownloadUrl(key: string): Promise<string> {
    const exist = await this.fileExistsInMinio(key);
    if (exist) {
      return await this.minioClient.presignedGetObject(this.bucket, key);
    } else {
      return this.qiniuClient.signDownloadLink(key);
    }
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
