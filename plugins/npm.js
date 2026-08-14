const https = require('https');


function fetchNpm(url) {

    return new Promise((resolve, reject) => {

        https.get(url, res => {

            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });


            res.on('end', () => {

                try {

                    resolve(
                        JSON.parse(data)
                    );

                } catch(e) {

                    reject(e);

                }

            });


        }).on('error', reject);

    });

}



module.exports = {

    command: ['npm'],
    category: 'tools',
    ownerOnly: true,


    operate: async ({ sock, m, sender, args }) => {

        try {

            const pkg = args[0];


            if (!pkg) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
`❌ Masukkan nama package

Contoh:
.npm baileys`
                    },
                    {
                        quoted:m
                    }
                );

            }


            const data =
            await fetchNpm(
                `https://registry.npmjs.org/${pkg}`
            );


            const latest =
            data['dist-tags']?.latest || '-';


            await sock.sendMessage(
                sender,
                {
                    text:
`╭──〔 📦 NPM INFO 〕──⬣

📌 Package:
${data.name}

📦 Versi:
${latest}

📝 Deskripsi:
${data.description || '-'}

👤 Author:
${typeof data.author === 'object'
? data.author.name
: data.author || '-'}

╰━━━━━━━━━━━━⬣`
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'NPM ERROR:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Package tidak ditemukan / gagal mengambil data`
                },
                {
                    quoted:m
                }
            );

        }

    }

};