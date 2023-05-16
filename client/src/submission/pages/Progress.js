import React, { useContext, useEffect, useState } from 'react';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import SubmissionsList from '../../submission/components/SubmissionsList';
import { useParams } from 'react-router-dom';

const Progress = () => {
  const { qid } = useParams();
  const [loadedQuestion, setLoadedQuestion] = useState();
  const [submissions, setSubmissions] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/submissions/${qid}`,
          'GET',
          null,
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setLoadedQuestion(responseData.question);
        // console.log(responseData);
        setSubmissions(responseData.question.studentsSubmitted);
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
      {!isLoading && loadedQuestion && (
        <div className="singleClassroom">
          <h1 className="singleClassroom-title">{`${loadedQuestion.title} - Submissions`}</h1>
          <div>
              <SubmissionsList submissions={submissions} />
          </div>
        </div>
      )}
    </>
  );
};

export default Progress;
