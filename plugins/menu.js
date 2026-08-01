const fs = require('fs');
const path = require('path');


const startTime = Date.now();


module.exports = {

    command: ['help'],
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



            for(const file of files){

                try{

                    const plugin =
                    require(
                        path.join(
                            __dirname,
                            file
                        )
                    );


                    if(!plugin.command)
                    continue;


                    let cat =
                    plugin.category ||
                    'other';



                    if(!menu[cat])
                    menu[cat] = [];



                    let cmds =
                    Array.isArray(plugin.command)
                    ? plugin.command
                    : [plugin.command];



                    menu[cat].push(...cmds);

                    total += cmds.length;


                }catch(e){}

            }



            const runtime = () => {

                let s =
                Math.floor(
                    (Date.now()-startTime)/1000
                );

                let h =
                Math.floor(s/3600);

                let m =
                Math.floor(
                    (s%3600)/60
                );

                let d =
                s%60;


                return `${h}h ${m}m ${d}s`;

            };





            let teks =
`
╭━━━〔 🌌 𝐅𝐁𝐎𝐓 〕━━━╮
┃
┃ 🤖 Status : Online
┃ 👤 User   : ${pushName || 'User'}
┃ ⏱ Runtime: ${runtime()}
┃
┃ 📦 Plugin : ${files.length}
┃ ⚡ Cmd    : ${total}
┃
┣━━━━━━━━━━━━━━━━━━┫
┃ 📖 Baca selengkapnya
┃ Gunakan command di bawah
┃ untuk melihat semua fitur
┣━━━━━━━━━━━━━━━━━━┫
`;




            for(const cat in menu){


                teks +=
`
┃
┃ ✨ ${cat.toUpperCase()}
┃
`;


                menu[cat].forEach(cmd=>{

                    teks +=
`┃  ◈ ${prefix}${cmd}
`;

                });


            }



            teks +=
`
┃
┣━━━━━━━━━━━━━━━━━━┫
┃ 💎 FBot Assistant
┃ 🚀 Fast • Simple • Stable
╰━━━━━━━━━━━━━━━━━━╯
`;





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
                'menu.mp3'
            );



            if(fs.existsSync(image)){


                await sock.sendMessage(sender,{
                    image:
                    fs.readFileSync(image),

                    caption:
                    teks

                },{quoted:m});


            }else{


                await sock.sendMessage(sender,{
                    text:
                    teks

                },{quoted:m});

            }




            if(fs.existsSync(audio)){


                await sock.sendMessage(sender,{
                    audio:
                    fs.readFileSync(audio),

                    mimetype:
                    'audio/mpeg'

                },{quoted:m});

            }



        }catch(e){

            console.log(
                'MENU ERROR',
                e
            );

        }

    }

};