//console.log('hello node')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient
const uri = "mongodb://beleza:beleza1@ds113606.mlab.com:13606/qbeleza"

app.use(bodyParser.urlencoded({ extended : true }))

MongoClient.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('qbeleza')

    app.listen(3000, function() {
        console.log('server running on port 3000')
    })

})

app.set('view engine','ejs')

app.route('/') //setado a rota, e abaixo as ações a serem tomadas dentro desta rota
.get(function(req, res) {
  const cursor = db.collection('servicos').find()
  res.render('index.ejs')
})

.post((req, res) => {
  db.collection('servicos').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('Salvo no Banco de Dados')
    res.redirect('/show')
  })
})

app.route('/show')
.get((req, res) => {
  db.collection('servicos').find().toArray((err, results) => {
    if (err) return console.log(err)
    res.render('show.ejs', { servicos: results })
  })
})

app.route('/edit/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('servicos').find(ObjectId(id)).toArray((err, result) => {
    if (err) return res.send(err)
    res.render('edit.ejs', { servicos: result })
  })
})
.post((req, res) => {
  var id = req.params.id
  var nome = req.body.nome
  var descricao = req.body.descricao
  var preco = req.body.preco

  db.collection('servicos').updateOne({_id: ObjectId(id)}, {
    $set: {
      nome: nome,
      descricao: descricao,
      preco: preco
    }
  }, (err, result) => {
    if (err) return res.send(err)
    res.redirect('/show')
    console.log('Atualizado no Banco de Dados')
  })
})

app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id

  db.collection('servicos').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')
  })
})
