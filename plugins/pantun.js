const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['pantun'],
    category: 'fun',
    ownerOnly: false,


    operate: async ({ sock, m, sender }) => {

        try {

            const file =
            path.join(
                __dirname,
                '../media/pantun.json'
            );


            const pantun =
            JSON.parse(
                fs.readFileSync(file)
            );


            const random =
            pantun[
                Math.floor(
                    Math.random() * pantun.length
                )
            ];


            await sock.sendMessage(
                sender,
                {
                    text:
`╭──〔 🎭 PANTUN 〕──⬣

${random}

╰━━━━━━━━━━━━⬣`
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(err);

        }

    }

};