# SEI - Sistema Educacional Integrado

Bem-vindo ao **SEI**, um Sistema Educacional Integrado web full-stack que permite o gerenciamento completo de entidades acadêmicas como alunos, professores, disciplinas, locais e turmas. O projeto é totalmente containerizado com Docker, garantindo facilidade de configuração e consistência no ambiente de desenvolvimento.

---

## Funcionalidades

- **Dashboard**: Visão geral com estatísticas e calendário acadêmico.
- **Alunos**: Cadastro, edição, listagem e busca.
- **Professores**: Cadastro, edição, listagem e busca.
- **Disciplinas**: Gerenciamento completo.
- **Locais**: Cadastro de salas com controle de capacidade.
- **Turmas**: Criação com associação a disciplinas, professores e locais, com verificação de conflitos de horário.
- **Soft Delete**: Desativação e reativação de registros.
- **Matrículas**: Adição e remoção de alunos em turmas.

---

## Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

---

## Como Executar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/MatheusTLampugnani/sei
cd sei
```

### 2. Criar arquivo `.env` no backend

**Local:** `sei/backend/.env`

```env
DB_USER=user
DB_PASSWORD=password
DB_HOST=db
DB_PORT=port
DB_NAME=name
PORT=port
```

### 3. Subir os containers

```bash
docker-compose up --build
```

- Aguarde a inicialização completa.
- O backend exibirá "Tabelas verificadas/criadas com sucesso!" quando estiver pronto.

### 4. Acessar a aplicação

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend (API): [http://localhost:3001](http://localhost:3001)