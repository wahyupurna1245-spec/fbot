const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = {

    command: ['tovn'],
    category: 'tools',
    ownerOnly: false,

    operate: async ({ sock, m, sender }) => {

        try {

            const quoted =
                m.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted) {
                return sock.sendMessage(sender,{
                    text:
`⚠️ Reply video/audio/file dulu

Contoh:
Reply video
.tovn`
                },{quoted:m});
            }


            const temp = `/tmp/tovn_${Date.now()}`;
            const input = temp + '.input';
            const output = temp + '.ogg';


            const msg = {
                key:{
                    remoteJid: sender,
                    id: m.message.extendedTextMessage.contextInfo.stanzaId
                },
                message: quoted
            };


            const buffer = await downloadMediaMessage(
                msg,
                'buffer',
                {},
                {
                    logger: console
                }
            );


            fs.writeFileSync(input, buffer);



            await new Promise((resolve,reject)=>{

                exec(
`ffmpeg -y -i "${input}" -vn -c:a libopus -b:a 48k -ar 48000 -ac 1 -application voip "${output}"`,
                    (err,stdout,stderr)=>{

                        if(err){
                            console.log(stderr);
                            reject(err);
                        } else {
                            resolve();
                        }

                    }
                );

            });



            const audio = fs.readFileSync(output);


            await sock.sendMessage(sender,{
                audio: audio,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true
            },{quoted:m});



            fs.unlinkSync(input);
            fs.unlinkSync(output);



        } catch(e){

            console.log('TOVN ERROR:',e);

            await sock.sendMessage(sender,{
                text:'❌ Gagal membuat VN'
            },{quoted:m});

        }

    }

};