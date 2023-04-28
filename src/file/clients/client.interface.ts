
export interface FileClient {
  stat(key: string): Promise<{ size: number } | { error: string }>;
  signDownloadLink(key: string): Promise<string>;
  signUploadLink(key: string): Promise<{
    url: string,
    extraFormData: {
      [key: string]: string;
    }
  }>;
}
