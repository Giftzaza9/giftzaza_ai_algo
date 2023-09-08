const { Product } = require('../src/models');
const fs = require("fs");
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost/giftzaza';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB.');
});

const filePath = '/Users/nachopiris/Developer/giftzaza/giftzaza-api/products.json';

async function main() {
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Analiza el contenido JSON en un objeto
    const products = JSON.parse(jsonData);

    // Recorrer el array de objetos
    for (const product of products) {
        const dbProduct = await new Product({ title: product.title, description: product.description, link: product.link, image: product.image, rating: product.review_score, price: product.price, categories: product.categories })
        await dbProduct.save()
    }
}

main()