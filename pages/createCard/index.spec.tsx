import axios from "axios";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import CardEditor from "~/components/Editor";
import Header from "~/components/Header";
import Select from "~/components/Select";
import Typeahead, { TypeaheadOption } from "~/components/Typeahead";
import { CardType, RepoTags } from "~/typings/common";

import CardPreview from "../updateCards/components/CardPreview";
import CardAnswers from "./CardAnswers";
import CreateCardPage from "./index";

const mockedTags = {
  tag1: 1,
  tag2: 2,
  tag3: 3
};

describe("filterCards page", () => {
  let page: ShallowWrapper;
  let getSpy: jest.SpyInstance<any>;
  let fetchedTags: RepoTags;
  const props = {
    card: {
      card: {
        answers: [{ text: "", id: "1111" }],
        comment: "",
        question: ""
      },
      lang: "en",
      tags: [],
      type: "info"
    },
    commentEditorState: undefined,
    isPreviewVisible: false,
    questionEditorState: undefined,
    repoTags: [] as TypeaheadOption[]
  };

  beforeEach(() => {
    fetchedTags = mockedTags;
    getSpy = jest.spyOn(axios, "get");
    const res = { data: { tags: fetchedTags } };
    getSpy.mockReturnValue(Promise.resolve(res));
    page = shallow(<CreateCardPage {...props} />);
  });

  it("renders Header", () => {
    expect(page.find(Header).exists()).toBe(true);
  });

  it("renders Select for language and cardtype", () => {
    expect(page.find(Select).length).toBe(2);
  });

  it("renders Typeahead for tags", () => {
    const typeahead = page.find(Typeahead);

    expect(typeahead.exists()).toBe(true);
  });

  it("renders CardEditor for question and comment", () => {
    expect(page.find(CardEditor).length).toBe(2);
  });

  it("renders CardAnswers", () => {
    expect(page.find(CardAnswers).exists()).toBe(true);
  });

  it("does not render CardAnswers for 'info' card type", () => {
    (page.instance() as CreateCardPage).changeCardType(CardType.INFO);

    expect(page.find(CardAnswers).exists()).toBe(false);
  });

  describe("changeCardType", () => {
    it("changes card type", () => {
      expect((page.state("card") as any).type).toBe(CardType.CHOOSE_SEQUENCE);
      (page.instance() as CreateCardPage).changeCardType(CardType.INFO);
      expect((page.state("card") as any).type).toBe(CardType.INFO);
    });
  });

  describe("changeCardLanguage", () => {
    it("changes card language", () => {
      expect((page.state("card") as any).lang).toBe("en");
      (page.instance() as CreateCardPage).changeCardLanguage("ru");
      expect((page.state("card") as any).lang).toBe("ru");
    });
  });

  describe("getHtmlEditorContent", () => {
    it("returns empty html if no content", () => {
      const html = (page.instance() as CreateCardPage).getHtmlEditorContent();
      expect(html).toBe("<p></p>");
    });
  });

  describe("showPreview", () => {
    it("shows card preview", () => {
      (page.instance() as CreateCardPage).showPreview();

      expect(page.state("isPreviewVisible")).toBe(true);
      expect(page.find(CardPreview).exists()).toBe(true);
    });
  });

  describe("changeTagSelection", () => {
    it("updates tags of the card", () => {
      expect(page.find(Typeahead).prop("options")).toHaveLength(3);
      const newTag = [{ id: "tag2", label: "tag2" }];

      (page.instance() as CreateCardPage).changeTagSelection(newTag);

      expect((page.state("card") as any).tags).toMatchObject(["tag2"]);
    });
  });

  describe("updateAnswers", () => {
    it("updates answers of the card", () => {
      expect(page.find(CardAnswers).prop("answers")).toHaveLength(1);
      const answers = [{ text: "answer1" }, { text: "answer2" }];

      (page.instance() as CreateCardPage).updateAnswers(answers);

      expect((page.state("card") as any).card.answers).toMatchObject(answers);
    });
  });

  describe("getCardSchema", () => {
    it("returns correct JSON card schema", () => {
      (page.instance() as CreateCardPage).updateAnswers([
        { text: "answer1" },
        { text: "answer2", correct: true }
      ]);
      (page.instance() as CreateCardPage).changeCardType(
        CardType.CHOOSE_OPTIONS
      );
      const schema = (page.instance() as CreateCardPage).getCardSchema();
      const expectedJSON =
        '{"card":{"answers":[{"text":"answer1"},{"text":"answer2","correct":true}],"comment":"<p></p>","question":"<p></p>"},"lang":"ru","tags":["tag2"],"type":"choose_options"}';

      expect(schema).toBe(expectedJSON);
    });
  });
});
