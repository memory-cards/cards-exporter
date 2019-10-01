import * as React from "react";

export default class Index extends React.Component {
  public render() {
    return (
      <div>
        <h1>Cards Exporter</h1>
        <h3>Pages:</h3>
        <ul>
          <li>
            <a href="/api/date">Date info</a>
          </li>
          <li>
            <a href="/api/cards/list">Cards info</a>
          </li>
          <li>
            <a href="/api/cards/deck">Deck info</a>
          </li>
          <li>
            <a href="/api/cards/update">Last update info</a>
          </li>
          <li>
            <a href="/api/cards/tags">Tags info</a>
          </li>
          <li>
            <a href="/filterCards">Filter cards page</a>
          </li>
          <li>
            <a href="/updateCards">Update cards page</a>
          </li>
        </ul>
      </div>
    );
  }
}
