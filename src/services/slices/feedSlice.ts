import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrdersData, TOrder } from '@utils-types';

// Интерфейс для состояния
interface FeedState {
  orders: TOrder[];
  orderModalData: TOrder[];
  profileOrders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error?: string | null;
}

// Определяем начальное состояние
const initialState: FeedState = {
  orders: [],
  orderModalData: [],
  profileOrders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};


export const getFeedAll = createAsyncThunk('feed/getFeedAll', getFeedsApi);


export const getOrders = createAsyncThunk('order/getOrders', getOrdersApi);


export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  getOrderByNumberApi
);

export const fetchOrders = createAsyncThunk<TOrdersData, void>(
  'feed/fetchOrders',
  async () => {
    const orders = await getOrdersApi();
    return { orders, total: orders.length, totalToday: 0 }; 
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedAll.fulfilled, (state, action) => {
        state.loading = false;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.orders = action.payload.orders;
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
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderModalData = action.payload.orders;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
      });
  },
});


export default feedSlice.reducer;

export const getProfileOrders = (state: { feedSlice: FeedState }) =>
  state.feedSlice.orders;

export const selectFeedLoading = (state: { feedSlice: FeedState }) => state.feedSlice.loading;
export const selectFeedOrders = (state: { feedSlice: FeedState }) => state.feedSlice.orders;
export const selectProfileOrders = (state: { feedSlice: FeedState }) => state.feedSlice.profileOrders;
export const selectTotal = (state: { feedSlice: FeedState }) => state.feedSlice.total;
export const selectTotalToday = (state: { feedSlice: FeedState }) => state.feedSlice.totalToday;
export const selectOrderModalData = (state: { feedSlice: FeedState }) => state.feedSlice.orderModalData[0];
