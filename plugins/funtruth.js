module.exports = {
    command: ['truth'],
    category: 'fun',
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {
        const truth = [
            "Siapa orang terakhir yang kamu chat?",
            "Apa hal paling memalukan yang pernah kamu lakukan?",
            "Siapa orang yang paling kamu rindukan saat ini?",
            "Pernah bohong kepada orang tua? Tentang apa?",
            "Apa rahasia kecil yang belum pernah kamu ceritakan?",
            "Siapa orang yang membuat kamu tersenyum akhir-akhir ini?",
            "Apa kebiasaan burukmu yang ingin kamu hilangkan?",
            "Pernah pura-pura sibuk agar tidak membalas chat?",
            "Apa hal yang paling kamu takutkan?",
            "Siapa orang yang paling berpengaruh dalam hidupmu?",
            "Apa impian terbesar yang ingin kamu capai?",
            "Pernah suka diam-diam sama seseorang?",
            "Apa makanan yang tidak pernah bosan kamu makan?",
            "Apa hal paling bodoh yang pernah kamu lakukan?",
            "Kalau bisa mengulang waktu, apa yang ingin kamu ubah?",
            "Apa aplikasi yang paling sering kamu buka?",
            "Pernah stalking seseorang? Siapa?",
            "Apa sifat burukmu yang jarang diketahui orang?",
            "Siapa orang yang paling sering membuatmu kesal?",
            "Apa hal sederhana yang bisa membuatmu bahagia?"
        ];

        const hasil = truth[Math.floor(Math.random() * truth.length)];

        await sock.sendMessage(sender, {
            text: `🎭 *TRUTH*

${hasil}

Jawab dengan jujur 😆`
        }, { quoted: m });
    }
};