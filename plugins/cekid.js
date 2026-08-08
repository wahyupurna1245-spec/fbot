module.exports = {
    command: ['cekid'],
    ownerOnly: false,

    operate: async ({ sock, m, sender, prefix, command }) => {

        const teksBalasan = `
🆔 *CEK ID*

👤 Nomor kamu:
${sender}

💬 Chat ID:
${m.chat || m.key.remoteJid}
        `;

        await sock.sendMessage(
            sender,
            {
                text: teksBalasan
            },
            {
                quoted: m
            }
        );
    }
};