import { filterKnownCards, getAllCards } from "~/utils/cards";
import { RepoTags } from "../typings/common";

export const repoTags: RepoTags = {};

export const collectAllTags = () =>
  getAllCards()
    .then(cards => filterKnownCards(cards))
    .then(cards =>
      cards.reduce((currentTags: RepoTags, card) => {
        card.tags.forEach(tag => {
          if (currentTags[tag]) {
            currentTags[tag] += 1;
          } else {
            currentTags[tag] = 1;
          }
        });
        return currentTags;
      }, repoTags)
    )
    /* tslint:disable no-console */
    .catch((e: Error) => console.error(e));
