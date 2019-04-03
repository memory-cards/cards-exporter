import { Request, Response } from "express";
import { repoTags } from "~/utils/tags";

export default (_: Request, response: Response) => {
  response.send({
    apiName: "cards/tags",
    tags: repoTags
  });
};
