import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './SingleClassroom.css';
import Button from '../../shared/components/FormElements/Button';
import QuestionsList from '../../question/components/QuestionsList';
import UsersList from '../../user/components/UsersList';
import GreenButton from '../../shared/components/FormElements/GreenButton';

const SingleClassroom = () => {
  const { cid } = useParams();
  const [loadedClass, setLoadedClass] = useState();
  const [questions, setQuestions] = useState();
  const [users, setUsers] = useState();
  const [showQuestions, setShowQuestions] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(`http://localhost:5000/api/classrooms/join/${cid}`)
    alert("Link Copied!");
  }

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/classrooms/${cid}`,
          'GET',
          null,
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setLoadedClass(responseData.classroom);
        setQuestions(responseData.classroom.questions);
        setUsers(responseData.classroom.students);
      } catch (err) {}
    };
    if (auth.token) fetchClass();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedClass && (
        <div className="singleClassroom">
          <h1 className="singleClassroom-title">{loadedClass.name}</h1>
          <div className="singleClassroom-actions">
            <Button onClick={() => setShowQuestions(true)}>Questions</Button>
            <Button onClick={() => setShowQuestions(false)}>Students</Button>
            {auth.isTeacher && (
              <>
                <GreenButton inverse to={`/question/new/${cid}`}>
                  Create Question
                </GreenButton>
                <Button inverse onClick={copyLinkHandler}>
                  Copy Link
                </Button>
              </>
            )}
          </div>
          <div>
            {showQuestions && questions && (
              <QuestionsList questions={questions} />
            )}
            {!showQuestions && users && <UsersList users={users} />}
          </div>
        </div>
      )}
    </>
  );
};

export default SingleClassroom;
