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

Kirim gambar lalu reply:
.setimagebot

Kirim audio/VN lalu reply:
.setaudiobot`
                },{quoted:m});

            }



            const mediaFolder =
                path.join(
                    process.cwd(),
                    'media'
                );



            // buat folder media jika belum ada
            if(!fs.existsSync(mediaFolder)){

                fs.mkdirSync(
                    mediaFolder,
                    { recursive:true }
                );

            }



            let fileName;



            if(command === 'setimagebot'){


                if(!quoted.imageMessage){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Reply gambar untuk set image bot'
                    },{quoted:m});

                }


                fileName =
                'menu.jpg';

            }




            if(command === 'setaudiobot'){


                if(!quoted.audioMessage){

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



            const savePath =
            path.join(
                mediaFolder,
                fileName
            );



            fs.writeFileSync(
                savePath,
                buffer
            );



            await sock.sendMessage(sender,{
                text:
`✅ Media bot berhasil diganti

📁 File:
${fileName}

📂 Lokasi:
media/${fileName}`
            },{quoted:m});



        } catch(e){

            console.log(
                'SET MEDIA ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
                '❌ Gagal menyimpan media'
            },{quoted:m});

        }

    }

};