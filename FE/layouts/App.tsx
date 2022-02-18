import React from 'react';
import loadable from '@loadable/component';
import { Route, Routes, Navigate } from 'react-router-dom';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
  return (
    <Routes>
      <Route path="/" element={SignUp} />
      <Route path="/login" element={LogIn} />
      <Route path="/signup" element={SignUp} />
    </Routes>
  );
};

export default App;