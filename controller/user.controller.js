var myMD = require('../modeljs/user.model');
var validation = require('../public/javascripts/validation');

var msg = '';

exports.list = async (req, res, next) => {
    msg = '';

    let listUser = await myMD.userModel.find();

    console.log(listUser);
    res.render('user/list', { msg: msg, listUser: listUser, title: "User" })
}


exports.register = async (req, res, next) => {

    msg = '';

    if (req.method == 'POST') {

        if (req.body.passWord != req.body.checkPassWord) {

            msg = 'Mật Khẩu Không Trùng Khớp'
            return res.render('user/register', { msg: msg });

        } else if (!validation.isText(req.body.userName)) {

            msg = 'Tên Đăng Nhập Không Được Chứa Các Kí Tự Đặc Biệt.'
            return res.render('user/register', { msg: msg });

        } else if (!validation.isText(req.body.passWord)) {

            msg = 'Mật Khẩu Không Được Chứa Các Kí Tự Đặc Biệt.'
            return res.render('user/register', { msg: msg });

        } else if (!validation.isleghtText(req.body.userName) || !validation.isleghtText(req.body.passWord)) {

            msg = 'Tên Đăng Nhập Hoặc Mật Khẩu Phải Lớn Hơn 5 Kí Tự.'
            return res.render('user/register', { msg: msg });
        } else if (!validation.isValidEmail(req.body.email)) {

            msg = 'Email Không Hợp Lệ.'
            return res.render('user/register', { msg: msg });
        }

        try {
            let objUser = await myMD.userModel.findOne({ userName: req.body.userName });
            console.log(objUser);
            if (objUser != null) {
                msg = 'Tài Khoản Đã Tồn Tại.'
               return  res.render('user/register', { msg: msg });
            } else {
                let objUser = await new myMD.userModel();
                objUser.userName = req.body.userName;
                objUser.email = req.body.email;
                objUser.passWord = req.body.passWord;
                objUser.role = String('User');

                // Thực hiện ghi vào CSDL

                let new_SP = await objUser.save();
                console.log(new_SP);
                msg = 'Đăng Kí Thành Công';

                // res.redirect('/user/login');
            }

        } catch (error) {
            msg = 'Lỗi Ghi CSDL: ' + error.message;
            console.log(error);
        }
    }
    res.render('user/register', { msg: msg });
}


exports.login = async (req, res, next) => {
    msg = '';

    if (req.method == 'POST') {

        if (!validation.isText(req.body.userName)) {

            msg = 'Tên Đăng Nhập Không Được Chứa Các Kí Tự Đặc Biệt.'
            return res.render('user/register', { msg: msg });

        } else if (!validation.isText(req.body.passWord)) {

            msg = 'Mật Khẩu Không Được Chứa Các Kí Tự Đặc Biệt.'
            return res.render('user/register', { msg: msg });

        }
        try {
            let objUser = await myMD.userModel.findOne({ userName: req.body.userName });
            console.log(objUser);
            if (objUser != null) { // có Tồn Tại User
                // Kiểm Tra pass
                if (objUser.passWord == req.body.passWord) {
                    // Đăng Nhập Thành Công
                    setTimeout(function () {

                    }, 2000);
                    // ghi Dữ liệu vào sesion
                    req.session.userLogin = objUser;
                    // Chuyển TRang
                    return res.redirect('/');

                } else {
                    msg = 'Sai Mật Khẩu';
                }
            } else {
                msg = "User Không Tồn Tại"
            }


        } catch (error) {
            msg = error.message;
        }

    }

    res.render('user/login', { msg: msg });
}


exports.editUser = async (req, res, next) => {
    msg = '';

    let idUser = req.params.idUser;

    let objUser = await myMD.userModel.findById(idUser);

    if (req.session.userLogin.role != 'Admin') {
        msg = 'Chỉ Admin Mới Có Thể Sửa.'
        return res.render('user/edit', { msg: msg, objUser: objUser, title: "Chỉnh Sửa User" })

    } else {
        if (idUser == '642859d76fc35f88967c6a96' && req.session.userLogin._id != '642859d76fc35f88967c6a96') {
            msg = 'Không Thể Chỉnh Sửa Tài Khoản Này.'
            return res.render('user/edit', { msg: msg, objUser: objUser, title: "Chỉnh Sửa User" })

        } else {

            if (req.method == 'POST') {
                // Viết Kiểm Tra Tính Hợp Lệ
                if (req.body.passWord == req.body.checkPassWord) {
                    //Tạo Đối tượng model để gán Dữ liệu post
                    let objUser = new myMD.userModel();
                    objUser.userName = req.body.userName;
                    objUser.email = req.body.email;
                    objUser.passWord = req.body.passWord;
                    objUser.role = req.body.role;

                    // Thực hiện ghi vào CSDL
                    objUser._id = idUser;

                    try {
                        await myMD.userModel.findByIdAndUpdate(idUser, objUser);
                        msg = 'Cập Nhật Thành Công'
                    } catch (error) {
                        msg = 'Lỗi Ghi CSDL: ' + error.message;
                        console.log(error);
                    }
                }

            }
        }

    }
    res.render('user/edit', { msg: msg, objUser: objUser, title: "Chỉnh Sửa User" })
}


exports.deleteUser = async (req, res, next) => {

    let idUser = req.params.idUser;
    let listUser = await myMD.userModel.find();

    if (req.session.userLogin.role != 'Admin') {
        msg = 'Chỉ Admin Mới Có Thể Xóa.'
        return res.render('user/list', { msg: msg, listUser: listUser, title: "User" })
    } else {
        // let listAdmin = await myMD.userModel.find({role : 'Admin'});
        if (idUser == '642859d76fc35f88967c6a96' && req.session.userLogin._id != '642859d76fc35f88967c6a96') {
            msg = 'Không Thể Xóa Tài Khoản Này.'
            return res.render('user/list', { msg: msg, listUser: listUser, title: "User" })
        }
        // else if(idUser == '642859d76fc35f88967c6a96' && req.session.userLogin._id == '642859d76fc35f88967c6a96' && listAdmin == 1 ){
        //     msg = 'Bạn Cần Có 1 Tài Khoản Admin Khác Thay Thế.'
        //     return res.render('user/list', { msg: msg, listUser: listUser, title: "User" })
        // }
        else {

            try {
                await myMD.userModel.findByIdAndDelete(idUser);
                
                msg = 'Xóa Thành Công'

            } catch (error) {
                msg = 'Lỗi Ghi CSDL: ' + error.message;
                console.log(error);
            }
        }
    }

    res.render('user/list', { msg: msg, listUser: listUser, title: "User" })
}
