const { adminName, adminPassword } = require('../config/enviroment.config')

const roleMiddleware = async (req, res, next) => {
    const { email, password } = req.body
    if(email == adminName && password == adminPassword){
        req.session.user = {
            name: 'admin',
            lastName: 'Coder',
            email: adminName,
            age: 15,
            password: adminPassword,
            role: 'admin'
        }
        req.session.save(err => {
            if (err){
                console.log('session error: ', err);
            } 
            else {
                res.redirect('/products');
            }
        })
    }else{
        next()
    }
  };
  
  module.exports = {
    roleMiddleware
  }