const { Product } = require('../src/models');
const {connectDB, disconnectDB} = require('./settings');
const scrapeProduct = require('../src/lib/scrapeProduct');

async function main() {
    await connectDB();
    const products = await Product.find();
    products.forEach(async (product) =>{
        console.log(product.title)
        const product_data = await scrapeProduct(product.link)
        if (!product_data || !product_data.description || !product_data.price) {
            await product.remove();
            next();
        }
        product_data.tags = await classificateProduct(product_data.description)
        product.title = product_data.title,
        product.description =   product_data.description,
        product.link = product_data.link,
        product.image=  product_data.image,
        product.price=  product_data.price,
        product.rating=  product_data.rating,
        product.tags=  product_data.tags
        await product.save()
    });

    console.log('Products updated')
    disconnectDB();
}

main()