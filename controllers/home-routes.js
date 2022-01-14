const router = require('express').Router();
// import models to be used as inject data when each route is called by the server
const { User, Post, Comment } = require('../models');

// get all post data on application's main homepage, and inject and render it to the handlebars homeview page.
router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'content', 'post_url', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    }).then(postData => {
        // iterate through array of post data for each post and map out the data as a new array of serialized data to be used in handlebars
        const posts = postData.map(post => post.get({ plain: true }));
        // render the main homepage with the posts data array, and the data value for if there is a user session that is logged in already
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// if user has a session logged into already then redirect to homepage, otherwise send to login form page.
router.get('/login', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/');
        return;
    }

    res.render('login');
});

// conditionally send user to sign up page, or redirect to homepage if loggedIn
router.get('/signup', (req, res) => {
    if(req.session.loggedIn){
        res.redirect('/');
        return;
    }
    res.render('signup');
});

// render a singe post based on the requested post id from the front-end side of the app
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'title', 'content', 'post_url', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    }).then(postData => {
        if(!postData){
            res.status(404).json({ message: "No post found at this id" })
            return;
        }
        const post = postData.get({ plain: true });

        res.render('post', { post, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
}); 

module.exports = router;