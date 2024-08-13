import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface OrderBurgerSliceState {
  order: TOrder | null;
  error?: string | null;
  loading: boolean;
}

export const initialState: OrderBurgerSliceState = {
  order: null,
  loading: false,
  error: null,
};


export const createOrder = createAsyncThunk(
  'user/getOrderBurger',
  orderBurgerApi
);

const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState,
  reducers: {
    closeOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});


export const getOrder = (state: { orderBurger: OrderBurgerSliceState }) => state.orderBurger.order;
export const getLoading = (state: { orderBurger: OrderBurgerSliceState }) => state.orderBurger.loading;

export const { closeOrder } = orderBurgerSlice.actions;
export const orderReducer = orderBurgerSlice.reducer;

export default orderBurgerSlice.reducer;
