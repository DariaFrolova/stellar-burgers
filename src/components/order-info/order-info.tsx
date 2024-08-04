import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';  
import { selectOrderModalData } from '../../services/slices/feedSlice';  
import { selectIngredients } from '../../services/slices/ingredientsSlice';  

export const OrderInfo: FC = () => {
  // Выбираем данные заказа и ингредиентов из store
  const orderData = useSelector(selectOrderModalData);
  const ingredients = useSelector(selectIngredients);


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



// исходное
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
//     return <Preloader />;
//   }

//   return <OrderInfoUI orderInfo={orderInfo} />;
// };