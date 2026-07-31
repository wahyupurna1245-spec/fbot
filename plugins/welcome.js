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
                        text:
                        '❌ Fitur ini hanya untuk grup'
                    },
                    {
                        quoted:m
                    }
                );

            }



            // hanya owner bot
            if (!isOwner) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ Khusus owner bot'
                    },
                    {
                        quoted:m
                    }
                );

            }



            const action =
                args[0]?.toLowerCase();



            let welcome = {};



            if (fs.existsSync(welcomeFile)) {

                try {

                    welcome =
                    JSON.parse(
                        fs.readFileSync(welcomeFile)
                    );

                } catch {}

            }



            const groupId =
                m.key.remoteJid;



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
`✅ Welcome aktif

📌 Grup ini sekarang akan mengirim pesan saat ada member baru masuk`
                    },
                    {
                        quoted:m
                    }
                );


            }



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
                        '✅ Welcome dimatikan di grup ini'
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
`Cara pakai:

.welcome on
➡️ Aktifkan welcome grup

.welcome off
➡️ Matikan welcome grup`
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