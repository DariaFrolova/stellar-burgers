import orderReducer, { createOrder, initialState } from './orderSlice';

describe('тестирование работы редьюсера "orderBurgerSlice"', () => {
  // Определяем экшены для тестирования
  const actions = {
    pending: {
      type: createOrder.pending.type,
      payload: null
    },
    fulfilled: {
      type: createOrder.fulfilled.type,
      payload: {
        order: { id: 1, name: 'Test Burger' }
      }
    },
    rejected: {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка создания заказа' }
    }
  };

  // Тестирование начального состояния редьюсера
  it('Обработка initialState', () => {
    const state = orderReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  it('Тестирование работы экшена "createOrder/pending"', () => {
    const state = orderReducer(initialState, actions.pending);
    // Проверяем, что состояние загрузки включено и ошибка отсутствует
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
    expect(state.order).toBe(null);
  });

  it('тестирование работы экшена "createOrder/fulfilled"', () => {
    // Сначала симулируем состояние загрузки
    let state = orderReducer(initialState, actions.pending);
    expect(state.loading).toBe(true);

    // Теперь проверяем состояние после успешного выполнения действия
    state = orderReducer(state, actions.fulfilled);
    expect(state.loading).toBe(false);
    expect(state.order).toEqual(actions.fulfilled.payload.order);
    expect(state.error).toBe(null);
  });

  it('тестирование работы экшена "createOrder/rejected"', () => {
    // Сначала симулируем состояние загрузки
    let state = orderReducer(initialState, actions.pending);
    expect(state.loading).toBe(true);

    // Теперь проверяем состояние после ошибки
    state = orderReducer(state, actions.rejected);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(actions.rejected.error.message);
    expect(state.order).toBe(null);
  });

  // Дополнительные тесты на случай некорректных данных
  it('тестирование экшена с некорректными данными', () => {
    const incorrectAction = {
      type: createOrder.fulfilled.type,
      payload: { order: null } // Некорректные данные о заказе
    };
    const state = orderReducer(initialState, incorrectAction);
    // Проверяем, что состояние остается прежним или обрабатывается правильно
    expect(state.order).toEqual(initialState.order);
    expect(state.error).toBe(null);
  });
});
