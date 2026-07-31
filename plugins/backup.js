const fs = require('fs');
const { exec } = require('child_process');


module.exports = {

    command: ['backup'],

    category: 'owner',

    ownerOnly: true,


    operate: async ({ sock, m, sender }) => {

        try {

            const backupName =
                `backup-${Date.now()}.zip`;


            const files = [
                'plugins',
                'media',
                'tmp',
                'handler.js',
                'index.js',
                'package.json',
                'package-lock.json',
                'Dockerfile',
                'setting.json',
                'mode.json',
                'welcome.json',
                'left.json',
                'session.json'
            ];


            const target = files
                .filter(file => fs.existsSync(file))
                .join(' ');



            await sock.sendMessage(
                sender,
                {
                    text:
                    '⏳ Membuat backup...'
                },
                {
                    quoted:m
                }
            );



            exec(
                `zip -r ${backupName} ${target} -x "node_modules/*"`,
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
                                '❌ Backup gagal\n' + err.message
                            },
                            {
                                quoted:m
                            }
                        );

                    }



                    if (!fs.existsSync(backupName)) {

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
`✅ Backup berhasil

📦 Isi:
✔ plugins
✔ media
✔ tmp
✔ session
✔ config bot

❌ node_modules tidak ikut`
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


        } catch (err) {

            console.log(
                'Backup error:',
                err
            );

        }

    }

};