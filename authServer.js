require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const verifyToken = require('./middleware/auth')

const app = express()

let users = [
    {
        id: 1,
        username: 'thong',
        refreshToken: null
    },
    {
        id: 2,
        username: 'thuong',
        refreshToken: null
    },
    {
        id: 3,
        username: 'thai',
        refreshToken: null
    }
]

const generateTokens = payload => {

    const { id, username } = payload
    //create jwt token
    const accessToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m'})
    
    const refreshToken = jwt.sign({ id, username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1h'})

    return { accessToken, refreshToken }
}

const updateRefreshToken = (username, refreshToken) => {
    users = users.map(user => {
		if (user.username === username)
			return {
				...user,
				refreshToken
			}

		return user
	})
}

app.use(express.json())

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = users.find(user => user.username === username)
    
    if (!user) return res.status(401)

    const tokens = generateTokens(user)

    updateRefreshToken(username, tokens.refreshToken)

    console.log(users)

    res.json({ tokens })
})

app.post('/token', (req, res) => {
    const refreshToken = req.body.refreshToken
    if(!refreshToken) {
        res.status(401)
    }

    const user = users.find(user => user.refreshToken === refreshToken)

    if(!user) {
        res.status(403)
    }

    try {
        jwt.sign(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const tokens = generateTokens(user) 
        updateRefreshToken(user.username, refreshToken)

        res.json(tokens)
    } catch (err) {
        console.log(err)
        res.sendStatus(403)
    }
})

app.delete('/logout', verifyToken, (req, res) => {
    const user = users.find(user => user.id === req.userId)
    updateRefreshToken(user.username, null)
    console.log(users)

    res.sendStatus(204)
})

const PORT = process.env.PORT || 4001

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))