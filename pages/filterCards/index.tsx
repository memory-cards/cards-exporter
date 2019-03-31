import axios from 'axios';
import { withRouter } from 'next/router';
import * as React from 'react';

interface IProps {
  data: {
    tags: any;
  };
}

class Index extends React.Component<IProps> {
  public static async getInitialProps() {
    const res = await axios.get('http://localhost:8080/api/cards/filter');
    return { data: { tags: res.data.tags } || {} };
  }
  public state = { selectedTags: [] };

  public generateUrl = ev => {
    if (ev.target.tagName === 'LABEL') {
      if (!this.state.selectedTags.some(tag => ev.target.textContent === tag)) {
        this.state.selectedTags.push(ev.target.textContent);
      } else {
        this.state.selectedTags = this.state.selectedTags.filter(
          tag => ev.target.textContent !== tag
        );
      }
    }
  };

  public getDeck = () => {
    const tags = this.state.selectedTags.map(tag => `tags=${tag}`);
    const params = `?${tags.join('&')}`;
    const url = `http://localhost:8080/api/cards/deck${params}`;

    window.open(url);
  };

  public render() {
    const tags = Object.keys(this.props.data.tags);

    return (
      <div>
        Select required tags:
        <ul>
          {tags.map(tag => (
            <li>
              <label onClick={this.generateUrl}>
                <input type="checkbox" />
                {tag}
              </label>
              - {this.props.data.tags[tag]}
            </li>
          ))}
        </ul>
        <button onClick={this.getDeck}>Get deck</button>
      </div>
    );
  }
}

export default withRouter(Index);
