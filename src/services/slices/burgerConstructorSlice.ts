import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // для генерации уникального идентификатора
import { TIngredient, TConstructorIngredient } from '@utils-types';

import { RootState } from '../store';

// Определяем интерфейс состояния конструктора бургера
interface IBurgerConstructorState {
  bun: TConstructorIngredient | null; // Хранит булку
  ingredients: TConstructorIngredient[]; // Хранит список ингредиентов
}

// Начальное состояние
const initialState: IBurgerConstructorState = {
  bun: null,
  ingredients: []
};

// создаем слайс
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,

  reducers: {
    // Добавляем ингредиент (булку или другой ингредиент)
    addIngredientToOrder: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const { type } = action.payload;
        // Проверяем тип ингредиента: если булка - сохраняем как булку, иначе добавляем в обычные ингредиенты
        if (type === 'bun') {
          state.bun = action.payload; // Сохраняем булку
        } else {
          state.ingredients.push(action.payload); // Добавляем обычный ингредиент
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4(); // Генерируем уникальный id
        return { payload: { ...ingredient, id } }; // Возвращаем ингредиент с новым id
      }
    },
    // Меняем порядок ингредиента
    changeIngredientLayer: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.ingredients;
      // Проверяем допустимость индексов
      if (
        fromIndex !== toIndex &&
        fromIndex >= 0 &&
        toIndex >= 0 &&
        fromIndex < ingredients.length &&
        toIndex < ingredients.length
      ) {
        const [removed] = ingredients.splice(fromIndex, 1); // Удаляем ингредиент из старой позиции
        ingredients.splice(toIndex, 0, removed); // Вставляем его на новую позицию
      }
    },
    // Удаляем ингредиент
    removeIngredientFromOrder: (state, action: PayloadAction<string>) => {
      // Удаляем ингредиент по id
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    }, 
    // Очищаем конструктор бургера
    clearBurgerConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Экспортируем действия (action creators)
export const {
  addIngredientToOrder,
  changeIngredientLayer,
  removeIngredientFromOrder,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;

// Экспортируем редьюсер
export default burgerConstructorSlice.reducer; 

// Экспорт селектора
export const constructorSelector = (state: RootState) => state.burgerConstructor;




// export const selectBurgerConstructorState = (state: {
//   burgerConstructor: IBurgerConstructorState;
// }) => state.burgerConstructor;


// export const selectBun = createSelector(
//   [selectBurgerConstructorState],
//   (burgerConstructor) => burgerConstructor.bun
// );

// export const selectIngredients = createSelector(
//   [selectBurgerConstructorState],
//   (burgerConstructor) => burgerConstructor.ingredients
// );


// // Экспортируем редьюсер
// export default burgerConstructorSlice.reducer; 


