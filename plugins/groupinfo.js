module.exports = {

    command: ['groupinfo', 'infogc'],
    category: 'group',
    ownerOnly: false,

    operate: async ({ sock, m, sender, isGroup }) => {

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


        try {

            const metadata =
                await sock.groupMetadata(sender);


            const owner =
                metadata.owner
                ? metadata.owner.split('@')[0]
                : 'Tidak diketahui';


            const admins =
                metadata.participants
                .filter(v => v.admin)
                .map(v =>
                    `• @${v.id.split('@')[0]}`
                )
                .join('\n');


            const teks =
`╭━━━〔 INFO GROUP 〕━━━╮

📌 Nama:
${metadata.subject}

🆔 ID:
${metadata.id}

👥 Member:
${metadata.participants.length}

👑 Owner:
@${owner}

🛡 Admin:
${admins || 'Tidak ada'}

╰━━━━━━━━━━━━━━━━╯`;


            await sock.sendMessage(
                sender,
                {
                    text: teks,
                    mentions:
                    metadata.participants
                    .filter(v => v.admin)
                    .map(v => v.id)
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'GroupInfo Error:',
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