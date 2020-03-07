const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const porta = 3001

const MongoClient = require('mongodb').MongoClient
//const uri = "mongodb+srv://<user>:<password>@cluster0-x8op1.mongodb.net/test?retryWrites=true&w=majority"
const uri = "mongodb+srv://denis:LXKBPJRHuEcIpL9r@cluster0-x8op1.mongodb.net/test?retryWrites=true&w=majority"

const ObjectId = require('mongodb').ObjectID

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.log(err)
    db = client.db('sample_analytics') // coloque o nome do seu DB

    app.listen(porta, () => {
        console.log(`Server running on port ${porta}` )
    })
})

app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    db.collection('customers').find().sort({ name : 1 }).toArray(function (err, results) {
        if(err) return console.log(err)
        res.render('index.ejs', { data: results })
    })
})

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
console.log(new Pessoa('Daniela Pinheiro', 'daniela12@hotmail.com'))
//console.log(`Aplicação rodando na porta ${porta}`);
