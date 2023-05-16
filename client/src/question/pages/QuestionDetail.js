import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { Base64 } from 'js-base64';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import './QuestionDetail.css';
import Compiler from '../components/Compiler';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/FormElements/Button';

const QuestionDetail = () => {
  const { qid } = useParams();
  const [question, setQuestion] = useState();
  const [subStatus, setSubStatus] = useState();
  const [message, setMessage] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  let isSubmitting;

  const storeSubmission = async (result) => {
    // console.log(result);
    const source_code = Base64.decode(result.source_code);
    const status = result.status.description;
    try {
      if (isSubmitting) {
        const responseData = await sendRequest(
          `http://localhost:5000/api/submissions/new/${qid}`,
          'POST',
          JSON.stringify({ status, sourceCode: source_code }),
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setSubStatus(status);
        if (status === 'Compilation Error')
          setMessage(Base64.decode(result.compile_output));
        else if (status === 'Accepted') setMessage('Private TestCases Passed!');
        else if (status === 'Wrong Answer')
          setMessage('Private TestCases Failed!');
      } else {
        setSubStatus(status);
        if (status === 'Compilation Error')
          setMessage(Base64.decode(result.compile_output));
        else if (status === 'Accepted') setMessage('Public TestCases Passed!');
        else if (status === 'Wrong Answer')
          setMessage('Public TestCases Failed!');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getResult = async (token) => {
    const url = `https://judge0-extra-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.REACT_KEY,
        'X-RapidAPI-Host': process.env.REACT_HOST,
      },
    };
    try {
      const response = await fetch(url, options);
      const result = await response.text();
      // console.log(result);
      storeSubmission(JSON.parse(result));
    } catch (error) {
      console.error(error);
    }
  };

  const executeCode = async (code, input, output) => {
    const encodedCode = Base64.encode(code);
    const encodedInput = Base64.encode(input);
    const encodedOutput = Base64.encode(output);
    const mainBody = {
      language_id: 12,
      source_code: encodedCode,
      stdin: encodedInput,
      expected_output: encodedOutput,
    };
    const url =
      'https://judge0-extra-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.REACT_KEY,
        'X-RapidAPI-Host': process.env.REACT_HOST,
      },
      body: JSON.stringify(mainBody),
    };
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      const token = result.token;
      setTimeout(() => {
        getResult(token);
      }, 4000);
    } catch (error) {
      console.error(error);
    }
  };

  const runCode = (code) => {
    isSubmitting = false;
    executeCode(code, question.publicTCs.input, question.publicTCs.output);
  };

  const submitCode = (code) => {
    isSubmitting = true;
    executeCode(code, question.privateTCs.input, question.privateTCs.output);
  };

  const closeModelHandler = () => {
    setSubStatus(null);
  };

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/questions/question/${qid}`,
          'GET',
          null,
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,
          }
        );
        setQuestion(responseData.question);
      } catch (err) {}
    };
    if (auth.token) fetchClass();
  }, [sendRequest]);
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={!!subStatus}
        onCancel={closeModelHandler}
        header={subStatus}
        footerClass="classroom-item__modal-actions"
        footer={<Button onClick={closeModelHandler}>OKAY</Button>}
      >
        <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
      </Modal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="questionDetail">
        {!isLoading && question && (
          <div className="questionDetail-content part">
            <h1>{question.title}</h1>
            <p
              className="questionDetail-body"
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {question.body}
            </p>
            <hr />
            <h4>Sample TestCase</h4>
            <h5>Input:</h5>
            <p style={{ whiteSpace: 'pre-wrap' }}>{question.publicTCs.input}</p>
            <h5>Output:</h5>
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {question.publicTCs.output}
            </p>
            {auth.isTeacher && (
              <>
                <h4>Private TestCase</h4>
                <h5>Input:</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {question.privateTCs.input}
                </p>
                <h5>Output:</h5>
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {question.privateTCs.output}
                </p>
              </>
            )}
          </div>
        )}
        {!auth.isTeacher && (
          <div className="compiler part">
            <Compiler submitCode={submitCode} runCode={runCode} />
          </div>
        )}
      </div>
    </>
  );
};

export default QuestionDetail;
