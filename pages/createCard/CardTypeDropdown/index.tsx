import * as React from "react";

interface Props {
  options: string[];
  onСhangeCardType: (value: string) => void;
}

const CardTypeDropdown = ({ options, onСhangeCardType }: Props) => {
  const onChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    onСhangeCardType(ev.target.value);
  };

  return (
    <select name="card-type" onChange={onChange}>
      {options.map(option => (
        <option>{option}</option>
      ))}
    </select>
  );
};

export default CardTypeDropdown;
