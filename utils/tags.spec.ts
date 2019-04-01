import * as cards from "~/utils/cards";
import { collectAllTags, repoTags } from "./tags";

describe("collectAllTags", () => {
  let mockFilterKnownCards: jest.SpyInstance<any>;
  let mockGetAllCards: jest.SpyInstance<any>;

  beforeEach(() => {
    mockFilterKnownCards = jest.spyOn(cards, "filterKnownCards");
    mockGetAllCards = jest.spyOn(cards, "getAllCards");
  });

  afterEach(() => {
    mockGetAllCards.mockRestore();
    mockFilterKnownCards.mockRestore();
  });

  it("collects repo tags correctly", async () => {
    const value = () => Math.random().toString();
    const getCard = (tags: string[]) => ({ tags });

    const tag1 = value();
    const tag2 = value();
    const tag3 = value();

    const getAllCardsMock: any[] = [];
    const filterKnownCardsMock: any[] = [
      getCard([]),
      getCard([tag3]),
      getCard([tag3, tag2]),
      getCard([tag3, tag2, tag1])
    ];
    mockGetAllCards.mockReturnValue(Promise.resolve(getAllCardsMock));
    mockFilterKnownCards.mockReturnValue(Promise.resolve(filterKnownCardsMock));

    await collectAllTags();

    expect(repoTags).toEqual({ [tag1]: 1, [tag2]: 2, [tag3]: 3 });
  });
});
