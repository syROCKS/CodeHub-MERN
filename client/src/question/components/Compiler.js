import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { langs } from '@uiw/codemirror-extensions-langs';
import Button from '../../shared/components/FormElements/Button';
import GreenButton from '../../shared/components/FormElements/GreenButton';

const Compiler = (props) => {
  const [code, setCode] = useState('//Write your code here');

  const changeHandler = (e) => {
    setCode(e);
  }

  return (
    <div>
      <CodeMirror
        value={code}
        onChange={changeHandler}
        height="calc(100vh - 7rem)"
        theme={dracula}
        basicSetup={{ autocompletion: true }}
        extensions={[langs.cpp()]}
      />
      <Button size="small" onClick={() => props.runCode(code)}>Run Code</Button>
      <GreenButton size="small" onClick={() => props.submitCode(code)}>Submit</GreenButton>
    </div>
  );
};

export default Compiler;
