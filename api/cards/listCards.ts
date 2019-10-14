import { Request, Response } from "express";
import { getAllCards } from "~/utils/cards";
import { showMemory } from "~/utils/env";

export default (_: Request, response: Response) =>
  getAllCards().then((cards: string[]) => {
    showMemory();
    return response.send({
      cards,
      apiName: "cards/list"
    });
  });
