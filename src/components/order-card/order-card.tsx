import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

const maxIngredients = 6; // Максимальное количество ингредиентов для отображения

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;

    const ingredientMap: Record<string, { ingredient: TIngredient; count: number }> = {};

    order.ingredients.forEach((item: string) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        if (!ingredientMap[item]) {
          ingredientMap[item] = { ingredient, count: 0 };
        }
        ingredientMap[item].count++;
      }
    });

     // Формируем массив ингредиентов для отображения (булочки и начинки)
    const ingredientsInfo = Object.values(ingredientMap)
      .slice(0, maxIngredients)
      .reduce<{ bun: TIngredient[]; fillings: TIngredient[] }>(
        (acc, item) => {
          if (item.ingredient.type === 'bun') {
            acc.bun.push(item.ingredient);
          } else {
            acc.fillings.push(item.ingredient);
          }
          return acc;
        },
        { bun: [], fillings: [] }
      );

    const orderedIngredientsInfo = [...ingredientsInfo.bun, ...ingredientsInfo.fillings];

    // Вычисление общей стоимости заказа
    const total = Object.values(ingredientMap).reduce((acc, item) => {
      const itemCount = item.ingredient.type === 'bun' ? item.count * 2 : item.count;
      return acc + item.ingredient.price * itemCount; // Учитываем, что одна булочка используется для верхней и нижней части
    }, 0);

    const remains =
      order.ingredients.length > maxIngredients
        ? order.ingredients.length - maxIngredients
        : 0;

        // Форматируем дату создания заказа
    const date = new Date(order.createdAt);

    // Возвращаем итоговую информацию о заказе
    return {
      ...order,
      ingredientsInfo: orderedIngredientsInfo,
      ingredientsToShow: orderedIngredientsInfo,
      remains,
      total,
      date,
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});