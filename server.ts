/* istanbul ignore file */
import * as Sentry from "@sentry/node";
import express, { Request, Response } from "express";
import next from "next";

import api from "./api";
import * as cardsUtils from "./utils/cards";
import { collectAllTags } from "./utils/tags";

const PORT = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

Sentry.init({
  dsn: "https://320d89774d7344ed9c949a784a6e1c7d@sentry.io/1325279",
  beforeSend(event: Sentry.SentryEvent) {
    if (!process.env.HEROKU) {
      return null;
    }
    return event;
  }
});

app
  .prepare()
  .then(() => cardsUtils.setupCardsStorage())
  .then(() => {
    const server = express();
    server.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

    // The error handler must be before any other error middleware
    server.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
    server.use(api);

    // The error handler must be before any other error middleware
    server.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
    server.get("*", (request: Request, response: Response) =>
      handle(request, response)
    );

    server.listen(PORT, (err: Error) => {
      if (err) {
        throw err;
      }
      /* tslint:disable no-console */
      console.log(`Listen to the http://0.0.0.0:${PORT}`);
      collectAllTags();
    });
  })
  .catch((ex: any) => {
    /* tslint:disable no-console */
    console.error(ex.stack);
    process.exit(1);
  });
