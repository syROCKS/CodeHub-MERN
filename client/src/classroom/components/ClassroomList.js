import React, { useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import ClassroomItem from './ClassroomItem';
import Button from '../../shared/components/FormElements/Button';
import './ClassroomList.css';
import { AuthContext } from '../../shared/context/auth-context';

const ClassroomList = props => {
  const auth = useContext(AuthContext);

  if (props.items.length === 0) {
    if(auth.isTeacher) {
      return (
        <div className="classroom-list center no-classrooms">
          <Card>
            <h2>No Classrooms found. Maybe create one?</h2>
            <Button to="/classroom/new">Create Classroom</Button>
          </Card>
        </div>
      );
    } else {
      return (
        <div className="classroom-list center no-classrooms">
          <Card>
            <h2>No Classrooms found. Join one.</h2>
          </Card>
        </div>
      );
    }
  }

  return (
    <ul className="classroom-list">
      {props.items.map(classroom => (
        <ClassroomItem
          key={classroom.id}
          id={classroom.id}
          name={classroom.name}
          onDelete={props.onDeleteClassroom}
        />
      ))}
    </ul>
  );
};

export default ClassroomList;
