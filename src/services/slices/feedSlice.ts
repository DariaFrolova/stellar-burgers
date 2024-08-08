import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrdersData, TOrder } from '@utils-types';

type TOrderResponse = TOrder;

// Интерфейс для состояния
interface FeedState {
  orders: TOrder[];
  orderModalData: TOrder | null;
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
}

// Определяем начальное состояние
const initialState: FeedState = {
  orders: [],
  orderModalData: null,
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const getFeedAll = createAsyncThunk<TOrdersData, void>(
  'feed/getFeedAll',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

export const getOrders = createAsyncThunk<TOrder[], void>(
  'feed/getOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response as unknown as TOrder;
  } catch (error) {
    return rejectWithValue(
      '👽 Упс, что-то пошло не так, мы не получили номер заказа'
    );
  }
});

// Новый thunk для получения всех заказов
export const fetchOrders = createAsyncThunk<TOrdersData, void>(
  'feed/fetchOrders',
  async () => {
    const orders = await getOrdersApi();
    return { orders, total: orders.length, totalToday: 0 }; // Пример: total и totalToday могут быть изменены по необходимости
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setOrderModalData: (state, action) => {
      state.orderModalData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedAll.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders; // 'action.payload' содержит массив заказов
        state.total = action.payload.total; // Обновляем общее количество заказов
        state.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
      })
      .addCase(getFeedAll.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке всех заказов';
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload; // Обновляем список заказов
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке заказов';
      });
  },
});


export default feedSlice.reducer;

// Селекторы для извлечения состояния
export const selectOrders = (state: { feed: typeof initialState }) =>
  state.feed.orders;

export const selectTotal = (state: { feed: typeof initialState }) =>
  state.feed.total;
export const selectTotalToday = (state: { feed: typeof initialState }) =>
  state.feed.totalToday;
export const selectLoading = (state: { feed: typeof initialState }) =>
  state.feed.loading;
export const selectError = (state: { feed: typeof initialState }) =>
  state.feed.error;

  export const selectOrderModalData = (state: { feedSlice: typeof initialState }) => 
  state.feedSlice.orderModalData;

export const getProfileOrders = (state: { feedSlice: FeedState }) =>
  state.feedSlice.orders;



