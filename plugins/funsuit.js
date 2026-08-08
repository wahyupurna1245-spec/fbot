module.exports = {
    command: ['suit'],
    category: 'fun',
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {
        const text = m.message?.conversation || 
                     m.message?.extendedTextMessage?.text || '';

        const args = text.trim().split(' ').slice(1)[0];

        if (!args) {
            return sock.sendMessage(sender, {
                text: `🎮 *SUIT GAME*

Cara main:
.suit batu
.suit gunting
.suit kertas`
            }, { quoted: m });
        }

        const pilihan = {
            batu: '🪨 Batu',
            gunting: '✂️ Gunting',
            kertas: '📄 Kertas'
        };

        const user = pilihan[args.toLowerCase()];

        if (!user) {
            return sock.sendMessage(sender, {
                text: '❌ Pilihan salah!\nPilih: batu / gunting / kertas'
            }, { quoted: m });
        }

        const bot = Object.values(pilihan)[Math.floor(Math.random() * 3)];

        let hasil;

        if (user === bot) {
            hasil = '🤝 Seri';
        } else if (
            (user === '🪨 Batu' && bot === '✂️ Gunting') ||
            (user === '✂️ Gunting' && bot === '📄 Kertas') ||
            (user === '📄 Kertas' && bot === '🪨 Batu')
        ) {
            hasil = '🎉 Kamu menang';
        } else {
            hasil = '😢 Kamu kalah';
        }

        await sock.sendMessage(sender, {
            text: `🎮 *HASIL SUIT*

👤 Kamu: ${user}
🤖 Bot: ${bot}

${hasil}`
        }, { quoted: m });
    }
};