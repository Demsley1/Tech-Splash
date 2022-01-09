const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

router.get('/', (req,res) => {
    Comment.findAll({
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Post,
                attributes: ['title', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                } 
            }
            
        ]
    }).then(commentData => res.json(commentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res) =>  {
    Comment.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Post,
                attributes: ['title', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    }).then(commentData => {
        if(!commentData){
            res.status(404).json({ message: "No comments from users found with this id" })
            return;
        }
        res.json(commentData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

router.post('/', (req, res) => {
    if(req.session){
    Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        }).then(commentData => res.json(commentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

router.put('/:id', (req, res) => {
    Comment.update(
    {
        comment_text: req.body.comment_text
    },
    {
        where: {
            id: req.params.id
        }
    }
    ).then(commentData => {
        if(!commentData){
            res.status(404).json({ message: "no comments from user found at this id" })
            return;
        }
        res.json(commentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(commentData => {
        if(!commentData){
            res.status(404).json({ message: "No comments for user found with this id" })
            return;
        }
        res.json(commentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;