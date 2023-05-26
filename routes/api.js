var express = require('express');
var router = express.Router();
var user_api = require('../controller/api/user.api');
var product_api = require('../controller/api/product.api');


router.get('/user', user_api.listUser); // ds u:  /api/users


router.post('/user/login', user_api.login); // đăng nhập

router.post('/user/reg', user_api.reg); // đăng ký

router.get('/user/profile', user_api.profile); // lấy thông tin user

router.get('/user/logout', user_api.logout); // đăng xuất


router.get('/product', product_api.getProducts);

router.get('/product/search', product_api.search); 


module.exports = router;
