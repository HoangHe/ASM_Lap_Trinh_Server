var myMD = require('../modeljs/product.model');
var validation = require('../public/javascripts/validation');
var msg = '';

exports.list = async (req, res, next) => {

    let dieu_kien_loc = null;
    if (req.params.idCategory != '0') {
        if (typeof (req.params.idCategory) != 'undefined') {
            dieu_kien_loc = { id_category: req.params.idCategory }
            console.log("đã lọc: " + req.params.idCategory);
        }
    }
    let listProduct = await myMD.productModel.find(dieu_kien_loc).populate('id_category');
    let listCategory = await myMD.categoryModel.find();
    if (listProduct.length <= 0) {
        msg = 'Không Tìm Thấy Sản Phẩm'
    } else {
        msg = 'Có ' + listProduct.length + ' Sản Phẩm'
    }

    res.render('product/list', { msg: msg, listProduct: listProduct, listCategory: listCategory, idTheLoai: req.params.idCategory, title: "Sản Phẩm" })
}

exports.add = async (req, res, next) => {

    // Lấy Danh Sách Thể Loại truyền Ra View
    let listProduct = await myMD.productModel.find().populate('id_category');
    let listCategory = await myMD.categoryModel.find();

    if (req.method == 'POST') {
        // Viết Kiểm Tra Tính Hợp Lệ
        if (!validation.isNumber(req.body.price) || Number(req.body.price) < 0) {
            msg = 'Giá Tiền Không Hợp Lệ.'
            return res.render('product/list', { msg: msg, listProduct: listProduct, listCategory: listCategory, title: "Sản Phẩm" });
        }

        // Thực hiện ghi vào CSDL


        try {

            let objProduct = new myMD.productModel();
            objProduct.name = req.body.nameProduct;
            objProduct.price = req.body.price;
            objProduct.avata = req.file.path.split('\\').slice(1).join('\\');
            objProduct.description = req.body.description;
            objProduct.id_category = req.body.category;

            let new_SP = await objProduct.save();
            console.log(new_SP);
            res.redirect('/product');
            msg = 'Đã Thêm Thành Công';

        } catch (error) {
            msg = 'Lỗi Ghi CSDL: ' + error.message;
            console.log(error);
        }

    }
    res.render('product/list')
}


exports.editProduct = async (req, res, next) => {
    msg = '';

    let idProduct = req.params.idProduct;

    let objProduct = await myMD.productModel.findById(idProduct);

    // Lấy Danh Sách Thể Loại truyền Ra View
    let listCategory = await myMD.categoryModel.find();

    if (req.method == 'POST') {
        // Viết Kiểm Tra Tính Hợp Lệ

        //Tạo Đối tượng model để gán Dữ liệu post

        try {
            let objPd = new myMD.productModel();
            objPd.name = req.body.nameProduct;
            objPd.price = req.body.price;
            req.file ? objPd.avata = req.file.path.split('\\').slice(1).join('\\') :
                objPd.description = req.body.description;
            objPd.id_category = req.body.category;
            // Thực hiện ghi vào CSDL
            objPd._id = idProduct;

            await myMD.productModel.findByIdAndUpdate(idProduct, objPd);
            msg = 'Cập Nhật Thành Công'
        } catch (error) {
            msg = 'Lỗi Ghi CSDL: ' + error.message;
            console.log(error);
        }

    }
    res.render('product/edit', { msg: msg, objProduct: objProduct, listCategory: listCategory, title: "Chỉnh Sửa Sản Phẩm" })
}


exports.deleteProduct = async (req, res, next) => {
    try {
        let idProduct = req.params.idProduct;

        await myMD.productModel.findByIdAndDelete(idProduct);
        res.redirect('/product');
        msg = 'Xóa Thành Công'

    } catch (error) {
        msg = 'Lỗi Ghi CSDL: ' + error.message;
        console.log(error);
    }

    res.render('product/list')
}

exports.filterProduct = async (req, res, next) => {


    let msg = "";
    let title = "";

    if (req.body.filterCategory == "") {

    } else {
        let listCategory = await myMD.categoryModel.find();
        let list = await myMD.productModel.find({ id_group: req.body.filterCategory }).populate("id_category");
        let group = await myMD.productModel.findOne({ _id: req.body.filterCategory });

        if (list.length == 0) {
            msg = "Không có sản phẩm nào thuộc thể loại: ";
        } else {
            msg = "Có " + list.length + " sản phẩm thuộc thể loại: ";
        }

        res.render('products/product', { listProduct: list, listGroup: listGroup, title: title, msg: msg, req: req })
    }


    res.render('product/list', { msg: msg, listProduct: list, title: "Sản Phẩm" });
}

exports.category = async (req, res, next) => {

    let listCategory = await myMD.categoryModel.find();

    res.render('product/category', { msg: msg, listCategory: listCategory, title: "Thể Loại" })
}


exports.addCategory = async (req, res, next) => {
    let listCategory = await myMD.categoryModel.find();

    if (req.method == 'POST') {

        let objCategory = new myMD.categoryModel();
        objCategory.name = req.body.nameCategory;
        // Thực hiện ghi vào CSDL
        try {
            let new_SP = await objCategory.save();
            console.log(new_SP);
            await res.redirect('/product/category')
            msg = 'Đã Thêm Thành Công';
        } catch (error) {

            msg = 'Lỗi Ghi CSDL: ' + error.message;
            console.log(error);
        }

    }
    res.render('product/category', { msg: msg, listCategory: listCategory, title: "Thể Loại" })
}


exports.editCategory = async (req, res, next) => {


    let idCategory = req.params.idCategory;

    let listCategory = await myMD.categoryModel.findById(idCategory);

    if (req.method == 'POST') {
        let objCategory = new myMD.categoryModel();
        objCategory.name = req.body.nameCategory;

        // Thực hiện ghi vào CSDL
        objCategory._id = idCategory;

        try {
            await myMD.categoryModel.findByIdAndUpdate(idCategory, objCategory);
            msg = 'Cập Nhật Thành Công'
        } catch (error) {
            msg = 'Lỗi Ghi CSDL: ' + error.message;
            console.log(error);
        }

    }

    res.render('product/category', { msg: msg, listCategory: listCategory, title: "Thể Loại" })
}

exports.deleteCategory = async (req, res, next) => {

    let idCategory = req.params.idCategory;
    let listCategory = await myMD.categoryModel.find();

    try {
        await myMD.categoryModel.findByIdAndDelete(idCategory);
        await res.redirect('/product/category')
        msg = 'Xóa Thành Công'

    } catch (error) {
        msg = 'Lỗi Ghi CSDL: ' + error.message;
        console.log(error);
    }

    res.render('product/category', { msg: msg, listCategory: listCategory, title: "Thể Loại" })
}






