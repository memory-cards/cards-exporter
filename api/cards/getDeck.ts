import { Request, Response } from "express";
import { ICardDefinition } from "~/typings/ICardDefinition";
import { filterKnownCards, getAllCards } from "~/utils/cards";
import { generateDeck } from "~/utils/decks";

export default (request: Request, response: Response) => {
  const params = request.query;
  const userTags = params.tags
    ? Array.isArray(params.tags)
      ? params.tags
      : [params.tags]
    : [];

  return getAllCards()
    .then(cards => filterKnownCards(cards))
    .then(knownCards => {
      let filteredCards: ICardDefinition[] = [];

      if (userTags.length) {
        knownCards.forEach(card => {
          const hasUserTag = card.tags.some(tag => {
            return userTags.some((userTag: string) => userTag === tag);
          });

          if (hasUserTag) {
            filteredCards.push(card);
          }
        });
      } else {
        filteredCards = knownCards;
      }

      return filteredCards;
    })
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
