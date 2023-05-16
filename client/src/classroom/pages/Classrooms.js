import React, { useContext, useEffect, useState } from 'react';

import ClassroomList from '../components/ClassroomList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Classrooms = () => {
  const [loadedClasses, setLoadedClasses] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/classrooms/`,
          'GET',
          null,
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setLoadedClasses(responseData.classrooms);
      } catch (err) {}
    };
    if (auth.token) fetchClasses();
  }, [sendRequest]);

  const classDeletedHandler = (deletedClassId) => {
    setLoadedClasses((prevClasses) =>
      prevClasses.filter((classroom) => classroom.id !== deletedClassId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedClasses && (
        <ClassroomList
          items={loadedClasses}
          onDeleteClassroom={classDeletedHandler}
        />
      )}
    </React.Fragment>
  );
};
export default Classrooms;
