import { expect, describe, test } from '@jest/globals';

import burgerConstructorSlice, {
  addIngredientToOrder,
  changeIngredientLayer,
  removeIngredientFromOrder,
  clearBurgerConstructor,
  initialState
} from './burgerConstructorSlice';

const mockIngredientBun = {
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
  __v: 0,

  id: 'constructorItems'
};

const mockIngredientMain = {
  _id: '643d69a5c3f7b9001cfa093e',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  __v: 0,

  id: 'ingredientMain'
};

const mockIngredientSauce = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус фирменный Space Sauce',
  type: 'sauce',
  proteins: 50,
  fat: 22,
  carbohydrates: 11,
  calories: 14,
  price: 80,
  image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
  __v: 0,

  id: 'ingredientSauce'
};

describe('burgerConstructorSlice', () => {
  describe('addIngredientToOrder', () => {
    test('добавление булочки в заказ', () => {
      // Ожидаемое состояние после добавления булки
      const expectedResult = {
        ...initialState,
        bun: { ...mockIngredientBun, id: expect.any(String) } // ID заполняется автоматически
      };

      // Применяем действие для добавления булки
      const newState = burgerConstructorSlice(
        initialState,
        addIngredientToOrder(mockIngredientBun)
      );

      // Проверяем, что новое состояние соответствует ожидаемому
      expect(newState).toEqual(expectedResult);
    });

    test('добавление основного ингредиента в заказ', () => {
      // Ожидаемое состояние после добавления основного ингредиента
      const expectedResult = {
        ...initialState,
        ingredients: [{ ...mockIngredientMain, id: expect.any(String) }] // ID основного ингредиента заполняется автоматически
      };

      // Применяем действие для добавления основного ингредиента
      const newState = burgerConstructorSlice(
        initialState,
        addIngredientToOrder(mockIngredientMain)
      );

      // Проверяем, что новое состояние соответствует ожидаемому
      expect(newState).toEqual(expectedResult);
    });
  });
});

describe('changeIngredientLayer', () => {
  test('должен переместить ингредиент', () => {
    // Начальное состояние с двумя ингредиентами
    const stateWithIngredients = {
      ...initialState, // Исходное состояние
      ingredients: [
        { ...mockIngredientMain, id: '1' }, // Основной ингредиент с ID '1'
        { ...mockIngredientSauce, id: '2' } // Соус с ID '2'
      ]
    };

    // Ожидаемое состояние после перемещения ингредиента
    const expectedResult = {
      ...initialState, // Исходное состояние
      ingredients: [
        { ...mockIngredientSauce, id: '2' }, // Соус теперь первым
        { ...mockIngredientMain, id: '1' } // Основной ингредиент стал вторым
      ]
    };

    // Применяем действие changeIngredientLayer к текущему состоянию
    const newState = burgerConstructorSlice(
      stateWithIngredients,
      changeIngredientLayer({ fromIndex: 0, toIndex: 1 }) // Перемещение с 0 на 1
    );

    // Проверяем, что новое состояние соответствует ожидаемому
    expect(newState).toEqual(expectedResult);
  });

  test('должен переместить ингредиенты на одной позиции', () => {
    // Начальное состояние с тремя ингредиентами
    const stateWithIngredients = {
      ...initialState, // Исходное состояние
      ingredients: [
        { ...mockIngredientBun, id: 'bunId' }, // Булочка с ID 'bunId'
        { ...mockIngredientMain, id: 'mainId' }, // Основной ингредиент с ID 'mainId'
        { ...mockIngredientSauce, id: 'sauceId' } // Соус с ID 'sauceId'
      ]
    };

    // Ожидаемое состояние после попытки перемещения на одной позиции
    const expectedResult = {
      ...initialState, // Исходное состояние
      ingredients: [
        { ...mockIngredientBun, id: 'bunId' }, // Булка остаётся первой
        { ...mockIngredientSauce, id: 'sauceId' }, // Соус теперь вторым
        { ...mockIngredientMain, id: 'mainId' } // Основной ингредиент остаётся третьим
      ]
    };

    // Применяем действие changeIngredientLayer к текущему состоянию
    const newState = burgerConstructorSlice(
      stateWithIngredients,
      changeIngredientLayer({ fromIndex: 1, toIndex: 2 }) // Перемещение с 1 на 2
    );

    // Проверяем, что новое состояние соответствует ожидаемому
    expect(newState).toEqual(expectedResult);
  });
});

describe('removeIngredientFromOrder', () => {
  test('должен удалить ингредиент из заказа', () => {
    // Начальное состояние с двумя ингредиентами в заказе
    const stateWithIngredients = {
      ...initialState, // Исходное состояние
      ingredients: [
        { ...mockIngredientMain, id: '1' }, // Основной ингредиент с ID '1'
        { ...mockIngredientSauce, id: '2' } // Соус с ID '2'
      ]
    };

    // Ожидаемое состояние после удаления ингредиента с ID '1'
    const expectedResult = {
      ...initialState, // Исходное состояние
      ingredients: [{ ...mockIngredientSauce, id: '2' }] // Остался только соус с ID '2'
    };

    // Применяем действие removeIngredientFromOrder к текущему состоянию
    const newState = burgerConstructorSlice(
      stateWithIngredients,
      removeIngredientFromOrder('1')
    );

    // Проверяем, что новое состояние соответствует ожидаемому
    expect(newState).toEqual(expectedResult);
  });
});

describe('clearBurgerConstructor', () => {
  test('должен очистить конструктор бургера', () => {
    // Начальное состояние с ингредиентами
    const stateWithIngredients = {
      bun: { ...mockIngredientBun, id: 'bunId' }, // Булочка с заданным ID
      ingredients: [
        { ...mockIngredientMain, id: 'mainId' }, // Основной ингредиент с заданным ID
        { ...mockIngredientSauce, id: 'sauceId' } // Соус с заданным ID
      ]
    };

    // Ожидаемое состояние после очистки конструктора
    const expectedResult = {
      ...initialState, // Исходное состояние
      bun: null, // должена стать null
      ingredients: [] // Массив с ингредиентами ожидаем пустым
    };

    // Применяем clearBurgerConstructor к текущему состоянию
    const newState = burgerConstructorSlice(
      stateWithIngredients,
      clearBurgerConstructor()
    );

    // Проверяем, что новое состояние соответствует ожидаемому
    expect(newState).toEqual(expectedResult);
  });
});
