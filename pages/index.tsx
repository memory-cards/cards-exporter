import * as React from "react";

export default class Index extends React.Component {
  public render() {
    return (
      <div>
        <h1>Cards Exporter</h1>
        <h3>Pages:</h3>
        <ul>
          <li>
            <a href="/api/date">Date</a>
          </li>
          <li>
            <a href="/api/cards/list">Cards list</a>
          </li>
          <li>
            <a href="/api/cards/deck">Get deck</a>
          </li>
          <li>
            <a href="/api/cards/update">Update</a>
          </li>
          <li>
            <a href="/api/cards/tags">Tags</a>
          </li>
        </ul>
      </div>
    );
  }
}
