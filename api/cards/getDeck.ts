import { Request, Response } from "express";
import {
  filterCardsByTags,
  filterKnownCards,
  getAllCards
} from "~/utils/cards";
import { generateDeck } from "~/utils/decks";

export default (request: Request, response: Response) => {
  const params = request.query;
  const requestedTags = params.tags
    ? Array.isArray(params.tags)
      ? params.tags
      : [params.tags]
    : [];

  return getAllCards()
    .then(cards => filterKnownCards(cards))
    .then(knownCards => filterCardsByTags(knownCards, requestedTags))
    .then(filteredCards => generateDeck(filteredCards))
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
};
