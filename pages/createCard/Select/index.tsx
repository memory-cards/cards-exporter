import * as React from "react";

interface Props {
  name: string;
  options: string[];
  onSelectOption: (value: string) => void;
}

const Select = ({ options, onSelectOption, name }: Props) => {
  const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectOption(ev.target.value);
  };

  return (
    <select name={name} onChange={onChange}>
      {options.map(option => (
        <option>{option}</option>
      ))}
    </select>
  );
};

export default Select;
