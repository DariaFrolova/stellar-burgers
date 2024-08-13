import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders, fetchOrders } from '../../services/slices/feedSlice';
import { getProfileOrders } from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(getProfileOrders);

  useEffect(() => {
    dispatch(getOrders()); // отображает список заказов
    dispatch(fetchOrders()); // отображает список заказов пользователя
  }, []); // оставляем пустой массив, если dispatch будет стабилен

  return <ProfileOrdersUI orders={orders} />;
};



