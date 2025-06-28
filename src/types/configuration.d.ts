export type AppConfiguration = {
  db: DataSourceConfiguration;
  jwt: JwtConfiguration;
  server: ServerConfiguration;
  swagger: SwaggerConfiguration;
};

export type DataSourceConfiguration = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type JwtConfiguration = {
  secret: string;
  accessTokenDuration: string;
  refreshTokenDuration: string;
};

export type ServerConfiguration = {
  port: number;
};

export type SwaggerConfiguration = {
  username: string;
  password: string;
};
