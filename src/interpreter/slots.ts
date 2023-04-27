export enum SlotType {
  STRING = 'string',
  NUMBER = 'number',
  LOCAL_FILE = 'local_file',
  REMOTE_FILE = 'remote_file',
  REMOTE_DIR = 'remote_dir',
  S3_FILE = 's3_file',
  S3_DIR = 's3_dir',
}

export type SlotValue =
  | {
      type: SlotType.NUMBER;
      value: number;
    }
  | {
      type: SlotType.STRING;
      value: string;
    }
  | {
      type: SlotType.REMOTE_FILE;
      files: Array<{
        url: string;
        filename: string;
      }>;
    }
  | {
      type: SlotType.LOCAL_FILE;
      files: Array<string>;
    }
  | {
      type: SlotType.S3_FILE;
      key: string;
    }
  | {
      type: SlotType.S3_DIR;
      keys: Array<string>;
    };
