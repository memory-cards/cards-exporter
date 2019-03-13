import { Request, Response } from "express";
import * as fs from "fs";
import * as glob from "glob";
import * as json5 from "json5";
import * as util from "util";

const globPromised = util.promisify(glob.Glob);
const readFilePromised = util.promisify(fs.readFile);

export default (_: Request, response: Response) =>
  globPromised("data/cards/**/*.json*").then((files: string[]) =>
    Promise.all(
      files.map(fileName =>
        readFilePromised(fileName).then(item => json5.parse(item.toString()))
      )
    ).then(filesInfo =>
      response.send({
        apiName: "cards/list",
        cards: filesInfo
      })
    )
  );
