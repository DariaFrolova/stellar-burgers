import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';
import { isAuthCheck } from '../services/slices/userSlice';
import { ProtectedRouteProps } from './type';
import { Preloader } from '../components/ui/preloader';

// Компонент для защищенного маршрута
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,        // Дочерние элементы для отображения, если доступ разрешен
  onlyUnAuth = false // Флаг для проверки, доступен ли маршрут только для неаутентифицированных пользователей
}) => {
  // Получаем местоположение текущего маршрута
  const location = useLocation();
  
  // Проверяем, аутентифицирован ли пользователь
  const isAuthUser = useSelector(isAuthCheck);

  // Если состояние аутентификации еще не загружено, отображаем прелоадер
  if (isAuthUser === undefined) {
    return <Preloader />;
  }

  // Если доступ разрешен только для аутентифицированных пользователей, 
  // но пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!onlyUnAuth && !isAuthUser) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // Если доступ разрешен только для неаутентифицированных пользователей,
  // и пользователь уже аутентифицирован, перенаправляем на защищенный ресурс
  if (onlyUnAuth && isAuthUser) {
    const redirectTo = location.state?.from || '/'; // Перенаправляем на предыдущий маршрут или на главную страницу
    return <Navigate replace to={redirectTo} />;
  }

  // Если пользователь аутентифицирован и условие доступа выполняется, 
  // отображаем дочерние элементы
  return <>{children}</>;
};