import userReducer, {
  initialState,
  checkUserAuth,
  userRegister,
  userLogin,
  getUserProfile,
  updateUserProfile,
  logout,
  getUserOrders,
  authChecked
} from './userSlice';

// Моковые данные для тестирования пользователя
const testUser = {
  name: 'Антонио Бандерас',
  email: 'test@yandex.ru'
};

// Моковые данные для тестирования заказов
const testOrders = [
  { id: 1, name: 'Заказ 1', ingredients: [] },
  { id: 2, name: 'Заказ 2', ingredients: [] }
];

// Группа тестов для userSlice
describe('Тестирование userSlice', () => {
  // Тест на обработку начального состояния
  it('Должен возвращать начальное состояние при неопознанном экшене', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Тестирование входа пользователя', () => {
    // Тест на состояние pending при входе в систему
    it('Должен обновлять состояние на loading при входе пользователя', () => {
      const action = { type: userLogin.pending.type };
      const newState = userReducer(initialState, action);
      expect(newState).toEqual({ ...initialState, loading: true });
    });

    // Тест на состояние fulfilled при успешном входе
    it('Должен обновлять состояние на isAuth: true при успешном входе', () => {
      const action = {
        type: userLogin.fulfilled.type,
        payload: { user: testUser }
      };
      const newState = userReducer(initialState, action);
      expect(newState).toEqual({
        ...initialState,
        isAuth: true,
        user: testUser,
        loading: false,
        error: null
      });
    });

    // Тест на состояние rejected при ошибке входа
    it('Должен обновлять состояние на ошибку при неудачном входе', () => {
      const action = {
        type: userLogin.rejected.type,
        error: { message: 'Ошибка' }
      };
      const newState = userReducer(initialState, action);
      expect(newState).toEqual({
        ...initialState,
        isAuth: false,
        loading: false,
        error: 'Ошибка'
      });
    });
  });

  describe('Тестирование регистрации пользователя', () => {
    // Тест на состояние fulfilled при успешной регистрации
    it('Должен обновлять состояние на isAuth: true при успешной регистрации', () => {
      const action = {
        type: userRegister.fulfilled.type,
        payload: { user: testUser }
      };
      const newState = userReducer(initialState, action);
      expect(newState).toEqual({
        ...initialState,
        isAuth: true,
        user: testUser,
        loading: false,
        error: null
      });
    });

    // Тест на состояние rejected при ошибке регистрации
    it('Должен обновлять состояние на ошибку при неудачной регистрации', () => {
      const action = {
        type: userRegister.rejected.type,
        error: { message: 'Ошибка' }
      };
      const newState = userReducer(initialState, action);
      expect(newState).toEqual({
        ...initialState,
        isAuthChecked: false,
        user: null,
        loading: false,
        error: 'Ошибка'
      });
    });
  });
});

describe('Выход пользователя', () => {
  // Тест на состояние pending при выходе пользователя
  it('Обработка состояния pending', () => {
    const action = { type: logout.pending.type };
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...initialState, loading: true });
  });

  // Тест на состояние fulfilled при успешном выходе пользователя
  it('Обработка состояния fulfilled', () => {
    const action = { type: logout.fulfilled.type };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isAuth: false,
      user: { name: '', email: '' },
      loading: false
    });
  });

  // Тест на состояние rejected при ошибке выхода
  it('Обработка состояния rejected', () => {
    const action = {
      type: logout.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка'
    });
  });
});

describe('Получение заказов пользователя', () => {
  // Тест на состояние pending при получении заказов
  it('Обработка состояния pending', () => {
    const action = { type: getUserOrders.pending.type };
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...initialState, loading: true });
  });

  // Тест на состояние fulfilled при успешном получении заказов
  it('Обработка состояния fulfilled', () => {
    const action = {
      type: getUserOrders.fulfilled.type,
      payload: testOrders // Переименованы mockOrders в testOrders
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      orders: testOrders,
      loading: false
    });
  });

  // Тест на состояние rejected при ошибке получения заказов
  it('Обработка состояния rejected', () => {
    const action = {
      type: getUserOrders.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка'
    });
  });
});

describe('Получение профиля пользователя', () => {
  // Тест на состояние pending при получении профиля
  it('Обработка состояния pending', () => {
    const action = { type: getUserProfile.pending.type };
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...initialState, loading: true });
  });

  // Тест на состояние fulfilled при успешном получении профиля пользователя
  it('Обработка состояния fulfilled', () => {
    const action = {
      type: getUserProfile.fulfilled.type,
      payload: { user: testUser } // Переименован mockUser в testUser
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isAuth: true,
      user: testUser,
      loading: false
    });
  });

  // Тест на состояние rejected при ошибке получения профиля
  it('Обработка состояния rejected', () => {
    const action = {
      type: getUserProfile.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка'
    });
  });
});

describe('Обновление профиля пользователя', () => {
  // Тест на состояние pending при обновлении профиля
  it('Обработка состояния pending', () => {
    const action = { type: updateUserProfile.pending.type };
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...initialState, loading: true });
  });

  // Тест на состояние fulfilled при успешном обновлении профиля
  it('Обработка состояния fulfilled', () => {
    const action = {
      type: updateUserProfile.fulfilled.type,
      payload: { user: testUser } // Переименован mockUser в testUser
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      user: testUser,
      loading: false
    });
  });

  // Тест на состояние rejected при ошибке обновления профиля
  it('Обработка состояния rejected', () => {
    const action = {
      type: updateUserProfile.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка'
    });
  });
});

describe('Проверка авторизации пользователя', () => {
  // Тест на состояние pending при проверке авторизации
  it('Обработка состояния pending', () => {
    const action = { type: checkUserAuth.pending.type };
    const state = userReducer(initialState, action);
    expect(state).toEqual({ ...initialState, loading: true });
  });

  // Тест на состояние fulfilled при успешной проверке авторизации
  it('Обработка состояния fulfilled', () => {
    const action = { type: checkUserAuth.fulfilled.type };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isAuthChecked: true,
      loading: false
    });
  });

  // Тест на состояние rejected при ошибке проверки авторизации
  it('Обработка состояния rejected', () => {
    const action = {
      type: checkUserAuth.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка'
    });
  });
});

describe('Авторизация проверена', () => {
  // Тест на успешное выполнение действия authChecked
  it('Обработка action authChecked', () => {
    const action = authChecked();
    const state = userReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      isAuthChecked: true,
      loading: false
    });
  });
});
