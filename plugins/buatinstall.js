const { exec } = require('child_process');


module.exports = {

    command: [
        '$'
    ],

    category: 'owner',
    ownerOnly: true,


    operate: async ({ sock, m, sender, args }) => {

        try {

            const cmd =
            args.join(' ');


            if(!cmd){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan perintah install

Contoh:

.$ npm install nama-package`
                },{
                    quoted:m
                });

            }



            await sock.sendMessage(sender,{
                text:
`⏳ Menjalankan:

${cmd}`
            },{
                quoted:m
            });



            exec(
                cmd,
                {
                    timeout: 120000
                },
                async(err, stdout, stderr)=>{


                    if(err){

                        return sock.sendMessage(sender,{
                            text:
`❌ Install gagal

${err.message}

${stderr || ''}`
                        },{
                            quoted:m
                        });

                    }



                    await sock.sendMessage(sender,{
                        text:
`✅ Install selesai

${stdout || 'Tidak ada output'}`
                    },{
                        quoted:m
                    });


                }
            );


        }catch(e){

            await sock.sendMessage(sender,{
                text:
`❌ Error:
${e.message}`
            },{
                quoted:m
            });

        }

    }

};d:m
            });

        }

    }

}; }

};