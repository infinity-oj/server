import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

import { Client as MinioClient, ClientOptions } from 'minio';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { File } from './entities/file.entity';
import { EntityRepository } from '@mikro-orm/core';
import { v4 as UUID } from 'uuid';

@Injectable()
export class FileService {
  private readonly minioClient: MinioClient;
  private readonly bucket: string;

  constructor(
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
      endPoint: '192.168.1.17',
      port: 9000,
      useSSL: false,
      accessKey: 'nKPRpQHXAoh0wzqz',
      secretKey: 'CcHDEuEFyzOzAnTJGmSQvHwDeBMt0gVb',
    });
    this.bucket = 'ioj-submissions';
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

  async getPresignedUploadUrl() {
    return new Promise((resolve, reject) => {
      this.minioClient.presignedPutObject(
        this.bucket,
        'hello.txt',
        24 * 60 * 60,
        (err, presignedUrl) => (err ? reject(err) : resolve(presignedUrl)),
      );
    });
  }

  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
