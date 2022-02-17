describe('testing middlewares', () => {
  describe('testing object-filter', () => {
    const {requestFilter} = require('./object-filter');

    it('should return the filtered object', () => {
      const mockedNext = jest.fn();
      const req = {body: {a: 1, b: 5, c: 3, d: 7}};

      const reqFilter = requestFilter('body', ['a', 'b', 'd']);

      // O atributo res é nulo pois não importa para o objetivo deste teste
      reqFilter(req, null, mockedNext);

      expect(mockedNext).toBeCalledWith();
      expect(req).toEqual({body: {a: 1, b: 5, d: 7}});
    });
  });

  describe('testing error-handler', () => {
    const errorHandler = require('./error-handler');
    const {NotAuthorizedError} = require('../errors/index');

    it('should return the status 401', () => {
      /*
       mockReturnThis torna possível o encadeamento de chamadas usado em 
       res.status(s).json(j)
       */
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      /*
      Os atributos req e next são nulos pois não importa para o objetivo 
      deste teste
      */
      errorHandler(new NotAuthorizedError('Test'), null, res, null);
      expect(res.status).toBeCalledWith(401);
      expect(res.json).toBeCalledWith({error: 'Test'});
    });
  });
});
