const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['menu','help'],
    category: 'main',
    ownerOnly: false,


    operate: async ({ sock, m, sender, prefix, pushName }) => {

        try {

            const files =
            fs.readdirSync(__dirname)
            .filter(f =>
                f.endsWith('.js') &&
                f !== 'menu.js'
            );


            let menu = {};
            let total = 0;
            let pluginAktif = 0;


            for(const file of files){

                try{

                    delete require.cache[
                        require.resolve(
                            path.join(__dirname,file)
                        )
                    ];


                    const plugin =
                    require(
                        path.join(__dirname,file)
                    );


                    if(!plugin.command)
                    continue;


                    pluginAktif++;


                    let cat =
                    plugin.category || 'other';


                    if(!menu[cat])
                    menu[cat] = [];


                    let cmds =
                    Array.isArray(plugin.command)
                    ? plugin.command
                    : [plugin.command];


                    cmds.forEach(cmd=>{

                        if(!menu[cat].includes(cmd)){

                            menu[cat].push(cmd);
                            total++;

                        }

                    });


                }catch(e){

                    console.log(
                        'PLUGIN MENU ERROR:',
                        file,
                        e.message
                    );

                }

            }



            function runtime(){

                let uptime =
                process.uptime();


                let jam =
                Math.floor(uptime / 3600);


                let menit =
                Math.floor((uptime % 3600) / 60);


                let detik =
                Math.floor(uptime % 60);


                return `${jam}j ${menit}m ${detik}d`;

            }



            let teks =
`🌌 *FBOT ASSISTANT*

🤖 Status : Online
👤 User : ${pushName || 'User'}
⏱ Runtime : ${runtime()}
📦 Plugin : ${pluginAktif}
⚡ Command : ${total}


`;



            Object.keys(menu)
            .sort()
            .forEach(cat=>{


                teks +=
`✨ *${cat.toUpperCase()}*
`;


                menu[cat]
                .sort()
                .forEach(cmd=>{

                    teks +=
`• ${prefix}${cmd}
`;

                });


                teks += '\n';


            });



            teks +=
`🚀 Fast • Simple • Stable
💎 FBot System`;



            const media =
            path.join(
                process.cwd(),
                'media'
            );


            const image =
            path.join(
                media,
                'menu.jpg'
            );


            const audio =
            path.join(
                media,
                'menu.ogg'
            );



            // Kirim gambar + menu

            if(fs.existsSync(image)){


                await sock.sendMessage(
                    sender,
                    {
                        image:
                        fs.readFileSync(image),

                        caption:
                        teks
                    },
                    {
                        quoted:m
                    }
                );


            }else{


                await sock.sendMessage(
                    sender,
                    {
                        text:
                        teks
                    },
                    {
                        quoted:m
                    }
                );

            }



            // Kirim voice note WhatsApp

            if(fs.existsSync(audio)){


                await sock.sendMessage(
                    sender,
                    {
                        audio:
                        fs.readFileSync(audio),

                        mimetype:
                        'audio/ogg; codecs=opus',

                        ptt:true
                    },
                    {
                        quoted:m
                    }
                );


            }


        }catch(e){

            console.log(
                'MENU ERROR:',
                e
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Menu error: ' + e.message
                },
                {
                    quoted:m
                }
            );

        }

    }

};