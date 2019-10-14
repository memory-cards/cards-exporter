import { Request, Response } from "express";
import * as fs from "fs";
import * as json5 from "json5";
import * as util from "util";

const readFilePromised = util.promisify(fs.readFile);

// const filename = "data/cards/enki/html/best-practices/alt-with-images-0.json5";

export default (request: Request, response: Response) => {
  const { filename } = request.query;
  readFilePromised(filename).then(item =>
    response.send(json5.parse(item.toString()))
  );
};
