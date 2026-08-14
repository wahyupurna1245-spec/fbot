const fs = require('fs');
const path = require('path');

const settingFile = path.join(__dirname, '../setting.json');

module.exports = {
    category: 'owner',
    command: ['setting'],
    ownerOnly: true,

    operate: async ({ sock, m, args, sender }) => {

        let settings = {
            autoTyping: false,
            autoReadSw: false,
            autoLikeSw: false,
            autoReadGroup: false,
            autoReadPrivate: false
        };

        if (fs.existsSync(settingFile)) {
            settings = JSON.parse(fs.readFileSync(settingFile));
        }

        if (!args[0]) {
            return sock.sendMessage(sender, {
                text:
`⚙️ *SETTING BOT*

1. Auto Typing : ${settings.autoTyping ? '✅' : '❌'}
2. Auto Read SW : ${settings.autoReadSw ? '✅' : '❌'}
3. Auto Like SW : ${settings.autoLikeSw ? '✅' : '❌'}
4. Auto Read Group : ${settings.autoReadGroup ? '✅' : '❌'}
5. Auto Read Private : ${settings.autoReadPrivate ? '✅' : '❌'}

Contoh:
.setting autolikesw on
.setting autoreadsw off`
            }, { quoted: m });
        }

        const fitur = args[0].toLowerCase();
        const status = args[1]?.toLowerCase();

        const map = {
            autotyping: 'autoTyping',
            autoreadsw: 'autoReadSw',
            autolikesw: 'autoLikeSw',
            autoreadgroup: 'autoReadGroup',
            autoreadprivate: 'autoReadPrivate'
        };

        if (!map[fitur])
            return sock.sendMessage(sender, { text: '❌ Fitur tidak ditemukan.' }, { quoted: m });

        if (!['on', 'off'].includes(status))
            return sock.sendMessage(sender, { text: 'Gunakan: on / off' }, { quoted: m });

        settings[map[fitur]] = status === 'on';

        fs.writeFileSync(settingFile, JSON.stringify(settings, null, 2));

        await sock.sendMessage(sender, {
            text: `✅ ${fitur} berhasil diubah menjadi ${status.toUpperCase()}`
        }, { quoted: m });

    }
};