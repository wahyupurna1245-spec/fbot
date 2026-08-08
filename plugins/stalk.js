module.exports = {

    command: ['stalk', 'cekwa'],
    category: 'tools',
    ownerOnly: false,


    operate: async ({ sock, m, sender, args }) => {

        try {

            let nomor = args[0];


            if (!nomor) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
`❌ Masukkan nomor

Contoh:
.stalk 628123456789`
                    },
                    {
                        quoted:m
                    }
                );

            }


            nomor =
            nomor.replace(
                /[^0-9]/g,
                ''
            );


            if (nomor.startsWith('08')) {

                nomor =
                '62' +
                nomor.slice(1);

            }



            const jid =
            nomor + '@s.whatsapp.net';



            const cek =
            await sock.onWhatsApp(
                jid
            );


            if (!cek[0]?.exists) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
`❌ Nomor tidak terdaftar WhatsApp

📱 ${nomor}`
                    },
                    {
                        quoted:m
                    }
                );

            }



            let foto = null;

            try {

                foto =
                await sock.profilePictureUrl(
                    jid,
                    'image'
                );

            } catch {}



            const teks =
`╭──〔 🔍 STALK WA 〕──⬣

📱 Nomor:
${nomor}

✅ Status:
Terdaftar WhatsApp

╰━━━━━━━━━━━━⬣`;



            if (foto) {

                await sock.sendMessage(
                    sender,
                    {
                        image:{
                            url:foto
                        },
                        caption:teks
                    },
                    {
                        quoted:m
                    }
                );


            } else {

                await sock.sendMessage(
                    sender,
                    {
                        text:teks
                    },
                    {
                        quoted:m
                    }
                );

            }


        } catch(err) {

            console.log(
                'Stalk Error:',
                err
            );

            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Gagal stalk

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};