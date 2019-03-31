import axios from "axios";
// tslint:disable no-submodule-imports
import { withRouter } from "next/router";
import * as React from "react";

interface Props {
  data: {
    tags: any;
  };
}

interface State {
  selectedTags: string[];
}

class Index extends React.Component<Props, State> {
  public static async getInitialProps() {
    const response = await axios.get(`http://localhost:8080/api/cards/tags`);
    return {
      data: { tags: response.data.tags } || {}
    };
  }
  public state = { selectedTags: [] };

  public generateUrl = (ev: React.MouseEvent) => {
    const target = ev.target as HTMLElement;
    const { selectedTags } = this.state;
    let tags;

    if (target.tagName === "LABEL") {
      if (!selectedTags.some(tag => target.textContent === tag)) {
        const tag = target.textContent as string;
        tags = [...selectedTags, tag];
      } else {
        tags = [...selectedTags.filter(tag => target.textContent !== tag)];
      }
      this.setState({ selectedTags: tags });
    }
  };

  public getDeck = () => {
    const tags = this.state.selectedTags.map(tag => `tags=${tag}`);
    const params = `?${tags.join("&")}`;
    const url = `${window.location.origin}/api/cards/deck${params}`;

    window.open(url);
  };

  public render() {
    const tags = Object.keys(this.props.data.tags).sort(
      (a: string, b: string) => a.localeCompare(b)
    );

    return (
      <div>
        Select required tags:
        <ul>
          {tags.map((tag: string) => (
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
