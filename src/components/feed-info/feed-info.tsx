// import { FC } from 'react';

// import { TOrder } from '@utils-types';
// import { FeedInfoUI } from '../ui/feed-info';
// //сюда

// const getOrders = (orders: TOrder[], status: string): number[] =>
//   orders
//     .filter((item) => item.status === status)
//     .map((item) => item.number)
//     .slice(0, 20);

// export const FeedInfo: FC = () => {
//   /** TODO: взять переменные из стора */
//   const orders: TOrder[] = [];
//   const feed = {};

//   const readyOrders = getOrders(orders, 'done');

//   const pendingOrders = getOrders(orders, 'pending');

//   return (
//     <FeedInfoUI
//       readyOrders={readyOrders}
//       pendingOrders={pendingOrders}
//       feed={feed}
//     />
//   );
// };

import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Функция для получения номеров заказов по статусу
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из Redux Store, убедившись в правильности пути к состоянию
  const orders: TOrder[] = useSelector((state: RootState) => state.feedSlice.orders);
  const total: number = useSelector((state: RootState) => state.feedSlice.total);
  const totalToday: number = useSelector((state: RootState) => state.feedSlice.totalToday);

  // Получаем готовые и ожидающие заказы
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  // Формируем объект фида
  const feed = {
    total,
    totalToday,
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
