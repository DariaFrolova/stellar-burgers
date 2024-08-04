// import { FC, useMemo } from 'react';
// import { TConstructorIngredient } from '@utils-types';
// import { BurgerConstructorUI } from '@ui';
// import { useDispatch, useSelector } from 'src/services/store';
// import { useNavigate } from 'react-router-dom';

// import { clearBurgerConstructor, constructorSelector } from 'src/services/slices/burgerConstructorSlice';

// import {
//   closeOrder,
//   getLoading,
//   createOrder,
//   getOrder
// } from '../../services/slices/orderSlice';

// import { isAuthCheck } from '../../services/slices/userSlice';


// export const BurgerConstructor: FC = () => {
//   /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */

//   // const constructorItems = {
//   //   bun: {
//   //     price: 0
//   //   },
//   //   ingredients: []
//   // };

//   // const orderRequest = false;
//   // const orderModalData = null;

//   const constructorItems = useSelector(constructorSelector);
//   const orderRequest = useSelector(getLoading);
//   const orderModalData = useSelector(getOrder);

//   const isAuthenticated = useSelector(isAuthCheck);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const onOrderClick = () => {
//     if (!constructorItems.bun || orderRequest) return;
//   };
//   const closeOrderModal = () => {};

//   const price = useMemo(
//     () =>
//       (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
//       constructorItems.ingredients.reduce(
//         (s: number, v: TConstructorIngredient) => s + v.price,
//         0
//       ),
//     [constructorItems]
//   );

//   return null;

//   return (
//     <BurgerConstructorUI
//       price={price}
//       orderRequest={orderRequest}
//       constructorItems={constructorItems}
//       orderModalData={orderModalData}
//       onOrderClick={onOrderClick}
//       closeOrderModal={closeOrderModal}
//     />
//   );
// };


///2

// import { FC, useMemo } from 'react';
// import { TConstructorIngredient } from '@utils-types';
// import { BurgerConstructorUI } from '@ui';
// import { useDispatch, useSelector } from '../../services/store';
// import {
//   clearBurgerConstructor,
//   constructorSelector
// } from '../../services/slices/burgerConstructorSlice';
// import { useNavigate } from 'react-router-dom';
// import {
//   closeOrder,
//   getLoading,
//   createOrder,
//   getOrder
// } from '../../services/slices/orderSlice';
// import { isAuthCheck } from '../../services/slices/userSlice';

// export const BurgerConstructor: FC = () => {
//   const constructorItems = useSelector(constructorSelector);
//   const orderRequest = useSelector(getLoading);
//   const orderModalData = useSelector(getOrder);
//   const isAuthenticated = useSelector(isAuthCheck);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const orderIds: string[] = [
//     ...constructorItems.ingredients.map((item) => item._id),
//     constructorItems.bun?._id
//   ].filter((id): id is string => !!id);

//   const handleOrderClick = () => {
//     if (!constructorItems.bun || orderRequest) return;
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }
//     dispatch(createOrder(orderIds));
//   };

//   const handleCloseOrderModal = () => {
//     dispatch(clearBurgerConstructor());
//     dispatch(closeOrder());
//   };

//   const totalPrice = useMemo(
//     () =>
//       (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
//       constructorItems.ingredients.reduce(
//         (sum: number, ingredient: TConstructorIngredient) =>
//           sum + ingredient.price,
//         0
//       ),
//     [constructorItems]
//   );

//   return (
//     <BurgerConstructorUI
//       price={totalPrice}
//       orderRequest={orderRequest}
//       constructorItems={constructorItems}
//       orderModalData={orderModalData}
//       onOrderClick={handleOrderClick}
//       closeOrderModal={handleCloseOrderModal}
//     />
//   );
// };

import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearBurgerConstructor,
  constructorSelector
} from '../../services/slices/burgerConstructorSlice';
import { useNavigate } from 'react-router-dom';
import {
  closeOrder,
  getLoading,
  createOrder,
  getOrder
} from '../../services/slices/orderSlice';
import { isAuthCheck } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(constructorSelector);
  const orderRequest = useSelector(getLoading);
  const orderModalData = useSelector(getOrder);
  const isAuthenticated = useSelector(isAuthCheck);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем список идентификаторов ингредиентов
  const orderIds = useMemo(() => {
    const ingredientIds = constructorItems.ingredients.map(item => item._id);
    const bunId = constructorItems.bun?._id || '';
    return [...ingredientIds, bunId].filter(Boolean); // Убираем неопределенные значения
  }, [constructorItems.ingredients, constructorItems.bun]);

  // Обработка клика по заказу
  const handleOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(createOrder(orderIds));
  };

  // Закрытие модального окна заказа
  const handleCloseOrderModal = () => {
    dispatch(clearBurgerConstructor());
    dispatch(closeOrder());
  };

  // Расчет общей цены (обновлен для лучшей читаемости)
  const totalPrice = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (total, ingredient) => total + ingredient.price, 
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};



