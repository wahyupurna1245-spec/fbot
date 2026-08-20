const fs = require('fs');
const { exec } = require('child_process');


module.exports = {

    command: ['restore'],

    category: 'owner',

    ownerOnly: true,


    operate: async ({
        sock,
        m,
        sender
    }) => {

        try {


            const quoted =
            m.message
            ?.extendedTextMessage
            ?.contextInfo
            ?.quotedMessage;



            const document =
            quoted?.documentMessage;



            if (!document) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
`❌ Reply file backup ZIP

Contoh:
.reply backup.zip
.restore`
                    },
                    {
                        quoted:m
                    }
                );

            }



            const {
                downloadContentFromMessage
            } =
            require(
                '@whiskeysockets/baileys'
            );



            await sock.sendMessage(
                sender,
                {
                    text:
                    '⏳ Mengunduh file backup...'
                },
                {
                    quoted:m
                }
            );



            const stream =
            await downloadContentFromMessage(
                document,
                'document'
            );



            let buffer =
            Buffer.from([]);



            for await (
                const chunk of stream
            ) {

                buffer =
                Buffer.concat(
                    [
                        buffer,
                        chunk
                    ]
                );

            }



            const zipName =
            'restore-backup.zip';



            fs.writeFileSync(
                zipName,
                buffer
            );



            await sock.sendMessage(
                sender,
                {
                    text:
                    '📦 Mengekstrak backup...'
                },
                {
                    quoted:m
                }
            );



            exec(
`unzip -o ${zipName} -x "node_modules/*"`,
                async (err) => {


                    if (err) {

                        return sock.sendMessage(
                            sender,
                            {
                                text:
`❌ Restore gagal

${err.message}`
                            },
                            {
                                quoted:m
                            }
                        );

                    }



                    fs.unlinkSync(
                        zipName
                    );



                    await sock.sendMessage(
                        sender,
                        {
                            text:
`✅ RESTORE BERHASIL

📂 Semua file backup sudah dikembalikan

⚠️ Restart bot agar perubahan aktif`
                        },
                        {
                            quoted:m
                        }
                    );


                }
            );


        } catch(err) {

            console.log(
                'Restore error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Error restore

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};