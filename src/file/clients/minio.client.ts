import { FileClient } from "./client.interface";

import { Client } from 'minio';
export class MinioClient implements FileClient {

  private readonly client: Client;
  private readonly bucket: string;

  constructor() {
    this.client = new Client({
      endPoint: process.env.MINIO_HOST,
      port: Number(process.env.MINIO_PORT),
      useSSL: process.env.MINIO_USESSL === 'true',
      accessKey: process.env.MINIO_USER,
      secretKey: process.env.MINIO_PASSWORD,
    });
    this.bucket = process.env.MINIO_BUCKET;
  }

  async stat(key: string): Promise<{ size: number; } | { error: string; }> {
    const info = await this.client.statObject(this.bucket, key);
    return info
  }

  async signDownloadLink(key: string): Promise<string> {
    return await this.client.presignedGetObject(this.bucket, key);
  }

  async signUploadLink(key: string): Promise<{ url: string; extraFormData: { [key: string]: string; }; }> {
    return {
      url: "",
      extraFormData: {}
    }
  }
}

