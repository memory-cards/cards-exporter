/**
 * @jest-environment jsdom
 */
import axios from "axios";
import { shallow, ShallowWrapper } from "enzyme";
import htmlToDraft from "html-to-draftjs";
import * as React from "react";
import CardEditor from "~/components/Editor";
import Header from "~/components/Header";
import Select from "~/components/Select";
import Typeahead, { TypeaheadOption } from "~/components/Typeahead";
import { CardType, RepoTags } from "~/typings/common";

import { ContentState, EditorState } from "draft-js";
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
  let instance: CreateCardPage;
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
    instance = page.instance() as CreateCardPage;
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
    instance.changeCardType(CardType.INFO);

    expect(page.find(CardAnswers).exists()).toBe(false);
  });

  describe("changeCardType", () => {
    it("changes card type", () => {
      expect((page.state("card") as any).type).toBe(CardType.CHOOSE_SEQUENCE);
      instance.changeCardType(CardType.INFO);
      expect((page.state("card") as any).type).toBe(CardType.INFO);
    });
  });

  describe("changeCardLanguage", () => {
    it("changes card language", () => {
      expect((page.state("card") as any).lang).toBe("en");
      instance.changeCardLanguage("ru");
      expect((page.state("card") as any).lang).toBe("ru");
    });
  });

  describe("getHtmlEditorContent", () => {
    it("returns empty html if no content", () => {
      const html = instance.getHtmlEditorContent();
      expect(html).toBe("<p></p>");
    });
  });

  describe("showPreview", () => {
    it("shows card preview", () => {
      instance.showPreview();

      expect(page.state("isPreviewVisible")).toBe(true);
      expect(page.find(CardPreview).exists()).toBe(true);
    });
  });

  describe("changeTagSelection", () => {
    it("updates tags of the card", () => {
      expect(page.find(Typeahead).prop("options")).toHaveLength(3);
      const newTag = [{ id: "tag2", label: "tag2" }];

      instance.changeTagSelection(newTag);

      expect((page.state("card") as any).tags).toMatchObject(["tag2"]);
    });
  });

  describe("updateAnswers", () => {
    it("updates answers of the card", () => {
      expect(page.find(CardAnswers).prop("answers")).toHaveLength(1);
      const answers = [{ text: "answer1" }, { text: "answer2" }];

      instance.updateAnswers(answers);

      expect((page.state("card") as any).card.answers).toMatchObject(answers);
    });
  });

  describe("getCardSchema", () => {
    it("returns correct JSON card schema", () => {
      instance.updateAnswers([
        { text: "answer1" },
        { text: "answer2", correct: true }
      ]);
      instance.changeCardType(CardType.CHOOSE_OPTIONS);
      const schema = instance.getCardSchema();
      const expectedJSON =
        '{"card":{"answers":[{"text":"answer1"},{"text":"answer2","correct":true}],"comment":"<p></p>\\n","question":"<p></p>\\n"},"lang":"ru","tags":["tag2"],"type":"choose_options"}';

      expect(schema).toBe(expectedJSON);
    });
  });

  describe("getEditTemplateHandler", () => {
    it("updates card with correct html", () => {
      const html = "<p>Question</p>\n";
      const { contentBlocks } = htmlToDraft(html);
      const contentState = ContentState.createFromBlockArray(contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      instance.getEditTemplateHandler("question")(editorState);

      expect((page.state() as any).card.card.question).toBe(html);
    });
  });
});
