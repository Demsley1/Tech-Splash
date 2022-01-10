const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts from database with comments and usernames attached
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
    }).then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get a specific post information with comments and username of the post creater, and username of the person that commented on the post
router.get('/:id', (req, res) => {
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
        res.json(postData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Post/create a new post for user 
router.post('/', withAuth, (req, res) => {
    // expects: { "title": "amazing post about super interesting topic", "content": "This is a simple test post for user who want to be featured on my blog site", "post_url": "https://www.samplepost.com/example", "user_id": 1 }
    Post.create({
        title: req.body.title,
        content: req.body.content,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    }).then(postData => res.json(postData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Update a users post by specific id
router.put('/:id', withAuth, (req, res) => {
    // expects: { "title": "fancy new title", "content": "reading the past text under the post, has made me change to this text"}
    Post.update(
    {
        title: req.body.title,
        content: req.body.content
    }, 
    {
        where: {
            id: req.params.id
        }
    }).then(postData => {
        if(!postData){
            res.status(404).json({ message: "No posts found at this id" })
            return;
        }
        res.json(postData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete a users specific post at indicated id
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(postData => {
        if(!postData){
            res.status(404).json({ message: "No posts found at this id" })
            return;
        }
        res.json(postData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;