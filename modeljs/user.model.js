var db = require('./db');

const userSchema = new db.mongoose.Schema(
    {   
        userName: { type: String, require: true },
        email: { type: String, require: true},
        passWord: { type: String, require: true},
        role: { type: String, require: false }
    },
    {
        collection: 'user'
    }
)


let userModel = db.mongoose.model('userModel', userSchema);
module.exports = { userModel };