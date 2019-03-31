import { Request, Response } from "express";
import { knownTags } from "~/utils/tags";

export default (_: Request, response: Response) => {
  return Promise.resolve()
    .then(() =>
      response.send({
        apiName: "cards/tags",
        tags: knownTags
      })
    )
    .catch((e: Error) =>
      response.send({
        apiName: "cards/tags",
        message: e.message,
        stack: e.stack
      })
    );
};
