import React from 'react';
import SubmissionItem from './SubmissionItem';

const SubmissionsList = ({ submissions }) => {
  if (submissions.length === 0) {
    return (
      <div>
        <h2>No Submissions</h2>
      </div>
    );
  }
  return (
    <div>
      {submissions.map((s) => (
        <SubmissionItem key={s._id} submission={s} />
      ))}
    </div>
  );
};

export default SubmissionsList;
