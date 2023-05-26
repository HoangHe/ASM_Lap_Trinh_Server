var db = require('./db');

let productSchema = new db.mongoose.Schema(
    {   
        name: { type: String, require: true },
        avata: { type: String, require: true},
        description: { type: String, require: false },
        price: { type: Number, require: true },
        id_category: { type: db.mongoose.Schema.Types.ObjectId, ref : 'categoryModel'}
    },
    {
        collection: 'product'
    }
)

let categorySchema = new db.mongoose.Schema(
    {
        name: {type : String, require: true}
    },
    {
        collection: 'category'
    }
)



let categoryModel = db.mongoose.model('categoryModel', categorySchema);
let productModel = db.mongoose.model('productModel', productSchema);

module.exports = { productModel , categoryModel};