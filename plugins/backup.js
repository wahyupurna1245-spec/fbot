const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['backup'],
    category: 'owner',
    ownerOnly: true,


    operate: async ({ sock, m, sender }) => {

        try {

            await sock.sendMessage(sender,{
                text:
                '⏳ Membuat backup semua file bot...'
            },{quoted:m});



            const folder =
                process.cwd();



            const fileName =
                `FBot-backup-${Date.now()}.zip`;



            const zipPath =
                path.join(
                    '/tmp',
                    fileName
                );



            const cmd =
`cd "${folder}" && zip -r "${zipPath}" . \
-x "node_modules/*" \
-x "*.zip"`;



            exec(
                cmd,
                async (err, stdout, stderr) => {


                    if(err){

                        console.log(
                            'BACKUP ERROR:',
                            stderr
                        );


                        return sock.sendMessage(sender,{
                            text:
`❌ Gagal membuat backup

Pastikan Dockerfile sudah ada:
zip`
                        },{quoted:m});

                    }



                    if(!fs.existsSync(zipPath)){


                        return sock.sendMessage(sender,{
                            text:
                            '❌ File backup tidak ditemukan'
                        },{quoted:m});

                    }




                    await sock.sendMessage(sender,{
                        document:
                            fs.readFileSync(zipPath),

                        mimetype:
                            'application/zip',

                        fileName:
                            fileName,

                        caption:
`✅ *FBot Backup Berhasil*

📦 File:
${fileName}

📁 Semua file dibackup

❌ Kecuali:
node_modules`
                    },{quoted:m});



                    fs.unlinkSync(zipPath);


                }
            );



        } catch(e){


            console.log(
                'BACKUP ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
                '❌ Error membuat backup'
            },{quoted:m});


        }

    }

};