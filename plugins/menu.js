const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['menuuu'],

    operate: async ({ sock, m, sender }) => {

        let folder = path.join(__dirname);
        let files = fs.readdirSync(folder)
            .filter(file => file.endsWith('.js') && file !== 'menu.js');

        let categories = {};

        for (let file of files) {
            let plugin = require(path.join(folder, file));

            let cat = plugin.category || 'lainnya';

            if (!categories[cat]) {
                categories[cat] = [];
            }

            categories[cat].push(...plugin.command);
        }


        let text = '╭─「 🤖 BOT MENU 」\n│\n';

        for (let cat in categories) {
            text += `├─ 📂 ${cat.toUpperCase()}\n`;

            for (let cmd of categories[cat]) {
                text += `│  ├ .${cmd}\n`;
            }

            text += '│\n';
        }

        text += '╰────────────';


        await sock.sendMessage(sender, {
            text
        }, { quoted: m });
    }
};