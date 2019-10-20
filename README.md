# Cards Exporter

[![Coverage Status](https://coveralls.io/repos/github/memory-cards/cards-exporter/badge.svg?branch=master)](https://coveralls.io/github/memory-cards/cards-exporter?branch=master) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Code Style](https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)

---

### Description

This project provides useful interface for collecting, creating, filtering and updating `anki` cards. There are several endpoints with cards info, such as tags, list of the cards or exporting `anki` decks endpoint.
At `filterCards` page we can get deck with the cards filtered by selected tags.
At `updateCards` page we can see the list of all cards and see the preview of this card in [anki-web](https://apps.ankiweb.net/) or [anki-droid](https://play.google.com/store/apps/details?id=com.ichi2.anki) (for mobile).

### Project structure

- `api` - backend part of the app. Here are collected endpoints with cards data;
- `components` - shared `react` components that are used across the app;
- `data` - stored cards from `memory-cards/cards` repository;
- `pages` - `next.js` pages of the web app;
- `utils` - useful services;

### How to run

Firstly is needed to be installed [git](https://git-scm.com/downloads), [node.js](https://nodejs.org/en/download/) (LTS version), [yarn](https://yarnpkg.com/lang/en/docs/install/#windows-stable) & [nodemon](https://www.npmjs.com/package/nodemon) tools.

To run the app in dev mode open the project root and type in command line:

```
  yarn
  yarn run dev
```

By default at http://localhost:8080/ you'll see the start page.
