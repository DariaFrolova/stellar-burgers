import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { constructorSelector } from '../../services/slices/burgerConstructorSlice';

// Компонент IngredientsCategory, который использует forwardRef для создания рефа на HTMLUListElement
export const IngredientsCategory = forwardRef<HTMLUListElement, TIngredientsCategoryProps>(
  ({ title, titleRef, ingredients }, ref) => {
    // Получаем текущее состояние конструктора бургера из Redux хранилища
    const burgerConstructor = useSelector(constructorSelector);
    
    // Используем useMemo для оптимизации подсчета ингредиентов
    const ingredientsCounters = useMemo(() => {
      // Инициализируем объект для хранения счетчиков ингредиентов
      const counters: Record<string, number> = {};

      // Перебираем каждый ингредиент в составе бургера
      for (const ingredient of burgerConstructor.ingredients) {
        // Увеличиваем счетчик для каждого уникального ингредиента
        counters[ingredient._id] = (counters[ingredient._id] || 0) + 1;
      }

      // Проверяем, какая булочка используется (если она есть)
      if (burgerConstructor.bun?._id) {
        // Если булочка есть, устанавливаем ее счетчик на 2 
        counters[burgerConstructor.bun._id] = 2;
      }

      // Возвращаем объект с подсчитанными ингредиентами
      return counters;
    }, [burgerConstructor]); // Используем burgerConstructor как зависимость для обновления счетчиков при изменении

    // Возвращаем компонент IngredientsCategoryUI, передавая в него все необходимые данные
    return (
      <IngredientsCategoryUI
        title={title} 
        titleRef={titleRef} 
        ingredients={ingredients} 
        ingredientsCounters={ingredientsCounters} 
        ref={ref} 
      />
    );
  }
);