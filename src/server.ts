// App.
import createExpressApp from './app';

// Configuration.
import configuration from './configuration';

const { port } = configuration.server;

createExpressApp().listen(port, () =>
  console.log(`Server running on port ${port}`)
);
