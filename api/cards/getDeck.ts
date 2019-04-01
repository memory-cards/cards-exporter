import { Request, Response } from "express";
import { filterKnownCards, getAllCards } from "~/utils/cards";
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
    .then(knownCards =>
      requestedTags.length
        ? knownCards.filter(card =>
            card.tags.some(tag =>
              requestedTags.some((userTag: string) => userTag === tag)
            )
          )
        : knownCards
    )
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
