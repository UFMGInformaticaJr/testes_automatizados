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

Em testes unitários, não podemos usar nada do express, pois ele é uma integração. O motivo de termos colocado express é para deixar o projeto mais próximo da realidade dos projetos da Ijunior, permitindo que este projeto seja, de fato, uma referência.

## Funcionalidades implementadas

Neste projeto, as funcionalidades foram implementadas com o intuito de mostrar diferentes casos de testes automatizados em cenários parecidos com projetos que a Ijunior desenvolve, para permitir que os leitores desse repositório possam relacionar o que é feito aqui, com seus projetos. Nós dividimos abaixo as features implementadas, bem como o porque elas foram adicionadas nesse repositório:

### Tratamento de erros nos endpoints

### Filtro de requisição

### Service com funções diversas

### UserService com funções de CRUD

## Testes unitários
