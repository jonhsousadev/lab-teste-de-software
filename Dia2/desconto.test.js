// desconto.test.js — Aula TDD: o TESTE vem primeiro
// Rode com: npx jest desconto

const { desconto } = require('./desconto');

describe('desconto — Aula TDD', () => {
  test('aplica 10% em 100 = 90', () => {
    expect(desconto(100, 10)).toBe(90);
  });

  test('0% mantém o preço: 200, 0 = 200', () => {
    expect(desconto(200, 0)).toBe(200);
  });

  test('100% zera o preço: 150, 100 = 0', () => {
    expect(desconto(150, 100)).toBe(0);
  });

  test('percentual acima de 100 lança erro', () => {
    expect(() => desconto(100, 150)).toThrow('Percentual inválido');
  });

  test('percentual negativo lança erro', () => {
    expect(() => desconto(100, -5)).toThrow('Percentual inválido');
  });

  test('preço negativo lança erro', () => {
    expect(() => desconto(-50, 10)).toThrow('Preço inválido');
  });
});
