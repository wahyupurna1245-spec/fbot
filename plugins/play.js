const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['play'],
    category: 'downloader',

    operate: async ({ sock, m, sender, args }) => {

        try {

            const query = args.join(' ');

            if (!query) {
                return sock.sendMessage(sender, {
                    text: '⚠️ Masukkan judul lagu\n\nContoh:\n.play Cinta Luar Biasa'
                }, { quoted: m });
            }


            await sock.sendMessage(sender, {
                text: `🔎 Mencari lagu:\n${query}`
            }, { quoted: m });


            const id = Date.now();

            const output = path.join('/tmp', `${id}.mp3`);


            const command = `
            yt-dlp \
            -x \
            --audio-format mp3 \
            --audio-quality 192K \
            --no-playlist \
            -o "${output}" \
            "ytsearch1:${query}"
            `;


            exec(command, async (error, stdout, stderr) => {


                if (error) {

                    console.log(stderr);

                    return sock.sendMessage(sender, {
                        text: '❌ Gagal download lagu.'
                    }, { quoted: m });

                }


                if (!fs.existsSync(output)) {

                    return sock.sendMessage(sender, {
                        text: '❌ File audio tidak ditemukan.'
                    }, { quoted: m });

                }


                const audio = fs.readFileSync(output);


                await sock.sendMessage(sender, {
                    audio,
                    mimetype: 'audio/mpeg',
                    ptt: false
                }, {
                    quoted: m
                });


                fs.unlinkSync(output);


            });


        } catch (err) {

            console.error('PLAY ERROR:', err);

            await sock.sendMessage(sender, {
                text: '❌ Terjadi error sistem.'
            }, { quoted: m });

        }

    }
};