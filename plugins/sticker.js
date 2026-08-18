const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');


module.exports = {

    command: [
        's',
        'sticker',
        'stiker'
    ],

    category: 'maker',


    operate: async ({ sock, m, sender }) => {

        try {

            const quoted =
            m.message?.extendedTextMessage
            ?.contextInfo
            ?.quotedMessage;


            const isImage =
            m.message?.imageMessage ||
            quoted?.imageMessage;


            const isVideo =
            m.message?.videoMessage ||
            quoted?.videoMessage;



            if(!isImage && !isVideo){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Kirim foto/video lalu reply:

.s`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Membuat sticker 1080...'
            },{quoted:m});



            const mediaMsg =
            quoted
            ? { message: quoted }
            : m;



            const buffer =
            await downloadMediaMessage(
                mediaMsg,
                'buffer',
                {},
                {
                    logger: console,
                    reuploadRequest:
                    sock.updateMediaMessage
                }
            );



            const id =
            Date.now();



            const input =
            path.join(
                '/tmp',
                `sticker-${id}.${isVideo?'mp4':'jpg'}`
            );


            const output =
            path.join(
                '/tmp',
                `sticker-${id}.webp`
            );



            fs.writeFileSync(
                input,
                buffer
            );



            let cmd;



            if(isVideo){

                cmd =
`
ffmpeg -y \
-i "${input}" \
-t 8 \
-vf "scale=1080:1080:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1,fps=15" \
-c:v libwebp \
-lossless 0 \
-q:v 40 \
-loop 0 \
"${output}"
`;

            } else {


                cmd =
`
ffmpeg -y \
-i "${input}" \
-vf "scale=1080:1080:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1" \
-c:v libwebp \
-lossless 0 \
-q:v 40 \
"${output}"
`;

            }



            exec(cmd, async(err)=>{


                if(err){

                    console.log(
                        'FFMPEG ERROR:',
                        err
                    );


                    return sock.sendMessage(sender,{
                        text:
                        '❌ Gagal membuat sticker'
                    },{quoted:m});

                }



                if(!fs.existsSync(output)){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Sticker tidak ditemukan'
                    },{quoted:m});

                }



                await sock.sendMessage(sender,{
                    sticker:
                    fs.readFileSync(output)
                },{
                    quoted:m
                });



                try{

                    fs.unlinkSync(input);
                    fs.unlinkSync(output);

                }catch{}



            });



        }catch(e){

            console.log(
                'STICKER ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
                '❌ Error membuat sticker'
            },{quoted:m});

        }

    }

};