import * as httpMocks from "node-mocks-http";
import "../../utils/cards";
import updateCardsController from "./updateCards";

const mockUpdateCardsStorage = jest.fn(() => Promise.resolve("updateInfo"));

jest.mock("../../utils/cards", () => ({
  updateCardsStorage: () => mockUpdateCardsStorage()
}));

describe("updateCardsController", () => {
  let req: httpMocks.MockRequest<any>;
  let res: httpMocks.MockResponse<any>;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  it(`should send object with date and apiName`, async () => {
    res.send = jest.fn();
    await updateCardsController(req, res);

    expect(mockUpdateCardsStorage).toHaveBeenCalled();
    const sendParam = res.send.mock.calls[0][0];
    expect(sendParam).toMatchObject({
      apiName: "cards/update",
      commit: "updateInfo"
    });
  });
});
