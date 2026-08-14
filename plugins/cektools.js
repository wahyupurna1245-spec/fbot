const { exec } = require('child_process');


module.exports = {

    command: ['cektools'],
    category: 'tools',


    operate: async ({ sock, m, sender }) => {

        try {

            await sock.sendMessage(sender,{
                text:'⏳ Mengecek tools...'
            },{quoted:m});


            const tools = [
                ['Node.js','node -v'],
                ['NPM','npm -v'],
                ['YT-DLP','yt-dlp --version'],
                ['FFMPEG','ffmpeg -version'],
                ['FFPROBE','ffprobe -version'],
                ['Python','python3 --version'],
                ['Deno','deno --version'],
                ['Git','git --version'],
                ['Wget','wget --version'],
                ['Curl','curl --version'],
                ['ImageMagick','convert --version'],
                ['WebP','cwebp -version']
            ];


            let hasil =
`🛠️ *TOOLS SERVER*

`;


            for(const tool of tools){

                const name = tool[0];
                const command = tool[1];


                const version = await new Promise(resolve=>{

                    exec(
                        command,
                        {
                            timeout:5000
                        },
                        (err,stdout,stderr)=>{

                            if(err){

                                resolve('❌ Tidak tersedia');

                            }else{

                                let out =
                                (stdout || stderr)
                                .split('\n')[0]
                                .trim();

                                resolve(out || '✅ Tersedia');

                            }

                        }
                    );

                });



                hasil +=
`• ${name}
${version}

`;

            }



            await sock.sendMessage(sender,{
                text:
                hasil.slice(0,4000)
            },{quoted:m});



        }catch(e){

            console.log(e);

            sock.sendMessage(sender,{
                text:
                '❌ Gagal mengecek tools'
            },{quoted:m});

        }

    }

};