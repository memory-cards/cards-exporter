import * as httpMocks from "node-mocks-http";
import * as cards from "~/utils/cards";
import * as decks from "~/utils/decks";
import getDeckController from "./getDeck";

describe("getDeckController", () => {
  let req: httpMocks.MockRequest<any>;
  let res: httpMocks.MockResponse<any>;
  let mockFilterKnownCards: jest.SpyInstance<any>;
  let mockGetAllCards: jest.SpyInstance<any>;
  let generateDeckSpy: jest.SpyInstance<any>;
  let sendFileSpy: jest.SpyInstance<any>;
  let sendSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    sendFileSpy = res.sendFile = jest.fn();
    sendSpy = jest.spyOn(res, "send");
    mockFilterKnownCards = jest.spyOn(cards, "filterKnownCards");
    mockGetAllCards = jest.spyOn(cards, "getAllCards");
    generateDeckSpy = jest.spyOn(decks, "generateDeck");
  });
  afterEach(() => {
    generateDeckSpy.mockRestore();
    mockGetAllCards.mockRestore();
    mockFilterKnownCards.mockRestore();
  });
  it("calls pipe of functions and send file with result", async () => {
    const getAllCardsMock: any[] = [];
    const filterKnownCardsMock: any[] = [];
    mockGetAllCards.mockReturnValue(Promise.resolve(getAllCardsMock));
    mockFilterKnownCards.mockReturnValue(Promise.resolve(filterKnownCardsMock));

    await getDeckController(req, res);
    expect(mockGetAllCards).toHaveBeenCalled();
    expect(mockFilterKnownCards).toHaveBeenCalledWith(getAllCardsMock);
    expect(generateDeckSpy).toHaveBeenCalledWith(filterKnownCardsMock);
    expect(sendFileSpy).toHaveBeenCalled();
  });

  it("sends error response of any fail 1", async () => {
    mockGetAllCards.mockImplementation(() =>
      Promise.reject(new Error("some strange error"))
    );
    await getDeckController(req, res);
    expect(sendSpy).toHaveBeenCalled();
    expect(sendSpy.mock.calls[0][0]).toMatchObject({
      apiName: "cards/getDeck",
      message: "some strange error"
    });
  });

  it("sends error response of any fail 2", async () => {
    mockFilterKnownCards.mockImplementation(() => {
      throw new Error("some strange error 2");
    });
    await getDeckController(req, res);
    expect(sendSpy).toHaveBeenCalled();
    expect(sendSpy.mock.calls[0][0]).toMatchObject({
      apiName: "cards/getDeck",
      message: "some strange error 2"
    });
  });
});
