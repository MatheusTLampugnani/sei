function validarCPF(cpf) {
  if (typeof cpf !== 'string') return false;
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;

  const digitos = cpf.split('').map(el => +el);
  
  const resto = (offset) => digitos
    .slice(0, 9 + offset)
    .reduce((sum, el, index) => sum + el * (10 + offset - index), 0) % 11;

  const digitoVerificador1 = resto(0) < 2 ? 0 : 11 - resto(0);
  if (digitoVerificador1 !== digitos[9]) return false;
  
  const digitoVerificador2 = resto(1) < 2 ? 0 : 11 - resto(1);
  if (digitoVerificador2 !== digitos[10]) return false;

  return true;
}

module.exports = { validarCPF };