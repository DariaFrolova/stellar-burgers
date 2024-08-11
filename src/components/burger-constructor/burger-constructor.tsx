import { FC, useMemo } from 'react';
// import { TConstructorIngredient } from '@utils-types';
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