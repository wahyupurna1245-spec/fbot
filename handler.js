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
        const sender =
            m.key.remoteJid;
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
// ANTI SPAM COMMAND ONLY
// =========================
if(isCmd && !isOwner){
    const cooldownFile =
    path.join(
        __dirname,
        'database',
        'cooldown.json'
    );
    let cooldown = {};
    if(fs.existsSync(cooldownFile)){
        try{
            cooldown =
            JSON.parse(
                fs.readFileSync(cooldownFile)
            );
        }catch{}
    }
    // beda command beda cooldown
    const key =
    sender + ':' + command;
    const now =
    Date.now();
    // 5 detik lebih aman
    const delay =
    5000;
    if(
        cooldown[key] &&
        now - cooldown[key] < delay
    ){
        const sisa =
        Math.ceil(
            (delay - (now - cooldown[key]))
            / 1000
        );
        await sock.sendMessage(
            sender,
            {
                text:
`⏳ *ANTI SPAM COMMAND*

Tunggu ${sisa} detik lagi untuk:
${prefix}${command}`
            },
            {
                quoted:m
            }
        );
        return;
    }
    cooldown[key] = now;
    fs.mkdirSync(
        path.dirname(cooldownFile),
        {
            recursive:true
        }
    );
    fs.writeFileSync(
        cooldownFile,
        JSON.stringify(
            cooldown,
            null,
            2
        )
    );
}
// =========================
// COMMAND REACTION STATUS
// =========================

let commandReact = false;

if(isCmd && !isOwner){

    commandReact = true;

    try{

        await sock.sendMessage(
            sender,
            {
                react:{
                    text:'',
                    key:m.key
                }
            }
        );

    }catch{}

}
// =======================
// SIMPAN STATISTIK COMMAND
// =======================
if(isCmd){

    const statsFile =
    path.join(
        __dirname,
        'database',
        'stats.json'
    );


    let stats = {};


    try{

        if(fs.existsSync(statsFile)){

            stats =
            JSON.parse(
                fs.readFileSync(statsFile)
            );

        }

    }catch{}



    stats[command] =
    (stats[command] || 0) + 1;



    fs.mkdirSync(
        path.dirname(statsFile),
        {
            recursive:true
        }
    );


    fs.writeFileSync(
        statsFile,
        JSON.stringify(
            stats,
            null,
            2
        )
    );

}
// ============================
// =========================
// ANTI LINK GROUP
// =========================
if(isGroup){
const antiLinkFile =
path.join(
 __dirname,
 'database',
 'antilink.json'
);
    let antiLink = {};
    if(fs.existsSync(antiLinkFile)){
        try{
            antiLink =
            JSON.parse(
                fs.readFileSync(antiLinkFile)
            );
        }catch{}
    }
    if(antiLink[sender]){
        const text =
m.message.conversation ||
m.message.extendedTextMessage?.text ||
m.message.imageMessage?.caption ||
m.message.videoMessage?.caption ||
'';
        const link =
        /(https?:\/\/|www\.|chat\.whatsapp\.com)/i
        .test(text);
        if(link && !isOwner){
            try{
                await sock.sendMessage(
                    sender,
                    {
                        delete:m.key
                    }
                );
                await sock.sendMessage(
                    sender,
                    {
                        text:
`🚫 *ANTI LINK AKTIF*

Pesan link dihapus.`
                    },
                    {
                        quoted:m
                    }
                );
            }catch(e){
                console.log(
                    'ANTI LINK ERROR',
                    e.message
                );

            }
            return;
        }
    }
}            
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
    isCmd &&
    commands.includes(command)
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
    try{
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
        // BERHASIL
        if(commandReact){
            try{
                await sock.sendMessage(
                    sender,
                    {
                        react:{
                            text:'✅',
                            key:m.key
                        }
                    }
                );
            }catch{}
        }
    }catch(err){
        console.log(
            'PLUGIN ERROR:',
            err.message
        );
        // GAGAL
        if(commandReact){
            try{
                await sock.sendMessage(
                    sender,
                    {
                        react:{
                            text:'❌',
                            key:m.key
                        }
                    }
                );
            }catch{}
        }
    }
}
        }
    } catch (e) {
        console.error(
            'Handler Error:',
            e
        );
    }
};
