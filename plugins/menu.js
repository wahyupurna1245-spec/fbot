const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['menu','help'],
    category: 'main',


    operate: async ({
        sock,
        m,
        sender,
        prefix,
        pushName
    }) => {


        try {


            function fontKeren(text){

                const map = {

A:'𝑨',B:'𝑩',C:'𝑪',D:'𝑫',E:'𝑬',
F:'𝑭',G:'𝑮',H:'𝑯',I:'𝑰',
J:'𝑱',K:'𝑲',L:'𝑳',M:'𝑴',
N:'𝑵',O:'𝑶',P:'𝑷',Q:'𝑸',
R:'𝑹',S:'𝑺',T:'𝑻',U:'𝑼',
V:'𝑽',W:'𝑾',X:'𝑿',Y:'𝒀',Z:'𝒁',

a:'𝒂',b:'𝒃',c:'𝒄',d:'𝒅',
e:'𝒆',f:'𝒇',g:'𝒈',h:'𝒉',
i:'𝒊',j:'𝒋',k:'𝒌',l:'𝒍',
m:'𝒎',n:'𝒏',o:'𝒐',p:'𝒑',
q:'𝒒',r:'𝒓',s:'𝒔',t:'𝒕',
u:'𝒖',v:'𝒗',w:'𝒘',x:'𝒙',
y:'𝒚',z:'𝒛'

};


                return text
                .split('')
                .map(c => map[c] || c)
                .join('');

            }



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

                    const pluginPath =
                    path.join(__dirname,file);


                    delete require.cache[
                        require.resolve(pluginPath)
                    ];


                    const plugin =
                    require(pluginPath);


                    if(!plugin.command)
                    continue;


                    pluginAktif++;


                    const cat =
                    plugin.category || 'other';


                    if(!menu[cat])
                    menu[cat] = [];


                    const cmds =
                    Array.isArray(plugin.command)
                    ? plugin.command
                    : [plugin.command];


                    for(const cmd of cmds){

                        if(!menu[cat].includes(cmd)){

                            menu[cat].push(cmd);
                            total++;

                        }

                    }


                }catch(e){

                    console.log(
                        'MENU ERROR:',
                        file,
                        e.message
                    );

                }

            }



            function runtime(){

                const up =
                process.uptime();


                const hari =
                Math.floor(up / 86400);


                const jam =
                Math.floor(
                    (up % 86400) / 3600
                );


                const menit =
                Math.floor(
                    (up % 3600) / 60
                );


                return `${hari} Hari ${jam} Jam ${menit} Menit`;

            }
            function salam(){

                const jam =
                parseInt(
                    new Date()
                    .toLocaleString(
                        'id-ID',
                        {
                            timeZone:'Asia/Jakarta',
                            hour:'2-digit',
                            hour12:false
                        }
                    )
                );


                if(jam >= 4 && jam < 11)
                return '🌅 Selamat pagi';


                if(jam >= 11 && jam < 15)
                return '☀️ Selamat siang';


                if(jam >= 15 && jam < 18)
                return '🌇 Selamat sore';


                return '🌙 Selamat malam';

            }



            const icon = {

                main:'🏠',
                downloader:'⬇️',
                converter:'🔄',
                maker:'🎨',
                fun:'🎲',
                group:'👥',
                owner:'👑',
                tools:'🛠️',
                search:'🔎',
                utility:'📅',
                info:'ℹ️'

            };



            const readMore =
            String.fromCharCode(8206)
            .repeat(4000);



            let teks =

`${fontKeren('Hai')} ${pushName || 'User'}
${salam()}


╭━━〔 ${fontKeren('BOT INFO')} 〕
│Status : Online
│Runtime :
│${runtime()}
│Plugin : ${pluginAktif}
│Command : ${total}
╰━━━━━━━━━━━━━━╯


${fontKeren('Berikut adalah beberapa command yang tersedia')}

${readMore}
`;



            Object.keys(menu)
            .sort()
            .forEach(cat=>{


                teks +=
`╭━━〔 ${icon[cat.toLowerCase()] || '📂'} ${fontKeren(cat.toUpperCase())} 〕
`;



                menu[cat]
                .sort()
                .forEach(cmd=>{

                    teks +=
`│✎ ${prefix}${cmd}
`;

                });



                teks +=
`╰━━━━━━━━━━━━━━╯

`;

            });



            teks +=

`
💎 ${fontKeren('FBOT System')}
🚀 ${fontKeren('Fast • Simple • Stable')}
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
                'menu.ogg'
            );



            let contextInfo = {};



            if(fs.existsSync(image)){


                contextInfo = {

                    externalAdReply: {

                        title:
                        fontKeren('FBOT ASSISTANT'),

                        body:
                        'Fast • Simple • Stable | WhatsApp Bot',

                        thumbnail:
                        fs.readFileSync(image),

                        sourceUrl:
                        'https://fbot.my.id',

                        mediaType:1,

                        renderLargerThumbnail:true

                    }

                };

            }




            await sock.sendMessage(
                sender,
                {
                    text:teks,
                    contextInfo
                },
                {
                    quoted:m
                }
            );




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
                    '❌ Menu error: '+e.message
                },
                {
                    quoted:m
                }
            );

        }


    }

};