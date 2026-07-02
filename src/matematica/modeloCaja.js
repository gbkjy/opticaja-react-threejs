export function obtenerVolumen(x, A, B) {
  if (x < 0 || x >= Math.min(A, B) / 2) return 0;
  return x * (A - 2 * x) * (B - 2 * x);
}

export function obtenerCorteOptimo(A, B) {
  const suma = A + B;
  const discriminante = A * A - A * B + B * B;
  return (suma - Math.sqrt(discriminante)) / 6;
}

export function obtenerVolumenMaximo(A, B) {
  const xOptimo = obtenerCorteOptimo(A, B);
  return obtenerVolumen(xOptimo, A, B);
}

export function obtenerPrimeraDerivada(x, A, B) {
  return A * B - 4 * (A + B) * x + 12 * x * x;
}

export function obtenerSegundaDerivada(x, A, B) {
  return 24 * x - 4 * (A + B);
}

export function limitarCorte(x, A, B) {
  const limiteMaximo = Math.min(A, B) / 2 - 0.5;
  if (x > limiteMaximo) return limiteMaximo;
  if (x < 0) return 0;
  return x;
}
