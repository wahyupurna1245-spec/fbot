const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['help'],
    category: 'system',

    operate: async ({ sock, m, sender }) => {
        try {

            let botName = 'BOT WHATSAPP';

            // Ambil nama bot dari config jika ada
            try {
                const config = require('../config.json');
                botName = config.botName || botName;
            } catch {}

            const plugins = fs.readdirSync(__dirname)
                .filter(file =>
                    file.endsWith('.js') &&
                    file !== 'menu.js'
                );


            let categories = {};
            let total = 0;


            for (const file of plugins) {
                try {

                    const plugin = require(path.join(__dirname, file));

                    if (!plugin.command) continue;

                    const category = plugin.category || 'other';


                    if (!categories[category]) {
                        categories[category] = [];
                    }


                    plugin.command.forEach(cmd => {

                        if (!categories[category].includes(cmd)) {
                            categories[category].push(cmd);
                            total++;
                        }

                    });


                } catch (err) {
                    console.log('Plugin error:', file);
                }
            }


            Object.keys(categories).forEach(cat => {
                categories[cat].sort();
            });


            const icon = {
                downloader: '📥',
                media: '🎬',
                sticker: '🎨',
                tools: '🛠️',
                group: '👥',
                owner: '👑',
                ai: '🧠',
                fun: '🎮',
                system: '⚙️',
                other: '📂'
            };


            let text = `
╭━━〔 ${botName} 〕━━╮
┃
┃ ◈ Status : Online
┃ ◈ Plugin : ${plugins.length}
┃ ◈ Command : ${total}
┃ ◈ User : @${sender.split('@')[0]}
┃
╰━━━━━━━━━━━━━━╯

`;


            const order = [
                'downloader',
                'media',
                'sticker',
                'tools',
                'group',
                'owner',
                'ai',
                'fun',
                'system',
                'other'
            ];


            for (const cat of order) {

                if (!categories[cat]) continue;


                text += `┌─「 ${icon[cat]} ${cat.toUpperCase()} 」\n`;

                categories[cat].forEach(cmd => {
                    text += `│  ◦ .${cmd}\n`;
                });

                text += `└────────────\n\n`;
            }


            text += `
╭────────────╮
│ 🤖 Auto Plugin Menu
│ ⚡ System Active
╰────────────╯
`;


            await sock.sendMessage(sender, {
                text,
                mentions: [sender]
            }, {
                quoted: m
            });


        } catch (err) {

            console.error(err);

            await sock.sendMessage(sender, {
                text: '❌ Menu error.'
            }, {
                quoted: m
            });

        }
    }
};