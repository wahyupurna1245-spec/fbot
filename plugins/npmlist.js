const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['npmlist', 'npm-list'],
    category: 'tools',
    ownerOnly: true,


    operate: async ({ sock, m, sender }) => {

        try {

            const file =
                path.join(
                    __dirname,
                    '../package.json'
                );


            if (!fs.existsSync(file)) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ package.json tidak ditemukan'
                    },
                    {
                        quoted:m
                    }
                );

            }


            const pkg =
                JSON.parse(
                    fs.readFileSync(file)
                );


            const deps =
                pkg.dependencies || {};


            let teks =
`╭──〔 📦 NPM LIST 〕──⬣

`;


            let no = 1;


            for (const name in deps) {

                teks +=
`${no}. ${name}
   └ ${deps[name]}

`;

                no++;

            }


            teks +=
`╰━━━━━━━━━━━━⬣

Total package: ${no - 1}`;


            await sock.sendMessage(
                sender,
                {
                    text: teks
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'NPM LIST ERROR:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Gagal membaca package.json'
                },
                {
                    quoted:m
                }
            );

        }

    }

};