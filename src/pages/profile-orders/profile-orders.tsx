import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders, fetchOrders } from '../../services/slices/feedSlice';
import { getProfileOrders } from '../../services/slices/feedSlice'; 

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // Получаем заказы из Redux
  const orders = useSelector(getProfileOrders) || [];

  useEffect(() => {
    dispatch(getOrders()); // отображает список заказов
    dispatch(fetchOrders()); // отображает список заказов пользователя

  }, []); // оставляем пустой массив, если dispatch будет стабилен 


  return <ProfileOrdersUI orders={orders} />;

};


// import { FC, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux'; 
// import { fetchOrders } from '../../services/slices/feedSlice'; 
// import { ProfileOrdersUI } from '@ui-pages';
// import { TOrder } from '@utils-types';

// export const ProfileOrders: FC = () => {
//   const dispatch = useDispatch();
//   const orders = useSelector((state) => state.feed.orders); // Получаем заказы из состояния
//   const isLoading = useSelector((state) => state.feed.loading); // Статус загрузки
//   const error = useSelector((state) => state.feed.error); // Получаем ошибки

//   useEffect(() => {
//     dispatch(fetchOrders()); // Вызываем thunk для получения всех заказов
//   }, [dispatch]);

//   if (isLoading) {
//     return <div>Loading...</div>; // Показываем индикатор загрузки
//   }

//   if (error) {
//     return <div>{error}</div>; // Показываем ошибку, если она есть
//   }

//   return <ProfileOrdersUI orders={orders} />; // Передаем заказы в UI компонент
// };










// import { ProfileOrdersUI } from '@ui-pages';
// import { TOrder } from '@utils-types';
// import { FC } from 'react';

// //сюда

// export const ProfileOrders: FC = () => {
//   /** TODO: взять переменную из стора */
//   const orders: TOrder[] = [];

//   return <ProfileOrdersUI orders={orders} />;
// };