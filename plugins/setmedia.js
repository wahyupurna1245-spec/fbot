const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');


module.exports = {

    command: [
        'setimagebot',
        'setaudiobot',
        'setvideobot'
    ],

    category: 'owner',

    ownerOnly: true,


    operate: async ({ sock, m, sender, command }) => {

        try {


            const quoted =
            m.message?.extendedTextMessage
            ?.contextInfo
            ?.quotedMessage;



            if(!quoted){

                return sock.sendMessage(sender,{
                    text:
`❌ Reply media dulu

Contoh:

Reply gambar:
.setimagebot

Reply audio/VN:
.setaudiobot

Reply video:
.setvideobot`
                },{quoted:m});

            }



            const mediaFolder =
            path.join(
                process.cwd(),
                'media'
            );


            if(!fs.existsSync(mediaFolder)){

                fs.mkdirSync(
                    mediaFolder,
                    {
                        recursive:true
                    }
                );

            }



            const buffer =
            await downloadMediaMessage(
                {
                    message: quoted
                },
                'buffer',
                {}
            );


// ====================
// SET GAMBAR
// ====================

            if(command === 'setimagebot'){


                if(!quoted.imageMessage){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Reply gambar untuk set image bot'
                    },{quoted:m});

                }


                fs.writeFileSync(
                    path.join(
                        mediaFolder,
                        'menu.jpg'
                    ),
                    buffer
                );


                return sock.sendMessage(sender,{
                    text:
`✅ Image bot berhasil diganti

📁 media/menu.jpg`
                },{quoted:m});

            }




// ====================
// SET AUDIO
// ====================

            if(command === 'setaudiobot'){


                if(
                    !quoted.audioMessage &&
                    !quoted.voiceMessage
                ){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Reply audio atau voice note'
                    },{quoted:m});

                }



                const temp =
                path.join(
                    mediaFolder,
                    'temp_audio'
                );


                const output =
                path.join(
                    mediaFolder,
                    'menu.ogg'
                );



                fs.writeFileSync(
                    temp,
                    buffer
                );



                await sock.sendMessage(sender,{
                    text:
                    '⏳ Mengubah audio...'
                },{quoted:m});



                exec(
`ffmpeg -y -i "${temp}" -c:a libopus -b:a 32k "${output}"`,
                async(error)=>{


                    if(error){

                        return sock.sendMessage(sender,{
                            text:
                            '❌ Gagal convert audio'
                        },{quoted:m});

                    }



                    fs.unlinkSync(temp);



                    await sock.sendMessage(sender,{
                        text:
`✅ Audio bot berhasil diganti

🎙 Format: Voice Note
📁 media/menu.ogg`
                    },{quoted:m});


                });

            }




// ====================
// SET VIDEO BOT
// ====================

            if(command === 'setvideobot'){


                if(!quoted.videoMessage){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Reply video untuk set video bot'
                    },{quoted:m});

                }



                const videoPath =
                path.join(
                    mediaFolder,
                    'bot.mp4'
                );



                fs.writeFileSync(
                    videoPath,
                    buffer
                );



                return sock.sendMessage(sender,{
                    text:
`✅ Video bot berhasil diganti

🎬 Format: MP4
📁 media/bot.mp4`
                },{quoted:m});


            }



        }catch(e){

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