const fs = require('fs');
const path = require('path');
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
                'left.json'
            ];


            const existFiles = files
                .filter(f => fs.existsSync(f))
                .join(' ');



            const cmd =
                `zip -r ${backupName} ${existFiles} -x "node_modules/*" "session.json"`;


            exec(cmd, async (err) => {


                if (err) {

                    console.log(
                        'Backup error:',
                        err
                    );

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            '❌ Backup gagal'
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
- plugins
- media
- config
- source bot

❌ session tidak ikut`
                    },
                    {
                        quoted:m
                    }
                );



                fs.unlinkSync(
                    backupName
                );


            });



        } catch (e) {

            console.log(e);

        }

    }

};
