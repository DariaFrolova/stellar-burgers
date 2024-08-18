beforeEach(() => {
  // Загрузка фикстур для тестов
  cy.fixture('ingredients.json').as('ingredients');
  cy.fixture('feed.json').as('feed');
  cy.fixture('user.json').as('user');
  cy.fixture('orders.json').as('orders');

  // Перехваты запросов к API
  cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
    'fetchIngredients'
  );
  cy.intercept('POST', '/api/orders/all', { fixture: 'feed.json' }).as(
    'postFeed'
  );
  cy.intercept('GET', '/api/orders', { fixture: 'orders.json' }).as(
    'createOrder'
  );
  cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');

  // Установка токенов
  cy.setCookie('accessToken', 'mockAccessToken');
  localStorage.setItem('refreshToken', 'mockRefreshToken');

  // Переход на главную страницу и ожидание завершения запросов
  cy.visit('/');
  cy.wait(['@fetchIngredients', '@getUser']);

  // Проверка состояния модальных окон
  cy.get('#modals').should('be.empty');
});

// Сбрасываем LocalStorage и куки после каждого теста
afterEach(() => {
  cy.clearLocalStorage();
  cy.clearAllCookies();
  cy.log('Тест завершён');
});

describe('Тест конструктора бургера', () => {
  beforeEach(() => {
    cy.get('[data-cy=burger-constructor]').as('burgerConstructor');
    cy.contains('Биокотлета из марсианской Магнолии').parent().as('main');
    cy.contains('Соус Spicy-X').as('sauce');
  });

  it('Проверка добавления булочки', () => {
    const bunTopElement = 'Краторная булка N-200i (верх)';
    const bunBottomElement = 'Краторная булка N-200i (низ)';

    cy.get('@burgerConstructor').should('exist');
    cy.get('@burgerConstructor').should('not.contain', bunTopElement);
    cy.get('@burgerConstructor').should('not.contain', bunBottomElement);
    cy.get('@burgerConstructor')
      .contains('Краторная булка N-200i')
      .should('not.exist');

    cy.contains('Добавить').should('exist').click({ force: true });

    cy.get('[data-cy=bun-top]')
      .as('bunTop')
      .should('exist')
      .contains(bunTopElement);
    cy.get('[data-cy=bun-bottom]')
      .as('bunBottom')
      .should('exist')
      .contains(bunBottomElement);
  });
});

describe('Модалки', () => {
  const modalSelector = '[data-cy=modal]';
  const closeButtonSelector = '[data-cy=modal-close-button]';
  const overlaySelector = '[data-cy=modal-overlay]';

  beforeEach(() => {
    cy.get('ul').find('[href^="/ingredients"]').first().click({ force: true });
    cy.get(modalSelector)
      .as('modal')
      .children()
      .first()
      .should('be.visible', { force: true }); // из-за CSS-свойства position: fixed стандартный метод клика не сработает, и тест будет застревать. Поэтому имитируем реальное действие пользователя, позволяя кликнуть на элемент 
  });

  it('Проверка открытия модального окна', () => {
    cy.get('@modal').should('be.visible');
  });

  it('Проверка закрытия модального окна по крестику', () => {
    cy.get(closeButtonSelector).click();
    cy.get('@modal').should('not.exist');
  });

  it('Проверка закрытия модального окна при ESC', () => {
    cy.get('body').type('{esc}');
    cy.get('@modal').should('not.exist');
  });

  it('Проверка закрытия модального окна при клике по оверлею', () => {
    cy.get(overlaySelector).click({ force: true });
    cy.get('@modal').should('not.exist');
  });
});

describe('Оформление заказа', function () {
  beforeEach(function () {
    // Настройка заглушки для API вызова и начальные проверки
    cy.intercept('GET', '/api/orders', { fixture: 'orders.json' }).as(
      'createOrder'
    );
    cy.get('#modals').as('modals').should('be.empty');
    cy.get('p').contains('Антонио Бандерас').should('exist');
    cy.get('[data-cy=burger-constructor]').as('burgerConstructor');
    cy.contains('Биокотлета из марсианской Магнолии').parent().as('patty');
    cy.contains('Соус Spicy-X').as('sauce');
    cy.contains('Филе Люминесцентного тетраодонтимформа').as('fillet');
  });

  function addIngredient(container: string, ingredientSelector: string): void {
    cy.get(container).contains(ingredientSelector).should('not.exist');
    cy.contains(ingredientSelector)
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.get(container).contains(ingredientSelector).should('exist');
  }

  it('Проверка процесса добавления ингредиентов и оформление заказа', function () {
    const ingredients = [
      'Краторная булка N-200i',
      'Биокотлета из марсианской Магнолии',
      'Соус Spicy-X',
      'Филе Люминесцентного тетраодонтимформа'
    ];

    // Добавляем все необходимые ингредиенты
    ingredients.forEach((ingredient) => {
      addIngredient('@burgerConstructor', ingredient);
    });

    // Проверяем наличие элементов и оформление заказа
    cy.get('@burgerConstructor').contains('Выберите булки').should('not.exist');
    cy.get('@burgerConstructor')
      .contains('Выберите начинку')
      .should('not.exist');
    cy.get('button').contains('Оформить заказ').click();
    cy.wait('@createOrder');

    // Проверка модального окна с номером заказа
    cy.get('@modals').should('not.be.empty');
    cy.get('@modals').find('[data-cy="order-number"]').should('exist');

    // Закрытие модального окна и возврат в начальное состояние
    cy.get('@modals').find('[data-cy="modal-close-button"]').click();
    cy.get('@modals').should('be.empty');
    cy.get('div').contains('Выберите булки').should('exist');
    cy.get('div').contains('Выберите начинку').should('exist');
  });
});
