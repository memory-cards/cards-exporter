export interface RepoTags {
  [tagName: string]: number;
}

export enum CardType {
  INFO = "info",
  CHOOSE_SEQUENCE = "choose_sequence",
  CHOOSE_OPTIONS = "choose_options",
  ORDER_ITEMS = "order_items"
}
