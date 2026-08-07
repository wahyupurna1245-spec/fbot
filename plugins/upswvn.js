const { downloadMediaMessage } = require('@whiskeysockets/baileys');


module.exports = {

    command: ['upswvn'],

    category: 'owner',

    ownerOnly: true,


    operate: async ({ sock, m, sender }) => {

        try {

            const quoted =
            m.message?.extendedTextMessage
            ?.contextInfo
            ?.quotedMessage;



            if(!quoted){

                return sock.sendMessage(sender,{
                    text:
`❌ Reply VN dulu

Cara:
1. Kirim voice note
2. Reply VN
3. Ketik:
.upswvn`
                },{quoted:m});

            }



            const audioMessage =
            quoted.audioMessage;



            if(!audioMessage){

                return sock.sendMessage(sender,{
                    text:
                    '❌ Yang direply harus voice note WhatsApp'
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Memproses VN...'
            },{quoted:m});



            const buffer =
            await downloadMediaMessage(
                {
                    message: quoted
                },
                'buffer',
                {}
            );



            let statusList = [];

            try {

                statusList =
                Object.keys(
                    sock.store?.contacts || {}
                );

            } catch(e){}



            if(statusList.length === 0){

                statusList = [
                    sender
                ];

            }



            await sock.sendMessage(
                'status@broadcast',
                {
                    audio: buffer,
                    mimetype:
                    'audio/ogg; codecs=opus',
                    ptt:true
                },
                {
                    statusJidList: statusList
                }
            );



            await sock.sendMessage(sender,{
                text:
                '✅ Voice note berhasil dibuat SW'
            },{quoted:m});



        }catch(e){

            console.log(
                'UPSWVN ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
`❌ UPSWVN ERROR

${e.message}`
            },{quoted:m});

        }

    }

};