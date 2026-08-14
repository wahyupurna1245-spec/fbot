const { exec } = require('child_process');
const fs = require('fs');

module.exports = {

    category: 'downloader',

    command: [
        'tiktok2',
        'tt2'
    ],


    operate: async ({
        sock,
        m,
        sender,
        args
    }) => {

        let file;

        try {

            const url = args.join(' ');


            if(!url){
                return sock.sendMessage(
                    sender,
                    {
                        text:
`❌ Masukkan link TikTok

Contoh:
.tiktok2 https://vt.tiktok.com/xxxx`
                    },
                    {
                        quoted:m
                    }
                );
            }


            await sock.sendMessage(
                sender,
                {
                    react:{
                        text:'⏳',
                        key:m.key
                    }
                }
            );


            file =
            `/tmp/tiktok_${Date.now()}.mp4`;


            const command =
`yt-dlp \
-f "best[ext=mp4]/best" \
--no-playlist \
-o "${file}" \
"${url}"`;


            exec(
                command,
                {
                    maxBuffer:
                    1024 * 1024 * 20
                },
                async(err)=>{


                    if(err){

                        console.log(
                            'TikTok2 Error:',
                            err.message
                        );


                        return sock.sendMessage(
                            sender,
                            {
                                text:
                                '❌ TikTok gagal didownload'
                            },
                            {
                                quoted:m
                            }
                        );

                    }


                    if(!fs.existsSync(file)){

                        return sock.sendMessage(
                            sender,
                            {
                                text:
                                '❌ File video tidak ditemukan'
                            },
                            {
                                quoted:m
                            }
                        );

                    }



                    await sock.sendMessage(
                        sender,
                        {
                            video:
                            fs.readFileSync(file),

                            caption:
`✅ TikTok Download

🚀 FBOT Downloader`
                        },
                        {
                            quoted:m
                        }
                    );


                    fs.unlinkSync(file);


                    await sock.sendMessage(
                        sender,
                        {
                            react:{
                                text:'✅',
                                key:m.key
                            }
                        }
                    );


                }
            );


        }catch(e){

            console.log(
                'TikTok2:',
                e.message
            );


            try{

                if(file && fs.existsSync(file))
                    fs.unlinkSync(file);

            }catch{}


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