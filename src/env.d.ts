declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';

      PORT: string;

      DATABASE_TYPE: 'mysql' | 'mariadb';
      DATABASE_NAME: string;
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;

      REDIS_HOST: string;
      REDIS_PORT: string;
    }
  }
}

export {};
