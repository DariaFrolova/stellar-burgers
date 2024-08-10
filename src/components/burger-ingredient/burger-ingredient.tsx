import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredientToOrder } from '../../services/slices/burgerConstructorSlice';

// Компонент BurgerIngredient, который отображает отдельный ингредиент бургера
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  // Используем memo для оптимизации производительности
  ({ ingredient, count }) => {
    const location = useLocation(); // Получаем текущее местоположение для обработки маршрутов
    const dispatch = useDispatch(); // Получаем функцию dispatch для отправки действий в store

    // Функция для добавления ингредиента в заказ
    const handleAdd = () => {
      dispatch(addIngredientToOrder(ingredient)); // Отправляем действие для добавления ингредиента в заказ
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}  
        count={count}  
        locationState={{ background: location }}  
        handleAdd={handleAdd}  
      />
    );
  }
);