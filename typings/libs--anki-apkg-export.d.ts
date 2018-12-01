declare class AnkiExport {
  public constructor(name: string);

  public addCard(front: string, back: string, tags?: string[]);

  public save(): Promise<string | Buffer>;
}

declare module "anki-apkg-export" {
  export = AnkiExport;
}
