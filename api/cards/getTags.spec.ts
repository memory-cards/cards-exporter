import * as httpMocks from "node-mocks-http";
import { repoTags } from "~/utils/tags";

import getTagsController from "./getTags";

jest.mock("~/utils/tags", () => ({
  repoTags: { tag1: Math.random(), tag2: Math.random() }
}));

describe("getTagsController", () => {
  let req: httpMocks.MockRequest<any>;
  let res: httpMocks.MockResponse<any>;
  let sendSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    sendSpy = jest.spyOn(res, "send");
  });

  it("sends correct object on response", async () => {
    await getTagsController(req, res);

    expect(sendSpy.mock.calls[0][0]).toMatchObject({
      apiName: "cards/tags",
      tags: repoTags
    });
  });
});
