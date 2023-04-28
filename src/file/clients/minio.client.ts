import { FileClient } from "./client.interface";

export class MinioClient implements FileClient {
  async stat(key: string): Promise<{ size: number; } | { error: string; }> {
    return {
      size: 0
    }
  }

  async signDownloadLink(): Promise<string> {
    return "";
  }

  async signUploadLink(key: string): Promise<{ url: string; extraFormData: { [key: string]: string; }; }> {
    return {
      url: "",
      extraFormData: {}
    }
  }
}

