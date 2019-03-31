import { Request, Response } from "express";
import { filterKnownCards, getAllCards } from "~/utils/cards";

const knownTags: any = {};

export default (_: Request, response: Response) =>
  getAllCards()
    .then(cards => filterKnownCards(cards))
    .then(cards => {
      cards.forEach(card => {
        card.tags.forEach(tag => {
          if (!knownTags[tag]) {
            knownTags[tag] = 1;
          } else {
            knownTags[tag] += 1;
          }
        });
      });
    })
    .then(() =>
      response.send({
        apiName: "cards/filter",
        tags: knownTags
      })
    )
    .catch((e: Error) =>
      response.send({
        apiName: "cards/filterCards",
        message: e.message,
        stack: e.stack
      })
    );
