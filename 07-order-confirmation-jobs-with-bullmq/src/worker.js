import { Worker } from 'bullmq';
import { connection } from './queue.js'

const emailWorker = new Worker('emails',
    async (job) => {
        console.log('Processing email job ', job.id, job.name, job.data);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log('Email job completed ', job.id);
    },
    {connection}
);

emailWorker.on('completed', (job) => {
    console.log("job completed ", job.id);
});

emailWorker.on('failed', (job, err) => {
    console.log("job failed ", job.id, err);
});