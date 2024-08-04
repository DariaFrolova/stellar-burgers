import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
   // Получаем список ингредиентов из Redux с помощью селектора 
  const ingredients = useSelector(selectIngredients);

   // Получаем параметры из URL с помощью хука 
  const params = useParams();

  // Находим данные ингредиента по идентификатору из параметров урл
  const ingredientData = ingredients.find((item) => {
    // Сравниваем id ингредиента с параметром id из урл
    if (item._id === params.id) {
      return item; // Возвращаем найденный ингредиент
    }
  });

   // Если данные ингредиента не найдены, рендерим прелоадер
  if (!ingredientData) {
    return <Preloader />;
  }

   // Если данные ингредиента найдены, рендерим компонент 
  return <IngredientDetailsUI ingredientData={ingredientData} />;
};




// исходник

// import { FC } from 'react';
// import { Preloader } from '../ui/preloader';
// import { IngredientDetailsUI } from '../ui/ingredient-details';

// //сюда

// export const IngredientDetails: FC = () => {
//   /** TODO: взять переменную из стора */
//   const ingredientData = null;

//   if (!ingredientData) {
//     return <Preloader />;
//   }

//   return <IngredientDetailsUI ingredientData={ingredientData} />;
// };