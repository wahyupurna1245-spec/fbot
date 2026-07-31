module.exports = {
    command: ['dare'],
    category: 'fun',
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {
        const dare = [
            "Kirim emoji yang menggambarkan perasaanmu sekarang 😆",
            "Ganti foto profil selama 10 menit",
            "Tulis kata pertama yang muncul di pikiranmu",
            "Kirim stiker terakhir yang kamu punya",
            "Sebutkan 3 hal yang kamu suka",
            "Buat pantun lucu sekarang juga",
            "Kirim emoji favoritmu sebanyak 5 kali",
            "Tulis nama makanan yang paling kamu suka",
            "Ketik 'aku keren' tanpa malu 😎",
            "Ceritakan kejadian lucu yang pernah kamu alami",
            "Tirukan suara hewan lewat chat 🐱",
            "Sebutkan 1 cita-cita yang ingin kamu capai",
            "Kirim pesan dengan semua huruf kapital",
            "Sebutkan 5 aplikasi yang sering kamu pakai",
            "Buat kalimat paling random yang kamu bisa",
            "Kirim salam dengan gaya paling unik",
            "Sebutkan teman yang paling sering bikin ketawa",
            "Tulis satu hal yang membuatmu bahagia hari ini",
            "Buat teka-teki untuk orang lain",
            "Ucapkan sesuatu yang positif tentang dirimu"
        ];

        const hasil = dare[Math.floor(Math.random() * dare.length)];

        await sock.sendMessage(sender, {
            text: `🔥 *DARE*

${hasil}

Berani lakukan? 😈`
        }, { quoted: m });
    }
};