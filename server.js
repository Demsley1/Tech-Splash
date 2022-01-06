const express = require('express');
const sequelize = require('./config/connection');
const routes = require('./controllers')
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const router = require('./controllers/api/user-routes');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});