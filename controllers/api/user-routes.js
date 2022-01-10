const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all users, wihtout sending password data over response to server
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    }).then(userData => res.send(userData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get a user at requested id, exclude password from daatabase, and include post and comment data
router.get('/:id', withAuth, (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'post_url', 'created_at'],
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: "No user found with this id" })
            return;
        }
        res.json(dbUserData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/', withAuth, (req,res) => {
    // expects { "username": "test_user1", "email": "IamTesting@example.com", "password": "password123" }
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).then(userData => {
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            req.session.loggedIn = true;

            res.json(userData);
        });
    })      
    .catch(err => {
        console.log(err);
        res.status(404).json(err);
    });
});

// find a specific user by the email and compare the inputed password with the stored hashed password, by using a custom password validation function.
router.post('/login', (req, res) => {
    User.findOne({
        where:{
            email: req.body.email
        }
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: "No user found with that email address!" })
            return;
        }
        const validPW = dbUserData.queryPW(req.body.password);

        if(!validPW){
            res.status(400).json({ message: "invalid password for user" });
            return;
        }

        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }

});

// Update user model with parameter at specified id, and include the hook for password hashing
router.put('/:id', withAuth, (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(404).json({ message: "No user found with this id" })
            return;
        }
        res.json(dbUserData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete a user at specified id
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbUserData => {
        if(!dbUserData){
            res.status(400).json({ message: "No user found with this id" });
            return;
        }
        res.json(dbUserData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

module.exports = router;