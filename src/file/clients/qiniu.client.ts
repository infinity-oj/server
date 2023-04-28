import { FileClient } from './client.interface';
import qiniu from 'qiniu';
import moment from 'moment';

export class QiniuClient implements FileClient {
  private bucket = 'spaces';
  constructor() {
    qiniu.conf.ACCESS_KEY = process.env.QINIU_AK;
    qiniu.conf.SECRET_KEY = process.env.QINIU_SK;
  }


  async stat(key: string): Promise<{ size: number } | { error: string }> {
    const bucketManager = new qiniu.rs.BucketManager();
    return new Promise((res, rej) => {
      bucketManager.stat(this.bucket, key, (err, respBody, respInfo) => {
        if (err) {
          rej({ error: err.name })
        } else {
          if (respInfo.statusCode === 200) {
            res({ size: respBody.fsize })
          } else {
            res({ error: respBody.error })
          }
        }
      })
    })
  }

  async signDownloadLink(key: string): Promise<string> {
    const bucketManager = new qiniu.rs.BucketManager();
    const privateBucketDomain = 'https://file.spaces.sustech.cloud';
    const deadline = moment().add({ days: 1 }).unix();
    const privateDownloadUrl = bucketManager.privateDownloadUrl(
      privateBucketDomain,
      key,
      deadline,
    );
    return privateDownloadUrl;
  }

  async signUploadLink(
    key: string,
  ): Promise<{ url: string; extraFormData: { [key: string]: string } }> {
    const resource_key = `${this.bucket}:${key}`;
    const options = {
      scope: resource_key,
      expires: 1800,
      callbackUrl: 'https://eb3d-183-49-46-196.ngrok-free.app/file/callback',
      callbackBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
      callbackBodyType: 'application/json',
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken();
    return {
      url: 'https://up-z2.qiniup.com',
      extraFormData: {
        key,
        token: uploadToken,
      },
    };
  }
}
