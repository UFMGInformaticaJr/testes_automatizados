describe('error-handler', () => {
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
    {
      err:new NotAuthorizedError('Teste'), 
      statusEsperado: 401, 
      mensagemEsperada:{error: 'Teste'}
    },
    {
      err:new AccessDeniedError('Teste message'), 
      statusEsperado: 403, 
      mensagemEsperada: {error: 'Teste message'}
    },
    {
      err:new InternalError('Internal error!'), 
      statusEsperado: 500, 
      mensagemEsperada: {error: 'Internal error!'}
    },
    {
      err:new InvalidParamsError('Message'),
      statusEsperado: 400, 
      mensagemEsperada: {error: 'Message'}
    },
    {
      err:new MediaTypeError('Something went wrong!'), 
      statusEsperado: 415, 
      mensagemEsperada: {error: 'Something went wrong!'}
    },
    {
      err:new NotFoundError("The resource couldn't be found"), 
      statusEsperado: 404, 
      mensagemEsperada: {error: "The resource couldn't be found"}
    },
  ])(
    '%j',
    ({err, statusEsperado, mensagemEsperada}) => {
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
