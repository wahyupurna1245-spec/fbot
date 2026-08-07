const fs = require('fs');
const path = require('path');


module.exports = {

    command: [
        'stats',
        'statistik'
    ],

    category: 'tools',
    ownerOnly: true,


    operate: async ({ sock, m, sender }) => {

        try {


            const uptime =
            process.uptime();



            const jam =
            Math.floor(uptime / 3600);


            const menit =
            Math.floor(
                (uptime % 3600) / 60
            );


            const detik =
            Math.floor(
                uptime % 60
            );



            const pluginFolder =
            path.join(
                __dirname
            );



            let pluginCount = 0;


            if(fs.existsSync(pluginFolder)){

                pluginCount =
                fs.readdirSync(pluginFolder)
                .filter(
                    file =>
                    file.endsWith('.js')
                )
                .length;

            }



            const memory =
            process.memoryUsage();



            const ram =
            (
                memory.rss /
                1024 /
                1024
            ).toFixed(2);



            const text =
`📊 *BOT STATISTICS*

🤖 Status:
Online ✅

⏱️ Uptime:
${jam} jam ${menit} menit ${detik} detik

📦 Plugin:
${pluginCount} file

💾 RAM:
${ram} MB

🟢 Node.js:
${process.version}

🖥️ Platform:
${process.platform}

🚀 Mode:
Running`;



            await sock.sendMessage(sender,{
                text
            },{quoted:m});



        } catch(e){


            console.log(
                'STATS ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
                `❌ Stats error\n${e.message}`
            },{quoted:m});

        }

    }

};