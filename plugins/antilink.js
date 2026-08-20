const fs = require('fs');
const path = require('path');

const file =
path.join(
    __dirname,
    '../database/antilink.json'
);


module.exports = {

    command: [
        'antilink'
    ],

    category:'group',

    ownerOnly:false,


    operate: async ({
        sock,
        m,
        args,
        sender,
        isGroup,
        isOwner
    }) => {


        try {


            if(!isGroup){

                return sock.sendMessage(
                    sender,
                    {
                        text:
                        '❌ Fitur ini hanya bisa digunakan di grup'
                    },
                    {
                        quoted:m
                    }
                );

            }



            // CEK ADMIN GRUP

            let metadata =
            await sock.groupMetadata(
                sender
            );


            let user =
            metadata.participants.find(
                p =>
                p.id === m.key.participant
            );


            let isAdmin =
            user?.admin === 'admin' ||
            user?.admin === 'superadmin';



            if(!isOwner && !isAdmin){

                return sock.sendMessage(
                    sender,
                    {
                        text:
`❌ *AKSES DITOLAK*

🔒 Hanya admin grup atau owner bot yang bisa mengatur Anti Link`
                    },
                    {
                        quoted:m
                    }
                );

            }




            let data = {};



            if(fs.existsSync(file)){

                try{

                    data =
                    JSON.parse(
                        fs.readFileSync(file)
                    );

                }catch{}

            }



            const status =
            args[0]?.toLowerCase();



            if(!['on','off'].includes(status)){


                return sock.sendMessage(
                    sender,
                    {
                        text:
`🔗 *ANTI LINK*

Status grup:
${data[sender] ? '🟢 AKTIF':'🔴 NONAKTIF'}


Cara pakai:

.antilink on
.antilink off`
                    },
                    {
                        quoted:m
                    }
                );

            }




            data[sender] =
            status === 'on';



            fs.mkdirSync(
                path.dirname(file),
                {
                    recursive:true
                }
            );



            fs.writeFileSync(
                file,
                JSON.stringify(
                    data,
                    null,
                    2
                )
            );




            await sock.sendMessage(
                sender,
                {
                    text:
`✅ *ANTI LINK UPDATED*

Status:
${status === 'on'
?'🛡 Anti Link Aktif'
:'🔓 Anti Link Dimatikan'}`
                },
                {
                    quoted:m
                }
            );



        }catch(e){


            console.log(
                'ANTILINK ERROR:',
                e
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Error: '+e.message
                },
                {
                    quoted:m
                }
            );

        }


    }

};