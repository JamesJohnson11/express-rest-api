const express = require('express');
const app = express();
const posts = require('./posts.json');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded());


// Create new post
app.post('/posts', (req, res) => {
    posts.push(req.body);
    let stringedData = JSON.stringify(posts, null, 2);
    fs.writeFile('posts.json', stringedData, function (err) {
        if (err) {
            return res.status(500).json({ message: err });
        }
    })
    return res.status(200).json({ message: "New post has been created!" });
})


// Fetch all posts
app.get('/posts', (req, res) => {
    return res.json({ posts });
})


// Fetch a single post
app.get('/posts/:id', (req, res) => {
    let id = req.params.id;
    let singlePost = posts.find(post => {
        return String(post.id) === id;
    })
    if (singlePost) {
        return res.status(200).json({ post: singlePost });
    } else {
        return res.status(404).json({ message: "No post found." });
    }
})


// Update a single post
app.put('/posts/:id', (req, res) => {
    let id = req.params.id;
    let postToUpdate = posts.find(post => {
        return String(post.id) === id;
    })

    if (!postToUpdate) {
        return res.status(404).json({ message: "No post found." });
    } else {
        // Will only update post title or body. User ID and post ID will remain intact regardless of user input.
        postToUpdate.body = req.body.post.body;
        postToUpdate.title = req.body.post.title;

        let stringedData = JSON.stringify(posts, null, 2);
        fs.writeFile('posts.json', stringedData, function (err) {
            if (err) {
                return res.status(500).json({ message: err });
            }
        })
        return res.status(200).json({ message: "Your post has been updated!" });
    }
})


// Listen for server on port 3000
app.listen(3000, function () {
    console.log('Server is running on port 3000.');
})