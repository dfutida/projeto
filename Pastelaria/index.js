const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const porta = 3000
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const sharp = require('sharp')
const fs = require('fs')

const MongoClient = require('mongodb').MongoClient
const uri = "mongodb+srv://denis:LXKBPJRHuEcIpL9r@cluster0-x8op1.mongodb.net/test?retryWrites=true&w=majority"

const ObjectId = require('mongodb').ObjectID

MongoClient.connect(uri, {useUnifiedTopology: true}, (err, client) => {
    if (err) return console.log(err)
    db = client.db('crud_pastelaria') // coloque o nome do seu DB

    app.listen(porta, () => {
        console.log(`Server running on port ${porta}` )
    })
})

// EJS
app.set('view engine', 'ejs');

//setting middleware
app.use('/public', express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }))

//tornar publica o diretorio de imagens public/uploads
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index_client.ejs')
})

app.get('/', (req, res) => {
    var cursor = db.collection('cliente').find()
})

app.get('/cadPastel', (req, res) => {
    res.render('cadPastel.ejs')
})

app.get('/cadPastel', (req, res) => {
    var cursor = db.collection('pastel').find()
})


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('image');

// Check File Type
function checkFileType(file, cb){
// Allowed ext
const filetypes = /jpeg|jpg|png|gif/;
// Check ext
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// Check mime
const mimetype = filetypes.test(file.mimetype);

if(mimetype && extname) {
    return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}


/*
app.route('/edit_pastel/:id')
.get((req, res) => {
    var id = req.params.id
    db.collection('pastel').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit_pastel.ejs', { data: result })
    })
})

.post((req, res) => {

    upload(req, res, async err => {

        id = req.params.id,
        name = req.body.name,
        price = req.body.price
        //img = req.file.filename

        if(err){
            res.status(500).json({'success':false})
            return
        }
       
        //console.log('Imagem: ', img);
        //res.json({'success':true})

        db.collection('pastel').updateOne({_id: ObjectId(id)}, {
            $set: {
                name: name,
                price: price,
                //image: img
            }
        }, (err) => {
            if(err) return res.send(err)

            res.redirect('/show_all_pastel')
            console.log('Registro atualizado com sucesso')
            //res.render('/show_all_pastel', {
            //msg: 'File Uploaded!'
            //file: `uploads/${req.file.filename}`
            })
        })

    console.log(req.body, req.file)
})
*/

app.route('/delete_pastel/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('pastel').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log(`Pastel deletado do Banco de Dados! ${id}`)
    res.redirect('/show_all_pastel')
  })
})

app.get('/show_pastel', (req, res) => {
    db.collection('pastel').find().sort({ name : 1 }).toArray(function (err, results) {
        if(err) return console.log(err)
        res.render('show_pastel.ejs', { data: results })
    })
})

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
      if(err){
        res.render('show_pastel.ejs', {
          msg: err
        });
      } else {
        if(req.file == undefined){
          res.render('show_pastel.ejs', {
            msg: 'Error: No File Selected!'
          });
        } else {
                
            sharp(req.file.path).resize(100,100).toBuffer(function(err, buffer) {
                fs.writeFile(req.file.path, buffer, function(e) {
                });
            });
            
            var myobj = { 
                name: req.body.name,
                price: req.body.price,
                image: req.file.filename
            }

            db.collection('pastel').insertOne(myobj, (err, result) => {
                if (err) return console.log(err)            

            console.log('Pastel salvo no banco de dados')
            res.redirect('/show_all_pastel')                
                
            })
        }
      }
    })
  })

app.get('/show_all_pastel', (req, res) => {
    db.collection('pastel').find().sort({ name : 1 }).toArray(function (err, results) {
        if(err) return console.log(err)

        res.render('show_all_pastel.ejs', { data: results })
    })
})

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('cliente').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit_client.ejs', { data: result })
    })
})

.post((req, res) => {
    var id = req.params.id;
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone
    var birthdate = req.body.birthdate
    var adress = req.body.adress
    var additional = req.body.additional
    var district = req.body.district
    var zipcode = req.body.zipcode

    db.collection('cliente').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            email: email,
            phone: phone,
            birthdate: birthdate,
            adress: adress,
            additional: additional,
            district: district,
            zipcode: zipcode
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

  db.collection('cliente').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log(`Cliente deletado do Banco de Dados! ${id}`)
    res.redirect('/show')
  })
})

app.get('/show', (req, res) => {
    db.collection('cliente').find().sort({ name : 1 }).toArray(function (err, results) {
        if(err) return console.log(err)
        res.render('show_all.ejs', { data: results })
    })
})

app.get('/show_client', (req, res) => {
    db.collection('cliente').find().sort({ name : 1 }).toArray(function (err, results) {
        if(err) return console.log(err)
        res.render('show_all_client.ejs', { data: results })
    })
})

app.post('/show_client', (req, res) => {
    db.collection('cliente').insertOne(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Cliente salvo no banco de dados')
        res.redirect('/show')
    })
})

// cliente 234242 -> Nome, Email, etc
// pastel 3132321 -> Nome, Preço, Foto
// pastel 3242422 -> Nome, Preço, Foto
// pastel 3154654 -> Nome, Preço, Foto

// [selecione o cliente] -> 234242
// pastel de carne [2]
// pastel de queijo [1]
// pastel de palmito [0]

/*
{
    idCliente: 234242,
    pasteis: [{
        idPastel: 3132321,
        qtd: 2
    },{
        idPastel: 3242422,
        qtd: 1
    },{
        idPastel: 3154654,
        qtd: 0
    }]
}
*/

/*
    app.post('/pedido', function (req, res) {
        const obj = req.body;

        const cliente = db.collection('cliente').findOne({_id: obj.idCliente})

        obj.pasteis.forEach((pastel) => {
            for(var i = 0; i < pastel.qtd; i++){
                db.collection('pastel').findOne({_id: pastel.idPastel})
            }
        })

        db.collection('pedido').insertOne( , (err, result) => {
        if (err) return console.log(err)

        console.log('Cliente salvo no banco de dados')
        res.redirect('/show')
    })
    });
*/
