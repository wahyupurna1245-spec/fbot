const fs = require('fs');
const path = require('path');
const modeFile = path.join(__dirname, 'mode.json');
const settingFile = path.join(__dirname, 'setting.json');
module.exports = async (sock, mek, chatUpdate) => {
    try {
        const m = mek;
        if (!m.message) return;
        // =========================
        // LOAD SETTING
        // =========================
        let settings = {
            autoTyping: false,
            autoReadSw: false,
            autoLikeSw: false,
            autoReadGroup: false,
            autoReadPrivate: false
        };
        if (fs.existsSync(settingFile)) {
            try {
                settings = {
                    ...settings,
                    ...JSON.parse(
                        fs.readFileSync(settingFile)
                    )
                };
            } catch {}
        }
        // =========================
        // STATUS WHATSAPP
        // =========================
        if (
            m.key.remoteJid === 'status@broadcast'
        ) {
            if (settings.autoReadSw) {
                try {
                    await sock.readMessages([
                        {
                            remoteJid: 'status@broadcast',
                            id: m.key.id,
                            participant:
                                m.key.participant ||
                                m.participant
                        }
                    ]);
                } catch {}

            }
            if (settings.autoLikeSw) {
                try {
                    await sock.sendMessage(
                        'status@broadcast',
                        {                            reactionMessage: {
                                key: m.key,
                                text: '❤️'
                            }
                        }
                    );
                } catch {}
            }
            return;
        }
        // =========================
        // AUTO READ CHAT
        // =========================
        if (!m.key.fromMe) {
            const chatJid =
                m.key.remoteJid;
            const isGroupChat =
                chatJid.endsWith('@g.us');
            if (
                isGroupChat &&
                settings.autoReadGroup
            ) {
                try {
                    await sock.readMessages([
                        {
                            remoteJid: chatJid,
                            id: m.key.id,
                            participant:
                                m.key.participant ||
                                m.participant
                        }
                    ]);

                } catch {}
            }
            if (
                !isGroupChat &&
                settings.autoReadPrivate
            ) {
                try {
                    await sock.readMessages([
                        {
                            remoteJid: chatJid,
                            id: m.key.id
                        }
                    ]);
                } catch {}
            }
        }
        // =========================
        // PARSE COMMAND
        // =========================
        const body =
            m.message.conversation ||
            m.message.extendedTextMessage?.text ||
            m.message.imageMessage?.caption ||
            '';
        const budy =
            typeof body === 'string'
            ? body
            : '';
        const prefix =
            budy.match(
                /^[°•π÷×¶∆£¢€¥®™_=|~!?#/$%^&.+¬]/
            )?.[0] || '';
        const isCmd =
            budy.startsWith(prefix);
        const command =
            isCmd
            ? budy
                .slice(prefix.length)
                .trim()
                .split(/\s+/)[0]
                .toLowerCase()
            : '';
        const args =
            budy
            .trim()
            .split(/\s+/)
            .slice(1);
        const q =
            args.join(' ');
        //SENDER NYA
        const sender =
            m.key.remoteJid;

        // =========================
// AFK SYSTEM
// =========================

const afkFile =
path.join(
    __dirname,
    'database/afk.json'
);


let afkData = {};

try {

    if (fs.existsSync(afkFile)) {

        afkData =
        JSON.parse(
            fs.readFileSync(afkFile)
        );

    }

} catch {}



// Hapus AFK jika user chat lagi

if (
    afkData[sender] &&
    !m.key.fromMe
) {

    delete afkData[sender];


    fs.writeFileSync(
        afkFile,
        JSON.stringify(
            afkData,
            null,
            2
        )
    );


    await sock.sendMessage(
        sender,
        {
            text:
`👋 Selamat datang kembali

Status AFK kamu sudah dihapus.`
        },
        {
            quoted:m
        }
    );

}
        // ====================





// =========================
// CEK MENTION USER AFK FIX
// =========================

let contextInfo = null;

if (m.message?.extendedTextMessage) {
    contextInfo =
    m.message.extendedTextMessage.contextInfo;
}

if (m.message?.imageMessage) {
    contextInfo =
    m.message.imageMessage.contextInfo;
}

if (m.message?.videoMessage) {
    contextInfo =
    m.message.videoMessage.contextInfo;
}


const mentioned =
contextInfo?.mentionedJid || [];


for (const jid of mentioned) {

    if (afkData[jid]) {

        const data =
        afkData[jid];


        const menit =
        Math.floor(
            (Date.now() - data.waktu) / 60000
        );


        await sock.sendMessage(
            sender,
            {
                text:
`💤 *USER SEDANG AFK*

👤 @${jid.split('@')[0]}

📝 Alasan:
${data.alasan}

⏰ Sejak:
${menit} menit lalu`,
                mentions: [jid]
            },
            {
                quoted: m
            }
        );

        break;

    }

}




        
        
        // FIX GROUP DETECT
        const isGroup =
            sender.endsWith('@g.us') ||
            !!m.key.participant;
                        
        // =========================
        // OWNER CHECK
        // =========================
        const botNumber =
            sock.user.id.split(':')[0] +
            '@s.whatsapp.net';
        const ownerNumbers = [
            '628812478704@s.whatsapp.net',
            botNumber
        ];
        const senderNumber =
            sender.includes(':')
            ? sender.split(':')[0] + '@s.whatsapp.net'
            : sender;
        const isOwner =
            ownerNumbers.includes(senderNumber) ||
            ownerNumbers.includes(m.key.participant) ||
            m.key.fromMe;
        // =========================
        // MODE SYSTEM
        // =========================
        let mode = {
            isSelf: false,
            groupOnly: false,
            privateOnly: false
        };
        if (fs.existsSync(modeFile)) {
            try {
                mode = {
                    ...mode,
                    ...JSON.parse(
                        fs.readFileSync(modeFile)
                    )
                };
            } catch {}
        }
        // SELF MODE
        if (
            mode.isSelf &&
            !isOwner
        ) return;
        // GROUP ONLY
        if (
            mode.groupOnly &&
            !isGroup
        ) return;
        // PRIVATE ONLY
        if (
            mode.privateOnly &&
            isGroup
        ) return;
        // =========================
        // AUTO TYPING
        // =========================
        if (
            settings.autoTyping &&
            isCmd
        ) {
            await sock.sendPresenceUpdate(
                'composing',
                sender
            );
        }
        // =========================
        // LOAD PLUGIN
        // =========================
        const pluginFolder =
            path.join(
                __dirname,
                'plugins'
            );
        if (!fs.existsSync(pluginFolder)) {

            fs.mkdirSync(pluginFolder);
        }
        const pluginFiles =
            fs.readdirSync(pluginFolder);
        const plugins = {};
        for (const file of pluginFiles) {
            if (
                file.endsWith('.js')
            ) {
                const pluginPath =
                    path.join(
                        pluginFolder,
                        file
                    );
                try {
                    delete require.cache[
                        require.resolve(pluginPath)
                    ];
                    plugins[file] =
                        require(pluginPath);
                } catch (err) {
                    console.log(
                        'Plugin error:',
                        file,
                        err.message
                    );
                }
            }
        }
        // =========================
        // RUN PLUGIN
        // =========================
        for (const name in plugins) {
            const plugin =
                plugins[name];
            let match =
                false;
            if (
                typeof plugin.command === 'string' &&
                plugin.command === command
            ) {
                match = true;
            }
            if (
                Array.isArray(plugin.command) &&
                plugin.command.includes(command)
            ) {
                match = true;
            }
            if (!match) continue;
            if (
                plugin.ownerOnly &&
                !isOwner
            ) {
                await sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ Perintah ini khusus owner'
                    },
                    {
                        quoted:m
                    }
                );
                return;
            }
            if (
                typeof plugin.operate === 'function'
            ) {
                await plugin.operate({
                    sock,
                    m,
                    command,
                    args,
                    q,
                    sender,
                    prefix,
                    isOwner,
                    isGroup,
                    pushName:
                        m.pushName || ''
                });
            }
        }
    } catch (e) {
        console.error(
            'Handler Error:',
            e
        );
    }
};
