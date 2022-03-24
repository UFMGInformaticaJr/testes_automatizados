# Testes automatizados em NodeJS

<!-- omit in toc -->
## Sumário

- [Introdução](#introdução)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Dependências do projeto](#dependências-do-projeto)
- [Decisões de projeto](#decisões-de-projeto)
  - [Models](#models)
  - [Uso do Express](#uso-do-express)
- [Funcionalidades implementadas](#funcionalidades-implementadas)
  - [Tratamento de erros nos endpoints](#tratamento-de-erros-nos-endpoints)
  - [Filtro de requisição](#filtro-de-requisição)
  - [Service com funções diversas](#service-com-funções-diversas)
  - [SenhaService](#senhaservice)
  - [UserService com funções de CRUD](#userservice-com-funções-de-crud)
- [Testes unitários](#testes-unitários)

## Introdução

Este é um projeto em NodeJS, usando o framework express, criado com o objetivo de mostrar como fazer testes automatizados usando o framework de testes Jest, servindo de referência para aqueles que buscam aprender ou relembrar como fazer testes automatizados.

O tema do projeto é usuário e as funcionalidades serão detalhadas em um tópico abaixo.

Atualmente, estamos abordando apenas testes unitários, e não testes de integração ou de sistema. (para mais informações sobre teste acesse [este](https://engsoftmoderna.info/cap8.html) link)

## Como rodar o projeto

## Dependências do projeto

## Decisões de projeto

### Models

Como não estão sendo abordados testes de integração, não utilizamos o sequelize para criar models. Para os models, criamos uma réplica de um suposto model de `User`, com todos os métodos comuns que um model real em sequelize teria, para que pudessemos usar para demonstrar mock em testes unitários.

### Uso do Express

Em testes unitários, não podemos usar nada do express, pois ele é uma integração. O motivo de termos colocado express é para deixar o projeto mais próximo da realidade dos projetos da Ijunior, permitindo que este projeto seja, de fato, uma referência para os desenvolvedores.

## Funcionalidades implementadas

Neste projeto, as funcionalidades foram implementadas com o intuito de mostrar diferentes casos de testes automatizados em cenários parecidos com projetos que a Ijunior desenvolve, para permitir que os leitores desse repositório possam relacionar o que é feito aqui, com seus projetos. Nós dividimos abaixo as features implementadas:

### Tratamento de erros nos endpoints

Esta feature, no arquivo `error-handler.js` localizado [aqui](/backend/nodejs/src/middlewares/error-handler.js), trata as possíveis exceções e erros que podem acontecer nos endpoints da aplicação. Por exemplo, se uma exceção é lançada mas não é tratada em nenhum local do sistema, o error-handler será acionado.

**Objetivo relacionado aos testes**: Ser um exemplo de funcionalidade integrada ao express (ou seja, que é usada apenas com o express), que tem teste unitário. Isto é muito importante, pois os desenvolvedores vão achar que estes tipos de códigos não tem teste unitário e vão querer fazer testes de integração.  

### Filtro de requisição

Esta feature, no arquivo `object-filter.js` localizado [aqui](/backend/nodejs/src/middlewares/object-filter.js), é usado para filtrar quais campos serão recebidos em uma requisição à nossa aplicação.

**Exemplo**:

Se o frontend envia uma requisição deste formato:
```json
{
  id: 1,
  name: "abara",
  idade: 50
}
```

E o `object-filter.js` especifica apenas os campos id e nome, então o que vai ser recebido no endpoint da nossa aplicação é apenas:
```json
{
  id: 1,
  name: "abara"
}
```

**Objetivo relacionado aos testes**: Ser também um exemplo de funcionalidade integrada ao express (ou seja, que é usada apenas com o express) que tem teste unitário. Isto cai no caso onde os desenvolvedores vão ter dificuldades de fazer testes unitários.

### Service com funções diversas

### SenhaService

### UserService com funções de CRUD

Esta feature, no arquivo `UserService.js` localizado [aqui](/backend/nodejs/src/services/UserService.js), usa o models `User` para exemplificar um CRUD de usuários, com operações de criação, edição, deleção e busca de um usuário.

**Objetivo relacionado aos testes**: Ser um exemplo de testes unitários em um CRUD, parte comum em todos os projetos loops da Ijunior.
## Testes unitários
