import express from 'express';
import { createServer, Server } from 'http';
import path from 'path';

let server: Server;
let app: express.Application;

function startServer(port: number = 3000): Promise<void> {
  app = express();
  app.use(express.static(path.join(__dirname, '../../../dist')));

  server = createServer(app);

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      resolve();
    });
  });
}

function stopServer() {
  return new Promise<void>((resolve) => {
    if (server) {
      server.close(() => {
        console.log('Server has been stopped');
        resolve();
      });
    } else {
      console.log('Server is not running');
    }
  });
}

export { startServer, stopServer };
