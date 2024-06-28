// Create web server
// Node.js: 8.11.1
// Express: 4.16.2
// MongoDB: 3.0.1
// Mongoose: 5.0.14

// Load modules
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment = require('./models/comment');

// Create web server
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true });

// Define routes
var router = express.Router();

// Get all comments
router.get('/comments', function(req, res) {
    Comment.find(function(err, comments) {
        if (err) {
            res.send(err);
        }
        res.json(comments);
    });
});

// Create a comment
router.post('/comments', function(req, res) {
    var comment = new Comment();
    comment.author = req.body.author;
    comment.content = req.body.content;
    comment.save(function(err) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Comment created!' });
    });
});

// Get a comment by ID
router.get('/comments/:comment_id', function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            res.send(err);
        }
        res.json(comment);
    });
});

// Update a comment by ID
router.put('/comments/:comment_id', function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            res.send(err);
        }
        comment.author = req.body.author;
        comment.content = req.body.content;
        comment.save(function(err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment updated!' });
        });
    });
});

// Delete a comment by ID
router.delete('/comments/:comment_id', function(req, res) {
    Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
        if (err) {
            res.send(err);
        }
        res.json({ message: 'Comment deleted!' });
    });
});

// Register routes
app.use('/api', router);

// Start server
var port = process.env.PORT || 8080;