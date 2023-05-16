import React, { useState } from 'react';
import './SubmissionItem.css';
import GreenButton from '../../shared/components/FormElements/GreenButton';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';

const SubmissionItem = ({ submission }) => {
  const [showCode, setShowCode] = useState(false);
  const sourceCode = submission.submissions[submission.submissions.length - 1].sourceCode;
  const status =
    submission.submissions[submission.submissions.length - 1].status;
  const submissionCount = submission.submissions.length;
  const closeModelHandler = () => {
    setShowCode(false);
  }
  return (
    <>
      <Modal
        show={showCode}
        onCancel={closeModelHandler}
        header={status}
        footerClass="classroom-item__modal-actions"
        footer={<Button onClick={closeModelHandler}>OKAY</Button>}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{sourceCode}</p>
      </Modal>
      <div className="submissionItem">
        <h3>{submission.student.name}</h3>
        <div className="submissionItem-actions">
          <h3 className={status === 'Accepted' ? 'green' : 'red'}>
            {status}({submissionCount})
          </h3>
          <GreenButton className="button" inverse onClick={()=>{setShowCode(true)}}>Show Code</GreenButton>
        </div>
      </div>
    </>
  );
};

export default SubmissionItem;
