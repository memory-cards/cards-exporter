import { filterKnownCards, getAllCards } from "~/utils/cards";

export const knownTags: any = {};

export const collectAllTags = () =>
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
    /* tslint:disable no-console */
    .catch((e: Error) => console.log(e));
