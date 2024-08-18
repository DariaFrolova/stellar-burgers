import store, { rootReducer } from './store';

describe('Тестирование корневого редьюсера (rootReducer)', () => {
  test('Проверка, что rootReducer возвращает начальное состояние для неизвестных действий', () => {
    // Инициализируем состояние с помощью rootReducer, передавая undefined и UNKNOWN_ACTION
    const defaultState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    // Получаем текущее состояние из хранилища
    const currentStoreState = store.getState();
    
    // Сравниваем полученное начальное состояние с состоянием из хранилища
    expect(defaultState).toEqual(currentStoreState);
  });
});
