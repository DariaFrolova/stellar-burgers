import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';

export const BurgerIngredients: FC = () => {
  // Получаем список ингредиентов из состояния приложения с помощью селектора 
  const ingredients = useSelector(selectIngredients);

  // Фильтруем ингредиенты по типам: булочки, начинки и соусы
  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const mains = ingredients.filter((ingredient) => ingredient.type === 'main');
  const sauces = ingredients.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  // Создаем состояние `currentTab` для хранения текущей выбранной вкладки
  // По умолчанию выбрана вкладка с булками
  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Создаем ссылки на заголовки категорий ингредиентов с помощью `useRef`
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Используем хук `useInView` из библиотеки 'react-intersection-observer'
  // для отслеживания видимости категорий ингредиентов на странице
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewMains] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Используем хук `useEffect` для обновления текущей вкладки на основе видимости категорий
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewMains) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewMains, inViewSauces]);

  // Обработчик клика на вкладку
  const handleTabClick = (tab: string) => {
    const tabMode = tab as TTabMode; 
    setCurrentTab(tabMode); // Устанавливаем текущую вкладку

    // Прокручиваем страницу к соответствующей категории ингредиентов при клике на вкладку
    if (tabMode === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tabMode === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (tabMode === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Рендерим компонент пользовательского интерфейса `BurgerIngredientsUI`
  // и передаем ему необходимые пропсы
  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
};