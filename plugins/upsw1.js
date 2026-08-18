const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {

    command: ['upsw1'],
    category: 'owner',
ownerOnly: true,

    operate: async ({ sock, m, args }) => {

        try {


            // DAFTAR KONTAK YANG BOLEH LIHAT STATUS
            const kontak = [
                '628812478704',
                '6285169952387'
            ];


            const targets = kontak.map(
                n => n + '@s.whatsapp.net'
            );



            const text = args.join(' ');



            let msg;



            // cek reply media
            const quoted =
                m.message?.extendedTextMessage
                ?.contextInfo
                ?.quotedMessage;



            // ======================
            // GAMBAR
            // ======================

            if (quoted?.imageMessage) {


                const buffer =
                await downloadMediaMessage(
                    {
                        message: quoted
                    },
                    'buffer',
                    {}
                );


                msg = {
                    image: buffer,
                    caption: text || ''
                };


            }


            // ======================
            // VIDEO
            // ======================

            else if (quoted?.videoMessage) {


                const buffer =
                await downloadMediaMessage(
                    {
                        message: quoted
                    },
                    'buffer',
                    {}
                );


                msg = {
                    video: buffer,
                    caption: text || ''
                };


            }


            // ======================
            // AUDIO
            // ======================

            else if (quoted?.audioMessage) {


                const buffer =
                await downloadMediaMessage(
                    {
                        message: quoted
                    },
                    'buffer',
                    {}
                );


                msg = {
                    audio: buffer,
                    mimetype: 'audio/mp4'
                };


            }


            // ======================
            // TEKS
            // ======================

            else if (text) {


                msg = {
                    text: text
                };


            }


            else {

                return sock.sendMessage(
                    m.key.remoteJid,
                    {
                        text:
`Cara pakai:

Teks:
.upsw Halo semua

Gambar/video:
Reply media lalu ketik:
.upsw`
                    },
                    {
                        quoted:m
                    }
                );

            }




            // KIRIM STATUS
            await sock.sendMessage(
                'status@broadcast',
                msg,
                {
                    statusJidList: targets
                }
            );



            await sock.sendMessage(
                m.key.remoteJid,
                {
                    text:
                    `✅ Status berhasil dibuat\n👥 Dilihat: ${targets.length} kontak`
                },
                {
                    quoted:m
                }
            );



        } catch(e) {


            console.log('UPSW ERROR:', e);


            await sock.sendMessage(
                m.key.remoteJid,
                {
                    text:
                    '❌ Gagal upload status\n' + e.message
                },
                {
                    quoted:m
                }
            );


        }

    }

};