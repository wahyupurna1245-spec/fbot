const https = require('https');


function download(url) {

    return new Promise((resolve, reject) => {

        https.get(url, res => {

            const data = [];

            res.on('data', chunk => {
                data.push(chunk);
            });

            res.on('end', () => {
                resolve(Buffer.concat(data));
            });

        }).on('error', reject);

    });

}



module.exports = {

    command: ['qr'],
    category: 'tools',
    ownerOnly: false,


    operate: async ({ sock, m, sender, args }) => {

        try {

            const teks =
                args.join(' ');



            if (!teks) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
`❌ Masukkan teks atau link

Contoh:
.qr https://google.com`
                    },
                    {
                        quoted:m
                    }
                );

            }



            const url =
            'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data='
            +
            encodeURIComponent(teks);



            const image =
                await download(url);



            await sock.sendMessage(
                sender,
                {
                    image,
                    caption:
`✅ QR Code berhasil dibuat

📝 Isi:
${teks}`
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'QR Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Gagal membuat QR'
                },
                {
                    quoted:m
                }
            );

        }

    }

};