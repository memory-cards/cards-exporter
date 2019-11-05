import * as React from "react";

interface Props {
  name: string;
  options: string[];
  value?: string;
  onSelectOption: (value: string) => void;
}

const Select = ({ options, onSelectOption, name, value }: Props) => {
  const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectOption(ev.target.value);
  };

  return (
    <select name={name} onChange={onChange}>
      {options.map(option => (
        <option selected={value === option}>{option}</option>
      ))}
    </select>
  );
};

export default Select;
