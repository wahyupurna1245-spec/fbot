const fs = require('fs');

const leftFile = './left.json';


module.exports = {

    command: ['left'],

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
                        quoted:m
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
                        quoted:m
                    }
                );
            }


            let left = {};

            if (fs.existsSync(leftFile)) {
                try {
                    left = JSON.parse(
                        fs.readFileSync(leftFile)
                    );
                } catch {}
            }


            const groupId = m.key.remoteJid;
            const action = args[0]?.toLowerCase();



            if (action === 'on') {

                left[groupId] = true;

                fs.writeFileSync(
                    leftFile,
                    JSON.stringify(left, null, 2)
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
`✅ Left aktif

Member keluar akan mendapat pesan perpisahan`
                    },
                    {
                        quoted:m
                    }
                );

            }



            if (action === 'off') {

                delete left[groupId];

                fs.writeFileSync(
                    leftFile,
                    JSON.stringify(left, null, 2)
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Left dimatikan di grup ini'
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
`Cara:

.left on
➡️ Aktifkan pesan member keluar

.left off
➡️ Matikan left`
                },
                {
                    quoted:m
                }
            );


        } catch (err) {

            console.log(
                'Left error:',
                err
            );

        }

    }

};