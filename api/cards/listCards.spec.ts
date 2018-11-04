import "fs";
import "glob";
import * as httpMocks from "node-mocks-http";

jest.mock("glob", () => ({
  Glob: (pattern: string, cb: (_: null, x: string[]) => void) =>
    cb(null, [pattern])
}));
jest.mock("fs", () => ({
  readFile: (fileName: string, cb: (_: null, x: any) => void) =>
    cb(null, [JSON.stringify({ "content for": fileName })])
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

    const sendParam = res.send.mock.calls[0][0];
    expect(sendParam).toMatchObject({
      apiName: "cards/list",
      cards: [{ "content for": "data/cards/*/*.json*" }]
    });
  });
});
