import {
  loginUserApi,
  TLoginData,
  logoutApi,
  getUserApi,
  registerUserApi,
  updateUserApi,
  getOrdersApi,
  TRegisterData} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

// // Создаем асинхронный thunk для проверки аутентификации пользователя
// export const checkUserAuth = createAsyncThunk(
//   'user/checkUserAuth',
//   async (_, { dispatch, rejectWithValue }) => {
//       try {
//          // Проверяем наличие токена доступа и получаем профиль пользователя
//           if (getCookie('accessToken')) {
//               await dispatch(getUserProfile());
//           }
//       } catch (error) {
//           return rejectWithValue(error); // Возвращаем ошибку при неудаче
//       } finally {
//           dispatch(authChecked()); // Отмечаем, что аутентификация проверена
//       }
//   }
// );

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

// // Создаем асинхронный thunk для входа пользователя
// export const userLogin = createAsyncThunk(
//   'user/login',
//   async ({ email, password }: TLoginData) => {
//       const response = await loginUserApi({ email, password });
//       // Если вход успешен, сохраняем токены в куках и localStorage
//       if (response.success) {
//           setCookie('accessToken', response.accessToken);
//           localStorage.setItem('refreshToken', response.refreshToken);
//       }
//       return response; // Возвращаем ответ
//   }
// );

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

// export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
//     const dataUser = await fetchWithRefresh('auth/user', {
//         headers: {
//             authorization: getCookie('accessToken'),
//         },
//     });
//     return dataUser;
// });

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
              state.error =
                  action.error.message ?? 'Не удалось зарегистрировать пользователя';
              state.loading = false;
              state.isAuthChecked = false;
              state.user = null;
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
              state.isAuth = false;
              state.error = action.error.message;
              state.loading = false;
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
              state.error = action.error.message;
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
              state.error =
                  action.error.message ?? 'Не удалось обновить данные пользователя';
              state.loading = false;
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
              state.error = action.error.message;
              state.loading = false;
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
              state.error =
                  action.error.message ?? 'Не удалось загрузить список заказов';
              state.loading = false;
          });
  }
});

// Определяем селекторы для получения данных о пользователе

const userSelectors = {
  isAuthCheck: (state: { user: TUserState })  => state.user.isAuth,
  getUser: (state: { user: TUserState })  => state.user.user,
  getUserName: (state: { user: TUserState })  => state.user.user?.name,
  getError: (state: { user: TUserState })  => state.user.error,
  getOrders: (state: { user: TUserState })  => state.user.orders,
  getLoading: (state: { user: TUserState })  => state.user.loading
};

export const {
  authChecked
} = userSlice.actions;

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



// import {
//     loginUserApi,
//     TLoginData,
//     logoutApi,
//     getUserApi,
//     registerUserApi,
//     updateUserApi,
//     getOrdersApi,
//     TRegisterData
//   } from '@api';
//   import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
//   import { TUser, TOrder } from '@utils-types';
//   import { getCookie, deleteCookie, setCookie } from '../../utils/cookie';

//   interface TUserState {
//     isAuth: boolean;
//     user: TUser | null;
//     orders: TOrder[];
//     isAuthChecked: boolean;
//     loading: boolean;
//     error?: string | null;
//   }
  
//   const initialState: TUserState = {
//     isAuth: false,
//     user: null,
//     orders: [],
//     isAuthChecked: false,
//     loading: false,
//     error: null
//   };
//   export const checkUserAuth = createAsyncThunk(
//     'user/checkUserAuth',
//     async (_, { dispatch, rejectWithValue }) => {
//       try {
//         if (getCookie('accessToken')) {
//           await dispatch(getUserProfile());
//         }
//       } catch (error) {
//         return rejectWithValue(error);
//       } finally {
//         dispatch(authChecked());
//       }
//     }
//   );
//   export const userRegister = createAsyncThunk(
//     'user/register',
//     async (data: TRegisterData) => {
//       const response = await registerUserApi(data);
//       return response;
//     }
//   );
  
//   export const userLogin = createAsyncThunk(
//     'user/login',
//     async ({ email, password }: TLoginData) => {
//       const response = await loginUserApi({ email, password });
//       if (response.success) {
//         setCookie('accessToken', response.accessToken);
//         localStorage.setItem('refreshToken', response.refreshToken);
//       }
//       return response;
//     }
//   );
//   export const getUserProfile = createAsyncThunk(
//     'user/getUserProfile',
//     async () => {
//       const response = await getUserApi();
//       return response;
//     }
//   );
  
//   export const updateUserProfile = createAsyncThunk(
//     'user/updateUserProfile',
//     async (data: TUser) => {
//       const response = await updateUserApi(data);
//       return response;
//     }
//   );
//   export const logout = createAsyncThunk('user/logout', async () => {
//     await logoutApi();
//     deleteCookie('accessToken');
//     localStorage.clear();
//   });
//   export const getUserOrders = createAsyncThunk(
//     'user/getUserOrders',
//     async () => {
//       const response = await getOrdersApi();
//       return response;
//     }
//   );
  
//   const userSlice = createSlice({
//     name: 'user',
//     initialState,
//     reducers: {
//       authChecked: (state) => {
//         state.isAuthChecked = true;
//         state.loading = false;
//       }
//     },
//     extraReducers: (builder) => {
//       builder
//         .addCase(userRegister.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(userRegister.fulfilled, (state, action) => {
//           state.isAuth = true;
//           state.user = action.payload.user;
//           state.loading = false;
//           state.error = null;
//         })
//         .addCase(userRegister.rejected, (state, action) => {
//           state.error =
//             action.error.message ?? 'Не удалось зарегистрировать пользователя';
//           state.loading = false;
//           state.isAuthChecked = false;
//           state.user = null;
//         })
//         .addCase(userLogin.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(userLogin.fulfilled, (state, action) => {
//           state.isAuth = true;
//           state.user = action.payload.user;
//           state.loading = false;
//           state.error = null;
//         })
//         .addCase(userLogin.rejected, (state, action) => {
//           state.isAuth = false;
//           state.error = action.error.message;
//           state.loading = false;
//         })
//         .addCase(getUserProfile.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(getUserProfile.fulfilled, (state, action) => {
//           state.isAuth = true;
//           state.user = action.payload.user;
//           state.loading = false;
//         })
//         .addCase(getUserProfile.rejected, (state, action) => {
//           state.isAuth = false;
//           state.error = action.error.message;
//           state.loading = false;
//         })
//         .addCase(updateUserProfile.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(updateUserProfile.fulfilled, (state, action) => {
//           state.user = action.payload.user;
//           state.loading = false;
//         })
//         .addCase(updateUserProfile.rejected, (state, action) => {
//           state.error =
//             action.error.message ?? 'Не удалось обновить данные пользователя';
//           state.loading = false;
//         })
//         .addCase(logout.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(logout.fulfilled, (state) => {
//           state.isAuth = false;
//           state.user = { name: '', email: '' };
//           state.loading = false;
//         })
//         .addCase(logout.rejected, (state, action) => {
//           state.error = action.error.message;
//           state.loading = false;
//         })
//         .addCase(checkUserAuth.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(checkUserAuth.fulfilled, (state) => {
//           state.isAuthChecked = true;
//           state.loading = false;
//         })
//         .addCase(checkUserAuth.rejected, (state, action) => {
//           state.error = action.error.message;
//           state.loading = false;
//         })
//         .addCase(getUserOrders.pending, (state) => {
//           state.loading = true;
//           state.error = null;
//         })
//         .addCase(getUserOrders.fulfilled, (state, action) => {
//           state.orders = action.payload;
//           state.loading = false;
//         })
//         .addCase(getUserOrders.rejected, (state, action) => {
//           state.error =
//             action.error.message ?? 'Не удалось загрузить список заказов';
//           state.loading = false;
//         });
//     },
//     selectors: {
//       isAuthCheck: (state) => state.isAuth,
//       getUser: (state) => state.user,
//       getUserName: (state) => state.user?.name,
//       getError: (state) => state.error,
//       getOrders: (state) => state.orders,
//       getLoading: (state) => state.loading
//     }
//   });
  
//   export const {
//     isAuthCheck,
//     getUser,
//     getError,
//     getOrders,
//     getLoading,
//     getUserName
//   } = userSlice.selectors;
  

// export default userSlice.reducer;
  
//   export const { authChecked } = userSlice.actions;
//   export const userSliceName = userSlice.name;
//   export const userReducer = userSlice.reducer;
  
