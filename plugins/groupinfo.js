module.exports = {

    command: [
        'groupinfo',
        'infogc'
    ],

    category: 'group',
    ownerOnly: false,


    operate: async ({
        sock,
        m,
        sender,
        isGroup
    }) => {

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



            const metadata =
            await sock.groupMetadata(sender);



            const owner =
            metadata.owner ||
            null;



            const admins =
            metadata.participants.filter(
                p =>
                p.admin === 'admin' ||
                p.admin === 'superadmin'
            );



            const member =
            metadata.participants.length;



            let link =
            '-';


            try {

                const code =
                await sock.groupInviteCode(
                    sender
                );

                link =
                `https://chat.whatsapp.com/${code}`;

            } catch {}



            let ownerText =
            '-';


            let mentions =
            [];


            if (owner) {

                ownerText =
                '@' +
                owner.split('@')[0];

                mentions.push(
                    owner
                );

            }



            let created =
            '-';


            if (metadata.creation) {

                created =
                new Date(
                    metadata.creation * 1000
                )
                .toLocaleString(
                    'id-ID'
                );

            }



            let botNumber =
            sock.user.id.split(':')[0] +
            '@s.whatsapp.net';



            const botAdmin =
            metadata.participants.some(
                p =>
                (
                    p.id === botNumber ||
                    p.jid === botNumber
                )
                &&
                (
                    p.admin === 'admin' ||
                    p.admin === 'superadmin'
                )
            );



            const text =
`╭━━〔 👥 GROUP INFO 〕━━╮

📌 Nama:
${metadata.subject}

🆔 ID:
${sender}

👑 Owner:
${ownerText}

👥 Member:
${member} orang

🛡️ Admin:
${admins.length} orang

🤖 Bot:
${botAdmin ? '✅ Admin' : '❌ Bukan Admin'}

📅 Dibuat:
${created}

📝 Deskripsi:
${metadata.desc || '-'}

🔗 Link:
${link}

╰━━━━━━━━━━━━━━╯`;



            let pp = null;


            try {

                pp =
                await sock.profilePictureUrl(
                    sender,
                    'image'
                );

            } catch {}



            if (pp) {

                return sock.sendMessage(
                    sender,
                    {
                        image:{
                            url:pp
                        },
                        caption:text,
                        mentions
                    },
                    {
                        quoted:m
                    }
                );

            }



            await sock.sendMessage(
                sender,
                {
                    text,
                    mentions
                },
                {
                    quoted:m
                }
            );



        } catch(err) {

            console.log(
                'Groupinfo Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Gagal mengambil info grup

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};