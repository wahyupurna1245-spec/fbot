const fs = require('fs');
const { exec } = require('child_process');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {

    command: ['tovideo', 'tovid'],
    category: 'converter',

    operate: async ({ sock, m, sender }) => {

        try {

            const quoted =
                m.message?.extendedTextMessage?.contextInfo?.quotedMessage;


            const sticker =
                m.message?.stickerMessage ||
                quoted?.stickerMessage;


            if (!sticker) {
                return sock.sendMessage(sender, {
                    text: '⚠️ Reply sticker animasi dengan *.tovideo*'
                }, { quoted: m });
            }


            await sock.sendMessage(sender, {
                text: '⏳ Convert sticker ke video...'
            }, { quoted: m });



            const buffer = await downloadMediaMessage(
                {
                    message: quoted || m.message
                },
                'buffer',
                {}
            );


            const id = Date.now();

            const input = `/tmp/${id}.webp`;
            const output = `/tmp/${id}.mp4`;


            fs.writeFileSync(input, buffer);



            exec(
`ffmpeg -y -i "${input}" -c:v libx264 -pix_fmt yuv420p "${output}"`,
            async (err) => {


                if (err) {
                    console.log(err);

                    return sock.sendMessage(sender, {
                        text: '❌ Gagal convert.'
                    }, { quoted: m });
                }


                await sock.sendMessage(sender, {
                    video: fs.readFileSync(output),
                    caption: '✅ Sticker → Video'
                }, { quoted: m });


                fs.unlinkSync(input);
                fs.unlinkSync(output);

            });


        } catch (e) {

            console.log(e);

            sock.sendMessage(sender, {
                text: '❌ Error.'
            }, { quoted: m });

        }

    }

};