import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const QUEUE_key =  'queue:emails';

app.post('/email', async (req, res) => { 
    const job = { 
        to: req.body.to,
        subject: req.body.subject || 'No Subject',
        body: req.body.body || 'No content',
        createdAt: new Date().toISOString(),
    } //create a job

    await redis.lpush(QUEUE_key, JSON.stringify(job)); //add job to redis list
    res.json({queued: true, job});
});

app.get('/email/process', async (req, res) => {
    const rawJob = await redis.rpop(QUEUE_key); //pop job from redis list
    const totalEmailsLeft = await redis.llen(QUEUE_key);
    if(!rawJob){
        return res.json({message: 'No jobs in the queue!', totalEmailsLeft})
    }

    const job = JSON.parse(rawJob);
    res.json({message: 'Email sent', job, totalEmailsLeft})
})


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
