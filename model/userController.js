/**
 * Created by Home Laptop on 06-Nov-17.
 */
const userModel = require('./user');

userModel.createUser = (name, number) => {
    return userModel
        .create({
            name : name,
            number : number
        })
        .catch((e) => {
            "use strict";
            console.log(e);
            return null;
        });
};

userModel.getUser = (number) => {
    return userModel
        .findOne({ number : number })
        .then((user) => {
            "use strict";
            if (!user)
                return userModel.createUser("", number);
            return user;
        })
        .catch((e) => {
            "use strict";
            console.log(e);
            return null;
        });
};

userModel.getBalance = (number) => {
    "use strict";
    return userModel
        .getUser(number)
        .then((model) => {
            return model.balance;
        })
        .catch((e) => {
            console.log(e);
            return null;
        });
};

module.exports = userModel;