# Todo React

Repositório principal para o projeto **Todo React**, contendo o front-end em React com Vite e, futuramente, o back-end separado.

## Estrutura do projeto

todo-react/
├── client/ # Front-end em React + Vite
├── server/ # (Futuro) Back-end
└── README.md # Este arquivo


## Front-end (client)

O front-end está dentro da pasta `client/`:

- Criado com **Vite** + **React**.
- Estilização com **Tailwind CSS**.
- Estrutura de pastas principais:
  - `src/components/` → Componentes React
  - `src/data/` → Dados e mocks
  - `src/assets/` → Imagens e ícones
  - `src/App.jsx`, `main.jsx` → Entrypoints da aplicação

### Rodando localmente

1. Entre na pasta `client`:
```bash
cd client

    Instale dependências:

npm install
# ou yarn

    Inicie o servidor de desenvolvimento:

npm run dev
# ou yarn dev

    Abra o navegador em http://localhost:5173

    (porta padrão do Vite).

Back-end (server)

Será criado futuramente em pasta separada (server/).
A ideia é ter deploy e versionamento separados do front-end.