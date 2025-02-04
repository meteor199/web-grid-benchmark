import { startServer } from './httpServer';

(async () => {
  const port = 6174;
  await startServer(port);
})();
