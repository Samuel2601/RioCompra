'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Riocompras2022';

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(3,'hour').unix()
    }

    return jwt.encode(payload,secret);
}