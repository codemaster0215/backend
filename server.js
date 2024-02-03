const express = require('express')
const app = express()
const { MongoClient, ObjectId } = require('mongodb')
const methodOverride = require('method-override')

app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'))
app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))



let db
const url = 'mongodb+srv://02andrew15:assa7478@hyunie.wqengdm.mongodb.net/?retryWrites=true&w=majority'
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum')
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
})
}).catch((err)=>{
  console.log(err)
})


app.get('/', (요청, 응답) => {
  응답.sendFile(__dirname + '/index.html')
}) 

app.get('/about', (요청, 응답) => {
    응답.sendFile(__dirname + '/about.html')
  }) 


app.get('/news', (요청, 응답) => {
    db.collection('post').insertOne({title: '어쩌구'})
    // 응답.send('오늘비옴')
  })

app.get('/list', async (요청,응답) => {
    let result = await db.collection('post').find().toArray()
    응답.render('list.ejs', { 글제목 : result })
    
})

  app.get('/shop', (요청, 응답) => {
    응답.send('쇼핑페이지')
  }) 

  app.get('/time', async (요청,응답) => {
    응답.render('time.ejs', { 시간 : new Date() })
    new Date()
    // 응답.send('오늘비옴')
  })

  app.get('/write', (요청, 응답) => {
    응답.render('write.ejs')
  })

  app.post('/add', async(req,res) => {
    console.log(req.body)

    
    try {

      if (req.body.title == ''){
      } else if (req.body.content == ''){
        res.send('blank space cannot be entered ')
        
  
      } else {
        await db.collection('post').insertOne({title: req.body.title, content: req.body.content})
        res.redirect('/list')
      }
  
    } catch(e) {
      console.log(e)
      res.status(500).send('server error ')
    }

      
    });


    app.get('/detail/:id', async (req,res)=>{
      
    
          let result = await db.collection('post').findOne({ _id : new ObjectId(req.params.id) })
          res.render('detail.ejs',{result : result})
          
    })

    app.get('/edit/:id', async (req,res)=>{

      // db.collection('post').updateOne({Which_Doc}, {$set : {req.body}})

       let result =  await db.collection('post').findOne({ _id : new ObjectId (req.params.id) })
      console.log(result)
       res.render('edit.ejs', {result : result})
      
})

  app.put('/edit', async (req,res)=>{
    
    await db.collection('post').updateOne({ _id : 1 },
    {$inc : {like : 1 }})
  

    

  await db.collection('post').updateOne({ _id : new ObjectId (req.body.id) },
   {$set : {title: req.body.title , content : req.body.content }})

  console.log(req.body)
   res.redirect('/list')
  })


   app.delete('/delete', async(req, res)=>{
    console.log(req.query)
    // delete doc in db
    await db.collection('post').deleteOne({ _id : new
    ObjectId(req.query.docid)})
    res.send('deleted.')  
   })

    