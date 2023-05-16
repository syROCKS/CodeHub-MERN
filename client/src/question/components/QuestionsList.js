import React from 'react';
import QuestionItem from './QuestionItem';

const QuestionsList = ({ questions }) => {
  if (questions.length === 0) {
    return (
      <div>
        <h2>No Questions</h2>
      </div>
    );
  }

  return (
    <div>
      {questions.map((q) => (
        <QuestionItem key={q.id} question={q} />
      ))}
    </div>
  );
};

export default QuestionsList;
