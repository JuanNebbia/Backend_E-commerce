const passport = require('passport')
const local = require('passport-local')
const github = require('passport-github2')
const jwt = require('passport-jwt')
const { createHash, isValidPassword } = require('../utils/bcrypt.utils')
const getDaos = require('../models/daos/factory')
const { logRed } = require('../utils/console.utils')
const { cookieExtractor } = require('../utils/session.utils')
const { SECRET_KEY, GITHUB_ID, GITHUB_SECRET, LOGIN_URL } = require("../config/enviroment.config.js")
const { ADMIN_NAME, ADMIN_PASSWORD } = require('./enviroment.config')
const { AddUserDTO, GetUserDTO } = require('../models/dtos/users.dto.js')

const { cartsDao, usersDao } = getDaos()

const LocalStrategy = local.Strategy
const GithubStrategy = github.Strategy
const JwtStrategy = jwt.Strategy

const ExtractJWT = jwt.ExtractJwt

const initializePassport = () =>{
    //Local Register
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done)=>{
            const { firstName, lastName, email, age, } = req.body
            if(!firstName || !lastName || !age || !email || !password){
                req.logger.error('Missing fields')
                return done(null, false)
            }
            try {
                const user = await usersDao.getByEmail(username)
                if(user){
                    req.logger.error('Unable to create user, email already registered')
                    return done(null, false, 'Unable to create user, email already registered')
                }
                const cart = await cartsDao.add()
                const newUser = {
                    firstName,
                    lastName, 
                    email,
                    age,
                    password: createHash(password),
                    cart: cart._id,
                    lastConnection: new Date(),
                    documents: [],
                    status: false
                }
                if(req.file){
                    const paths = {
                        path: req.file.path,
                        originalName: req.file.originalname  
                        }  
                    newUser.profilePic = paths
                } 
                const userPayload = new AddUserDTO(newUser)
                let result = await usersDao.addUser(userPayload)
                req.logger.info(`New user registered. ID: ${result._id} `)
                return done(null, result)
            } catch (error) {
                req.logger.error('Error getting user: ' + error)
                return done('Error getting user: ' + error)
            }
        }

    )),

    //Local Login
    passport.use('login', new LocalStrategy(
        {usernameField: 'email'},
        async(username, password, done) =>{
            try {
                if(username === ADMIN_NAME && password === ADMIN_PASSWORD){
                    const user = {
                        email: ADMIN_NAME,
                        password: ADMIN_PASSWORD,
                        role: 'admin',
                    }
                    return done(null, user)
                }
                const user = await usersDao.getByEmail(username)
                if(!user){
                    return done(null, false, 'user not found')
                }
                if(!isValidPassword(user, password)){
                    return done(null, false, 'wrong user or password')
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    //Github Strategy
    passport.use(
        new GithubStrategy({
            clientID: GITHUB_ID,
            clientSecret: GITHUB_SECRET,
            callbackURL: LOGIN_URL
        },
        async (accessToken, refreshToken, profile, done)=>{
            const userData = profile._json
            try {
                const user = await usersDao.getByEmail(userData.email)
                if(!user){
                    const cart = await cartsDao.add()
                    const newUser = {
                        firstName: userData.name.split(' ')[0],
                        lastName: userData.name.split(' ')[1],
                        age: userData.age || 0,
                        email: userData.email || ' ',
                        password: ' ',
                        githubLogin: userData.login,
                        cart: cart._id,
                        lastConnection: new Date(),
                        documents: []
                    }
                    const userPayload = new AddUserDTO(newUser)
                    const response = await usersDao.addUser(userPayload)
                    const finalUser = response._doc
                    done(null, finalUser)
                    return
                }
                done(null, user)
            } catch (error) {
                logRed('Github login error: ' + error);
                done(error)
            }
        }
    ))

    // JWT
    passport.use('jwt', new JwtStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY
    }, async (jwt_payload, done) =>{
        try {
            const userPayload = new GetUserDTO(jwt_payload)
            return done(null, userPayload)
        } catch (error) {
            return done(error)
        }
    }
    ))
}

passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser(async (id, done) => {
    const user = await usersDao.getById(id)
    done(null, user);
});

module.exports = initializePassport