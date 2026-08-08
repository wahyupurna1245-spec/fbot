const fs = require('fs');
const path = require('path');


const afkFile =
path.join(
    __dirname,
    '../database/afk.json'
);



function loadAFK() {

    try {

        if (!fs.existsSync(afkFile)) {
            return {};
        }

        return JSON.parse(
            fs.readFileSync(
                afkFile
            )
        );

    } catch {

        return {};

    }

}



function saveAFK(data) {

    fs.writeFileSync(
        afkFile,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}



module.exports = {

    command: ['afk'],
    category: 'tools',
    ownerOnly: false,


    operate: async ({
        sock,
        m,
        sender,
        args
    }) => {


        try {


            const user =
            m.key.participant ||
            sender;


            const afk =
            loadAFK();



            const alasan =
            args.join(' ') ||
            'Tidak ada alasan';



            afk[user] = {

                alasan,

                waktu:
                Date.now()

            };



            saveAFK(
                afk
            );



            await sock.sendMessage(
                sender,
                {
                    text:
`💤 *AFK AKTIF*

👤 User:
@${user.split('@')[0]}

📝 Alasan:
${alasan}

⏰ Waktu:
${new Date().toLocaleString('id-ID')}`,
                    mentions:[
                        user
                    ]
                },
                {
                    quoted:m
                }
            );


        } catch(err) {

            console.log(
                'AFK Error:',
                err
            );

        }

    }

};
