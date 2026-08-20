module.exports = {

    command: ['listadmin', 'adminlist'],
    category: 'group',
    ownerOnly: false,


    operate: async ({ sock, m, sender, isGroup }) => {

        try {

            if (!isGroup) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ Perintah ini hanya untuk grup'
                    },
                    {
                        quoted:m
                    }
                );

            }


            const metadata =
                await sock.groupMetadata(sender);


            const admins =
                metadata.participants.filter(
                    p =>
                    p.admin === 'admin' ||
                    p.admin === 'superadmin'
                );


            if (!admins.length) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ Tidak ada admin ditemukan'
                    },
                    {
                        quoted:m
                    }
                );

            }


            let teks =
`╭──〔 👑 LIST ADMIN 〕──⬣

📌 Grup:
${metadata.subject}

`;


            let mentions = [];


            admins.forEach((v, i) => {

                const nomor =
                    v.id.split('@')[0];


                teks +=
`${i + 1}. @${nomor}\n`;


                mentions.push(v.id);

            });


            teks +=
`
╰━━━━━━━━━━━━⬣`;


            await sock.sendMessage(
                sender,
                {
                    text: teks,
                    mentions
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'Listadmin Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Gagal mengambil daftar admin'
                },
                {
                    quoted:m
                }
            );

        }

    }

};