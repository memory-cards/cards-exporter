import express, { Request, Response } from "express";
import next from "next";

import api from "./api";

const PORT = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(api);

    server.get("*", (request: Request, response: Response) =>
      handle(request, response)
    );

    server.listen(PORT, (err: Error) => {
      if (err) {
        throw err;
      }
      /* tslint:disable no-console */
      console.log(`Listen to the http://0.0.0.0:${PORT}`);
    });
  })
  .catch((ex: any) => {
    /* tslint:disable no-console */
    console.error(ex.stack);
    process.exit(1);
  });
