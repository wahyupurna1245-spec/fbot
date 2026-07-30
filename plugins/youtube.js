const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['yt', 'youtube', 'ytmp4'],
    category: 'downloader',

    operate: async ({ sock, m, sender, args }) => {

        try {

            const input = args.join(' ');

            if (!input) {
                return sock.sendMessage(sender, {
                    text: '⚠️ Masukkan link atau judul video'
                }, { quoted: m });
            }


            await sock.sendMessage(sender, {
                text: '🔎 Mengambil informasi video...'
            }, { quoted: m });


            const target = input.includes('youtube.com') || input.includes('youtu.be')
                ? input
                : `ytsearch1:${input}`;


            // Ambil info video
            exec(`yt-dlp --dump-json --no-playlist "${target}"`, async (err, stdout) => {

                if (err) {
                    return sock.sendMessage(sender, {
                        text: '❌ Gagal mengambil informasi video.'
                    }, { quoted: m });
                }


                let info;

                try {
                    info = JSON.parse(stdout);
                } catch {
                    return sock.sendMessage(sender, {
                        text: '❌ Data video rusak.'
                    }, { quoted: m });
                }


                const title = info.title || 'Tidak ada judul';
                const videoUrl = info.webpage_url || input;
                const description = info.description || 'Tidak ada deskripsi';


                await sock.sendMessage(sender, {
                    text:
`🎬 *${title}*

🔗 Link:
${videoUrl}

📝 Deskripsi:
${description}

⏳ Sedang download video...`
                }, { quoted: m });


                const filePath = path.join(
                    '/tmp',
                    `youtube-${Date.now()}.mp4`
                );


                const cmd = `
yt-dlp \
--extractor-args "youtube:player_client=android" \
-f "best[height<=720]/best" \
--merge-output-format mp4 \
--no-playlist \
-o "${filePath}" \
"${target}"
`;


                exec(cmd, async (error, stdout, stderr) => {

                    if (error) {

                        console.log(stderr);

                        return sock.sendMessage(sender, {
                            text: '❌ Gagal download video.'
                        }, { quoted: m });

                    }


                    if (!fs.existsSync(filePath)) {

                        return sock.sendMessage(sender, {
                            text: '❌ File video tidak ditemukan.'
                        }, { quoted: m });

                    }


                    const video = fs.readFileSync(filePath);


                    await sock.sendMessage(sender, {
                        video,
                        caption:
`✅ *YouTube Downloader*

🎬 ${title}`
                    }, {
                        quoted: m
                    });


                    fs.unlinkSync(filePath);

                });


            });


        } catch (err) {

            console.error(err);

            sock.sendMessage(sender, {
                text: '❌ Terjadi error sistem.'
            }, { quoted: m });

        }

    }
};