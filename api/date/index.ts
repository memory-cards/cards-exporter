import { Request, Response } from "express";

export default (_: Request, response: Response) => {
  response.send({
    apiName: "date",
    date: new Date()
  });
};
