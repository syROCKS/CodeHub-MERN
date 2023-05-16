import React, { useContext } from 'react';
import Button from '../../shared/components/FormElements/Button';
import './QuestionItem.css'
import GreenButton from '../../shared/components/FormElements/GreenButton';
import { AuthContext } from '../../shared/context/auth-context';

const QuestionItem = ({ question }) => {
  const auth = useContext(AuthContext);
  return (
    <div className='questionItem'>
      <h3>{question.title}</h3>
      <div className='questionItem-actions'>
        <GreenButton inverse to={`/question/solve/${question.id}`}>{auth.isTeacher ? "View Question" : "Solve"}</GreenButton>
        {auth.isTeacher && <GreenButton to={`/question/progress/${question.id}`}>Progress</GreenButton>}
      </div>
    </div>
  );
};

export default QuestionItem;
