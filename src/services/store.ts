import { configureStore, combineReducers } from '@reduxjs/toolkit'; // добавляем combineReducers - для объединения нескольких редьюсеров в один

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import burgerConstructorReducer from './slices/burgerConstructorSlice';
import feedSliceReducer from './slices/feedSlice';
import ingredientsSliceReducer from './slices/ingredientsSlice';
// import ingredientsReducer from './slices/ingredientsSlice'; //изменено
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  feedSlice: feedSliceReducer,
  ingredients: ingredientsSliceReducer,
  // ingredients: ingredientsReducer, //изменено
  user: userReducer,
  orderBurger: orderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
