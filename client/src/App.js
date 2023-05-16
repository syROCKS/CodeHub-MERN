import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Home from './user/pages/Home';
import Auth from './user/pages/Auth';
import NewClassroom from './classroom/pages/NewClassroom';
import JoinClassroom from './classroom/pages/JoinClassroom';
import Classrooms from './classroom/pages/Classrooms';
import SingleClassroom from './classroom/pages/SingleClassroom';
import NewQuestion from './question/pages/NewQuestion';
import QuestionDetail from './question/pages/QuestionDetail';
import Progress from './submission/pages/Progress';

const App = () => {
  const { isTeacher, token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    if (isTeacher) {
      routes = (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classroom/all" element={<Classrooms />} />
          <Route path="/classroom/new" element={<NewClassroom />} />
          <Route path="/classroom/:cid" element={<SingleClassroom />} />
          <Route path="/question/new/:cid" element={<NewQuestion />} />
          <Route path="/question/progress/:qid" element={<Progress />} />
          <Route path="/question/solve/:qid" element={<QuestionDetail />} />
        </Routes>
      );
    } else {
      routes = (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/classroom/all" element={<Classrooms />} />
          <Route path="/classroom/join/:cid" element={<JoinClassroom />} />
          <Route path="/classroom/:cid" element={<SingleClassroom />} />
          <Route path="/question/solve/:qid" element={<QuestionDetail />} />
        </Routes>
      );
    }
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        isTeacher: isTeacher,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <div>{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
