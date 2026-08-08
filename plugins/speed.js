const https = require('https');

module.exports = {

    command: ['speed', 'speedtest'],
    category: 'tools',

    operate: async ({ sock, m, sender }) => {

        try {

            await sock.sendMessage(sender, {
                text: '🚀 Mengecek kecepatan internet...'
            }, { quoted: m });


            const url = 'https://speed.cloudflare.com/__down?bytes=10000000';

            const start = Date.now();
            let total = 0;


            https.get(url, (res) => {

                res.on('data', chunk => {
                    total += chunk.length;
                });


                res.on('end', async () => {

                    const time =
                        (Date.now() - start) / 1000;


                    const bytesPerSecond =
                        total / time;


                    function formatSpeed(bytes) {

                        const kb = bytes / 1024;
                        const mb = kb / 1024;
                        const gb = mb / 1024;


                        if (gb >= 1)
                            return gb.toFixed(2) + ' GB/s';

                        if (mb >= 1)
                            return mb.toFixed(2) + ' MB/s';

                        return kb.toFixed(2) + ' KB/s';

                    }


                    await sock.sendMessage(sender, {
                        text:
`🚀 *INTERNET SPEED*

⬇️ Download:
${formatSpeed(bytesPerSecond)}

📦 Data:
${(total / 1024 / 1024).toFixed(2)} MB

⏱️ Waktu:
${time.toFixed(2)} detik`
                    }, { quoted:m });


                });


            });


        } catch (e) {

            console.log(e);

            await sock.sendMessage(sender,{
                text:'❌ Gagal cek speed'
            },{quoted:m});

        }

    }
};