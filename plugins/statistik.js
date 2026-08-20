const fs = require('fs');
const path = require('path');


module.exports = {

    command: [
        'statistik',
        'stats'
    ],

    category: 'tools',


    operate: async ({
        sock,
        m,
        sender,
        pushName
    }) => {


        try {


            const statsFile =
path.join(
    process.cwd(),
    'database',
    'stats.json'
);

            let stats = {};



            if(fs.existsSync(statsFile)){

                try{

                    stats =
                    JSON.parse(
                        fs.readFileSync(statsFile)
                    );

                }catch{}

            }



            let totalCommand = 0;
            let topCommand = '-';
            let topCount = 0;



            for(const cmd in stats){

                totalCommand += stats[cmd];


                if(stats[cmd] > topCount){

                    topCount = stats[cmd];
                    topCommand = '.' + cmd;

                }

            }





            function runtime(){

                const up =
                process.uptime();


                const hari =
                Math.floor(
                    up / 86400
                );


                const jam =
                Math.floor(
                    (up % 86400) / 3600
                );


                const menit =
                Math.floor(
                    (up % 3600) / 60
                );


                return `${hari} Hr ${jam} Jm ${menit} Mnt`;

            }





            let teks =
`╭━━〔 📈 STATISTIC 〕
│ 🤖 Bot : FBOT ASSISTANT
│ 🟢 Status : Online
│ 👤 User : ${pushName || 'User'}
│
│ ⚡ Total Request : ${totalCommand}
│ 🔥 Top Command : ${topCommand}
│ 📊 Digunakan : ${topCount}x
│
│ ⏱ Runtime :
│ ${runtime()}
╰━━━━━━━━━━━━━━╯

💎 FBOT System
🚀 Fast • Simple • Stable`;





            await sock.sendMessage(
                sender,
                {
                    text: teks
                },
                {
                    quoted:m
                }
            );



        }catch(e){


            console.log(
                'STAT ERROR:',
                e
            );


            await sock.sendMessage(
                sender,
                {
                    text:
                    '❌ Statistik error'
                },
                {
                    quoted:m
                }
            );

        }


    }

};