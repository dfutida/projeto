const express = require('express')

const app = express()
const porta = 3000


app.get('/', function(req, res) {
    res.send("<a href='http://www.google.com'>Denis Futida</a>")
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