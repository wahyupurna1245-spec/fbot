module.exports = {
    command: ['jokes', 'joke'],
    category: 'fun',
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {
        const jokes = [
            "Kenapa komputer suka ngantuk? Karena kebanyakan buka Windows 😴",
            "Kenapa laptop panas? Karena kebanyakan mikirin masa depan 💻",
            "WiFi kalau putus bikin marah, hubungan kalau putus bikin pasrah 📶",
            "HP jatuh ke lantai yang rusak layar, hati jatuh yang rusak harapan 📱",
            "Kenapa charger selalu dicari? Karena dia satu-satunya yang bisa mengisi kekosongan 🔌",
            "Dompetku tipis bukan karena diet, tapi karena banyak pengeluaran 💸",
            "Kalau uang bisa bicara, mungkin dia sudah minta pindah rumah 😂",
            "Aku bukan malas, aku cuma sedang menghemat tenaga 🔋",
            "Alarm pagi adalah musuh yang selalu datang tepat waktu ⏰",
            "Kenapa mie instan cepat matang? Karena dia tidak suka menunggu 🍜",
            "Kalau hidup terasa berat, coba cek tas, mungkin ada batu di dalamnya 🤣",
            "Kuota habis lebih menyakitkan daripada chat cuma dibaca 😭",
            "HP lowbat mengajarkan kita arti sebuah perjuangan 🔋",
            "Kenapa kucing duduk di keyboard? Karena dia ingin jadi programmer 🐱",
            "Kalau gagal jangan menyerah, mungkin servernya sedang maintenance",
            "Kerja keras itu penting, tapi tidur keras juga penting 😴",
            "Jangan menilai buku dari sampulnya, kecuali buku menu restoran 🍔",
            "Uang memang bukan segalanya, tapi segalanya butuh uang 💰",
            "Kenapa ayam berkokok pagi? Karena dia tidak punya alarm 🐔",
            "Orang bilang sabar ada batasnya, ternyata batasnya habis duluan 😂",
            "Kalau cinta itu buta, kenapa masih lihat foto profil?",
            "Jomblo bukan masalah, yang masalah kuota selalu habis",
            "Teman sejati adalah yang tetap ada saat WiFi mati",
            "Kadang diam itu emas, tapi kalau ditanya tetap jawab ya 😆",
            "Jangan takut tua, takut lupa password akun sendiri",
            "Makan banyak bukan rakus, itu namanya isi tenaga 🍚",
            "Kalau malas olahraga, minimal olahraga jempol main HP",
            "Kecepatan internet menentukan tingkat kesabaran manusia",
            "Printer saja bisa error, apalagi manusia",
            "Google tahu banyak hal, tapi tidak tahu isi hati seseorang",
            "Keyboard tidak pernah mengeluh walau selalu ditekan",
            "Mouse komputer mengajarkan bahwa bergerak sedikit tetap ada hasil",
            "Kalau hidup seperti game, jangan lupa save progress 🎮",
            "Jangan bandingkan hidupmu dengan orang lain, sinyal saja beda-beda",
            "Orang sukses pernah gagal, orang gagal kadang lupa mencoba",
            "Semua orang punya cerita, tukang parkir punya banyak kendaraan",
            "Kalau ada masalah jangan dipendam, nanti jadi file corrupt",
            "Jangan lupa bahagia, karena charger saja selalu siap mengisi",
            "Kesabaran itu seperti baterai, kalau habis perlu diisi ulang",
            "Kalau pikiran penuh, coba kosongkan dengan tidur",
            "Teman yang baik itu seperti powerbank, membantu saat lowbat",
            "Jangan cari yang sempurna, cari yang mau menerima bug kamu",
            "Kadang rencana terbaik adalah makan lalu tidur",
            "Bahagia itu sederhana, misalnya kuota masih banyak",
            "Aku bukan malas, aku cuma mode hemat energi",
            "Kalau hidup susah, jangan lupa masih punya tombol restart",
            "Masalah datang silih berganti seperti notifikasi grup",
            "Jangan menyerah, kecuali menyerah push rank dulu 🎮"
        ];

        const hasil = jokes[Math.floor(Math.random() * jokes.length)];

        await sock.sendMessage(sender, {
            text: `😂 *JOKES*

${hasil}`
        }, { quoted: m });
    }
};