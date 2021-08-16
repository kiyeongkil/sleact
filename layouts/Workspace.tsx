import React, { FC, useCallback } from 'react';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';
import axios from 'axios';
import { Redirect } from 'react-router';

const Workspace: FC = ({children}) => {
	const { data, error, revalidate } = useSWR('/api/users', fetcher);

	const onLogout = useCallback(() => {
		axios.post('/api/users/logout', null, {
			withCredentials: true,
		})
			.then(() => {
				revalidate();
			});
	}, []);

	if (!data) {
		return <Redirect to="/login" />;
	}

	return(
		<div>
			<button onClick={onLogout}>로그아웃</button>
			{children}
		</div>
	) 
}

export default Workspace;