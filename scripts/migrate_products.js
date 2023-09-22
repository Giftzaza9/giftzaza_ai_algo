const { Product } = require('../src/models');
const fs = require("fs");
const {connectDB, disconnectDB} = require('./settings');

connectDB();

const filePath = '/home/ubuntu/giftzaza_ai_algo/scripts/products.json';

async function main() {
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Analiza el contenido JSON en un objeto
    const products = JSON.parse(jsonData);

    // Recorrer el array de objetos
    for (const product of products) {
        console.log(product.title)
        const dbProduct = await new Product({ title: product.title, description: product.description, link: product.link, image: product.image, rating: product.review_score, price: product.price, tags: product.categories })
        await dbProduct.save()
    }
    console.log('Products saved on MongoDB.')
    disconnectDB();
}

main()
