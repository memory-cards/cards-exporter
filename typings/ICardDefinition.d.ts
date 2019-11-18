export interface ICardDefinition {
  type: string;
  lang: string;
  tags: string[];
  card: {
    question: string;
    comment?: string;
    answers?: Array<{ text: string; correct?: true }>;
  };
}
