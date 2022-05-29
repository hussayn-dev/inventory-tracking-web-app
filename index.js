require('express-async-errors')
require('./config/connect')
require('dotenv').config()
const express = require('express')
const app = express()
const {errorHandler, notFound} = require('./middleware/error-hsndler')
const port = process.env.PORT || 5000
const passport = require('passport')
const userRouter = require('./routes/user')
const warehouseRouter = require('./routes/warehouse')
const inventoryRouter = require('./routes/inventory')
const initializePassport = require('./config/passport')
const session = require('express-session')
initializePassport(passport)

app.use(express.static('./public'))
app.use(express.json())


app.use(session({
    secret : process.env.SESSION_SECRET,
    resave : false,  
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/warehouse', warehouseRouter)
app.use('/api/v1/inventory', inventoryRouter)


app.use(notFound)
app.use(errorHandler)
app.listen(port, () => {
    console.log(`work has started on ${port}`)
})

