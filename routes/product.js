var express = require('express');
var router = express.Router();
var productCtrl = require('../controller/product.controller');
var check_login = require('../middlewares/check_login');
var multer = require('multer');
var uploader = multer({dest: './public/uploads'});


router.use(check_login.requires_Login);

router.get('/', productCtrl.list);

router.post('/add', uploader.single("avata"), productCtrl.add);

router.get('/edit/:idProduct',   productCtrl.editProduct);
router.post('/edit/:idProduct', uploader.single("editAvata"), productCtrl.editProduct);

router.get('/delete/:idProduct', productCtrl.deleteProduct);


router.get('/category', productCtrl.category);
router.post('/category/add', productCtrl.addCategory);

router.get('/editCategory/:idCategory', productCtrl.editCategory);
router.post('/editCategory/:idCategory', productCtrl.editCategory);

router.get('/deleteCategory/:idCategory', productCtrl.deleteCategory);

router.get('/filter/:idCategory', productCtrl.list);





module.exports = router;