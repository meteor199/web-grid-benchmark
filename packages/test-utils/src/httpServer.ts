import express from 'express';
import { createServer, Server } from 'http';
import { GRID_DIST_DIR } from './constants';
import { Server as WsServer, WebSocket } from 'ws';
import url from 'url';
import { generateGridDataUseFaker } from '@web-grid-benchmark/core';
import { faker } from '@faker-js/faker';

let server: Server;
let app: express.Application;

export function startServer(port: number = 3000): Promise<void> {
  app = express();
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    ); //  HTTP 
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
  app.use(express.static(GRID_DIST_DIR));
  app.options('*', (req, res) => {
    res.sendStatus(200);
  });

  server = createServer(app);
  setWs();

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      resolve();
    });
  });
}

export function stopServer() {
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

function setWs() {
  const wss = new WsServer({ server: server });
  wss.on('connection', (ws, req) => {
    const query = url.parse(req.url!, true).query as {
      count: string;
      interval: string;
      total: string;
    };
    const count = parseInt(query.count) || 1;
    const interval = parseInt(query.interval) || 100;
    const total = parseInt(query.total) || 100000;

    console.log('ws connect', count, interval, total);

    pushData(ws, { count, interval, total });
  });
}

function pushData(
  ws: WebSocket,
  options: { count: number; interval: number; total: number }
) {
  const timer = setInterval(() => {
    const dataList = [];
    for (let i = 0; i < options.count; i++) {
      dataList.push(
        generateGridDataUseFaker(faker.number.int({ min: 1, max: 100 }))
      );
    }
    ws.send(JSON.stringify(dataList));
  }, options.interval);
  ws.on('close', () => clearInterval(timer));
}
