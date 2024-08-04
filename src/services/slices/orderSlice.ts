import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

interface OrderBurgerSliceState {
  order: TOrder | null;
  error?: string | null;
  loading: boolean;
}

const initialState: OrderBurgerSliceState = {
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

// Экспортируем

export const getOrder = (state: { orderBurger: OrderBurgerSliceState }) => state.orderBurger.order;
export const getLoading = (state: { orderBurger: OrderBurgerSliceState }) => state.orderBurger.loading;

export const { closeOrder } = orderBurgerSlice.actions;
export const orderReducer = orderBurgerSlice.reducer;

export default orderBurgerSlice.reducer;






// export const { closeOrder } = orderBurgerSlice.actions;
// export const orderSliceName = orderBurgerSlice.name;
// export const orderReducer = orderBurgerSlice.reducer;

// export default orderBurgerSlice.reducer;



// import { orderBurgerApi } from '@api';
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { TOrder } from '@utils-types';

// interface OrderBurgerSliceState {
//   order: TOrder | null;
//   error?: string | null;
//   loading: boolean;
// }

// const initialState: OrderBurgerSliceState = {
//   order: null,
//   loading: false,
//   error: null
// };

// export const createOrder = createAsyncThunk(
//   'user/getOrderBurger',
//   orderBurgerApi
// );

// const orderBurgerSlice = createSlice({
//   name: 'orderBurger',
//   initialState,
//   reducers: {
//     closeOrder: (state) => {
//       state.order = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.order = action.payload.order;
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
//   selectors: {
//     getOrder: (state) => state.order,
//     getLoading: (state) => state.loading
//   }
// });

// export const { getOrder, getLoading } = orderBurgerSlice.selectors;

// export const { closeOrder } = orderBurgerSlice.actions;
// export const orderSliceName = orderBurgerSlice.name;
// export const orderReducer = orderBurgerSlice.reducer;

// export default orderBurgerSlice.reducer;

// import { orderBurgerApi, TNewOrderResponse } from '@api';
// import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { TOrder } from '@utils-types';

// // Определяем функцию для создания заказа с использованием createAsyncThunk
// export const createOrder = createAsyncThunk<TOrder, string[]>(
//   'user/getOrderBurger',
//   async (data) => {
//     const response: TNewOrderResponse = await orderBurgerApi(data); 

//     // Проверяем, успешен ли ответ
//     if (!response.success) {
//       throw new Error('Order creation failed'); // Если не успешен, выбрасываем ошибку
//     }
//     // Возвращаем объект заказа из ответа
//     return response.order;
//   }
// );

// // Определяем интерфейс состояния для хранения информации о заказе
// interface OrderState {
//   order: TOrder | null; // Заказ (или null, если заказа нет)
//   loading: boolean;  
//   error: string | null;
// }

// // Начальное состояние
// const initialState: OrderState = {
//   order: null, // Изначально заказ отсутствует
//   loading: false,  
//   error: null  
// };

// const orderSlice = createSlice({
//   name: 'orderBurger',  
//   initialState,  
//   reducers: {},  
//   extraReducers: (builder) => {
//     // состояний асинхронного thunk
//     builder
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;  
//         state.error = null;  
//       })
//       .addCase(
//         createOrder.fulfilled,
//         (state, action: PayloadAction<TOrder>) => {
//           state.loading = false;  
//           state.order = action.payload.order; // Устанавливаем заказ, полученный из ответа
//         }
//       )
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false; // Отключаем статус загрузки
//         state.error = action.error.message || 'Failed to create order'; // Устанавливаем сообщение об ошибке
//       });
//   }
// });

// // Экспортируем редьюсер для использования в store
// export const { reducer: orderReducer } = orderSlice;
