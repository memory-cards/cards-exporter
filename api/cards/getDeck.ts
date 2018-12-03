import { Request, Response } from "express";
import { filterKnownCards, getAllCards } from "~/utils/cards";
import { generateDeck } from "~/utils/decks";

export default (_: Request, response: Response) =>
  getAllCards()
    .then(cards => filterKnownCards(cards))
    .then(knownCards => generateDeck(knownCards))
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
