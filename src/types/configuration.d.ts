export type AppConfiguration = {
  db: DataSourceConfiguration;
  server: ServerConfiguration;
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
