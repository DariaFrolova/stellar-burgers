import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

// В исходном коде (ниже "исходный код") использовался textStyle в качестве ключа для statusText - это приводило к тому, 
// что displayText всегда возвращал undefined - статус не отображался в интерфейсе, 
// так как ключи в statusText — это статусы (pending, done, created), а не цвета. 
// Решила, что корректнее использовать displayText для определения текста статуса 

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  let displayText = '';

  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      displayText = statusText.pending; // Устанавливаем текст для статуса
      break;
    case 'done':
      textStyle = '#00CCCC';
      displayText = statusText.done; // Устанавливаем текст для статуса
      break;
    case 'created':
      textStyle = '#F2F2F3';
      displayText = statusText.created; // Устанавливаем текст для статуса
      break;
    default:
      displayText = 'Ваш заказ затянуло в черную дыру 🛸, мы уже его ищем'; // В случае, если статус не определен
  }

  return <OrderStatusUI textStyle={textStyle} text={displayText} />;
};




//исходный код

// import React, { FC } from 'react';
// import { OrderStatusProps } from './type';
// import { OrderStatusUI } from '@ui';

// const statusText: { [key: string]: string } = {
//   pending: 'Готовится',
//   done: 'Выполнен',
//   created: 'Создан'
// };

// export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
//   let textStyle = '';
//   switch (status) {
//     case 'pending':
//       textStyle = '#E52B1A';
//       break;
//     case 'done':
//       textStyle = '#00CCCC';
//       break;
//     default:
//       textStyle = '#F2F2F3';
//   }

//   return <OrderStatusUI textStyle={textStyle} text={statusText[textStyle]} />;
// };