const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    command: ['s', 'sticker', 'stiker'],
    category: 'maker',

    operate: async ({ sock, m, sender }) => {

        try {

            const quoted =
                m.message?.extendedTextMessage?.contextInfo?.quotedMessage;


            const isImage =
                m.message?.imageMessage ||
                quoted?.imageMessage;


            const isVideo =
                m.message?.videoMessage ||
                quoted?.videoMessage;


            if (!isImage && !isVideo) {
                return await sock.sendMessage(sender, {
                    text: '⚠️ Kirim foto/video lalu reply dengan *.s*'
                }, { quoted: m });
            }


            await sock.sendMessage(sender, {
                text: '⏳ Membuat sticker...'
            }, { quoted: m });


            const mediaMsg = quoted
                ? { message: quoted }
                : m;


            const buffer = await downloadMediaMessage(
                mediaMsg,
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
                }
            );


            const id = Date.now();


            const input = path.join(
                '/tmp',
                `media-${id}.${isVideo ? 'mp4' : 'jpg'}`
            );


            const output = path.join(
                '/tmp',
                `sticker-${id}.webp`
            );


            fs.writeFileSync(input, buffer);


            let cmd;


            if (isVideo) {

                cmd = `
ffmpeg -i "${input}" \
-t 8 \
-vf "scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white" \
-c:v libwebp \
-lossless 0 \
-q:v 50 \
-loop 0 \
"${output}"
`;

            } else {

                cmd = `
ffmpeg -i "${input}" \
-vf "scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=white" \
-c:v libwebp \
-lossless 0 \
-q:v 50 \
"${output}"
`;

            }


            exec(cmd, async (err) => {


                if (err) {

                    console.error('FFMPEG ERROR:', err);

                    return await sock.sendMessage(sender, {
                        text: '❌ Gagal convert sticker.'
                    }, { quoted: m });

                }


                if (!fs.existsSync(output)) {

                    return await sock.sendMessage(sender, {
                        text: '❌ File sticker tidak ditemukan.'
                    }, { quoted: m });

                }


                await sock.sendMessage(sender, {
                    sticker: fs.readFileSync(output)
                }, {
                    quoted: m
                });


                // hapus file tmp
                fs.unlinkSync(input);
                fs.unlinkSync(output);


            });


        } catch (err) {

            console.error('STICKER ERROR:', err);

            await sock.sendMessage(sender, {
                text: '❌ Terjadi error saat membuat sticker.'
            }, { quoted: m });

        }

    }
};