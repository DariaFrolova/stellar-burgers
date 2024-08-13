import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, updateUserProfile } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  // Извлекаем имя и email пользователя, устанавливаем значения по умолчанию
  const { name: initialName = '', email: initialEmail = '' } = user || {};

   // Устанавливаем состояние для значений формы, строчка для пароля - пустая строка 
  const [formValue, setFormValue] = useState({
    name: initialName,
    email: initialEmail,
    password: ''
  });

   // useEffect, который срабатывает при изменении начальных значений имени или email
  // Обновляет состояние формы, чтобы отобразить текущее состояние пользователя

  useEffect(() => {
    setFormValue({
      name: initialName,
      email: initialEmail,
      password: ''
    });
  }, [initialName, initialEmail]);

  const isFormChanged =
    formValue.name !== initialName ||
    formValue.email !== initialEmail ||
    !!formValue.password;

      // Обработчик отправки формы
  const handleSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      const { name, email, password } = formValue;
      const updatedData = { name, email, password };
      dispatch(updateUserProfile(updatedData));
    },
    [dispatch, formValue]
  );

  // Обработчик отмены изменений
  const handleCancel = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      setFormValue({
        name: initialName,
        email: initialEmail,
        password: ''
      });
    },
    [initialName, initialEmail]
  );

   // Обработчик изменения ввода в поле формы
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormValue((prevState) => ({
        ...prevState,
        [name]: value
      }));
    },
    []
  );

  // возвращаем интерфейс с переданными значениями
  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
