const errorHandler = require('./error-handler');
const {
  NotAuthorizedError,
  AccessDeniedError,
  InternalError,
  InvalidParamsError,
  MediaTypeError,
  NotFoundError,
} = require('../errors');

describe('error-handler', () => {
  describe('erro é recebido ==> escreve um código e mensagem na resposta', () => {
    test.each([
      {
        erroLancado:new NotAuthorizedError('Teste'), 
        statusEsperado: 401, 
        mensagemEsperada:{error: 'Teste'}
      },
      {
        erroLancado:new AccessDeniedError('Teste message'), 
        statusEsperado: 403, 
        mensagemEsperada: {error: 'Teste message'}
      },
      {
        erroLancado:new InternalError('Internal error!'), 
        statusEsperado: 500, 
        mensagemEsperada: {error: 'Internal error!'}
      },
      {
        erroLancado:new InvalidParamsError('Message'),
        statusEsperado: 400, 
        mensagemEsperada: {error: 'Message'}
      },
      {
        erroLancado:new MediaTypeError('Something went wrong!'), 
        statusEsperado: 415, 
        mensagemEsperada: {error: 'Something went wrong!'}
      },
      {
        erroLancado:new NotFoundError("The resource couldn't be found"), 
        statusEsperado: 404, 
        mensagemEsperada: {error: "The resource couldn't be found"}
      },
    ])(
      '%j',
      ({erroLancado, statusEsperado, mensagemEsperada}) => {
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
        errorHandler(erroLancado, null, res, null);
        expect(res.status).toBeCalledWith(statusEsperado);
        expect(res.json).toBeCalledWith(mensagemEsperada);
      }
    );
  });
});
