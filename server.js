const express = require('express');
// import sequelize database connection
const sequelize = require('./config/connection');
// import routes from both back-end, and front-end
const routes = require('./controllers')
const path = require('path');
// import express-handlebars a npm package capable of rendering javascript object into a html elements
const exphbs = require('express-handlebars');
// import express sessions, and connect-session-sequelize, to create a user session with a cookie and store the session in the database
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const helpers = require('./utils/helpers')
const hbs = exphbs.create({ helpers });
const app = express();
const PORT = process.env.PORT || 3001;

// object that controls the users session and its parameters
const sess = {
    secret: process.env.SECRET || "Serversidesecret",
    cookie: { },
    store: new SequelizeStore({ db: sequelize }),
    resave: false,
    saveUninitialized: true
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sess))

app.use(routes);

// app middleware functions to use the express handlebars engine, and sending the view data to the server
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});