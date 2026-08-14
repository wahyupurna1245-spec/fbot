module.exports = {
    command: ['dadu'],
    category: 'fun',
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {
        const angka = Math.floor(Math.random() * 6) + 1;

        const gambar = {
            1: '⚀',
            2: '⚁',
            3: '⚂',
            4: '⚃',
            5: '⚄',
            6: '⚅'
        };

        await sock.sendMessage(sender, {
            text: `🎲 *LEMPAR DADU*

Hasil:
${gambar[angka]} ${angka}

Lempar lagi kalau penasaran 😆`
        }, { quoted: m });
    }
};