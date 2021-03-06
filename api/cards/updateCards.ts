import { Request, Response } from "express";
import * as cardsUtils from "~/utils/cards";

export default (_: Request, response: Response) =>
  cardsUtils.updateCardsStorage().then(commitInfo => {
    response.send({
      apiName: "cards/update",
      commit: commitInfo
    });
  });
