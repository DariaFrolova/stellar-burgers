import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getFeedsApi } from '@api';
import { getFeedsApi } from '@api';
import { TOrdersData, TOrder } from '@utils-types';

//интерфейс для состояния
interface FeedState {
    orders: TOrder[];
    total: number;
    totalToday: number;
    loading: boolean;
    error: string | null; // error может быть строкой или null
}

// Определяем начальное состояние
const initialState: FeedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null,
};

  // Создаем асинхронное действие для получения заказов
export const fetchOrders = createAsyncThunk<TOrdersData, void>(
    'feed/fetchOrders',
    async () => {
      const response = await getFeedsApi(); // Получаем данные через API
      return response; // Возвращаем ответ
    }
  );
  

  // Создаем слайс состояния для заказов
const feedSlice = createSlice({
    name: 'feed', // Имя слайса
    initialState, // Начальное состояние
    reducers: {}, // Здесь можно добавить синхронные редьюсеры, если потребуется
    extraReducers: (builder) => {
      // Обрабатываем состояния асинхронного действия
      builder
        .addCase(fetchOrders.pending, (state) => {
          state.loading = true; // Устанавливаем статус загрузки перед началом запроса
          state.error = null; // Сбрасываем ошибку
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
          state.loading = false; // Устанавливаем статус загрузки как завершенный
          state.orders = action.payload.orders; // Обновляем список заказов
          state.total = action.payload.total; // Обновляем общее количество заказов
          state.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
        })
        .addCase(fetchOrders.rejected, (state, action) => {
          state.loading = false; // Завершаем загрузку при ошибке
          state.error = action.error.message || 'Ошибка при загрузке заказов'; // Установка ошибки
        });
    },
  });

// Экспортируем редьюсер, чтобы использовать его в store
export default feedSlice.reducer;

// Селекторы для извлечения состояния
export const selectOrders = (state: { feed: typeof initialState }) => state.feed.orders;
export const selectTotal = (state: { feed: typeof initialState }) => state.feed.total;
export const selectTotalToday = (state: { feed: typeof initialState }) => state.feed.totalToday;
export const selectLoading = (state: { feed: typeof initialState }) => state.feed.loading;
export const selectError = (state: { feed: typeof initialState }) => state.feed.error;