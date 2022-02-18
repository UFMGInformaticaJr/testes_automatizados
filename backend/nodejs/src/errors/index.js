class NotAuthorizedError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'NotAuthorizedError';
  }
}

class InternalError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'InternalError';
  }
}

class AccessDeniedError extends Error {
  constructor(msg) {
    const message = msg || 'Você não tem permissão para realizar essa ação';
    super(message);
    this.name = 'AccessDeniedError';
  }
}

class InvalidParamsError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'InvalidParamsError';
  }
}

 class MediaTypeError extends Error {
  constructor(msg) {
    super(msg);
    this.name = 'MediaTypeError';
  }
}

class NotFoundError extends Error {
  constructor(msg) {
    const message = msg || 'Arquivo não encontrado';
    super(message);
    this.name = 'NotFoundError';
  }
}

module.exports = {
  AccessDeniedError,
  InternalError,
  InvalidParamsError,
  MediaTypeError,
  NotAuthorizedError,
  NotFoundError,
};
