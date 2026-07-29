const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['yt', 'youtube', 'ytmp4'],
    category: 'downloader',

    operate: async ({ sock, m, sender, args }) => {

        try {

            const url = args[0];

            if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
                return await sock.sendMessage(sender, {
                    text: '⚠️ Masukkan link YouTube!\n\nContoh:\n.yt https://youtu.be/xxxxx'
                }, { quoted: m });
            }

            await sock.sendMessage(sender, {
                text: '⏳ Sedang mengunduh video YouTube...'
            }, { quoted: m });


            const id = Date.now();

            // folder penyimpanan aman untuk Termux
            const tempDir = path.join(__dirname, '../tmp');

            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            const output = path.join(tempDir, `${id}.mp4`);


            const command = `
yt-dlp \
-f "bestvideo[ext=mp4]+bestaudio/best[ext=mp4]/best" \
--merge-output-format mp4 \
--no-playlist \
--paths "${tempDir}" \
-o "${output}" \
"${url}"
`;


            exec(command, async (error, stdout, stderr) => {

                if (error) {
                    console.log(stderr);

                    return await sock.sendMessage(sender, {
                        text: '❌ Gagal download YouTube.\n\n' + stderr
                    }, { quoted: m });
                }


                if (!fs.existsSync(output)) {

                    return await sock.sendMessage(sender, {
                        text: '❌ File video tidak ditemukan.'
                    }, { quoted: m });

                }


                const video = fs.readFileSync(output);


                await sock.sendMessage(sender, {
                    video: video,
                    caption:
`✅ *YouTube Downloader*

📥 Berhasil mengunduh video`
                }, {
                    quoted: m
                });


                fs.unlinkSync(output);

            });


        } catch (err) {

            console.error('YT ERROR:', err);

            await sock.sendMessage(sender, {
                text: '❌ Terjadi error sistem.'
            }, { quoted: m });

        }

    }
};