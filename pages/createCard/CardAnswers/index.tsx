import * as React from "react";

interface Props {
  answers: Array<{ text: string; correct?: true }>;
}

const CardAnswers = ({ answers }: Props) => {
  return (
    <div>
      <ul className="list-group">
        {answers.map(({ text }) => (
          <li className="list-group-item">{text}</li>
        ))}
      </ul>
    </div>
  );
};

export default CardAnswers;
