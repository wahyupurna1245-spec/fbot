module.exports = {

    command: [
        'open',
        'close',
        'kick',
        'promote',
        'demote',
        'add'
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
                        quoted: m
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
                        '❌ Hanya admin grup yang bisa menggunakan fitur ini'
                    },
                    {
                        quoted:m
                    }
                );

            }



            // OPEN GROUP

            if (command === 'open') {

                await sock.groupSettingUpdate(
                    sender,
                    'not_announcement'
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Grup berhasil dibuka'
                    }
                );

            }



            // CLOSE GROUP

            if (command === 'close') {

                await sock.groupSettingUpdate(
                    sender,
                    'announcement'
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '🔒 Grup berhasil ditutup'
                    }
                );

            }



            // TARGET MEMBER

            const target =
            m.message
            ?.extendedTextMessage
            ?.contextInfo
            ?.mentionedJid?.[0];



            // KICK

            if (command === 'kick') {

                if (!target) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            '❌ Tag member yang ingin dikeluarkan'
                        },
                        {
                            quoted:m
                        }
                    );

                }


                await sock.groupParticipantsUpdate(
                    sender,
                    [target],
                    'remove'
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Member berhasil dikeluarkan'
                    }
                );

            }



            // PROMOTE

            if (command === 'promote') {

                if (!target) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            '❌ Tag member yang ingin dijadikan admin'
                        },
                        {
                            quoted:m
                        }
                    );

                }


                await sock.groupParticipantsUpdate(
                    sender,
                    [target],
                    'promote'
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Member berhasil menjadi admin'
                    }
                );

            }



            // DEMOTE

            if (command === 'demote') {

                if (!target) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            '❌ Tag admin yang ingin diturunkan'
                        },
                        {
                            quoted:m
                        }
                    );

                }


                await sock.groupParticipantsUpdate(
                    sender,
                    [target],
                    'demote'
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Admin berhasil diturunkan'
                    }
                );

            }



            // ADD MEMBER

            if (command === 'add') {

                const nomor =
                args.join('')
                .replace(
                    /[^0-9]/g,
                    ''
                );


                if (!nomor) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            'Contoh:\n.add 628123456789'
                        },
                        {
                            quoted:m
                        }
                    );

                }


                await sock.groupParticipantsUpdate(
                    sender,
                    [
                        nomor +
                        '@s.whatsapp.net'
                    ],
                    'add'
                );


                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Member berhasil ditambahkan'
                    }
                );

            }



        } catch(err) {

            console.log(
                'Group Manager Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Gagal menjalankan perintah

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};