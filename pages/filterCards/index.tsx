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
  selectedTags: any;
  tags: any;
}

class Index extends React.Component<Props, State> {
  public state = {
    selectedTags: {} as any,
    tags: {} as any
  };

  public async componentDidMount() {
    const response = await axios.get(`/api/cards/tags`);

    this.setState({ tags: response.data.tags });
  }

  public updateSelectedTags = (ev: React.MouseEvent) => {
    const target = ev.target as HTMLElement;
    const tag = target.textContent as string;
    const { selectedTags } = this.state;

    if (target.tagName === "LABEL") {
      this.setState({
        selectedTags: { ...selectedTags, [tag]: !selectedTags[tag] }
      });
    }
  };

  public getDeck = () => {
    const { selectedTags } = this.state;

    const tags = Object.entries(selectedTags)
      .filter(item => item[1])
      .map(item => `tags=${item[0]}`);
    const params = `?${tags.join("&")}`;
    const url = `${window.location.origin}/api/cards/deck${params}`;

    window.open(url);
  };

  public render() {
    const allTags = Object.keys(this.state.tags).sort((a: string, b: string) =>
      a.localeCompare(b)
    );

    return (
      <div>
        Select required tags:
        <ul>
          {allTags.map((tag: string) => (
            <li>
              <label onClick={this.updateSelectedTags}>
                <input type="checkbox" />
                {tag}
              </label>
              - {this.state.tags[tag]}
            </li>
          ))}
        </ul>
        <button onClick={this.getDeck}>Get deck</button>
      </div>
    );
  }
}

export default withRouter(Index);
