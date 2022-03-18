describe('Testando error-handler', () => {
  const errorHandler = require('./error-handler');
  const {
    NotAuthorizedError,
    AccessDeniedError,
    InternalError,
    InvalidParamsError,
    MediaTypeError,
    NotFoundError,
  } = require('../errors');

  test.each([
    [new NotAuthorizedError('Teste'), 401, {error: 'Teste'}],
    [new AccessDeniedError('Teste message'), 403, {error: 'Teste message'}],
    [new InternalError('Internal error!'), 500, {error: 'Internal error!'}],
    [new InvalidParamsError('Message'), 400, {error: 'Message'}],
    [new MediaTypeError('Something went wrong!'), 415, {error: 'Something went wrong!'}],
    [new NotFoundError("The resource couldn't be found"), 404, {error: "The resource couldn't be found"}],
  ])(
    'errorHandler(%p)',
    (err, statusEsperado, mensagemEsperada) => {
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
      errorHandler(err, null, res, null);
      expect(res.status).toBeCalledWith(statusEsperado);
      expect(res.json).toBeCalledWith(mensagemEsperada);
    }
  );
});
