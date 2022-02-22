import React, { useCallback, FC } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import axios from 'axios';
import { Navigate, Route } from 'react-router';

const Workspace: FC = ({children}) => {
  const {data, mutate} = useSWR('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,
    })
    .then(() => {
      mutate(false, false);
    });
  }, []);

  if (!data) {
    return <Route path="/" element={<Navigate replace to ="/login" />} />;
  }

  return (
    <div>
      <button onClick={onLogout}>logout</button>
      {children}
    </div>
  );
};

export default Workspace;