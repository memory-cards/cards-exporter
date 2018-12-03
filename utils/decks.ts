import AnkiExport from "anki-apkg-export";
import * as fs from "fs";
import * as tmp from "tmp";
import * as util from "util";
import { ICardDefinition } from "~/typings/ICardDefinition";
import { getCardData } from "~/utils/cards";

const writeFilePromised = util.promisify(fs.writeFile);
const getTmpFileName: (
  simpleOptions?: tmp.SimpleOptions
) => Promise<string> = util.promisify(tmp.tmpName) as any;

export const generateDeck = async (
  cards: ICardDefinition[] = [],
  deckName = ""
) => {
  const tmpFileName = await getTmpFileName();
  const now = new Date();
  const name =
    deckName ||
    `Exported deck (${now.toLocaleDateString()} ${now.toLocaleTimeString()})`;
  const apkg = new AnkiExport(name);
  cards.forEach((card: ICardDefinition) => {
    const { front, back, tags } = getCardData(card);
    apkg.addCard(front, back, tags);
  });
  return apkg
    .save()
    .then((zip: string | Buffer) =>
      writeFilePromised(`${tmpFileName}`, zip, "binary")
    )
    .then(() => ({
      deckName: name,
      fileName: tmpFileName
    }));
};
