const express = require('express')
const app = express()
const porta = 3001

var produto = {
    nome: "Sapato",
    preco: 100.50
}

var formulaImpostoA = function (preco) {
    return preco*0.1
}

var calcularPreco = function (produto, formulaImposto) {
    return (produto.nome + ': ' + (produto.preco + formulaImposto(produto.preco)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
}

var Pessoa = function(nome, email) {
    this.nome = nome
    this.email = email
}

app.get('/', (req, res) => {
    res.json(calcularPreco(produto, formulaImpostoA))
})

console.log(new Pessoa('Denis Futida', 'd.futida@hotmail.com'))
console.log(new Pessoa('Daniela Alves Pinheiro', 'daniela12@hotmail.com'))
console.log(`Aplicação rodando na porta ${porta}`);

app.listen(porta)