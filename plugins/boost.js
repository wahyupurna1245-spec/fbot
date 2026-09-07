const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = {

    command:['boost'],
    category:'tools',
    ownerOnly:true,


    operate: async ({
        sock,
        m,
        sender
    })=>{

        try{

            const before =
            process.memoryUsage().rss;


            await sock.sendMessage(sender,{
                text:
`⚡ *BOOST SYSTEM*

⏳ Optimasi sedang berjalan...`
            },{
                quoted:m
            });



            // ======================
            // CLEAN TMP
            // ======================

            let deleted = 0;

            const tmp =
            '/tmp';


            if(fs.existsSync(tmp)){

                for(const file of fs.readdirSync(tmp)){

                    try{

                        const target =
                        path.join(
                            tmp,
                            file
                        );


                        const stat =
                        fs.statSync(target);


                        // hapus file bot lama
                        if(
                            Date.now() -
                            stat.mtimeMs
                            >
                            60 * 60 * 1000
                        ){

                            fs.rmSync(
                                target,
                                {
                                    recursive:true,
                                    force:true
                                }
                            );

                            deleted++;

                        }

                    }catch{}

                }

            }




            // ======================
            // GC MEMORY
            // ======================

            if(global.gc){

                global.gc();

            }



            const after =
            process.memoryUsage().rss;



            function mb(v){

                return (
                    v /
                    1024 /
                    1024
                ).toFixed(2)
                +' MB';

            }



            const uptime =
            process.uptime();


            const h =
            Math.floor(
                uptime / 3600
            );


            const min =
            Math.floor(
                uptime % 3600 / 60
            );



            const text =
`
🚀 *BOOST COMPLETE*

╭━━〔 ⚡ SYSTEM 〕
│🧹 Clean tmp :
│${deleted} file
│
│🧠 Memory Before :
│${mb(before)}
│
│🧠 Memory After :
│${mb(after)}
│
│📉 Difference :
│${mb(before-after)}
│
│⏱ Runtime :
│${h} Jam ${min} Menit
│
│💻 CPU :
│${os.cpus().length} Core
╰━━━━━━━━━━━━━━╯


✅ Temporary file dibersihkan
✅ Memory garbage collector dijalankan
✅ Bot tetap online
`;



            await sock.sendMessage(sender,{
                text
            },{
                quoted:m
            });



        }catch(e){

            console.log(
                'BOOST ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
                '❌ Boost gagal'
            },{
                quoted:m
            });

        }

    }

};