import React, { FC, useState, SyntheticEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { isAuthCheck } from '../../services/slices/userSlice';

export const ForgotPassword: FC = () => {
  const isAuthenticated = useSelector(isAuthCheck);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    setError(null); // Сбрасываем ошибку перед новым запросом

    try {
      await forgotPasswordApi({ email });
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err); // Устанавливаем ошибку, если это экземпляр Error
      } else {
        setError(new Error('Неизвестная ошибка')); // Обработка неизвестной ошибки
      }
    }
  };

  if (isAuthenticated) {
    return <Navigate to='/' />; // Если пользователь аутентифицирован, переходим на главную
  }

  return (
    <ForgotPasswordUI
      errorText={error?.message} // Сохранение формата для текста ошибки
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};


// это было 
// import { FC, useState, SyntheticEvent } from 'react';
// import { useNavigate } from 'react-router-dom';

// import { forgotPasswordApi } from '@api';
// import { ForgotPasswordUI } from '@ui-pages';

// //сюда
// export const ForgotPassword: FC = () => {
//   const [email, setEmail] = useState('');
//   const [error, setError] = useState<Error | null>(null);

//   const navigate = useNavigate();

//   const handleSubmit = (e: SyntheticEvent) => {
//     e.preventDefault();

//     setError(null);
//     forgotPasswordApi({ email })
//       .then(() => {
//         localStorage.setItem('resetPassword', 'true');
//         navigate('/reset-password', { replace: true });
//       })
//       .catch((err) => setError(err));
//   };

//   return (
//     <ForgotPasswordUI
//       errorText={error?.message}
//       email={email}
//       setEmail={setEmail}
//       handleSubmit={handleSubmit}
//     />
//   );
// };