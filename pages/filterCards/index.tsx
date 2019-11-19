import axios from "axios";
import * as React from "react";
import { RepoTags } from "~/typings/common";
import Header from "../../components/Header";

import "./styles.scss";

interface SelectedTags {
  [tagName: string]: boolean;
}

interface State {
  readonly selectedTags: SelectedTags;
  tags: RepoTags;
  isError?: boolean;
}

class FilterCardsPage extends React.Component<State> {
  public state = {
    isError: false,
    selectedTags: ({} as any) as SelectedTags,
    tags: ({} as any) as RepoTags
  };

  public async componentDidMount() {
    try {
      const response = await axios.get(`/api/cards/tags`);
      this.setState({ tags: response.data.tags });
    } catch (e) {
      this.setState({ isError: true });
    }
  }

  public updateSelectedTags = (event: React.MouseEvent) => {
    const target = event.target as HTMLInputElement;

    if (target.tagName === "INPUT") {
      this.setState(({ selectedTags }: State) => {
        let newTags;
        const tag = target.value;

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

  public clearSelectedTags = () => {
    this.setState({ selectedTags: {} });
  };

  public getDeck = () => {
    const { selectedTags } = this.state;

    const tags = Object.keys(selectedTags).map(tag => `tags=${tag}`);
    const params = `?${tags.join("&")}`;
    const url = `/api/cards/deck${params}`;

    window.open(url);
  };

  public render() {
    if (this.state.isError) {
      return <div>Sorry, backend data has not been recieved yet :(</div>;
    }

    const { tags, selectedTags } = this.state;
    const tagsArray = Object.keys(tags).sort((a: string, b: string) =>
      a.localeCompare(b)
    );

    return (
      <>
        <Header />
        <div className="filter-container">
          <h2 className="p-3">Select required tags:</h2>
          <ul className="list-group">
            {tagsArray.map((tagName: string) => (
              <li
                className="list-group-item d-flex list-group-item-action justify-content-between align-items-center"
                key={tagName}
                onClick={this.updateSelectedTags}
              >
                <input
                  type="checkbox"
                  value={tagName}
                  checked={selectedTags[tagName]}
                />
                <span>{tagName}</span>
                <span className="badge badge-primary badge-pill">
                  {tags[tagName]}
                </span>
              </li>
            ))}
          </ul>
          <div>
            <button
              className="btn btn-primary m-3"
              type="button"
              onClick={this.clearSelectedTags}
            >
              Clear all
            </button>
            <button
              className="btn btn-success m-3"
              type="button"
              onClick={this.getDeck}
            >
              Get deck
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default FilterCardsPage;
