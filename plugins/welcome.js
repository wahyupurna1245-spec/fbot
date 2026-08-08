const fs = require('fs');

const welcomeFile = './welcome.json';


module.exports = {

    command: ['welcome'],

    category: 'group',


    operate: async ({ sock, m, sender, args, isGroup, isOwner }) => {

        try {


            if (!isGroup) {

                return sock.sendMessage(
                    sender,
                    {
                        text: '❌ Fitur ini hanya untuk grup'
                    },
                    {
                        quoted: m
                    }
                );

            }



            if (!isOwner) {

                return sock.sendMessage(
                    sender,
                    {
                        text: '❌ Khusus owner bot'
                    },
                    {
                        quoted: m
                    }
                );

            }



            let welcome = {};


            if (fs.existsSync(welcomeFile)) {

                try {

                    welcome = JSON.parse(
                        fs.readFileSync(welcomeFile)
                    );

                } catch {}

            }



            const groupId = m.key.remoteJid;

            const action = args[0]?.toLowerCase();



            // CEK STATUS

            if (!action) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
`📌 Status Welcome Grup

Status:
${welcome[groupId] ? '✅ ON' : '❌ OFF'}


Cara pakai:

.welcome on
➡️ Aktifkan welcome

.welcome off
➡️ Matikan welcome`
                    },
                    {
                        quoted:m
                    }
                );

            }




            // AKTIFKAN

            if (action === 'on') {


                welcome[groupId] = true;


                fs.writeFileSync(
                    welcomeFile,
                    JSON.stringify(
                        welcome,
                        null,
                        2
                    )
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
`✅ Welcome ON

📌 Grup ini sekarang aktif mengirim pesan member masuk`
                    },
                    {
                        quoted:m
                    }
                );


            }





            // MATIKAN

            if (action === 'off') {


                delete welcome[groupId];


                fs.writeFileSync(
                    welcomeFile,
                    JSON.stringify(
                        welcome,
                        null,
                        2
                    )
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
`✅ Welcome OFF

📌 Grup ini tidak akan mengirim pesan welcome lagi`
                    },
                    {
                        quoted:m
                    }
                );


            }




            return sock.sendMessage(
                sender,
                {
                    text:
`❌ Perintah tidak dikenal

Contoh:
.welcome
.welcome on
.welcome off`
                },
                {
                    quoted:m
                }
            );


        } catch (err) {

            console.log(
                'Welcome plugin error:',
                err
            );

        }

    }

};