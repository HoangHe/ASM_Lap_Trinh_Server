var express = require('express');
var router = express.Router();
var userCtrl = require('../controller/user.controller');
var check_login = require('../middlewares/check_login');

// Viết middleware Chung Cho Tất Cả các route trong file này ở 
router.use((req, res, next) => {
    console.log("--DÒng Này Là Middleware----");
    next();
});

router.get('/', check_login.requires_Login, userCtrl.list);

router.get('/edit/:idUser',check_login.requires_Login, userCtrl.editUser);
router.post('/edit/:idUser',check_login.requires_Login, userCtrl.editUser);

router.get('/delete/:idUser',check_login.requires_Login, userCtrl.deleteUser);


router.get('/register', userCtrl.register);
router.post('/register', userCtrl.register);


router.get('/login', userCtrl.login);
router.post('/login', userCtrl.login);



module.exports = router;
