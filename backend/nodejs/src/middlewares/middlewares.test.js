const express = require('express');
const request = require('supertest');

describe('testing middlewares', () => {
  let app;
  // Antes de cada teste a variável app é reinicializada
  beforeEach(() => {
    app = express();
    app.use(express.json());
    return app;
  });

  describe('testing object-filter', () => {
    const {requestFilter} = require('./object-filter');
    it('should return the filtered object (using supertest)', async () => {
      app.get('/', requestFilter('body', ['a', 'b', 'd']), (req, res) => {
        res.json(req.body);
      });

      const {body, status} = await request(app)
        .get('/')
        .set('Content-Type', 'application/json')
        .send('{"a":1,"b":5,"c":3,"d":7}');

      // Tranforma ambos em string pra facilitar a comparação
      expect(JSON.stringify(body)).toEqual(JSON.stringify({a: 1, b: 5, d: 7}));

      expect(status).toEqual(200);
    });

    it('should return the filtered object', () => {
      const mockedNext = jest.fn();
      const obj = {body: {a: 1, b: 5, c: 3, d: 7}};

      const reqFilter = requestFilter('body', ['a', 'b', 'd']);

      // O atributo res é nulo pois não importa para o objetivo deste teste
      reqFilter(obj, null, mockedNext);

      expect(mockedNext).toBeCalledWith();
      expect(obj).toEqual({body: {a: 1, b: 5, d: 7}});
    });
  });

  describe('testing error-handler', () => {
    const errorHandler = require('./error-handler');
    const {NotAuthorizedError} = require('../errors/index');

    it('should return the status 401 (using supertest)', async () => {
      app.get(
        '/',
        (req, res, next) => {
          next(new NotAuthorizedError('Teste'));
        },
        errorHandler
      );

      const {body, status} = await request(app)
        .get('/')
        .set('Content-Type', 'application/json')
        .send();

      expect(JSON.stringify(body)).toEqual(JSON.stringify({error: 'Teste'}));

      expect(status).toEqual(401);
    });

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
