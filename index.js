const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// BrandShop
// TNd1cvCqondVhQ67


const uri = "mongodb+srv://BrandShop:TNd1cvCqondVhQ67@cluster0.suyjuyq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // const productCollection = client.db('productDb').collection('product');
    const productCollection = client.db('productDB').collection('product');
    const itemCollection = client.db('productDB').collection('brand');
    const userCartCollection = client.db('productDB').collection('cart');

    app.get('/brand', async(req, res)=> {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/product/:category', async(req, res) => {
      const category = req.params.category;
      const query = {category: category};
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/details/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
    })
    
    app.get('/cardUpdate/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)};
      const result = await productCollection.findOne(query);
      res.send(result);
    })

    
    app.post('/product', async(req, res) => {
        const newProduct = req.body;
        const result = await productCollection.insertOne(newProduct);
        res.send(result)
    });
    app.post('/addToCart', async(req, res)=>{
      const addToCart = req.body;
      const result = await userCartCollection.insertOne(addToCart);
      res.send(result);
    })

    app.put('/cardUpdate/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateProduct = req.body;
      const product = {
        $set: {
          photo: updateProduct.photo,
          description: updateProduct.description,
          name: updateProduct.name,
          price: updateProduct.price,
          rating: updateProduct.rating,
          category: updateProduct.category,
        }
      }
      const result = await productCollection.updateOne(filter, product, options);
      res.send(result)
    })

    app.delete('/item/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCartCollection.deleteOne(query);
      res.send(result);
    })

    app.get('/user/:email', async(req, res) => {
      const email = req.params.email;
      const query = {userEmail: email};
      const cursor = userCartCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/myCart', async(req, res) =>{
      const user = req.body;
      const result = await userCartCollection.insertOne(user);
      res.send(result);
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('BrandSHop is running')
});
app.listen(port, () => {
    console.log(`brand server is running ${port}`)
})