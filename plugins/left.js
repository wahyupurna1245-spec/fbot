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
                        text:
                        '❌ Fitur ini hanya untuk grup'
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
                        text:
                        '❌ Khusus owner bot'
                    },
                    {
                        quoted:m
                    }
                );

            }




            let left = {};


            if (fs.existsSync(leftFile)) {

                try {

                    left =
                    JSON.parse(
                        fs.readFileSync(leftFile)
                    );

                } catch {}

            }




            const groupId =
                m.key.remoteJid;


            const action =
                args[0]?.toLowerCase();





            // CEK STATUS

            if (!action) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
`📌 Status Left Grup

Status:
${left[groupId] ? '✅ ON' : '❌ OFF'}


Cara pakai:

.left on
➡️ Aktifkan pesan member keluar

.left off
➡️ Matikan left`
                    },
                    {
                        quoted:m
                    }
                );

            }







            // AKTIFKAN

            if (action === 'on') {


                left[groupId] = true;


                fs.writeFileSync(
                    leftFile,
                    JSON.stringify(
                        left,
                        null,
                        2
                    )
                );



                return sock.sendMessage(
                    sender,
                    {
                        text:
`✅ Left ON

📌 Grup