const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');


module.exports = {

    command: [
        'setimagebot',
        'setaudiobot'
    ],

    category: 'owner',

    ownerOnly: true,


    operate: async ({ sock, m, sender, command }) => {

        try {

            const quoted =
                m.message?.extendedTextMessage
                ?.contextInfo
                ?.quotedMessage;


            if (!quoted) {

                return sock.sendMessage(sender,{
                    text:
`❌ Reply media dulu

Contoh:
1. Kirim gambar
2. Reply:
.setimagebot

Audio:
1. Kirim audio/voice note
2. Reply:
.setaudiobot`
                },{quoted:m});

            }



            const folder =
                __dirname;



            let fileName;



            if(command === 'setimagebot'){


                if(
                    !quoted.imageMessage
                ){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Reply gambar untuk set image bot'
                    },{quoted:m});

                }


                fileName =
                'menu.jpg';


            }



            if(command === 'setaudiobot'){


                if(
                    !quoted.audioMessage
                ){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Reply audio/voice note untuk set audio bot'
                    },{quoted:m});

                }


                fileName =
                'menu.mp3';

            }




            const buffer =
            await downloadMediaMessage(
                {
                    message: quoted
                },
                'buffer',
                {}
            );



            const save =
            path.join(
                folder,
                fileName
            );



            fs.writeFileSync(
                save,
                buffer
            );



            await sock.sendMessage(sender,{
                text:
`✅ Berhasil mengubah media bot

📁 File:
${fileName}

Lokasi:
plugins/${fileName}`
            },{quoted:m});



        } catch(e){

            console.log(
                'SET MEDIA ERROR:',
                e
            );


            sock.sendMessage(sender,{
                text:
                '❌ Gagal menyimpan media'
            },{quoted:m});

        }

    }

};