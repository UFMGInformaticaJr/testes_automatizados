describe('object-filter', () => {
  const {requestFilter} = require('./object-filter');
  
  describe('object-filter recebe o body de uma requisição ==> body é filtrado', () => {
    test.each([
      {
        reqObj:{body: {a: 1, b: 3, c: 3, d: 7}},
        reqKey: 'body',
        filter: ['a', 'b', 'd'],
        valorEsperado: {body: {a: 1, b: 3, d: 7}},
      },
      {
        reqObj:{body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1, b: 1}},
        reqKey: 'body',
        filter: ['a', 'b', 'd'],
        valorEsperado: {body: {a: 1, b: 3, d: 7}, query: {a: 1, b: 1}},
      },
      {
        reqObj:{body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1, b: 1}},
        reqKey: 'body',
        filter: ['a', 'b', 'e'],
        valorEsperado: {body: {a: 1, b: 3}, query: {a: 1, b: 1}},
      },
      {
        reqObj:{body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1, b: 1}},
        reqKey: 'query',
        filter: ['a'],
        valorEsperado: {body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1}},
      },
      {
        reqObj:{query: {a: 1, b: 1}},
        reqKey: 'query',
        filter: ['a'],
        valorEsperado: {query: {a: 1}},
      },
    ])('%j', ({reqObj, reqKey, filter, valorEsperado}) => {
      const mockedNext = jest.fn();
      const reqFilter = requestFilter(reqKey, filter);
  
      // O atributo res é nulo pois não importa para o objetivo deste teste
      reqFilter(reqObj, null, mockedNext);
  
      expect(mockedNext).toBeCalledWith();
      expect(reqObj).toEqual(valorEsperado);
    });
  });
});
