import { Request, Response } from "express";

export default (_: Request, response: Response) => {
  const x: any = {};
  x.someStrangeMethod();

  response.send({
    apiName: "date",
    date: new Date()
  });
};
