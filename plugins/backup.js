const fs = require('fs');
const { exec } = require('child_process');


module.exports = {

    command: ['backup'],

    category: 'owner',

    ownerOnly: true,


    operate: async ({
        sock,
        m,
        sender
    }) => {

        try {


            const backupName =
            `backupFBOT-${Date.now()}.zip`;



            await sock.sendMessage(
                sender,
                {
                    text:
                    '⏳ Membuat backup seluruh sistem...'
                },
                {
                    quoted:m
                }
            );



            const command =

`zip -r ${backupName} . \
-x "node_modules/*" \
-x ".git/*" \
-x "${backupName}" \
-x "*.zip"`;



            exec(
                command,
                async (err) => {


                    if (err) {

                        console.log(
                            'Backup error:',
                            err
                        );


                        return sock.sendMessage(
                            sender,
                            {
                                text:
`❌ Backup gagal

${err.message}`
                            },
                            {
                                quoted:m
                            }
                        );

                    }



                    if (
                        !fs.existsSync(
                            backupName
                        )
                    ) {

                        return sock.sendMessage(
                            sender,
                            {
                                text:
                                '❌ File backup tidak ditemukan'
                            },
                            {
                                quoted:m
                            }
                        );

                    }



                    const size =
                    (
                        fs.statSync(
                            backupName
                        ).size /
                        1024 /
                        1024
                    )
                    .toFixed(2);



                    await sock.sendMessage(
                        sender,
                        {
                            document:
                            fs.readFileSync(
                                backupName
                            ),

                            fileName:
                            backupName,

                            mimetype:
                            'application/zip',

                            caption:
`✅ BACKUP FBOT BERHASIL

📦 File:
${backupName}

💾 Ukuran:
${size} MB

Isi:
✔ Semua folder
✔ Semua plugin
✔ Semua config
✔ Database
✔ Session
✔ Media

❌ Dikecualikan:
• node_modules
• .git
• backup lama`
                        },
                        {
                            quoted:m
                        }
                    );



                    fs.unlinkSync(
                        backupName
                    );


                }
            );


        } catch(err) {

            console.log(
                'Backup error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Error backup

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};