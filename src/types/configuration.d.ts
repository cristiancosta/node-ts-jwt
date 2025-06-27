export type AppConfiguration = {
  db: DataSourceConfiguration;
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

export type ServerConfiguration = {
  port: number;
};

export type SwaggerConfiguration = {
  username: string;
  password: string;
};
