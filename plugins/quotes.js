const fs = require('fs');
const path = require('path');

module.exports = {

    command: ['quote', 'quotes'],
    category: 'fun',
    ownerOnly: false,


    operate: async ({ sock, m, sender }) => {

        try {

            const file =
                path.join(
                    __dirname,
                    '../media/kata.json'
                );


            if (!fs.existsSync(file)) {

                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ File media/kata.json tidak ditemukan'
                    },
                    {
                        quoted:m
                    }
                );

            }


            const kata =
                JSON.parse(
                    fs.readFileSync(file)
                );


            const random =
                kata[
                    Math.floor(
                        Math.random() * kata.length
                    )
                ];



            await sock.sendMessage(
                sender,
                {
                    text:
`╭──〔 💡 QUOTE 〕──⬣

${random}

╰━━━━━━━━━━━━⬣`
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'Quote Error:',
                err
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Quote error

${err.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};