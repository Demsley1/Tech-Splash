const router = require('express').Router();
const { add } = require('lodash');
const { User, Post, Comment } = require('../models');

router.get('/', (req, res) => {
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
        res.render('dashboard', { posts, loggedIn: req.session.loggedIn });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/add-post', (req, res) => {
    res.render('add-post');
});

router.get('/edit/:id', (req, res) => {
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