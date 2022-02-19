# Testes automatizados em NodeJS

## Introdução

Este é um projeto em NodeJS, usando o framework express, criado com o objetivo de mostrar como fazer testes automatizados usando o framework de testes Jest, servindo de referência para aqueles que buscam aprender ou relembrar como fazer testes automatizados.

O tema do projeto é usuário e as funcionalidades serão detalhadas em um tópico abaixo.

O intuito deste projeto, atualmente, é abordar apenas testes unitários, e não testes de integração ou de sistema. (para mais informações sobre teste acesse [este](https://engsoftmoderna.info/cap8.html) link)

## Decisões de projeto

Como não estão sendo abordados testes de integração, não utilizamos o sequelize para criar models. No lugar do sequelize, criamos uma réplica de um suposto model de `User`, com todos os métodos comuns que um model real teria, para que pudessemos usar para demonstrar mock em testes unitários.

Em testes unitários, não podemos usar nada do express, pois ele é uma integração. O motivo de termos colocado express é para deixar o projeto mais próximo da realidade dos projetos da Ijunior, permitindo que este projeto seja, de fato, uma referência.

## Funcionalidades implementadas

## Testes unitários
