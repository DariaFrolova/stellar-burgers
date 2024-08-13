import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logout } from '../../services/slices/userSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();   
      navigate('/');  // Перенаправление на главную страницу после успешного выхода
    } catch (error) {
      // Улучшаем обработку ошибок для информирования пользователя
      console.error('Logout failed:', error);
      alert('Ошибка при выходе: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  return (
    <ProfileMenuUI 
      handleLogout={handleLogout} 
      pathname={pathname} 
    />
  );
};