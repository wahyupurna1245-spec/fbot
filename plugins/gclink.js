module.exports = {
    command: ['gclink', 'linkgc'],
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {
        try {
            let chatId = m.key.remoteJid;

            console.log('GCLINK CHAT:', chatId);

            let metadata = await sock.groupMetadata(chatId);

            console.log('GROUP:', metadata.subject);

            let code = await sock.groupInviteCode(chatId);

            console.log('CODE:', code);

            await sock.sendMessage(
                sender,
                {
                    text:
`🔗 *LINK GRUP*

👥 Nama:
${metadata.subject}

https://chat.whatsapp.com/${code}`
                },
                { quoted: m }
            );

        } catch (err) {
            console.log('GCLINK ERROR:', err);

            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Error gclink

${err.message}`
                },
                { quoted: m }
            );
        }
    }
};