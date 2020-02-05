const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const porta = 3000

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://denis:LXKBPJRHuEcIpL9r@cluster0-x8op1.mongodb.net/test?retryWrites=true&w=majority"

const ObjectId = require('mongodb').ObjectID
//const cliente = new MongoClient(uri, { useUnifiedTopology: true });

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.log(err)
    db = client.db('sample_crud') // coloque o nome do seu DB

    app.listen(porta, () => {
        console.log(`Server running on port ${porta}` )
    })
})


/*
app.listen(3000, function() {
    console.log('Servidor rodando na porta 3000')
})
*/
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('data').find()
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', { dados: result })
    })
})

.post((req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var surname = req.body.surname;

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if(err) return res.send(err)
        res.redirect('/show')
        console.log('Registro atualizado com sucesso')
    })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log(`Deletado do Banco de Dados! ${id}`)
    res.redirect('/show')
  })
})

app.get('/show', (req, res) => {
    db.collection('data').find().sort({ name : 1 }).toArray(function (err, results) {
        if(err) return console.log(err)
        res.render('show.ejs', { data: results })
    })
})

app.post('/show', (req, res) => {
    db.collection('data').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no banco de dados')
        res.redirect('/show')
    })
})


