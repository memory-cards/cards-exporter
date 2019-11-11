import * as React from "react";
import { CardType } from "~/typings/common";

interface Props {
  cardType: CardType;
  answers: Array<{
    text: string;
    correct?: true;
    id: string;
  }>;
  updateAnswers: (
    answers: Array<{
      text: string;
      correct?: true;
      id: string;
    }>
  ) => void;
}

const CardAnswers = ({ answers, updateAnswers, cardType }: Props) => {
  const changeAnswer = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const text = ev.target.value;
    const updatedAnswers = answers.map(answer => {
      return answer.id !== ev.target.name ? answer : { ...answer, text };
    });
    updateAnswers(updatedAnswers);
  };

  const removeAnswer = (ev: React.MouseEvent<HTMLButtonElement>) => {
    const updatedAnswers = answers.filter(
      answer => answer.id !== (ev.target as HTMLInputElement).name
    );
    updateAnswers(updatedAnswers);
  };

  const addAnswer = () => {
    const updatedAnswers = [
      ...answers,
      { text: "", id: Math.random().toString() }
    ];
    updateAnswers(updatedAnswers);
  };

  const selectCorrectAnswer = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const updatedAnswers = answers.map(answer => {
      if (answer.id === ev.target.id) {
        if (ev.target.checked) {
          answer.correct = true;
        } else {
          delete answer.correct;
        }
      }
      return answer;
    });
    updateAnswers(updatedAnswers);
  };

  return (
    <div>
      {answers.map(({ text, id }) => (
        <div className="input-group">
          {cardType === CardType.CHOOSE_OPTIONS && (
            <div className="input-group-prepend">
              <div className="input-group-text">
                <input
                  id={id}
                  name="correct-answer"
                  type="checkbox"
                  onChange={selectCorrectAnswer}
                />
              </div>
            </div>
          )}
          <input
            name={id}
            type="text"
            value={text}
            className="form-control"
            onChange={changeAnswer}
          />
          <div className="input-group-append">
            <button
              name={id}
              className="btn btn-outline-secondary"
              type="button"
              onClick={removeAnswer}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={addAnswer}
      >
        Add answer
      </button>
    </div>
  );
};

export default CardAnswers;