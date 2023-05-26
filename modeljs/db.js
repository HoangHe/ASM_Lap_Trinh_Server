const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/QLSP_PH21007')
.catch((err) =>{
    console.log('Lỗi Kết Nối CSDL');
    console.log(err);
})

module.exports = {mongoose};