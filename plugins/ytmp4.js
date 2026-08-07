const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['ytmp4'],
    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const input = args.join(' ');


            if (!input) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link atau judul video

Contoh:
.ytmp4 tutorial nodejs

atau:
.ytmp4 https://youtu.be/xxxxx`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Mengambil video...'
            },{quoted:m});



            const target =
            (input.includes('youtube.com') || input.includes('youtu.be'))
            ? input
            : `ytsearch1:${input}`;



            const id = Date.now();


            const output =
            `/tmp/${id}.mp4`;



            const cmd =
`
yt-dlp \
--extractor-args "youtube:player_client=android" \
--no-playlist \
--retries 5 \
--fragment-retries 5 \
-f "bestvideo+bestaudio/best" \
--merge-output-format mp4 \
-o "${output}" \
"${target}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){


                    console.log(
                        'YTMP4 ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal download video

📋 Log:
${stderr.slice(0,1500)}`
                    },{quoted:m});

                }




                if(!fs.existsSync(output)){


                    return sock.sendMessage(sender,{
                        text:
                        '❌ File video tidak ditemukan'
                    },{quoted:m});


                }




                await sock.sendMessage(sender,{
                    video:
                    fs.readFileSync(output),

                    caption:
                    '🎬 YouTube MP4 Downloader'
                },{quoted:m});



                fs.unlinkSync(output);



            });



        } catch(e){


            console.log(
                'YTMP4 SYSTEM ERROR:',
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