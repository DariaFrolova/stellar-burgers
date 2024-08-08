import React, { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/services/store';

import { getFeedAll } from '../../services/slices/feedSlice'; 

export const Feed: FC = () => {

  const dispatch = useDispatch<AppDispatch>();
 
  const orders: TOrder[] = useSelector((state: RootState) => state.feedSlice.orders);
  const loading: boolean = useSelector((state: RootState) => state.feedSlice.loading);

  const handleGetFeeds = () => {
    dispatch(getFeedAll());  
  };
  
  useEffect(() => {
    handleGetFeeds(); // Первоначальная загрузка фидов
  }, [dispatch]);

   console.log('Orders:', orders);

  if (loading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return <div>Нет доступных заказов.</div>;
  }

  return (
    <FeedUI 
      orders={orders} 
      handleGetFeeds={handleGetFeeds} // Передаем функцию
    />
  );

};

// import React, { FC, useEffect } from 'react';
// import { Preloader } from '@ui';
// import { FeedUI } from '@ui-pages';
// import { TOrder } from '@utils-types';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from 'src/services/store';
// import { getFeedAll } from '../../services/slices/feedSlice';
// import { selectOrders } from '../../services/slices/feedSlice'; // Импортируйте ваш селектор

// export const Feed: FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   // Используйте селектор для получения заказов
//   const orders: TOrder[] = useSelector(selectOrders); // Измените здесь
//   const loading: boolean = useSelector((state: RootState) => state.feedSlice.loading);

//   const handleGetFeeds = () => {
//     dispatch(getFeedAll());  
//   };
  
//   useEffect(() => {
//     handleGetFeeds(); // Первоначальная загрузка фидов
//   }, [dispatch]);

//   console.log('Orders:', orders);

//   if (loading) {
//     return <Preloader />;
//   }

//   if (!orders.length) {
//     return <div>Нет доступных заказов.</div>;
//   }

//   return (
//     <FeedUI 
//       orders={orders} 
//       handleGetFeeds={handleGetFeeds} // Передаем функцию
//     />
//   );
// };



// import React, { FC, useEffect } from 'react';
// import { Preloader } from '@ui';
// import { FeedUI } from '@ui-pages';
// import { TOrder } from '@utils-types';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from 'src/services/store';
// import { getFeedAll, selectOrders } from '../../services/slices/feedSlice';

// export const Feed: FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const orders: TOrder[] = useSelector(selectOrders);
//   const loading: boolean = useSelector((state: RootState) => state.feedSlice.loading);
//   const error: string | null = useSelector((state: RootState) => state.feedSlice.error); // Добавьте обработку ошибок

//   const handleGetFeeds = () => {
//     dispatch(getFeedAll());
//   };

//   useEffect(() => {
//     handleGetFeeds(); // Первоначальная загрузка фидов
//   }, [dispatch]);

//   if (loading) {
//     return <Preloader />;
//   }

//   if (error) {
//     return <div>Ошибка: {error}</div>; // Отображение ошибки
//   }

//   if (!orders.length) {
//     return <div>Нет доступных заказов.</div>;
//   }

//   return (
//     <FeedUI 
//       orders={orders} 
//       handleGetFeeds={handleGetFeeds} // Передаем функцию
//     />
//   );
// };



// import React, { FC, useEffect } from 'react';

// import { Preloader } from '@ui';
// import { FeedUI } from '@ui-pages';
// import { TOrder } from '@utils-types';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from 'src/services/store';

// import { getFeedAll, getOrders } from '../../services/slices/feedSlice'; 

   
// export const Feed: FC = () => {

//   const dispatch = useDispatch<AppDispatch>();
 
//   const orders: TOrder[] = useSelector((state: RootState) => state.feedSlice.orders);
//   const loading: boolean = useSelector((state: RootState) => state.feedSlice.loading);

//   const handleGetFeeds = () => {
//     dispatch(getFeedAll());
//     dispatch(getOrders()); // это не точно
    
//   };

//   useEffect(() => {
//     handleGetFeeds(); // Первоначальная загрузка фидов
//   }, [dispatch]);

//   if (loading) {
//     return <Preloader />;
//   }

//   if (!orders.length) {
//     return <div>Нет доступных заказов.</div>;
//   }

//   return (
//     <FeedUI 
//       orders={orders} 
//       handleGetFeeds={handleGetFeeds} // Передаем функцию
//     />
//   );

// };

