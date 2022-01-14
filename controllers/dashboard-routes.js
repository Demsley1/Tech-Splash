const router = require('express').Router();
const { User, Post, Comment } = require('../models');
// authguard app with cusotm helper function for handlebars
const withAuth = require('../utils/auth');

// get all posts belonging to a specific user for the dashboard routed pages
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
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
        const posts = postData.map(post => post.get({ plain: true }));
        // render data to dashboard, and pass in a loggedIn value for true since a user can't access the dashboard unless already loggedIn
        res.render('dashboard', { posts, loggedIn: true });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// render the add post page from the dashboard routes
router.get('/add-post',withAuth, (req, res) => {
    res.render('add-post');
});

// render the edit post page, be selecting the post data from the specified post id returned from the front end
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findByPk(req.params.id, {
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
        if(postData){
        const post = postData.get({ plain: true });

        res.render('edit-post', { post, loggedIn: true });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;