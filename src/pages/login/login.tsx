import React, { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, Navigate } from 'react-router-dom';
import { isAuthCheck, userLogin } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthenticated = useSelector(isAuthCheck);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(userLogin({ email, password }));
  };

  // Если пользователь уже аутентифицирован, перенаправляем его в профайл
  if (isAuthenticated) {
    return <Navigate to='/profile' />;
  }

  // Отображаем интерфейс для входа
  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};


// исходник
// import { FC, SyntheticEvent, useState } from 'react';
// import { LoginUI } from '@ui-pages';

// //сюда

// export const Login: FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: SyntheticEvent) => {
//     e.preventDefault();
//   };

//   return (
//     <LoginUI
//       errorText=''
//       email={email}
//       setEmail={setEmail}
//       password={password}
//       setPassword={setPassword}
//       handleSubmit={handleSubmit}
//     />
//   );
// };
