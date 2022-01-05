const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User } = require('../../models');

router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    }).then(userData => res.send(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;