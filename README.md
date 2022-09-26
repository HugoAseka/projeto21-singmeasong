# <p align = "center">  Projeto Sing Me a Song </p>



##  Descrição

Sing me a song é uma aplicação para recomendação de músicas com algoritmos baseados na pontuação de uma de determinada música, é possível inserir músicas novas, dar upvote ou downvote em músicas cadastradas, procurar por músicas específicas, por grupos ou as que estão mais em tendência.

***

##  Testes automatizados

- Testes de integração
- Testes unitários
- Testes ponta a ponta (E2E)

***

## Tecnologias

- Jest
- Prisma
- Express
- React

***

```
### Configurando o back-end

Pelo terminal, rode o comando: npm install

Então, configure seus arquivos .env e .env.test, de acordo com o .env.example

```
PORT= porta em que a aplicação irá rodar no servidor (sugestão: 5000)
DATABASE_URL= postgres://user:password@host:5432/database
```

Rode o comando para migrar o banco de dados:  npm run prisma

```

```

Finalizado o processo, para inicializar o servidor, rode: npm run dev
```

```

### Configurando o front-end

Pelo terminal, vá até o diretório front-end e rode o seguinte comando para instalar as dependências:

```
npm install
```

Então, configure seu arquivo .env, de acordo com o .env.example.

```
REACT_APP_API_BASE_URL=http://localhost:PORT
*PORT: mesma porta em que o back-end irá rodar
```

Finalizado o processo, para inicializar o servidor, rode:
```
npm start
```
***

## Rodando os testes

:stop_sign: Certifique-se de utilizar um arquivo .env.test e um banco de dados de testes para não comprometer o seu banco de dados original

### Testes de integração

Para rodar os testes de integração, abra o diretório de back-end no terminal e rode o seguinte comando:

```
npm run test:integration
```

### Testes unitários

Para rodar os testes unitários, abra o diretório de back-end no terminal e rode o seguinte comando:

```
npm run test:unit
```


