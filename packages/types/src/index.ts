// Contrato API compartido entre web y api
// Agrega aquí los tipos que cruzan el límite front/back

export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};
