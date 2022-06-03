const cron = require('node-cron');

function sechedule(time, task) {
    cron.schedule(time, () => {
        task();
    });
}
function secheduleEverySecond(task) {
    cron.schedule('* * * * * *', () => {
        task();
    });
}

module.exports = {
    sechedule,
    secheduleEverySecond,
};
