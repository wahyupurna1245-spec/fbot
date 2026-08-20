const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['fakta'],
    category: 'fun',
    ownerOnly: false,


    operate: async ({ sock, m, sender }) => {

        try {

            const file =
            path.join(
                __dirname,
                '../media/fakta.json'
            );


            const data =
            JSON.parse(
                fs.readFileSync(file)
            );


            const random =
            data[
                Math.floor(
                    Math.random() * data.length
                )
            ];


            await sock.sendMessage(
                sender,
                {
                    text:
`╭──〔 🧠 FAKTA UNIK 〕──⬣

${random}

╰━━━━━━━━━━━━⬣`
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'Fakta Error:',
                err
            );

        }

    }

};