const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {

    command: ['toimg', 'toimage'],
    category: 'converter',


    operate: async ({ sock, m, sender }) => {

        try {

            const quoted =
                m.message?.extendedTextMessage?.contextInfo?.quotedMessage;


            const sticker =
                m.message?.stickerMessage ||
                quoted?.stickerMessage;


            if (!sticker) {

                return await sock.sendMessage(sender, {
                    text: '⚠️ Reply sticker dengan perintah *.toimg*'
                }, { quoted: m });

            }


            await sock.sendMessage(sender, {
                text: '⏳ Mengubah sticker menjadi gambar...'
            }, { quoted: m });



            const buffer = await downloadMediaMessage(
                {
                    message: quoted
                        ? quoted
                        : m.message
                },
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest: sock.updateMediaMessage
                }
            );



            const id = Date.now();


            const input =
                path.join(
                    '/tmp',
                    `sticker-${id}.webp`
                );


            const output =
                path.join(
                    '/tmp',
                    `image-${id}.png`
                );



            fs.writeFileSync(
                input,
                buffer
            );



            const cmd = `
ffmpeg -i "${input}" \
"${output}"
`;



            exec(cmd, async (err) => {


                if (err) {

                    console.error(
                        'TOIMG ERROR:',
                        err
                    );


                    return await sock.sendMessage(sender, {
                        text: '❌ Gagal mengubah sticker.'
                    }, { quoted: m });

                }



                if (!fs.existsSync(output)) {

                    return await sock.sendMessage(sender, {
                        text: '❌ Gambar tidak ditemukan.'
                    }, { quoted: m });

                }



                await sock.sendMessage(sender, {

                    image:
                    fs.readFileSync(output),

                    caption:
                    '✅ Sticker berhasil diubah menjadi gambar'

                }, {
                    quoted: m
                });



                fs.unlinkSync(input);
                fs.unlinkSync(output);


            });



        } catch (err) {

            console.error(
                'TOIMG ERROR:',
                err
            );


            await sock.sendMessage(sender, {
                text: '❌ Error saat convert sticker.'
            }, { quoted: m });

        }

    }

};