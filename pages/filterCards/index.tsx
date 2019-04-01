import axios from "axios";
import * as React from "react";
import { RepoTags } from "~/typings/common";

interface SelectedTags {
  [tagName: string]: boolean;
}

interface State {
  readonly selectedTags: SelectedTags;
  tags: RepoTags;
}

class Index extends React.Component<State> {
  public state = {
    selectedTags: ({} as any) as SelectedTags,
    tags: ({} as any) as RepoTags
  };

  public async componentDidMount() {
    try {
      const response = await axios.get(`/api/cards/tags`);
      this.setState({ tags: response.data.tags });
    } catch (e) {
      // what to place here ?
    }
  }

  public updateSelectedTags = (ev: React.MouseEvent) => {
    const target = ev.target as HTMLElement;
    const tag = target.textContent as string;

    if (target.tagName === "LABEL") {
      this.setState(({ selectedTags }: State) => {
        let newTags;
        if (selectedTags[tag]) {
          newTags = { ...selectedTags };
          delete newTags[tag];
        } else {
          newTags = { ...selectedTags, [tag]: true };
        }

        return { selectedTags: newTags };
      });
    }
  };

  public getDeck = () => {
    const { selectedTags } = this.state;

    const tags = Object.keys(selectedTags).map(tag => `tags=${tag}`);
    const params = `?${tags.join("&")}`;
    const url = `/api/cards/deck${params}`;

    window.open(url);
  };

  public render() {
    const allTags = Object.keys(this.state.tags).sort((a: string, b: string) =>
      a.localeCompare(b)
    );

    return (
      <div>
        <h2>Select required tags:</h2>
        <ul>
          {allTags.map((tag: string) => (
            <li key={tag}>
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

export default Index;
