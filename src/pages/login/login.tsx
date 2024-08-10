import React, { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, Navigate } from 'react-router-dom';
import { isAuthCheck, userLogin } from '../../services/slices/userSlice';
import { Preloader } from '@ui';
import { getError } from '../../services/slices/userSlice'; 

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthenticated = useSelector(isAuthCheck);
  const errorMessage = useSelector(getError) || ''; 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
  };

  // Если пользователь уже аутентифицирован, перенаправляем его на главную
  if (isAuthenticated) {
    return <Navigate to='/' />;
  }

  // Отображаем интерфейс для входа
  return (
    <LoginUI
      errorText={errorMessage ?? ''} // Передаем сообщение об ошибке в UI
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
