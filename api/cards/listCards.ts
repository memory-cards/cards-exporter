import { Request, Response } from "express";
import { getAllCards } from "~/utils/cards";

export default (_: Request, response: Response) =>
  getAllCards().then(filesInfo =>
    response.send({
      apiName: "cards/list",
      cards: filesInfo
    })
  );
