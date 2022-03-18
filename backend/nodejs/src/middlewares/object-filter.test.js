describe('Testando object-filter', () => {
  const {requestFilter} = require('./object-filter');
  
  test.each([
    [
      {body: {a: 1, b: 3, c: 3, d: 7}},
      'body',
      ['a', 'b', 'd'],
      {body: {a: 1, b: 3, d: 7}},
    ],
    [
      {body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1, b: 1}},
      'body',
      ['a', 'b', 'd'],
      {body: {a: 1, b: 3, d: 7}, query: {a: 1, b: 1}},
    ],
    [
      {body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1, b: 1}},
      'body',
      ['a', 'b', 'e'],
      {body: {a: 1, b: 3}, query: {a: 1, b: 1}},
    ],
    [
      {body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1, b: 1}},
      'query',
      ['a'],
      {body: {a: 1, b: 3, c: 3, d: 7}, query: {a: 1}},
    ],
    [
      {query: {a: 1, b: 1}},
      'query',
      ['a'],
      {query: {a: 1}},
    ],
  ])('reqFilter %#', (reqObj, reqKey, filter, valorEsperado) => {
    const mockedNext = jest.fn();

    const reqFilter = requestFilter(reqKey, filter);

    // O atributo res é nulo pois não importa para o objetivo deste teste
    reqFilter(reqObj, null, mockedNext);

    expect(mockedNext).toBeCalledWith();
    expect(reqObj).toEqual(valorEsperado);
  });
});
