import { FC, memo, useCallback } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  changeIngredientLayer,
  removeIngredientFromOrder
} from '../../services/slices/burgerConstructorSlice';

// Компонент BurgerConstructorElement отображает элемент конструктора бургера
export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  // Используем memo для предотвращения лишних ререндеров, если пропсы не изменились
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Функция для перемещения элемента вверх
    const handleMoveUp = useCallback(() => {
      // Проверяем, что элемент не является первым в списке
      if (index > 0) {
        dispatch(changeIngredientLayer({ fromIndex: index, toIndex: index - 1 }));
      }
    }, [dispatch, index]); // Зависимости

    // Функция для перемещения элемента вниз
    const handleMoveDown = useCallback(() => {
      // Проверяем, что элемент не является последним в списке
      if (index < totalItems - 1) {
        dispatch(changeIngredientLayer({ fromIndex: index, toIndex: index + 1 }));
      }
    }, [dispatch, index, totalItems]); // Зависимости 

    // Функция для удаления элемента из заказа
    const handleRemove = useCallback(() => {
      dispatch(removeIngredientFromOrder(ingredient.id)); // Отправляем ID ингредиента для удаления
    }, [dispatch, ingredient.id]); // Зависимости 

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}  
        index={index}  
        totalItems={totalItems}  
        handleMoveUp={handleMoveUp}  
        handleMoveDown={handleMoveDown}  
        handleClose={handleRemove} 
      />
    );
  }
);