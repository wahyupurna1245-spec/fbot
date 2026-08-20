const fs = require('fs');
const path = require('path');


module.exports = {

    command: [
        'ls',
        'readfile',
        'writefile',
        'deletefile',
        'mkdir',
        'renamefile',
        'uploadfile'
    ],

    category: 'file',

    ownerOnly: true,


    operate: async ({
        sock,
        m,
        sender,
        command,
        args
    }) => {


        try {

            const root =
            process.cwd();



            // =====================
            // LIST FILE
            // =====================

            if (command === 'ls') {


                const target =
                args[0] || '.';



                const dir =
                path.join(
                    root,
                    target
                );



                if (!fs.existsSync(dir)) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            '❌ Folder tidak ditemukan'
                        },
                        {
                            quoted:m
                        }
                    );

                }



                const files =
                fs.readdirSync(
                    dir
                );



                return sock.sendMessage(
                    sender,
                    {
                        text:
`📂 ISI FOLDER

${files.length ? files.join('\n') : '(kosong)'}`
                    },
                    {
                        quoted:m
                    }
                );

            }



            // =====================
// READ FILE
// =====================

if (command === 'readfile') {

    const file =
    args.join(' ');


    if (!file) {

        return sock.sendMessage(
            sender,
            {
                text:
                'Contoh:\n.readfile plugins/menu.js'
            },
            {
                quoted:m
            }
        );

    }


    const lokasi =
    path.join(
        root,
        file
    );


    if (!fs.existsSync(lokasi)) {

        return sock.sendMessage(
            sender,
            {
                text:
                '❌ File tidak ditemukan'
            },
            {
                quoted:m
            }
        );

    }


    const isi =
    fs.readFileSync(
        lokasi
    );


    return sock.sendMessage(
        sender,
        {
            document: isi,

            fileName:
            path.basename(file),

            mimetype:
            'text/plain',

            caption:
`📄 FILE MANAGER

📂 File:
${file}

📦 Ukuran:
${(isi.length / 1024).toFixed(2)} KB`
        },
        {
            quoted:m
        }
    );

}
            // =====================
            // WRITE FILE
            // =====================

            if (command === 'writefile') {


                const nama =
                args.shift();



                const isi =
                args.join(' ');



                if (!nama || !isi) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            'Contoh:\n.writefile test.txt halo'
                        },
                        {
                            quoted:m
                        }
                    );

                }



                fs.writeFileSync(
                    path.join(
                        root,
                        nama
                    ),
                    isi
                );



                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ File berhasil dibuat'
                    }
                );

            }



            // =====================
            // DELETE FILE
            // =====================

            if (command === 'deletefile') {


                const file =
                args[0];



                if (!file) return;



                const lokasi =
                path.join(
                    root,
                    file
                );



                if (
                    fs.existsSync(
                        lokasi
                    )
                ) {

                    fs.unlinkSync(
                        lokasi
                    );

                }



                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ File dihapus'
                    }
                );

            }


// =====================
// UPLOAD FILE
// =====================

if (command === 'uploadfile') {


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
`❌ Reply file yang mau diupload

Contoh:
(reply fbimage.js)
.uploadfile plugins`
            },
            {
                quoted:m
            }
        );

    }



    const folder =
    args.join(' ') || '.';



    const saveFolder =
    path.join(
        root,
        folder
    );



    if (!fs.existsSync(saveFolder)) {

        fs.mkdirSync(
            saveFolder,
            {
                recursive:true
            }
        );

    }



    const {
        downloadContentFromMessage
    } =
    require('@whiskeysockets/baileys');



    const stream =
    await downloadContentFromMessage(
        document,
        'document'
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



    const fileName =
    document.fileName ||
    `file-${Date.now()}`;



    const filePath =
    path.join(
        saveFolder,
        fileName
    );



    fs.writeFileSync(
        filePath,
        buffer
    );



    return sock.sendMessage(
        sender,
        {
            text:
`✅ Upload berhasil

📄 File:
${fileName}

📂 Lokasi:
${folder}/${fileName}`
        },
        {
            quoted:m
        }
    );

}
            // =====================
            // MAKE FOLDER
            // =====================

            if (command === 'mkdir') {


                const folder =
                args[0];



                if (!folder) return;



                fs.mkdirSync(
                    path.join(
                        root,
                        folder
                    ),
                    {
                        recursive:true
                    }
                );



                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Folder dibuat'
                    }
                );

            }



            // =====================
            // RENAME
            // =====================

            if (command === 'renamefile') {


                const data =
                args.join(' ')
                .split('|');



                if (data.length < 2) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
                            'Contoh:\n.renamefile a.txt|b.txt'
                        }
                    );

                }



                fs.renameSync(
                    path.join(
                        root,
                        data[0]
                    ),
                    path.join(
                        root,
                        data[1]
                    )
                );



                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '✅ Nama file diganti'
                    }
                );

            }



        } catch(err) {


            console.log(
                'File Manager:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Error

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};