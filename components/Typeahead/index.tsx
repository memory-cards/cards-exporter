import * as React from "react";
import { Typeahead as ReactTypeahead } from "react-bootstrap-typeahead";
// tslint:disable no-submodule-imports
import "react-bootstrap-typeahead/css/Typeahead.css";

export interface TypeaheadOption {
  id: string;
  label: string;
}

interface Props {
  options: TypeaheadOption[];
  selectedOptions?: TypeaheadOption[];
  onChange: (selected: TypeaheadOption[]) => void;
}

const Typeahead = ({ options, selectedOptions, onChange }: Props) => {
  return (
    <ReactTypeahead
      multiple
      options={options}
      selected={selectedOptions}
      onChange={onChange}
    />
  );
};

export default Typeahead;
