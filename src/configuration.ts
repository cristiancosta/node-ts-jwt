type AppConfiguration = {
  server: {
    port: number;
  };
}
 
const configuration: AppConfiguration = {
  server: {
    port: Number(process.env.PORT) || 8888
  }
};

export default configuration;
