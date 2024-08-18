import { expect, describe, it } from '@jest/globals';
import ingredientsSlice, {
  fetchAllIngredients,
  initialState
} from './ingredientsSlice';

describe('Тестирование редьюсера ингредиентов "ingredientsSlice"', () => {
  const mockIngredients = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      __v: 0
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      __v: 0
    }
  ];

  it('должен возвращать initialState при неизвестном действии', () => {
    expect(ingredientsSlice(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('Обработка action fetchAllIngredients', () => {
    it('должен устанавливать loading в true при pending', () => {
      const action = { type: fetchAllIngredients.pending.type };
      const newState = ingredientsSlice(initialState, action);
      expect(newState.loading).toBe(true);
    });

    it('должен обновлять состояние с данными ингредиентов при fulfilled', () => {
      const action = {
        type: fetchAllIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const newState = ingredientsSlice(initialState, action);
      expect(newState.loading).toBe(false);
      expect(newState.data).toEqual(mockIngredients);
    });

    it('должен устанавливать loading в false при rejected', () => {
      const action = { type: fetchAllIngredients.rejected.type };
      const stateWithLoading = { ...initialState, loading: true };
      const newState = ingredientsSlice(stateWithLoading, action);
      expect(newState.loading).toBe(false);
    });
  });
});
