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
    return response; // Возвращаем полученные данные
  }
);

export const getOrders = createAsyncThunk<TOrder[], void>(
  'feed/getOrders',
  async () => {
    const response = await getOrdersApi();
    return response; // Возвращаем список заказов
  }
);

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response as unknown as TOrder; // Приведение типа
  } catch (error) {
    return rejectWithValue(
      '👽 Упс, что-то пошло не так, мы не получили номер заказа'
    ); // Возврат ошибки
  }
});


// Создаем асинхронное действие для получения заказов
export const fetchOrders = createAsyncThunk<TOrdersData, void>(
  'feed/fetchOrders',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

// Создаем слайс состояния для заказов
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Существующие обработчики...
      .addCase(getFeedAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedAll.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders; // Предполагается, что 'action.payload' содержит массив заказов
        state.total = action.payload.total; // Обновляем общее количество заказов
        state.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
      })
      .addCase(getFeedAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке всех заказов'; // Установка ошибки
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
        state.error = action.error.message || 'Ошибка при загрузке заказов'; // Установка ошибки
      });
  }
});
//   extraReducers: (builder) => {
//     // Обрабатываем состояния асинхронного действия для получения всех заказов
//     builder
//       .addCase(fetchOrders.pending, (state) => {
//         state.loading = true; // Устанавливаем статус загрузки перед началом запроса
//         state.error = null; // Сбрасываем ошибку
//       })
//       .addCase(fetchOrders.fulfilled, (state, action) => {
//         state.loading = false; // Устанавливаем статус загрузки как завершенный
//         state.orders = action.payload.orders; // Обновляем список заказов
//         state.total = action.payload.total; // Обновляем общее количество заказов
//         state.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
//       })
//       .addCase(fetchOrders.rejected, (state, action) => {
//         state.loading = false; // Завершаем загрузку при ошибке
//         state.error = action.error.message || 'Ошибка при загрузке заказов'; // Установка ошибки
//       })
//       // Обрабатываем состояния асинхронного действия для получения заказа по номеру
//       .addCase(getOrderByNumber.pending, (state) => {
//         state.loading = true; // Статус загрузки
//         state.error = null; // Сбрасываем ошибку
//       })
//       .addCase(getOrderByNumber.fulfilled, (state, action) => {
//         state.loading = false; // Завершаем загрузку
//         state.orderModalData = action.payload; // Обновляем данные заказа по номеру
//       })
//       .addCase(getOrderByNumber.rejected, (state, action) => {
//         state.loading = false; // Завершаем загрузку при ошибке
//         state.error =
//           action.error.message || 'Ошибка при загрузке заказа по номеру'; // Установка ошибки
//       });
//   }
// });

// Экспортируем редьюсер, чтобы использовать его в store
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
export const selectOrderModalData = (state: { feed: typeof initialState }) =>
  state.feed.orderModalData; // Селектор для доступа к orderModalData



  
// первый вариант
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getFeedsApi } from '@api';
// import { TOrdersData, TOrder } from '@utils-types';

// //интерфейс для состояния
// interface FeedState {
//     orders: TOrder[];
//     total: number;
//     totalToday: number;
//     loading: boolean;
//     error: string | null; // error может быть строкой или null
// }

// // Определяем начальное состояние
// const initialState: FeedState = {
//     orders: [],
//     total: 0,
//     totalToday: 0,
//     loading: false,
//     error: null,
// };

//   // Создаем асинхронное действие для получения заказов
// export const fetchOrders = createAsyncThunk<TOrdersData, void>(
//     'feed/fetchOrders',
//     async () => {
//       const response = await getFeedsApi(); // Получаем данные через API
//       return response; // Возвращаем ответ
//     }
//   );

//   // Создаем слайс состояния для заказов
// const feedSlice = createSlice({
//     name: 'feed', // Имя слайса
//     initialState, // Начальное состояние
//     reducers: {}, // Здесь можно добавить синхронные редьюсеры, если потребуется
//     extraReducers: (builder) => {
//       // Обрабатываем состояния асинхронного действия
//       builder
//         .addCase(fetchOrders.pending, (state) => {
//           state.loading = true; // Устанавливаем статус загрузки перед началом запроса
//           state.error = null; // Сбрасываем ошибку
//         })
//         .addCase(fetchOrders.fulfilled, (state, action) => {
//           state.loading = false; // Устанавливаем статус загрузки как завершенный
//           state.orders = action.payload.orders; // Обновляем список заказов
//           state.total = action.payload.total; // Обновляем общее количество заказов
//           state.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
//         })
//         .addCase(fetchOrders.rejected, (state, action) => {
//           state.loading = false; // Завершаем загрузку при ошибке
//           state.error = action.error.message || 'Ошибка при загрузке заказов'; // Установка ошибки
//         });
//     },
//   });

// // Экспортируем редьюсер, чтобы использовать его в store
// export default feedSlice.reducer;

// // Селекторы для извлечения состояния
// export const selectOrders = (state: { feed: typeof initialState }) => state.feed.orders;
// export const selectTotal = (state: { feed: typeof initialState }) => state.feed.total;
// export const selectTotalToday = (state: { feed: typeof initialState }) => state.feed.totalToday;
// export const selectLoading = (state: { feed: typeof initialState }) => state.feed.loading;
// export const selectError = (state: { feed: typeof initialState }) => state.feed.error;

// // вариант 3
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getFeedsApi, getOrderByNumberApi } from '@api'; // Импортируем необходимые API функции
// import { TOrdersData, TOrder } from '@utils-types';

// // Интерфейс для состояния
// interface FeedState {
//     orders: TOrder[];
//     orderModalData: TOrder | null; // Для хранения данных заказа по номеру
//     total: number;
//     totalToday: number;
//     loading: boolean;
//     error: string | null; // error может быть строкой или null
// }

// // Определяем начальное состояние
// const initialState: FeedState = {
//     orders: [],
//     orderModalData: null, // Начальное значение - null (отсутствие данных)
//     total: 0,
//     totalToday: 0,
//     loading: false,
//     error: null,
// };

// // Создаем асинхронное действие для получения заказов
// export const fetchOrders = createAsyncThunk<TOrdersData, void>(
//     'feed/fetchOrders',
//     async () => {
//         const response = await getFeedsApi(); // Получаем данные через API
//         return response; // Возвращаем ответ
//     }
// );

// // Создаем асинхронное действие для получения заказа по номеру
// export const getOrderByNumber = createAsyncThunk<TOrder, number>(
//     'order/getOrderByNumber',
//     async (orderNumber) => {
//         const response = await getOrderByNumberApi(orderNumber); // Получаем данные по номеру заказа
//         return response; // Возвращаем ответ
//     }
// );

// // Создаем слайс состояния для заказов
// const feedSlice = createSlice({
//     name: 'feed', // Имя слайса
//     initialState, // Начальное состояние
//     reducers: {}, // Здесь можно добавить синхронные редьюсеры, если потребуется
//     extraReducers: (builder) => {
//         // Обрабатываем состояния асинхронного действия для получения всех заказов
//         builder
//             .addCase(fetchOrders.pending, (state) => {
//                 state.loading = true; // Устанавливаем статус загрузки перед началом запроса
//                 state.error = null; // Сбрасываем ошибку
//             })
//             .addCase(fetchOrders.fulfilled, (state, action) => {
//                 state.loading = false; // Устанавливаем статус загрузки как завершенный
//                 state.orders = action.payload.orders; // Обновляем список заказов
//                 state.total = action.payload.total; // Обновляем общее количество заказов
//                 state.totalToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
//             })
//             .addCase(fetchOrders.rejected, (state, action) => {
//                 state.loading = false; // Завершаем загрузку при ошибке
//                 state.error = action.error.message || 'Ошибка при загрузке заказов'; // Установка ошибки
//             })
//             // Обрабатываем состояния асинхронного действия для получения заказа по номеру
//             .addCase(getOrderByNumber.pending, (state) => {
//                 state.loading = true; // Статус загрузки
//                 state.error = null; // Сбрасываем ошибку
//             })
//             .addCase(getOrderByNumber.fulfilled, (state, action) => {
//                 state.loading = false; // Завершаем загрузку
//                 state.orderModalData = action.payload; // Обновляем данные заказа по номеру
//             })
//             .addCase(getOrderByNumber.rejected, (state, action) => {
//                 state.loading = false; // Завершаем загрузку при ошибке
//                 state.error = action.error.message || 'Ошибка при загрузке заказа по номеру'; // Установка ошибки
//             });
//     },
// });

// // Экспортируем редьюсер, чтобы использовать его в store
// export default feedSlice.reducer;

// // Селекторы для извлечения состояния
// export const selectOrders = (state: { feed: typeof initialState }) => state.feed.orders;
// export const selectTotal = (state: { feed: typeof initialState }) => state.feed.total;
// export const selectTotalToday = (state: { feed: typeof initialState }) => state.feed.totalToday;
// export const selectLoading = (state: { feed: typeof initialState }) => state.feed.loading;
// export const selectError = (state: { feed: typeof initialState }) => state.feed.error;
// export const selectOrderModalData = (state: { feed: typeof initialState }) => state.feed.orderModalData; // Селектор для доступа к orderModalData
