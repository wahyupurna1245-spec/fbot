module.exports = {

    command: [
        'setnamegc',
        'setdescgc',
        'setppgc',
        'revoke'
    ],

    category: 'group',
    ownerOnly: false,


    operate: async ({
        sock,
        m,
        sender,
        command,
        args,
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



            const user =
            m.key.participant ||
            sender;



            const userData =
            metadata.participants.find(
                p =>
                p.id === user ||
                p.jid === user
            );



            const isAdmin =
            userData &&
            (
                userData.admin === 'admin' ||
                userData.admin === 'superadmin'
            );



            if (!isAdmin) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ Hanya admin grup'
                    },
                    {
                        quoted:m
                    }
                );

            }



// =====================
// SET NAMA GRUP (REPLY)
// =====================

if (command === 'setnamegc') {

    const quoted =
    m.message
    ?.extendedTextMessage
    ?.contextInfo
    ?.quotedMessage;


    const nama =
    quoted?.conversation ||
    quoted?.extendedTextMessage?.text ||
    args.join(' ');


    if (!nama) {

        return sock.sendMessage(
            sender,
            {
                text:
`❌ Reply pesan atau tulis nama baru

Contoh:
.reply Nama Baru
.setnamegc`
            },
            {
                quoted:m
            }
        );

    }


    await sock.groupUpdateSubject(
        sender,
        nama
    );


    return sock.sendMessage(
        sender,
        {
            text:
            '✅ Nama grup berhasil diganti'
        }
    );

}



// =====================
// SET DESKRIPSI GRUP (REPLY)
// =====================

if (command === 'setdescgc') {

    const quoted =
    m.message
    ?.extendedTextMessage
    ?.contextInfo
    ?.quotedMessage;


    const desc =
    quoted?.conversation ||
    quoted?.extendedTextMessage?.text ||
    args.join(' ');


    if (!desc) {

        return sock.sendMessage(
            sender,
            {
                text:
`❌ Reply pesan atau tulis deskripsi baru

Contoh:
.reply Deskripsi grup
.setdescgc`
            },
            {
                quoted:m
            }
        );

    }


    await sock.groupUpdateDescription(
        sender,
        desc
    );


    return sock.sendMessage(
        sender,
        {
            text:
            '✅ Deskripsi grup berhasil diganti'
        }
    );

}
            // =====================
            // SET FOTO GRUP
            // =====================

            if (command === 'setppgc') {


                const quoted =
                m.message
                ?.extendedTextMessage
                ?.contextInfo
                ?.quotedMessage;



                const image =
                quoted?.imageMessage;



                if (!image) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
`❌ Reply gambar

Contoh:
.reply gambar
.setppgc`
                        },
                        {
                            quoted:m
                        }
                    );

                }



                const {
                    downloadContentFromMessage
                } =
                require('@whiskeysockets/baileys');



                const stream =
                await downloadContentFromMessage(
                    image,
                    'image'
                );



                let buffer =
                Buffer.from([]);



                for await (const chunk of stream) {

                    buffer =
                    Buffer.concat(
                        [
                            buffer,
                            chunk
                        ]
                    );

                }



                await sock.updateProfilePicture(
                    sender,
                    buffer
                );



                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Foto grup berhasil diganti'
                    }
                );

            }



            // =====================
            // RESET LINK
            // =====================

            if (command === 'revoke') {


                await sock.groupRevokeInvite(
                    sender
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Link grup berhasil direset'
                    }
                );

            }



        } catch(err) {

            console.log(
                'Group Admin Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Gagal

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};