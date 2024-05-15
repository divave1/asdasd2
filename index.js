const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 3000;

// Conexión a la base de datos MongoDB
const uri = "mongodb+srv://torresyuliana382:ZFAsVwH2gAIEm1ic@cluster0.ndoznk5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

client.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log("Conexión establecida correctamente a la base de datos");
  db = client.db("correos");
});

// Middleware para habilitar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Ruta inicial "/"
app.get("/", (req, res) => {
  res.json({ message: '¡Bienvenido a la API de correos!' });
});

// Ruta para obtener todos los elementos de la colección
app.get("/tabla/:collection_name", async (req, res) => {
  const collectionName = req.params.collection_name;
  const collection = db.collection(collectionName);
  
  try {
    const documentos = await collection.find().toArray();
    const documentos_sin_id = documentos.map(doc => {
      delete doc._id;
      return doc;
    });
    res.json(documentos_sin_id);
  } catch (err) {
    console.error('Error al obtener documentos de la colección:', err);
    res.status(500).json({ message: 'Error al obtener documentos de la colección' });
  }
});

// Ruta para agregar un nuevo documento a la colección
app.put("/submit/:collection_name", bodyParser.json(), async (req, res) => {
  const collectionName = req.params.collection_name;
  const collection = db.collection(collectionName);
  const correo = req.body;

  try {
    await collection.insertOne(correo);
    res.json({ message: "Documento agregado correctamente" });
  } catch (err) {
    console.error('Error al agregar documento a la colección:', err);
    res.status(500).json({ message: 'Error al agregar documento a la colección' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
