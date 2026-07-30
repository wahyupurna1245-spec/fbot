const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');


module.exports = {

    command: ['tomp3', 'toaudio'],
    category: 'converter',


    operate: async ({ sock, m, sender }) => {

        try {

            const quoted =
                m.message?.extendedTextMessage?.contextInfo?.quotedMessage;


            const video =
                m.message?.videoMessage ||
                quoted?.videoMessage;


            if (!video) {
                return sock.sendMessage(sender, {
                    text: '⚠️ Reply video dengan *.tomp3*'
                }, { quoted: m });
            }


            await sock.sendMessage(sender, {
                text: '⏳ Convert video ke MP3...'
            }, { quoted: m });



            const buffer = await downloadMediaMessage(
                {
                    message: quoted || m.message
                },
                'buffer',
                {}
            );


            const id = Date.now();

            const input = `/tmp/${id}.mp4`;
            const output = `/tmp/${id}.mp3`;


            fs.writeFileSync(input, buffer);



            exec(
`ffmpeg -y -i "${input}" -vn -c:a libmp3lame -b:a 128k "${output}"`,
            async (err, stdout, stderr) => {


                if (err) {

                    console.log('FFMPEG:', stderr);

                    return sock.sendMessage(sender, {
                        text: '❌ Gagal convert MP3.'
                    }, { quoted: m });

                }


                await sock.sendMessage(sender, {

                    audio: fs.readFileSync(output),

                    mimetype: 'audio/mpeg',

                    fileName: 'audio.mp3'

                }, {
                    quoted: m
                });



                fs.unlinkSync(input);
                fs.unlinkSync(output);

            });


        } catch (e) {

            console.log('TOMP3 ERROR:', e);

            sock.sendMessage(sender, {
                text: '❌ Error converter.'
            }, { quoted: m });

        }

    }

};