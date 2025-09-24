const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const RefreshToken = require('../models/refreshToken')

let users = [];


router.get('/users', (req, res) => {
    res.json(users)
})

router.post("/token", async (req, res) => {
    const { token: incomingToken } = req.body;
    if (!incomingToken) return res.status(401).send("No token provided");

    try {
        // Find all tokens in DB (we store hashed tokens)
        const tokens = await RefreshToken.find();

        let tokenDoc = null;
        // Compare incoming token with stored hashed tokens
        for (const t of tokens) {
            const match = await bcrypt.compare(incomingToken, t.token);
            if (match) {
                tokenDoc = t;
                break;
            }
        }

        if (!tokenDoc) return res.status(403).send("Invalid refresh token");

        // Verify JWT signature
        const payload = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);

        // Generate new access token (use the payload from refresh token)
        const accessToken = generateAccessToken({ id: payload.id, name: payload.name });

        // Generate new refresh token
        const newRefreshToken = jwt.sign(
            { id: payload.id, name: payload.name },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Hash the new refresh token and replace in DB
        tokenDoc.token = await bcrypt.hash(newRefreshToken, 10);
        tokenDoc.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await tokenDoc.save();

        res.json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) {
        console.error(err);
        res.status(403).send("Invalid token");
    }
});
router.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    }
    catch {
        res.status(500).send()
    }
})

router.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken(user)
            console.log('got here')
            const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
            console.log('got heree')
            const hashedToken = await bcrypt.hash(refreshToken, 10);
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            try {
                const refreshToken = new RefreshToken({
                    user: user,
                    token: hashedToken,
                    expiresAt,
                })
                await refreshToken.save()
            } catch (error) {
                res.status(500).send({ message: error.message })
            }

            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        } else {
            res.send('Not allowed')
        }
    } catch (err) {
        res.status(500)
    }
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}

module.exports = router