const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('../middleware/auth');


router.post('/auth/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({ email: req.body.email, password: hashedPassword })
        await user.save()
        res.status(201).send()
    }
    catch {
        res.status(500).send()
    }
})

router.post('/auth/login', async (req, res) => {


    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Cannot find user');


        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) return res.status(401).send('Not allowed');

        const accessToken = generateAccessToken({ id: user._id, email: user.email });

        const jti = uuidv4();
        const refreshToken = jwt.sign(
            { id: user._id, email: user.email, jti: jti },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);



        user.refreshTokens.push({
            jti: jti,
            device: req.headers['user-agent'] || "Unknown",
            expiresAt
        });

        await user.save();

        console.log(user)

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ accessToken: accessToken, user: { email: user.email } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/auth/refresh", async (req, res) => {
    try {
        // Read refresh token from HttpOnly cookie first
        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No token provided" });

        // Verify JWT signature
        let payload;
        try {
            payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        // Get user by ID from payload
        const user = await User.findById(payload.id);
        console.log(user)
        if (!user) return res.status(401).json({ message: "User not found" });

        // Check hashed token in user's refreshTokens array
        const tokenEntry = user.refreshTokens.find(t =>

            payload.jti === t.jti
        );
        if (!tokenEntry) return res.status(403).json({ message: "Invalid refresh token" });

        // Generate new tokens
        const newAccessToken = generateAccessToken({ id: user._id, email: user.email });
        const jti = uuidv4();
        const newRefreshToken = jwt.sign(
            { id: user._id, email: user.email, jti: jti },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );


        // Replace old token in user's array
        tokenEntry.jti = jti;
        tokenEntry.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
        await user.save();

        // Optionally set the new refresh token as an HttpOnly cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/auth/logout", async (req, res) => {



    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token provided" });

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Get user by ID from payload
    const user = await User.findById(payload.id);
    console.log(user)
    if (!user) return res.status(401).json({ message: "User not found" });

    const tokenEntry = user.refreshTokens.find(t =>

        payload.jti === t.jti
    );
    if (!tokenEntry) return res.status(403).json({ message: "Invalid refresh token" });

    user.refreshTokens = user.refreshTokens.filter(t => t.jti !== payload.jti);
    await user.save();

    // Optionally clear cookie if you set the token there
    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });

    res.status(200).json({ message: "Logged out successfully" });


})

router.post("/auth/logoutAll", async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token provided" });

    let payload;
    try {
        payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Atomically find the user and check the token exists
    const user = await User.findOne({ _id: payload.id, 'refreshTokens.jti': payload.jti });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    // Clear all refresh tokens
    user.refreshTokens = [];
    await user.save();

    // Clear cookie if set
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({ message: "Logged out from all devices successfully" });
});

router.get('/auth/me', authenticateToken, (req, res) => {
    res.status(200).json({ user: { email: req.user.email } });
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}



module.exports = router