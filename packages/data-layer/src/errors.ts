// Errores nombrados — prohibido el catch genérico. Cada falla tiene su clase.

export class DataLayerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotImplementedError extends DataLayerError {
  constructor(what = "operación") {
    super(`No implementado todavía: ${what}`);
  }
}

export class ValidationError extends DataLayerError {}
export class NotFoundError extends DataLayerError {}
export class UnauthorizedError extends DataLayerError {}
export class FileStorageError extends DataLayerError {}
