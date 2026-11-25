# Nexvion Tech — Sistema de E-commerce

## Sobre o projeto

A Nexvion Tech é uma loja virtual fictícia desenvolvida para a atividade N2–AT2 de Programação para Web. O sistema permite consultar produtos, pesquisar e filtrar o catálogo, adicionar itens ao carrinho, realizar compras simuladas e gerenciar produtos, pedidos e estoque.

A aplicação utiliza HTML, CSS e JavaScript no frontend, Node.js e Express no backend e MySQL para armazenar os dados. Não existe integração com meios reais de pagamento.

## Funcionalidades

- Catálogo público com produtos, categorias, preços e disponibilidade em estoque.
- Pesquisa por nome e filtro por categoria.
- Carrinho com inclusão, remoção e alteração de quantidades, subtotal, desconto e valor final.
- Cadastro e login de clientes, além de logout.
- Finalização de compras com registro do pedido no banco de dados.
- Histórico de pedidos para o cliente e consulta geral pelo administrador.
- Painel administrativo para cadastrar, editar e desativar produtos.
- Gerenciamento de estoque com entradas, saídas, ajustes e histórico de movimentações.
- Validações no frontend e no backend para proteger as operações.

## Tecnologias

- **Frontend:** HTML, CSS e JavaScript.
- **Backend:** Node.js e Express.
- **Banco de dados:** MySQL.
- **Bibliotecas principais:** `mysql2`, `bcryptjs`, `jsonwebtoken` e `dotenv`.

## Como executar no Windows

### 1. Pré-requisitos

Instale o Node.js 22 ou superior e o MySQL 8.0.16 ou superior. Deixe o serviço do MySQL iniciado.

### 2. Criar o banco de dados

Abra o MySQL Workbench, conecte-se ao seu servidor e execute o arquivo `database/schema.sql` completo. O script cria o banco `nexvion_tech_refatorado`, as tabelas necessárias e os oito produtos iniciais.

### 3. Configurar o backend

Abra o PowerShell na pasta principal do projeto e execute:

```powershell
cd backend
npm ci
Copy-Item .env.example .env
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

Abra o arquivo `backend/.env` e configure os dados de acesso ao seu MySQL (`DB_USER` e `DB_PASSWORD`). Copie a chave gerada pelo último comando para `JWT_SECRET`. Mantenha `DB_NAME=nexvion_tech_refatorado`, a menos que também altere o nome do banco no script SQL.

### 4. Iniciar a aplicação

Ainda na pasta `backend`, execute:

```powershell
npm start
```

Acesse a loja em [http://localhost:3001](http://localhost:3001). O próprio Express disponibiliza o frontend e a API. Mantenha o terminal aberto enquanto utilizar o sistema. Para encerrar, pressione `Ctrl+C`.

## Acessos para demonstração

- **Administrador:** `admin@nexvion.com`
- **Senha:** `admin123`
- **Cliente:** utilize a opção **Cadastrar** na loja para criar uma conta de cliente.

As credenciais são destinadas à demonstração local do projeto.

## Organização das pastas

```text
loja-tech/
├── backend/
│   ├── db/                 Conexão com o MySQL
│   ├── middleware/         Autenticação e controle de acesso
│   ├── routes/              Rotas de autenticação, produtos, pedidos e estoque
│   ├── server.js            Inicialização do servidor Express
│   ├── util.js              Validações e operações auxiliares
│   ├── package.json         Dependências e comandos
│   └── .env.example         Modelo de configuração
├── database/
│   └── schema.sql           Criação das tabelas e dados iniciais
└── frontend/
    ├── css/                 Estilos da aplicação
    ├── img/                 Imagens utilizadas na loja
    ├── js/                  Lógica do catálogo, carrinho e autenticação
    └── *.html               Páginas da loja e do painel administrativo
```

## Banco de dados

O banco possui as tabelas `usuarios`, `categorias`, `produtos`, `pedidos`, `itens_pedido` e `movimentacoes_estoque`. A tabela `sessoes` é utilizada pelo sistema para controlar as sessões de login.

Os pedidos ficam associados ao cliente que realizou a compra. Os itens armazenam o nome e o preço unitário utilizados no momento do pedido, preservando os dados da compra mesmo que o produto seja alterado depois.

## Regras importantes

- Visitantes podem consultar o catálogo e utilizar o carrinho; para concluir uma compra é necessário entrar em uma conta.
- O cadastro público cria somente usuários com perfil de cliente.
- O painel administrativo e as operações de estoque são restritos ao administrador.
- O backend consulta os preços e o estoque no banco antes de confirmar uma compra.
- O pedido, os itens, a baixa de estoque e o registro da movimentação são confirmados juntos. Se ocorrer um erro durante a operação, as alterações são desfeitas.
- As senhas são armazenadas com hash, e não em texto puro.
- A compra é simulada: o sistema registra o pedido, mas não processa pagamentos reais.

## Principais rotas da API

| Método | Rota | Finalidade |
|---|---|---|
| `POST` | `/api/auth/cadastro` | Cadastrar cliente |
| `POST` | `/api/auth/login` | Entrar no sistema |
| `POST` | `/api/auth/logout` | Encerrar sessão |
| `GET` | `/api/produtos` | Consultar produtos ativos |
| `GET` | `/api/produtos/categorias` | Consultar categorias |
| `POST` | `/api/produtos` | Cadastrar produto (administrador) |
| `PUT` | `/api/produtos/:id` | Editar produto (administrador) |
| `DELETE` | `/api/produtos/:id` | Desativar produto (administrador) |
| `POST` | `/api/pedidos` | Finalizar compra |
| `GET` | `/api/pedidos` | Consultar pedidos permitidos ao usuário |
| `GET` | `/api/estoque/historico` | Consultar movimentações (administrador) |
| `POST` | `/api/estoque/entrada` | Registrar entrada (administrador) |
| `POST` | `/api/estoque/saida` | Registrar saída (administrador) |
| `POST` | `/api/estoque/ajuste` | Ajustar saldo (administrador) |

## Roteiro básico de demonstração

1. Pesquise um produto e filtre o catálogo por categoria.
2. Adicione produtos ao carrinho e altere suas quantidades.
3. Tente finalizar a compra sem entrar no sistema.
4. Cadastre ou entre com uma conta de cliente e conclua a compra.
5. Consulte o pedido no histórico do cliente.
6. Entre como administrador, cadastre ou edite um produto.
7. Registre uma movimentação de estoque e consulte o histórico.

## Solução de problemas

- **Erro de acesso ao MySQL:** confira `DB_USER`, `DB_PASSWORD`, host e porta no arquivo `.env`.
- **Erro de conexão com o MySQL:** confirme se o serviço do banco está iniciado.
- **Banco ou tabelas inexistentes:** execute `database/schema.sql` no mesmo servidor configurado no `.env`.
- **Erro relacionado ao JWT:** confirme se `JWT_SECRET` contém uma chave aleatória com pelo menos 32 caracteres.
- **Porta 3001 ocupada:** encerre outro processo que esteja usando a porta ou altere `PORT` no `.env` e acesse o endereço correspondente.

## Repositório

O repositório deve conter o código-fonte, o arquivo `database/schema.sql` e o `.env.example`. Não publique o arquivo `.env`, senhas pessoais ou outras credenciais reais.
