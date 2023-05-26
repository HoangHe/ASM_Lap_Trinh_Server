var myMD = require('../../modeljs/user.model');
const bcrypt = require('bcrypt');

exports.listUser = async (req, res, next) => {

    try {
        let list = await myMD.userModel.find();
        if (list) {
            return res.status(200).json({ data: list, msg: 'Lấy dữ liệu thành công' });
        } else {
            return res.status(204).json({ msg: 'Không có dữ liệu' });
        }

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }

}


exports.login = async (req, res, next) => {

    console.log(req.body);

    try {
        const user = await myMD.userModel.findOne({ userName : req.body.userName });
        console.log(user);
        if (!user) {
            console.log("Không tồn tại tài khoản");
            return res.status(500).json({ msg: "sai thông tin đăng nhập" });
        } else {
            const isPasswordMatch = bcrypt.compare(req.body.passWord, user.passWord);
            if (!isPasswordMatch) {
                console.log("Sai mật khẩu");
                return res.status(500).json({ msg: "Sai mật khẩu" })
            } else {
                console.log('Đăng nhập thành công');
                return res.status(201).json({ msg: "Đăng nhập thành công" })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sai tài khoản hoặc mật khẩu" })
    }

}


exports.reg = async (req, res, next) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const user = new myMD.userModel(req.body);

        user.passWord = await bcrypt.hash(req.body.passWord, salt);


        let new_u = await user.save()


        return res.status(201).json({ user: new_u })

    } catch (error) {

        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


exports.profile = (req, res, next) => {

    res.json({ status: 1, msg: 'Trang thông tin' });
}


exports.logout = async (req, res, next) => {

    res.json({ status: 1, msg: 'Trang đăng xuất' });
}



