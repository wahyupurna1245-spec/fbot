const path = require('path');

module.exports = {
    command: ['bot'],
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {

        const video = path.join(
            __dirname,
            '../media/bot.mp4'
        );

        await sock.sendMessage(
            sender,
            {
                video: {
                    url: video
                },
                ptv: true
            },
            {
                quoted: m
            }
        );

    }
};