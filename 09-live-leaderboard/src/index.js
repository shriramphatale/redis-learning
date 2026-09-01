import express from 'express'
import Redis from 'ioredis'

const app = express()
app.use(express.json()) 

const redis = new Redis(process.env.Redis_URL || 'redis://localhost:6379');

app.post('/post/:id/view', async (req, res) => {
    const views = await redis.incr(`post:${req.params.id}:views`)
    return res.json({ views });
});

//leaderboard endpoints

app.post('/leaderboard/score', async (req, res) => { //increament score
    const {userId, score} = req.body;
    const updated = await redis.zincrby('leaderboard', score, `user:${userId}`);

    return res.json({ updated });
});

app.get('/leaderboard', async (req, res) => { // top 10
    const top10 = await redis.zrevrange('leaderboard', 0, 9, 'withscores')
    return res.json({ top10 });
});

app.get('/leaderboard/:userId/rank', async (req, res) => { // user rank
    const {userId} = req.params;
    const rank = await redis.zrevrank('leaderboard', `user:${userId}`);
    return res.json({ userId: userId, rank: rank});
});


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`)
})
