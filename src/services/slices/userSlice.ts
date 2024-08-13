import {
  loginUserApi,
  TLoginData,
  logoutApi,
  getUserApi,
  registerUserApi,
  updateUserApi,
  getOrdersApi,
  TRegisterData} from '@api';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { TUser, TOrder } from '@utils-types';
import { getCookie, deleteCookie, setCookie } from '../../utils/cookie';

// Определяем интерфейс состояния пользователя
interface TUserState {
  isAuth: boolean;
  user: TUser | null;
  orders: TOrder[];
  isAuthChecked: boolean;
  loading: boolean;
  error?: string | null;
}

// Начальное состояние пользователя

const initialState: TUserState = {
  isAuth: false,
  user: null,
  orders: [],
  isAuthChecked: false,
  loading: false,
  error: null
};


// Создаем асинхронный thunk для проверки аутентификации пользователя и загрузки заказов
export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch, rejectWithValue }) => {
      try {
          if (getCookie('accessToken')) {
              await dispatch(getUserProfile()); // Получаем профиль пользователя
              await dispatch(getUserOrders()); // Получаем заказы пользователя, если он аутентифицирован
          }
      } catch (error) {
          return rejectWithValue(error);
      } finally {
          dispatch(authChecked());
      }
  }
);

// Создаем асинхронный thunk для регистрации нового пользователя
export const userRegister = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
      const response = await registerUserApi(data); // Вызываем API регистрации
      return response; // Возвращаем ответ
  }
);


// добавили вызов getUserOrders в userLogin
export const userLogin = createAsyncThunk(
  'user/login',
  async ({ email, password }: TLoginData, { dispatch }) => {
      const response = await loginUserApi({ email, password });
      if (response.success) {
          setCookie('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          // После успешного входа пользователя можно загружать заказы
          await dispatch(getUserOrders());
      }
      return response;
  }
);


// Создаем асинхронный thunk для получения профиля пользователя
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async () => {
      const response = await getUserApi(); // Вызываем API для получения профиля
      return response; // Возвращаем ответ
  }
);

// Создаем асинхронный thunk для обновления профиля пользователя
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (data: TUser) => {
      const response = await updateUserApi(data); // Вызываем API для обновления
      return response; // Возвращаем ответ
  }
);

// Создаем асинхронный thunk для выхода пользователя
export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi(); // Вызываем API для выхода
  deleteCookie('accessToken'); // Удаляем токен из куков
  localStorage.clear();  // Очищаем localStorage
});

// Создаем асинхронный thunk для получения заказов пользователя
export const getUserOrders = createAsyncThunk(
  'user/getUserOrders',
  async () => {
      const response = await getOrdersApi(); // Вызываем API для получения заказов
      return response; // Возвращаем ответ
  }
);

// Создаем слайс состояния пользователя с редьюсерами и асинхронными действиями
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
      authChecked: (state) => {
          state.isAuthChecked = true;
          state.loading = false;
      }
  },
  extraReducers: (builder) => {
      builder
      // Обработчики для регистрации
          .addCase(userRegister.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(userRegister.fulfilled, (state, action) => {
              state.isAuth = true;
              state.user = action.payload.user;
              state.loading = false;
              state.error = null;
          })
          .addCase(userRegister.rejected, (state, action) => {
              state.loading = false;
            state.error = action.error.message || 'Что-то пошло не так';
          })
          // Обработчики для входа 
          .addCase(userLogin.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(userLogin.fulfilled, (state, action) => {
              state.isAuth = true;
              state.user = action.payload.user;
              state.loading = false;
              state.error = null;
          })
        // Обработка ошибок при входе
        .addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.isAuth = false;
            state.error = action.error.message;
        })
          // Обработчики для получения профиля
          .addCase(getUserProfile.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(getUserProfile.fulfilled, (state, action) => {
              state.isAuth = true;
              state.user = action.payload.user;
              state.loading = false;
          })
          .addCase(getUserProfile.rejected, (state, action) => {
              state.isAuth = false;
              state.error = action.error.message || 'Что-то пошло не так';
              state.loading = false;
          })
          // Обработчики для обновления профиля
          .addCase(updateUserProfile.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(updateUserProfile.fulfilled, (state, action) => {
              state.user = action.payload.user;
              state.loading = false;
          })
          .addCase(updateUserProfile.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message || 'Не удалось обновить данные пользователя';
          })
          // Обработчики для выхода
          .addCase(logout.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(logout.fulfilled, (state) => {
              state.isAuth = false;
              state.user = { name: '', email: '' };
              state.loading = false;
          })
          .addCase(logout.rejected, (state, action) => {
              state.loading = false;
              state.error = action.error.message || 'Не удалось выйти из системы';
          })
          // Обработчики для проверки аутентификации
          .addCase(checkUserAuth.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(checkUserAuth.fulfilled, (state) => {
              state.isAuthChecked = true;
              state.loading = false;
          })
          .addCase(checkUserAuth.rejected, (state, action) => {
              state.error = action.error.message;
              state.loading = false;
          })
           // Обработчики для получения заказов
          .addCase(getUserOrders.pending, (state) => {
              state.loading = true;
              state.error = null;
          })
          .addCase(getUserOrders.fulfilled, (state, action) => {
              state.orders = action.payload;
              state.loading = false;
          })
          .addCase(getUserOrders.rejected, (state, action) => {
            //   state.error =
              state.error = action.error.message || 'Не удалось загрузить список заказов';
              state.loading = false;
          });
  }
});


// Селекторы
const selectUserState = (state: { user: TUserState }) => state.user;

export const userSelectors = {
  isAuthCheck: createSelector(selectUserState, (user) => user.isAuth),
  getUser: createSelector(selectUserState, (user) => user.user),
  getUserName: createSelector(selectUserState, (user) => user.user?.name),
  getError: createSelector(selectUserState, (user) => user.error),
  getOrders: createSelector(selectUserState, (user) => user.orders),
  getLoading: createSelector(selectUserState, (user) => user.loading)
};

// Экспортируем действия и редьюсер
export const { authChecked } = userSlice.actions;
export const userSliceName = userSlice.name;
export const userReducer = userSlice.reducer;

// Экспортируем селекторы
export const {
  isAuthCheck,
  getUser,
  getError,
  getOrders,
  getLoading,
  getUserName
} = userSelectors;

export default userReducer;