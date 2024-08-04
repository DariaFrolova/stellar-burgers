import {
    loginUserApi,
    TLoginData,
    logoutApi,
    getUserApi,
    registerUserApi,
    updateUserApi,
    getOrdersApi,
    TRegisterData
  } from '@api';
  import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
  import { TUser, TOrder } from '@utils-types';
  import { getCookie, deleteCookie, setCookie } from '../../utils/cookie';
  
  interface TUserState {
    isAuth: boolean;
    user: TUser | null;
    orders: TOrder[];
    isAuthChecked: boolean;
    loading: boolean;
    error?: string | null;
  }
  
  const initialState: TUserState = {
    isAuth: false,
    user: null,
    orders: [],
    isAuthChecked: false,
    loading: false,
    error: null
  };
  export const checkUserAuth = createAsyncThunk(
    'user/checkUserAuth',
    async (_, { dispatch, rejectWithValue }) => {
      try {
        if (getCookie('accessToken')) {
          await dispatch(getUserProfile());
        }
      } catch (error) {
        return rejectWithValue(error);
      } finally {
        dispatch(authChecked());
      }
    }
  );
  export const userRegister = createAsyncThunk(
    'user/register',
    async (data: TRegisterData) => {
      const response = await registerUserApi(data);
      return response;
    }
  );
  
  export const userLogin = createAsyncThunk(
    'user/login',
    async ({ email, password }: TLoginData) => {
      const response = await loginUserApi({ email, password });
      if (response.success) {
        setCookie('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      return response;
    }
  );
  export const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async () => {
      const response = await getUserApi();
      return response;
    }
  );
  
  export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (data: TUser) => {
      const response = await updateUserApi(data);
      return response;
    }
  );
  export const logout = createAsyncThunk('user/logout', async () => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.clear();
  });
  export const getUserOrders = createAsyncThunk(
    'user/getUserOrders',
    async () => {
      const response = await getOrdersApi();
      return response;
    }
  );
  
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
        .addCase(userLogin.rejected, (state, action) => {
          state.isAuth = false;
          state.error = action.error.message;
          state.loading = false;
        })
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
    },
    selectors: {
      isAuthCheck: (state) => state.isAuth,
      getUser: (state) => state.user,
      getUserName: (state) => state.user?.name,
      getError: (state) => state.error,
      getOrders: (state) => state.orders,
      getLoading: (state) => state.loading
    }
  });
  
  export const {
    isAuthCheck,
    getUser,
    getError,
    getOrders,
    getLoading,
    getUserName
  } = userSlice.selectors;
  
  export default userSlice.reducer;
  
  export const { authChecked } = userSlice.actions;
  export const userSliceName = userSlice.name;
  export const userReducer = userSlice.reducer;
  