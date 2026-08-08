const os = require('os');


module.exports = {

    command: ['botinfo', 'info'],
    category: 'main',
    ownerOnly: false,


    operate: async ({ sock, m, sender }) => {

        try {

            const uptime =
                process.uptime();


            const jam =
                Math.floor(uptime / 3600);

            const menit =
                Math.floor((uptime % 3600) / 60);

            const detik =
                Math.floor(uptime % 60);



            const memory =
                process.memoryUsage();


            const ram =
                (memory.rss / 1024 / 1024)
                .toFixed(2);



            const nomor =
                sock.user.id
                .split(':')[0];



            const teks =
`╭──〔 🤖 BOT INFO 〕──⬣

👤 Nama Bot:
Fbot Assistant

📱 Nomor Bot:
${nomor}

⏱ Runtime:
${jam} Jam ${menit} Menit ${detik} Detik

🟢 Node.js:
${process.version}

💾 RAM Digunakan:
${ram} MB

💻 OS:
${os.platform()}

🏗 Arch:
${os.arch()}

⚙️ CPU:
${os.cpus()[0].model}

╰━━━━━━━━━━━━⬣`;


            await sock.sendMessage(
                sender,
                {
                    text: teks
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'Botinfo Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Gagal mengambil info bot'
                },
                {
                    quoted:m
                }
            );

        }

    }

};