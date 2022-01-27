/**
 * Acessa o objeto dentro de request, passado pelo parâmtro,
 * e deleta todas as chaves que não estão presentes no array.
 *
 * @param {string} object Nome de um objeto contido no request, ex.: 'body'
 * @param {string[]} keys Nomes das chaves desejadas dentro do objeto passado
 * @return {null}
 */
function requestFilter(object, keys) {
  return function (req, res, next) {
    try {
      Object.keys(req[object]).forEach((key) => {
        if (keys.indexOf(key) === -1) {
          delete req[object][key];
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  requestFilter,
};
