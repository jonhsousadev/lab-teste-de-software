// desconto.js — Aula TDD: código gerado A PARTIR dos testes
// Versão final (GREEN + REFACTOR). Em sala, construímos passo a passo.

function desconto(preco, pct) {
  if (preco < 0) {
    throw new Error('Preço inválido');
  }
  if (pct < 0 || pct > 100) {
    throw new Error('Percentual inválido');
  }
  return preco - (preco * pct) / 100;
}

module.exports = { desconto };
