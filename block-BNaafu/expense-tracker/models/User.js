let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    age: { type: Number },
    phone: { type: Number },
    country: { type: String },
    password: { type: String },
    incomes: [{ type: mongoose.Types.ObjectId, ref: 'Income' }],
    expenses: [{ type: mongoose.Types.ObjectId, ref: 'Expense' }],
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  bcrypt.hash(this.password, 10, (err, hashed) => {
    if (err) return next(err);

    this.password = hashed;
    return next();
  });
});

userSchema.methods.checkPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

// userSchema.methods.getBal=function(){

// }

let User = mongoose.model('User', userSchema);

module.exports = User;
