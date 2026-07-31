const fs = require('fs');
const path = require('path');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');


module.exports = {

    command: ['document', 'doc'],
    category: 'owner',
    ownerOnly: true,


    operate: async ({ sock, m, sender, args }) => {

        try {


            const folder =
                path.join(
                    __dirname,
                    '../media'
                );


            if (!fs.existsSync(folder)) {

                fs.mkdirSync(
                    folder,
                    {
                        recursive: true
                    }
                );

            }



            const action =
                args[0]?.toLowerCase();



            const allowed = [

                // Dokumen
                '.txt',
                '.json',
                '.pdf',
                '.doc',
                '.docx',
                '.xls',
                '.xlsx',
                '.ppt',
                '.pptx',
                '.csv',

                // Gambar
                '.png',
                '.jpg',
                '.jpeg',
                '.webp',
                '.gif',
                '.bmp',
                '.svg',

                // Audio
                '.mp3',
                '.opus',
                '.ogg',
                '.wav',
                '.m4a',
                '.aac',
                '.flac',

                // Video
                '.mp4',
                '.mkv',
                '.avi',
                '.mov',
                '.webm',
                '.3gp',

                // Arsip
                '.zip',
                '.rar',
                '.7z',
                '.tar',
                '.gz',

                // Kode
                '.html',
                '.css',
                '.xml',
                '.sql',

                // Lainnya
                '.apk',
                '.iso',
                '.bin'

            ];




            // =====================
            // LIST
            // =====================

            if (!action || action === 'list') {


                const files =
                    fs.readdirSync(folder)
                    .filter(f =>
                        allowed.includes(
                            path.extname(f)
                            .toLowerCase()
                        )
                    );



                return sock.sendMessage(
                    sender,
                    {
                        text:
`📂 *MEDIA MANAGER*

${
files.length
?
files.map((v,i)=>
`${i+1}. ${v}`
).join('\n')
:
'Tidak ada file'
}

Total:
${files.length}`
                    },
                    {
                        quoted:m
                    }
                );


            }





            // =====================
            // ADD
            // =====================

            if (action === 'add') {


                const quoted =
                    m.message
                    ?.extendedTextMessage
                    ?.contextInfo
                    ?.quotedMessage;



                if (!quoted?.documentMessage) {


                    return sock.sendMessage(
                        sender,
                        {
                            text:
`❌ Reply file dokumen

Cara:
1. Kirim file sebagai dokumen
2. Reply:
.document add`
                        },
                        {
                            quoted:m
                        }
                    );

                }



                const doc =
                    quoted.documentMessage;



                const fileName =
                    doc.fileName ||
                    `file-${Date.now()}`;



                const ext =
                    path.extname(fileName)
                    .toLowerCase();



                if (!allowed.includes(ext)) {


                    return sock.sendMessage(
                        sender,
                        {
                            text:
`❌ Format tidak didukung

${allowed.join(', ')}`
                        },
                        {
                            quoted:m
                        }
                    );

                }



                const buffer =
                    await downloadMediaMessage(
                        {
                            message: quoted
                        },
                        'buffer',
                        {}
                    );



                const save =
                    path.join(
                        folder,
                        fileName
                    );



                fs.writeFileSync(
                    save,
                    buffer
                );



                return sock.sendMessage(
                    sender,
                    {
                        text:
`✅ File berhasil disimpan

📁 ${fileName}

Lokasi:
media/${fileName}`
                    },
                    {
                        quoted:m
                    }
                );


            }





            // =====================
            // DELETE
            // =====================

            if (action === 'del') {


                const file =
                    args[1];


                if (!file) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
`Contoh:

.document del gambar.jpg`
                        },
                        {
                            quoted:m
                        }
                    );

                }



                const target =
                    path.join(
                        folder,
                        file
                    );



                if (!fs.existsSync(target)) {


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



                fs.unlinkSync(target);



                return sock.sendMessage(
                    sender,
                    {
                        text:
`✅ ${file} berhasil dihapus`
                    },
                    {
                        quoted:m
                    }
                );


            }





            // =====================
            // INFO
            // =====================

            if (action === 'info') {


                const file =
                    args[1];


                if (!file) {

                    return sock.sendMessage(
                        sender,
                        {
                            text:
`Contoh:

.document info menu.jpg`
                        },
                        {
                            quoted:m
                        }
                    );

                }



                const target =
                    path.join(
                        folder,
                        file
                    );



                if (!fs.existsSync(target)) {


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



                const size =
                    fs.statSync(target).size;



                return sock.sendMessage(
                    sender,
                    {
                        text:
`📄 *FILE INFO*

Nama:
${file}

Ukuran:
${(size / 1024).toFixed(2)} KB`
                    },
                    {
                        quoted:m
                    }
                );


            }





            return sock.sendMessage(
                sender,
                {
                    text:
`❌ Perintah tidak dikenal

📂 MEDIA MANAGER

.document list
.document add
.document del nama.file
.document info nama.file`
                },
                {
                    quoted:m
                }
            );



        } catch (err) {


            console.log(
                'Document Error:',
                err
            );


            return sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Terjadi error'
                },
                {
                    quoted:m
                }
            );

        }

    }

};