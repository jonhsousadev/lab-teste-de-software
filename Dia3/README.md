# Dia 3 — Playwright (E2E) na cafeteria Código & Café

Projeto de exemplo com um teste E2E em uma página de pedidos (`loja.html`) com inputs de texto, select, número, rádio e checkbox.

O Playwright pode ser executado de duas formas, **sem instalar nada no sistema**:

- **Opção A:** no GitHub Codespaces (nada é instalado na sua máquina).
- **Opção B:** localmente, mas com tudo dentro da pasta do projeto.

---

## Opção A — GitHub Codespaces (recomendado)

O Codespaces é um ambiente de desenvolvimento na nuvem, com VS Code no navegador, Node.js já instalado e Linux. Só é preciso ter uma conta no GitHub.

### 1. Abrir o Codespace

1. Abra o repositório `lab-teste-de-software` no GitHub.
2. Clique em **Code** > aba **Codespaces** > **Create codespace on main**.
3. Aguarde o VS Code abrir no navegador.

### 2. Entrar na pasta do projeto

No terminal do Codespaces (menu **Terminal > New Terminal**):

```bash
cd Dia3
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Instalar o navegador

No Linux do Codespaces, o navegador precisa de algumas bibliotecas do sistema. O parâmetro `--with-deps` instala tudo (a máquina é descartável, então não há problema):

```bash
npx playwright install --with-deps chromium
```

### 5. Executar os testes

```bash
npx playwright test
```

O Codespaces não tem tela, então os testes rodam em modo **headless** (sem janela). Resultado esperado: `7 passed`.

### 6. Ver o relatório HTML

```bash
npx playwright show-report --host 0.0.0.0
```

O Codespaces mostra uma notificação para abrir a porta (normalmente `9323`). Clique em **Open in Browser**. Também é possível abrir a aba **Ports** e clicar no link da porta. Para encerrar, use `Ctrl + C`.

### 7. (Opcional) Modo UI no Codespaces

```bash
npx playwright test --ui-host=0.0.0.0 --ui-port=8080
```

Abra a porta `8080` pela aba **Ports**. O modo UI mostra cada passo do teste, com a página antes e depois de cada ação.

### 8. Ver a página da loja

Para ver o resultado visual da `loja.html`, use a extensão **Live Server** ou rode:

```bash
npx --yes serve .
```

e abra a porta indicada pela aba **Ports**, acessando `/loja.html`.

### 9. Ao terminar

Pare o Codespace em **github.com/codespaces** (`...` > **Stop codespace**) para não consumir horas gratuitas. Se quiser, apague-o por lá.

---

## Opção B — Local, sem instalação global

### Pré-requisito

- Node.js 18 ou superior (`node -v`).

### 1. Instalar as dependências (só dentro da pasta)

```powershell
cd Dia3
npm install
```

O Playwright fica em `Dia3/node_modules/`. Use sempre `npx` ou `npm run`, que usam a versão local.

### 2. Instalar o navegador dentro do projeto

Por padrão, o Playwright baixa os navegadores para uma pasta global do usuário. O script `setup` define `PLAYWRIGHT_BROWSERS_PATH=0`, que mantém o Chromium dentro de `node_modules`:

```powershell
npm run setup
```

### 3. Executar

```powershell
npm test                # headless
npm run test:headed     # abre o navegador visível
```

Relatório:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "0"
npx playwright show-report
```

> Se aparecer erro de navegador não encontrado, o comando foi executado sem `PLAYWRIGHT_BROWSERS_PATH=0`. Use os scripts do `package.json`, que já o configuram.

### Limpeza

Apague a pasta `node_modules`: ela contém o Playwright e o navegador.

---

## Estrutura do projeto

```
Dia3/
├── loja.html               # página da cafeteria (aplicação testada)
├── playwright.config.js    # configuração do Playwright
├── package.json
└── tests/
    └── pedido.spec.js      # testes E2E
```

## O que a loja permite

| Elemento | Tipo | Regra |
| --- | --- | --- |
| Nome do cliente | texto | obrigatório para finalizar |
| Tipo de café | select | R$ 20,00, R$ 25,00 ou R$ 30,00 |
| Quantidade | número | de 1 a 10 |
| Cupom de desconto | texto + botão | `CAFE10` dá 10% de desconto |
| Forma de pagamento | rádio | Pix ou Cartão |
| Embalar para viagem | checkbox | aparece na confirmação |

## Como o Playwright interage com cada input

| Elemento | Ação no teste |
| --- | --- |
| Texto, número | `getByLabel('Nome do cliente').fill('Maria')` |
| Select | `getByLabel('Tipo de café').selectOption({ label: '...' })` |
| Rádio, checkbox | `getByLabel('Cartão').check()` |
| Botão | `getByRole('button', { name: 'Aplicar cupom' }).click()` |
| Verificação | `expect(locator).toHaveText(...)`, `toBeVisible()`, `toHaveValue(...)` |

## Atividades em sala

1. Rodar os testes e abrir o relatório HTML.
2. Quebrar um teste de propósito (por exemplo, esperar `R$ 50,00`) e ler a mensagem de falha e o screenshot no relatório.
3. Criar um teste: 3 Lattes com `CAFE10` devem resultar em `R$ 81,00`.
4. Criar um teste: quantidade `0` deve mostrar `A quantidade deve ser de 1 a 10`.
5. Adicionar um novo cupom em `loja.html` (por exemplo, `DEV20`, com 20%) e testá-lo.
6. Relacionar os conceitos da pesquisa com o código: `test`, `page`, locator e `expect`.
