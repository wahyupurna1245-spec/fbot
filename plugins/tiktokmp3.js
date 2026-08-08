const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['tiktokmp3', 'ttmp3'],
    category: 'downloader',

    operate: async ({ sock, m, sender, args }) => {

        try {

            const url = args[0];

            if (!url || !url.includes('tiktok.com')) {
                return await sock.sendMessage(sender, {
                    text: `⚠️ Masukkan link TikTok

Contoh:
.ttmp3 https://vt.tiktok.com/xxxxx`
                }, { quoted: m });
            }


            await sock.sendMessage(sender, {
                text: '⏳ Mengambil audio TikTok...'
            }, { quoted: m });


            const filePath = path.join(
                '/tmp',
                `tiktok-${Date.now()}.mp3`
            );


            const cmd = `
yt-dlp \
-x \
--audio-format mp3 \
--audio-quality 192K \
--no-playlist \
-o "${filePath}" \
"${url}"
`;


            exec(cmd, async (error, stdout, stderr) => {


                if (error) {

                    console.log('TTMP3 ERROR:', stderr);

                    return await sock.sendMessage(sender, {
                        text: '❌ Gagal mengambil audio TikTok.'
                    }, { quoted: m });

                }


                if (!fs.existsSync(filePath)) {

                    return await sock.sendMessage(sender, {
                        text: '❌ File audio tidak ditemukan.'
                    }, { quoted: m });

                }


                const audio = fs.readFileSync(filePath);


                await sock.sendMessage(sender, {
                    audio,
                    mimetype: 'audio/mpeg',
                    fileName: 'tiktok.mp3'
                }, {
                    quoted: m
                });


                fs.unlinkSync(filePath);


            });


        } catch (err) {

            console.error('TTMP3 ERROR:', err);

            await sock.sendMessage(sender, {
                text: '❌ Terjadi error sistem.'
            }, { quoted: m });

        }

    }
};