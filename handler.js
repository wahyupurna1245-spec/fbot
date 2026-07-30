const fs = require('fs');
const path = require('path');

const modeFile = path.join(__dirname, 'mode.json');
const settingFile = path.join(__dirname, 'setting.json');

module.exports = async (sock, mek, chatUpdate) => {
    try {
        const m = mek;
        if (!m.message) return;


        // =========================
        // LOAD SETTING (SATU KALI)
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
                    ...JSON.parse(fs.readFileSync(settingFile))
                };
            } catch (e) {}
        }



        // =========================
        // AUTO READ + LIKE STATUS
        // =========================
        if (
            m.key &&
            (
                m.key.remoteJid === 'status@broadcast' ||
                m.chat === 'status@broadcast'
            )
        ) {


            // AUTO READ STATUS
            if (settings.autoReadSw) {
                try {

                    const jid = m.key.remoteJid;
                    const msgId = m.key.id;
                    const participant =
                        m.key.participant || m.participant;


                    await sock.readMessages([
                        {
                            remoteJid: jid,
                            id: msgId,
                            participant: participant
                        }
                    ]);


                    if (participant) {
                        await sock.sendReceipt(
                            jid,
                            participant,
                            [msgId],
                            'read'
                        );
                    }

                } catch (err) {
                    console.error(
                        'Gagal membaca status:',
                        err
                    );
                }
            }



            // AUTO LIKE STATUS
            if (settings.autoLikeSw) {
                try {

                    await sock.sendMessage(
                        m.key.remoteJid,
                        {
                            reactionMessage: {
                                key: {
                                    remoteJid: 'status@broadcast',
                                    id: m.key.id,
                                    participant:
                                        m.key.participant ||
                                        m.participant
                                },
                                text: '❤️'
                            }
                        }
                    );


                    console.log(
                        '✅ Auto like SW berhasil'
                    );

                } catch (err) {

                    console.error(
                        '❌ Gagal like SW:',
                        err
                    );

                }
            }


            return;
        }




        // =========================
        // AUTO READ CHAT
        // =========================

        if (
            !m.key.fromMe &&
            m.key.remoteJid !== 'status@broadcast'
        ) {

            const chatJid = m.key.remoteJid;
            const isGroupChat =
                chatJid.endsWith('@g.us');


            // AUTO READ GRUP
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

                } catch (err) {}

            }



            // AUTO READ PRIVATE
            else if (
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

                } catch (err) {}

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
            /^[°•π÷×¶∆£¢€¥®™_=|~!?#/$%^&.+¬]/gi.test(budy)
                ? budy.match(
                    /^[°•π÷×¶∆£¢€¥®™_=|~!?#/$%^&.+¬]/gi
                  )[0]
                : '';


        const isCmd =
            budy.startsWith(prefix);


        const command =
            isCmd
                ? budy
                    .slice(prefix.length)
                    .trim()
                    .split(' ')
                    .shift()
                    .toLowerCase()
                : '';


        const args =
            budy
                .trim()
                .split(/ +/)
                .slice(1);


        const q =
            args.join(' ');



        const sender =
            m.key.remoteJid;


        const isGroup =
            sender.endsWith('@g.us');


        const botNumber =
            sock.user.id.split(':')[0] +
            '@s.whatsapp.net';



        const ownerNumbers = [
            '628812478704@s.whatsapp.net',
            botNumber
        ];


        const senderNumber =
            sender.includes(':')
                ? sender.split(':')[0] +
                  '@s.whatsapp.net'
                : sender;


        const isOwner =
            ownerNumbers.includes(senderNumber) ||
            ownerNumbers.includes(m.key.participant) ||
            m.key.fromMe;




        // =========================
        // MODE SETTING
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

            } catch (e) {}
        }



        if (mode.isSelf && !isOwner)
            return;


        if (mode.groupOnly && !isGroup)
            return;


        if (mode.privateOnly && isGroup)
            return;




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



        for (let file of pluginFiles) {

            if (file.endsWith('.js')) {

                const pluginPath =
                    path.join(
                        pluginFolder,
                        file
                    );


                delete require.cache[
                    require.resolve(pluginPath)
                ];


                plugins[file] =
                    require(pluginPath);

            }

        }





        // =========================
        // RUN PLUGIN
        // =========================

        for (let name in plugins) {

            const plugin =
                plugins[name];


            let matchCommand =
                false;



            if (
                typeof plugin.command === 'string' &&
                plugin.command === command
            ) {

                matchCommand = true;

            }


            else if (
                Array.isArray(plugin.command) &&
                plugin.command.includes(command)
            ) {

                matchCommand = true;

            }



            if (matchCommand) {


                if (
                    plugin.ownerOnly &&
                    !isOwner
                ) {

                    await sock.sendMessage(
                        sender,
                        {
                            text:
                            'Perintah ini khusus untuk pemilik bot!'
                        },
                        {
                            quoted: m
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

        }



    } catch (e) {

        console.error(
            'Error di handler:',
            e
        );

    }

};