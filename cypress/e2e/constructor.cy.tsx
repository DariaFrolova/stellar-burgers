beforeEach(() => {
    // Загружаем фикстуры
    cy.fixture('ingredients.json').as('ingredients');
    cy.fixture('feed.json').as('feed');
    cy.fixture('user.json').as('user');
  
    // Перехватываем API запросы и возвращаем фикстуры
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '/api/orders/all', { fixture: 'feed.json' }).as('postFeed');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
  
    // Устанавливаем токены для авторизации
    cy.setCookie('accessToken', 'mockAccessToken');
    localStorage.setItem('refreshToken', 'mockRefreshToken');
  
    // Переходим на главную страницу
    cy.visit('/');
  
    // Ожидаем загрузки данных перед продолжением
    cy.wait(['@getIngredients', '@getUser']);
  
    // Убеждаемся, что модальные окна пустые при загрузке
    cy.get('#modals').should('be.empty').as('modals');
  });
  
  // Очистка состояния после каждого теста
  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearAllCookies();
  });
  
  describe('Конструктор бургеров', function () {
    beforeEach(function () {
      cy.get('[data-cy=burger-constructor]').as('burgerConstructor');
      cy.contains('Биокотлета из марсианской Магнолии').parent().as('patty');
      cy.contains('Соус Spicy-X').as('sauce');
    });
  
    function checkExists(selector: string, shouldExist = true) {
      const assertion = shouldExist ? 'exist' : 'not.exist';
      return cy.get(selector).should(assertion);
    }
  
    it('проверка добавления булки', function () {
      checkExists('@burgerConstructor', true);
      
      cy.get('@burgerConstructor')
        .contains('Краторная булка N-200i').should('not.exist');
  
      cy.contains('Добавить').click();
      
      cy.get('[data-cy=bun-top]').as('bunTop');
      cy.get('[data-cy=bun-bottom]').as('bunBottom');
  
      checkExists('@bunTop', true)
        .contains('Краторная булка N-200i (верх)');
      checkExists('@bunBottom', true)
        .contains('Краторная булка N-200i (низ)');
    });
  
    it('проверка добавления начинки', function () {
      checkExists('@burgerConstructor', true);
      
      cy.get('@burgerConstructor')
        .contains('Биокотлета из марсианской Магнолии').should('not.exist');
  
      cy.get('@patty').find('button').contains('Добавить').click();
      
      checkExists('@burgerConstructor', true)
        .contains('Биокотлета из марсианской Магнолии');
    });
  
    it('проверка добавления соуса', function () {
      checkExists('@burgerConstructor', true);
      
      cy.get('@burgerConstructor')
        .contains('Соус Spicy-X').should('not.exist');
  
      cy.get('@sauce').parent().find('button').contains('Добавить').click();
      
      checkExists('@burgerConstructor', true)
        .contains('Соус Spicy-X');
    });
  });
  
  