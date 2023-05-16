import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './NewQuestion.css';
import { useNavigate, useParams } from 'react-router-dom';

const NewQuestion = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigator = useNavigate();
  const { cid } = useParams();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      questionBody: {
        value: '',
        isValid: false,
      },
      publicTCInputs: {
        value: '',
        isValid: false,
      },
      publicTCOutputs: {
        value: '',
        isValid: false,
      },
      privateTCInputs: {
        value: '',
        isValid: false,
      },
      privateTCOutputs: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const createQuestionSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('body', formState.inputs.questionBody.value);
      formData.append('publicTCInputs', formState.inputs.publicTCInputs.value);
      formData.append('publicTCOutputs', formState.inputs.publicTCOutputs.value);
      formData.append('privateTCInputs', formState.inputs.privateTCInputs.value);
      formData.append('privateTCOutputs', formState.inputs.privateTCOutputs.value);
      const jsonObject = {};
      for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
      }
      const responseData = await sendRequest(
        `http://localhost:5000/api/questions/new/${cid}`,
        'POST',
        JSON.stringify(jsonObject),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );

      navigator(`/classroom/${cid}`, { replace: true });
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Create Question</h2>
        <hr />
        <form onSubmit={createQuestionSubmitHandler}>
          <Input
            element="input"
            id="title"
            type="text"
            label="Question Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a question title."
            onInput={inputHandler}
          />
          <Input
            id="questionBody"
            type="text"
            label="Question Body"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter question body."
            onInput={inputHandler}
          />
          <Input
            id="publicTCInputs"
            type="text"
            label="Input Public TestCases"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter public testcases."
            onInput={inputHandler}
          />
          <Input
            id="publicTCOutputs"
            type="text"
            label="Output Public TestCases"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter public testcases."
            onInput={inputHandler}
          />
          <Input
            id="privateTCInputs"
            type="text"
            label="Input Private TestCases"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter private testcases."
            onInput={inputHandler}
          />
          <Input
            id="privateTCOutputs"
            type="text"
            label="Output Private TestCases"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter private testcases."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            CREATE
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
};

export default NewQuestion;
