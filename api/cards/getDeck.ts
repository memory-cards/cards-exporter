import AnkiExport from "anki-apkg-export";
import { Request, Response } from "express";
import * as fs from "fs";
import * as glob from "glob";
import * as json5 from "json5";
import * as tmp from "tmp";
import * as util from "util";
import { getCardData, isCardTypeExists } from "~/utils/cards";

const globPromised = util.promisify(glob.Glob);
const readFilePromised = util.promisify(fs.readFile);
const writeFilePromised = util.promisify(fs.writeFile);
const getTmpFileName: (
  simpleOptions?: tmp.SimpleOptions
) => Promise<string> = util.promisify(tmp.tmpName) as any;

export default (_: Request, response: Response) =>
  globPromised("data/cards/*/*.json*")
    .then((files: string[]) =>
      Promise.all(
        files.map(fileName =>
          readFilePromised(fileName).then(item => json5.parse(item.toString()))
        )
      )
    )
    .then((filesInfo: any[]) =>
      Promise.all([
        filesInfo.filter(el => isCardTypeExists(el.type)),
        getTmpFileName({})
      ])
    )
    .then(([knownCards, tmpFileName]: [object[], string]) => {
      const now = new Date();
      const apkg = new AnkiExport(
        `Exported deck (${now.toLocaleDateString()} ${now.toLocaleTimeString()})`
      );
      knownCards.forEach((card: any) => {
        const { front, back, tags } = getCardData(card);
        apkg.addCard(front, back, tags);
      });
      apkg
        .save()
        .then((zip: string) =>
          writeFilePromised(`${tmpFileName}`, zip, "binary")
        )
        .then(() =>
          response.sendFile(tmpFileName, {
            headers: {
              "Content-Disposition": `attachment; filename="Exported deck: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}.apkg"`
            }
          })
        )
        .catch((e: Error) =>
          response.send({
            apiName: "cards/getDeck",
            message: e.message,
            stack: e.stack
          })
        );
    });
