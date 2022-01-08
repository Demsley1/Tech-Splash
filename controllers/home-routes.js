const router = require('express').Router();
const { User, Post, Comment } = require('../models');

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
        const posts = postData.map(post => post.get({ plain: true }));
        res.render('homepage', { posts });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;