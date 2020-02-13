const express = require('express')

const app = express()
const porta = 3000


app.get('/json', function(req, res) {
    return res.json({
        mensagem: "Olá Mundo!"
    })
})

app.get('/usuario', function(req, res) {
    return res.send("Essa é a rota do usuário!")
})

function teste() {
    console.log('Helo!!')
}

app.get('/', function(req, res, next) {
    console.log('the response will be sent by the next function ...')
    teste()
    next();
}, function (req, res) {
    res.send('Teste 2')
    console.log('Teste 2')
})

app.get('/json', function(req, res) {
    return res.json({
        mensagem: "Olá Mundo!"
    })
})

app.get('/usuario', function(req, res) {
    return res.send("Essa é a rota do usuário!")
})

console.log(`Aplicação rodando na porta ${porta}`);

app.listen(porta)