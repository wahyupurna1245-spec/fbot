const { exec } = require('child_process');
const fs = require('fs');


module.exports = {

    command: [
        'facebookvideo',
        'fbvid'
    ],

    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const url = args[0];


            if (!url || !url.includes('facebook')) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link Facebook

Contoh:
.fb https://www.facebook.com/reel/xxxxx`
                },{quoted:m});

            }


            await sock.sendMessage(sender,{
                text:
                '⏳ Download Facebook...'
            },{quoted:m});



            const id = Date.now();

            const output =
            `/tmp/facebook_${id}.mp4`;



            const cmd =
`
yt-dlp \
--no-playlist \
--retries 5 \
-f "best[ext=mp4]/best" \
-o "${output}" \
"${url}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){


                    console.log(
                        'FACEBOOK ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal download Facebook

📋 Log:
${stderr.slice(0,1500)}`
                    },{quoted:m});


                }



                if(!fs.existsSync(output)){


                    return sock.sendMessage(sender,{
                        text:
                        '❌ Video tidak ditemukan'
                    },{quoted:m});


                }



                await sock.sendMessage(sender,{

                    video:
                    fs.readFileSync(output),

                    caption:
`✅ Facebook Downloader

📹 Berhasil mengambil video`

                },{quoted:m});



                fs.unlinkSync(output);



            });



        } catch(e) {


            console.log(
                'FB ERROR:',
                e
            );


            sock.sendMessage(sender,{
                text:
`❌ Error sistem

${e.message}`
            },{quoted:m});


        }

    }

};