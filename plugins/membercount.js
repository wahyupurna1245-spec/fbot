module.exports = {

    command: ['member'],
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


            const total =
                metadata.participants.length;


            const admin =
                metadata.participants.filter(
                    v =>
                    v.admin === 'admin' ||
                    v.admin === 'superadmin'
                ).length;


            const biasa =
                total - admin;



            const teks =
`╭──〔 👥 MEMBER INFO 〕──⬣

📌 Grup:
${metadata.subject}

👥 Total Member:
${total}

👑 Admin:
${admin}

🙂 Member:
${biasa}

╰━━━━━━━━━━━━⬣`;


            await sock.sendMessage(
                sender,
                {
                    text: teks
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'Membercount Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Gagal mengambil data member'
                },
                {
                    quoted:m
                }
            );

        }

    }

};       );

        }

    }

};