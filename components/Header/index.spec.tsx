import { shallow, ShallowWrapper } from "enzyme";
import Link, { LinkProps } from "next/link";
import * as React from "react";
import * as TestRenderer from "react-test-renderer";

import { TestHeader as Header } from "./index";

const urls = [
  "/api/date",
  "/api/cards/list",
  "/api/cards/deck",
  "/api/cards/update",
  "/api/cards/tags",
  "/filterCards",
  "/updateCards"
];

describe("With Enzyme", () => {
  let header: ShallowWrapper;
  let links: ShallowWrapper<LinkProps>;

  beforeEach(() => {
    header = shallow(<Header />);
    links = header.find(Link);
  });

  it("render links", () => {
    expect(links.exists()).toBe(true);
  });

  const testNavLink = (url: string, i: number) => {
    it(`has ${url} link`, () => {
      expect(links.at(i).prop("href")).toBe(url);
    });
  };

  urls.forEach((url, index) => testNavLink(url, index));

  it("does not render active link", () => {
    expect(header.find(".active").length).toBe(0);
  });

  it("renders active link if has", () => {
    const newRouter = { pathname: "/filterCards" };
    header.setProps({ router: newRouter });

    expect(header.find(".active").length).toBe(1);
    expect(header.find(".active").text()).toBe("Filter cards page");
  });
});

describe("With Snapshot Testing", () => {
  it("Header", () => {
    const component = TestRenderer.create(<Header />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
