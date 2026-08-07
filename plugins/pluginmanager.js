const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');


module.exports = {

    command: ['plugin'],
    category: 'owner',
    ownerOnly: true,


    operate: async ({ sock, m, sender, args }) => {

        const pluginFolder = __dirname;
        const action = args[0]?.toLowerCase();



        // =====================
        // LIST PLUGIN
        // =====================
        if (!action || action === 'list') {

            const files = fs.readdirSync(pluginFolder)
                .filter(f => f.endsWith('.js'));


            return sock.sendMessage(sender, {
                text:
`📂 *PLUGIN MANAGER*

${files.map((v,i)=>`${i+1}. ${v}`).join('\n')}

Total: ${files.length}`
            }, { quoted:m });

        }




        // =====================
        // ADD PLUGIN
        // =====================
        if (action === 'add') {

            try {

                const quoted =
                    m.message.extendedTextMessage
                    ?.contextInfo
                    ?.quotedMessage;


                if (!quoted?.documentMessage) {

                    return sock.sendMessage(sender,{
                        text:
`❌ Reply file .js

Cara:
1. Kirim plugin.js sebagai dokumen
2. Reply:
.plugin add`
                    },{quoted:m});

                }



                const doc = quoted.documentMessage;


                const fileName = doc.fileName;


                if (!fileName.endsWith('.js')) {

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Hanya menerima file .js'
                    },{quoted:m});

                }




                const buffer = await downloadMediaMessage(
                    {
                        message: quoted
                    },
                    'buffer',
                    {}
                );



                const savePath =
                    path.join(
                        pluginFolder,
                        fileName
                    );



                fs.writeFileSync(
                    savePath,
                    buffer
                );



                return sock.sendMessage(sender,{
                    text:
`✅ Plugin berhasil ditambahkan

📁 ${fileName}

Lokasi:
${savePath}

Gunakan:
.plugin reload`
                },{quoted:m});



            } catch(err) {

                console.error(err);

                return sock.sendMessage(sender,{
                    text:
`❌ Gagal tambah plugin

${err.message}`
                },{quoted:m});

            }

        }





        // =====================
        // DELETE PLUGIN
        // =====================
        if (action === 'del') {

            const file = args[1];


            if (!file) {

                return sock.sendMessage(sender,{
                    text:
`Contoh:
.plugin del runtime.js`
                },{quoted:m});

            }



            const target =
                path.join(
                    pluginFolder,
                    file
                );



            if (!fs.existsSync(target)) {

                return sock.sendMessage(sender,{
                    text:
                    '❌ Plugin tidak ditemukan'
                },{quoted:m});

            }



            fs.unlinkSync(target);



            return sock.sendMessage(sender,{
                text:
`✅ Plugin ${file} berhasil dihapus`
            },{quoted:m});

        }





        // =====================
        // RELOAD PLUGIN
        // =====================
        if (action === 'reload') {


            Object.keys(require.cache)
            .forEach(key => {

                if (key.includes('plugins')) {
                    delete require.cache[key];
                }

            });



            return sock.sendMessage(sender,{
                text:
                '✅ Semua plugin berhasil reload'
            },{quoted:m});

        }





        return sock.sendMessage(sender,{
            text:
`❌ Perintah tidak dikenal

📂 Plugin Manager

.plugin list
.plugin add
.plugin del nama.js
.plugin reload`
        },{quoted:m});


    }

};