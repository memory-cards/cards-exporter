import * as httpMocks from "node-mocks-http";
import { getAllCards } from "~/utils/cards";

jest.mock("~/utils/cards", () => ({
  getAllCards: () => Promise.resolve(["5", "6"])
}));

import listCardsController from "./listCards";

describe("listCardsController", () => {
  let req: httpMocks.MockRequest<any>;
  let res: httpMocks.MockResponse<any>;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  it(`should send object with cards and apiName`, async () => {
    res.send = jest.fn();
    await listCardsController(req, res);
    const expectedCards = await getAllCards();

    const sendParam = res.send.mock.calls[0][0];
    expect(sendParam).toMatchObject({
      apiName: "cards/list",
      cards: expectedCards
    });
  });
});
