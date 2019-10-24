import Bee from 'bee-queue';
import WelcomeMail from '../app/jobs/WelcomeMail';
import HelpOrderAnswerMail from '../app/jobs/HelpOrderAnswerMail';
import RedisConfig from '../config/redis';

const jobs = [WelcomeMail, HelpOrderAnswerMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: RedisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFail).process(handle);
    });
  }

  handleFail(job, err) {
    console.log(`Queue ${job.queue.key}: FAILED`, err);
  }
}

export default new Queue();
