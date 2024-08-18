import { expect, describe, it } from '@jest/globals';

import feedSlice, {
  getFeedAll,
  getOrders,
  getOrderByNumber,
  initialState,
  fetchOrders
} from './feedSlice';

const mockOrders = [
  {
    _id: '1',
    status: 'готов',
    name: 'Space флюоресцентный антарианский метеоритный бургер',
    createdAt: '2024-08-05T19:52:46.004Z',
    updatedAt: '2024-08-05T19:52:46.500Z',
    number: 12345,
    ingredients: ['Булка', 'Начинка']
  }
];

const mockFeedState = {
  orders: mockOrders,
  orderModalData: mockOrders,
  profileOrders: mockOrders,
  total: 100,
  totalToday: 1,
  loading: false,
  error: null
};

describe('Тест для редьюсера feedSlice', () => {
  it('Тест на проверку initial state редьюсера', () => {
    expect(feedSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Тест на обработку состояния pending для getFeedAll', () => {
    const action = { type: getFeedAll.pending.type };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Тест на обработку выполненного состояния getFeedAll', () => {
    const action = {
      type: getFeedAll.fulfilled.type,
      payload: {
        total: 10,
        totalToday: 5,
        orders: mockOrders
      }
    };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(5);
    expect(state.orders).toEqual(mockOrders);
  });

  it('Тест на обработку getFeedAll.rejected', () => {
    const action = {
      type: getFeedAll.rejected.type,
      error: { message: 'Ошибка при загрузке всех заказов' }
    };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке всех заказов');
  });

  it('Тест на обработку getOrders.pending', () => {
    const action = { type: getOrders.pending.type };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Тест на обработку getOrders.fulfilled', () => {
    const action = {
      type: getOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  });

  it('Тест на обработку getOrders.rejected', () => {
    const action = {
      type: getOrders.rejected.type,
      error: { message: 'Ошибка при загрузке заказов' }
    };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка при загрузке заказов');
  });

  it('Тест на обработку getOrderByNumber.pending', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('Тест на обработку getOrderByNumber.fulfilled', () => {
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: mockOrders }
    };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orderModalData).toEqual(mockOrders);
  });

  it('Тест на обработку getOrderByNumber.rejected', () => {
    const action = { type: getOrderByNumber.rejected.type };
    const state = feedSlice(initialState, action);
    expect(state.loading).toBe(false);
  });

  it('Тест на обработку fetchOrders.fulfilled', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: {
        orders: mockOrders,
        total: mockOrders.length,
        totalToday: 0
      }
    };
    const state = feedSlice(initialState, action);
    expect(state.orders).toEqual(action.payload.orders);
    expect(state.total).toBe(action.payload.total);
    expect(state.totalToday).toBe(action.payload.totalToday);
  });
});
