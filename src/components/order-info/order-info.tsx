import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { getOrderByNumber, selectOrderModalData } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();

    // Получаем данные заказа и список ингредиентов из Redux store
  const orderData: TOrder = useSelector(selectOrderModalData);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      dispatch(getOrderByNumber(Number(number!))); // Если номер есть, запрашиваем данные заказа
    }
  }, [dispatch, number]);

  
  const orderInfo = useMemo(() => {
     // Используем useMemo для оптимизации и избежания лишних вычислений
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item); // Ищем каждый ингредиент в массиве
        if (ingredient) {
          if (!acc[item]) {
            // Если ингредиент еще не добавлен, добавляем его с начальным количеством
            acc[item] = { ...ingredient, count: ingredient.type === 'bun' ? 2 : 1 }; // булочки всегда 2
          } else {
            // Если ингредиент уже есть в списке, увеличиваем его количество
            if (ingredient.type !== 'bun') {
              acc[item].count++;
            }
          }
        }
        return acc;
      },
      {}
    );
// Подсчитываем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};