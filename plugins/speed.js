const https = require('https');


module.exports = {

    command: [
        'speed',
        'speedtest'
    ],

    category: 'tools',


    operate: async ({ sock, m, sender }) => {

        try {

            await sock.sendMessage(sender,{
                text:
                '🚀 Mengecek kecepatan internet...'
            },{
                quoted:m
            });



            // PING

            const startPing =
            Date.now();


            await new Promise((resolve,reject)=>{

                https.get(
                    'https://www.google.com',
                    res=>{
                        res.on('data',()=>{});
                        res.on('end',resolve);
                    }
                ).on('error',reject);

            });


            const ping =
            Date.now() - startPing;



            // DOWNLOAD TEST

            const start =
            Date.now();

            let total = 0;


            https.get(
                'https://speed.cloudflare.com/__down?bytes=10000000',
                res=>{


                    res.on('data',chunk=>{

                        total += chunk.length;

                    });



                    res.on('end',async()=>{


                        const time =
                        (Date.now()-start)/1000;



                        const mb =
                        total / 1024 / 1024;



                        const bytesPerSecond =
total / time;


function formatSpeed(bytes){

    const kb =
    bytes / 1024;

    const mb =
    kb / 1024;

    const gb =
    mb / 1024;


    if(gb >= 1){

        return gb.toFixed(2) + ' GB/s';

    }


    if(mb >= 1){

        return mb.toFixed(2) + ' MB/s';

    }


    if(kb >= 1){

        return kb.toFixed(2) + ' KB/s';

    }


    return bytes.toFixed(2) + ' B/s';

}



                        await sock.sendMessage(sender,{
                            text:
`╭━━〔 🚀 SPEEDTEST 〕━━╮

📡 Ping :
${ping} ms

⬇️ Download :
${formatSpeed(bytesPerSecond)}

📦 Data :
${mb.toFixed(2)} MB

⚡ Node.js Test
💎 FBOT System

╰━━━━━━━━━━━━━━╯`
                        },{
                            quoted:m
                        });


                    });


                }
            );



        }catch(e){

            console.log(
                e
            );


            await sock.sendMessage(sender,{
                text:
                '❌ Speedtest gagal'
            },{
                quoted:m
            });

        }

    }

};