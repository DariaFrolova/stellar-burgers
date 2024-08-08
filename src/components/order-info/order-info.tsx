//вариант который работает но не то 

import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';  
import { selectOrderModalData } from '../../services/slices/feedSlice';  
import { selectIngredients } from '../../services/slices/ingredientsSlice';  

export const OrderInfo: FC = () => {
 
  const orderData = useSelector(selectOrderModalData);
  
  const ingredients = useSelector(selectIngredients);

  // const orderData: TOrder[] = useSelector((state: RootState) => state.feedSlice.orders);

  // const ingredients: TIngredient[] = useSelector ((state: RootState) => state.ingredients.data);

  const orderInfo = useMemo(() => {
    // Проверяем, что данные о заказе и ингредиенты доступны
    if (!orderData || !ingredients.length) return null;


    const date = new Date(orderData.createdAt);

    // Определяем тип для ингредиентов с учётом количества
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number }; 
    };

    // Создаём объект ingredientsInfo, группируя ингредиенты по их ID и считая количество
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        // Проверяем, есть ли уже этот ингредиент в аккумуляторе
        if (!acc[item]) {
          // Если нет, находим этот ингредиент в списке
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            // Если ингредиент найден, добавляем с начальным количеством 1
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          // Если ингредиент уже существует, увеличиваем его количество на 1
          acc[item].count++;
        }

        return acc; // Возвращаем обновлённый 
      },
      {} // Начальное значение - пустой объект
    );

    // Вычисляем общую сумму стоимости всех ингредиентов
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count, // Умножаем цену на количество для каждого ингредиента
      0 // Начальное значение  - 0
    );

    // Возвращаем объект с итоговой информацией о заказе
    return {
      ...orderData, // Включаем данные о заказе
      ingredientsInfo, // Включаем информацию о ингредиентах и их количестве
      date, // Включаем дату заказа
      total // Включаем общую сумму заказа
    };
  }, [orderData, ingredients]); // Мемоизация зависит от orderData и ingredients

  // Если orderInfo не удалось создать (например, данные отсутствуют), отображаем загрузчик
  if (!orderInfo) {
    return <Preloader />;
  }

  // Если все готово, отображаем компонент с информацией о заказе, передавая ему данные
  return <OrderInfoUI orderInfo={orderInfo} />;
};









	



// // исходное
// import { FC, useMemo } from 'react';
// import { Preloader } from '../ui/preloader';
// import { OrderInfoUI } from '../ui/order-info';
// import { TIngredient } from '@utils-types';

// //сюда

// export const OrderInfo: FC = () => {
//   /** TODO: взять переменные orderData и ingredients из стора */
//   const orderData = {
//     createdAt: '',
//     ingredients: [],
//     _id: '',
//     status: '',
//     name: '',
//     updatedAt: 'string',
//     number: 0
//   };

//   const ingredients: TIngredient[] = [];

//   /* Готовим данные для отображения */
//   const orderInfo = useMemo(() => {
//     if (!orderData || !ingredients.length) return null;

//     const date = new Date(orderData.createdAt);

//     type TIngredientsWithCount = {
//       [key: string]: TIngredient & { count: number };
//     };

//     const ingredientsInfo = orderData.ingredients.reduce(
//       (acc: TIngredientsWithCount, item) => {
//         if (!acc[item]) {
//           const ingredient = ingredients.find((ing) => ing._id === item);
//           if (ingredient) {
//             acc[item] = {
//               ...ingredient,
//               count: 1
//             };
//           }
//         } else {
//           acc[item].count++;
//         }

//         return acc;
//       },
//       {}
//     );

//     const total = Object.values(ingredientsInfo).reduce(
//       (acc, item) => acc + item.price * item.count,
//       0
//     );

//     return {
//       ...orderData,
//       ingredientsInfo,
//       date,
//       total
//     };
//   }, [orderData, ingredients]);

//   if (!orderInfo) {
//     // return <Preloader />;
//     return <div>Загрузка...</div>;
//   }

//   return <OrderInfoUI orderInfo={orderInfo} />;
// };


// import { FC, useMemo } from 'react';
// import { Preloader } from '../ui/preloader';
// import { OrderInfoUI } from '../ui/order-info';
// import { TIngredient } from '@utils-types';
// import { useSelector } from 'react-redux';
// import { getOrder, getLoading } from '../../services/slices/orderSlice'; // Импортируйте ваши селекторы
// import { selectIngredients } from '../../services/slices/ingredientsSlice'; // Импортируйте селектор для ингредиентов

// export const OrderInfo: FC = () => {
//   // Используем useSelector для получения данных о заказе и состоянии загрузки
//   const orderData = useSelector(getOrder);
//   const loading = useSelector(getLoading);
//   const ingredients: TIngredient[] = useSelector(selectIngredients);

//   // Используем useMemo, чтобы вычислить информацию о заказе
//   const orderInfo = useMemo(() => {
//     if (!orderData || !ingredients.length) return null;

//     const date = new Date(orderData.createdAt);

//     type TIngredientsWithCount = {
//       [key: string]: TIngredient & { count: number };
//     };

//     const ingredientsInfo = orderData.ingredients.reduce(
//       (acc: TIngredientsWithCount, item) => {
//         if (!acc[item]) {
//           const ingredient = ingredients.find((ing) => ing._id === item);
//           if (ingredient) {
//             acc[item] = {
//               ...ingredient,
//               count: 1
//             };
//           }
//         } else {
//           acc[item].count++;
//         }

//         return acc;
//       }, {}
//     );

//     const total = Object.values(ingredientsInfo).reduce(
//       (acc, item) => acc + item.price * item.count,
//       0
//     );

//     return {
//       ...orderData,
//       ingredientsInfo,
//       date,
//       total
//     };
//   }, [orderData, ingredients]);

//   // Если загрузка происходит, отображаем прелоадер
//   if (loading) {
//     return <Preloader />;
//   }

//   // Если данных о заказе нет, также можно выводить прелоадер или другой компонент:
//   if (!orderInfo) {
//     return <div>No order information available.</div>;
//   }

//   return <OrderInfoUI orderInfo={orderInfo} />;
// };


//последняя версия на 7 августа
// import { FC, useEffect, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from '../../services/store';
// import { Preloader } from '../ui/preloader';
// import { OrderInfoUI } from '../ui/order-info';
// import { TIngredient, TOrder } from '@utils-types';
// import { selectOrderModalData } from '../../services/slices/feedSlice';
// import { selectIngredients } from '../../services/slices/ingredientsSlice';
// import { getOrderByNumber } from '../../services/slices/feedSlice';

// export const OrderInfo: FC = () => {
//   const dispatch = useDispatch();
//   const { number } = useParams();

//   const orderData: TOrder | null = useSelector(selectOrderModalData);
//   const ingredients: TIngredient[] = useSelector(selectIngredients);

//   useEffect(() => {
//     if (number) {
//       console.log("Fetching order number:", number);
//       dispatch(getOrderByNumber(Number(number)));
//     }
//   }, [dispatch, number]);

//   // Логируем orderData и ingredients
//   console.log("Order Data:", orderData);
//   console.log("Ingredients:", ingredients);

//   const orderInfo = useMemo(() => {
//     if (!orderData || !ingredients.length) return null;

//     const date = new Date(orderData.createdAt);
//     const ingredientsInfo = orderData.ingredients.reduce(
//       (acc: Record<string, TIngredient & { count: number }>, item) => {
//         if (!acc[item]) {
//           const ingredient = ingredients.find((ing) => ing._id === item);
//           if (ingredient) {
//             acc[item] = { ...ingredient, count: 1 };
//           }
//         } else {
//           acc[item].count++;
//         }
//         return acc;
//       },
//       {}
//     );

//     const total = Object.values(ingredientsInfo).reduce(
//       (acc, item) => acc + item.price * item.count,
//       0
//     );

//     return { ...orderData, ingredientsInfo, date, total };
//   }, [orderData, ingredients]);

//   if (!orderInfo) {
//     return <Preloader />;
//   }

//   return <OrderInfoUI orderInfo={orderInfo} />;
// };




// // Ваши импорты
// import { FC, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Preloader } from '../ui/preloader';
// import { OrderInfoUI } from '../ui/order-info';
// import { TIngredient, TOrder } from '@utils-types';  
// import { selectOrderModalData } from '../../services/slices/feedSlice';  
// import { selectIngredients } from '../../services/slices/ingredientsSlice';  
// import { useParams } from 'react-router-dom';
// import { RootState } from 'src/services/store';

// export const OrderInfo: FC = () => {
//   const orderData = useSelector(selectOrderModalData);
//   const ingredients = useSelector(selectIngredients);

//   const orderInfo = useMemo(() => {
//     // Проверяем, что данные о заказе и ингредиенты доступны
//     if (!orderData || !ingredients.length) return null;

//     const date = new Date(orderData.createdAt);

//     type TIngredientsWithCount = {
//       [key: string]: TIngredient & { count: number }; 
//     };

//     const ingredientsInfo = orderData.ingredients.reduce(
//       (acc: TIngredientsWithCount, item) => {
//         if (!acc[item]) {
//           const ingredient = ingredients.find((ing) => ing._id === item);
//           if (ingredient) {
//             acc[item] = {
//               ...ingredient,
//               count: 1
//             };
//           }
//         } else {
//           acc[item].count++;
//         }

//         return acc;
//       },
//       {}
//     );

//     const total = Object.values(ingredientsInfo).reduce(
//       (acc, item) => acc + item.price * item.count,
//       0
//     );

//     return {
//       ...orderData,
//       ingredientsInfo,
//       date,
//       total
//     };
//   }, [orderData, ingredients]);

//   // Вместо Preloader можете вернуть текст или alert
//   if (!orderInfo) {
//     return <div>Загрузка...</div>; // Здесь вы можете заместо текста использовать любой HTML или компонент
//     // Или можно использовать alert
//     // alert("Данные о заказе либо ингредиенты отсутствуют!");
//   }

//   return <OrderInfoUI orderInfo={orderInfo} />;
// };
