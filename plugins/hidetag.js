module.exports = {

    command: ['hidetag', 'ht'],
    category: 'group',
    ownerOnly: false,


    operate: async ({ sock, m, sender, args, isGroup }) => {

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


            const members =
                metadata.participants.map(
                    v => v.id
                );


            const teks =
                args.join(' ') ||
                '';


            await sock.sendMessage(
                sender,
                {
                    text: teks,
                    mentions: members
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'Hidetag Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Gagal melakukan hidetag'
                },
                {
                    quoted:m
                }
            );

        }

    }

};