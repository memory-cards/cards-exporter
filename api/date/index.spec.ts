import * as httpMocks from "node-mocks-http";
import DateController from "./index";

describe("DateController", () => {
  let req: httpMocks.MockRequest<any>;
  let res: httpMocks.MockResponse<any>;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
  });

  it(`should send object with date and apiName`, () => {
    res.send = jest.fn();
    DateController(req, res);

    const sendParam = res.send.mock.calls[0][0];
    expect(sendParam).toMatchObject({ apiName: "date" });
    expect(sendParam).toHaveProperty("date");
  });
});
