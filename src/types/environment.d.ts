declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      DB_PORT: string;
      SERVER_PORT: string;
      JWT_SECRET: string;
      JWT_ACCESS_TOKEN_DURATION: string;
      JWT_REFRESH_TOKEN_DURATION: string;
      SWAGGER_USERNAME: string;
      SWAGGER_PASSWORD: string;
    }
  }
}

export {};
