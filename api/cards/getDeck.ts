import { Request, Response } from "express";
import * as fs from "fs";
import * as glob from "glob";
import * as json5 from "json5";
import * as util from "util";
import { isCardTypeExists } from "~/utils/cards";
import { generateDeck } from "~/utils/decks";

const globPromised = util.promisify(glob.Glob);
const readFilePromised = util.promisify(fs.readFile);

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
      filesInfo.filter(el => isCardTypeExists(el.type))
    )
    .then((knownCards: ICardDefinition[]) => generateDeck(knownCards))
    .then((deck: { deckName: string; fileName: string }) =>
      response.sendFile(deck.fileName, {
        headers: {
          "Content-Disposition": `attachment; filename="${deck.deckName}.apkg"`
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
