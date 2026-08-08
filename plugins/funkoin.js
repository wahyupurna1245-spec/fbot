module.exports = {
    command: ['koin', 'coin'],
    category: 'fun',
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {
        const hasil = Math.random() < 0.5 ? '🪙 Kepala' : '🪙 Ekor';

        await sock.sendMessage(sender, {
            text: `🪙 *LEMPAR KOIN*

Hasil:
${hasil}

Coba lagi kalau penasaran 😆`
        }, { quoted: m });
    }
};