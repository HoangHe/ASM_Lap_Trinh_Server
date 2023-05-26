var myMD = require('../../modeljs/product.model');
const bcrypt = require('bcrypt');



exports.getProducts = async (req, res, next) => {
    let list = await myMD.productModel.find().populate("id_category");
    if (list) {
        let modifiedList = list.map(item => {
            return {
                _id: item._id,
                name: item.name,
                price: item.price,
                description: item.description,
                avata: item.avata,
                category: item.id_category.name // thông tin bạn cần lấy
            }
        });
        return res.status(200).json({ data: modifiedList, msg: 'Lấy dữ liệu thành công' });
    } else {
        return res.status(204).json({ msg: 'Không có dữ liệu' });
    }
};


exports.search = async (req, res, next) => {
    console.log(req.body);

    let regex = new RegExp(req.body.searchText, "i");
    let listProducts = await myMD.productModel.find({ name: regex }).populate("id_category");

    if (listProducts) {
        let modifiedList = listProducts.map(item => {
            return {
                _id: item._id,
                name: item.name,
                price: item.price,
                description: item.description,
                image: item.image,
                category: item.id_category.name // thông tin bạn cần lấy
            }
        });
        return res.status(201).json({ data: modifiedList, msg: 'Lấy dữ liệu thành công' });
    } else {
        return res.status(204).json({ msg: 'Không có dữ liệu' });
    }

}