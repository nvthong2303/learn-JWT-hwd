require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')

const verifyToken = require('./middleware/auth')

const app = express()

const posts = [
    {
        userId: 1,
        post: 'thong nguyen '
    },
    {
        userId: 1,
        post: 'thong so 2'
    },
    {
        userId: 3,
        post: 'thong so 3'
    }
]

app.use(express.json());

// app.get('/posts', verifyToken, (req, res) => {
//     res.json({ posts: 'my post'})
// })

app.get('/posts', verifyToken, (req, res) => {
    res.json(posts.filter(post => post.userId === req.userId))
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is listening on ${PORT}`);
});