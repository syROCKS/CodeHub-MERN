import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ClassroomForm.css';

const JoinClassroom = () => {
  const auth = useContext(AuthContext);
  const {cid} = useParams();
  const { error, sendRequest, clearError } = useHttpClient();

  const navigator = useNavigate();

  useEffect(() => {
    const classroomSubmitHandler = async () => {
      try {
        await sendRequest(
          'http://localhost:5000/api/classrooms/join/' + cid,
          'POST',
          null,
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          }
        );
        navigator('/classroom/all', { replace: true });
      } catch (err) {}
    };
    classroomSubmitHandler();
  }, []);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <LoadingSpinner asOverlay />
    </React.Fragment>
  );
};

export default JoinClassroom;
