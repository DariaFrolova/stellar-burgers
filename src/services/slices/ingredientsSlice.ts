import { getIngredientsApi } from '@api';  
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';  
import { TIngredient } from '@utils-types';  

// Интерфейс состояния ингредиентов
interface IIngredientsState {
  items: any;
  data: TIngredient[]; // Массив ингредиентов
  loading: boolean; // Статус загрузки
}

const initialState: IIngredientsState = {
  data: [],
  loading: false,
  items: undefined //?? 
};

// Асинхронный thunk для получения всех ингредиентов
export const fetchAllIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>(
  'ingredients/fetchAllIngredients',  
  async (_, { rejectWithValue }) => {
    try {
      const response = await getIngredientsApi();  
      return response;  
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Неизвестная ошибка'
      );
    }
  }
);

// Создаем слайс состояния для ингредиентов
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},  
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIngredients.pending, (state) => {
        // Когда запрос на получение ингредиентов находится в процессе
        state.loading = true; // Устанавливаем флаг загрузки
      })
      .addCase(
        fetchAllIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          // Когда запрос успешен
          state.loading = false; // Сбрасываем флаг загрузки
          state.data = action.payload; // Сохраняем полученные ингредиенты в состоянии
        }
      )
      .addCase(fetchAllIngredients.rejected, (state) => {
        // Когда запрос завершился с ошибкой
        state.loading = false; // Сбрасываем флаг загрузки
      });
  }
});


// Селекторы для доступа к состоянию
export const selectIngredients = (state: { ingredients: IIngredientsState }) => state.ingredients.data;
export const selectIngredientsLoading = (state: { ingredients: IIngredientsState }) => state.ingredients.loading;

export const ingredientsReducer = ingredientsSlice.reducer;

// Экспортируем
export default ingredientsReducer;
