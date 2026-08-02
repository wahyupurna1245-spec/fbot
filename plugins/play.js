const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['play'],
    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {


            const url = args[0];


            if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link YouTube

Contoh:
.play https://youtu.be/xxxxx`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Mengambil audio YouTube...'
            },{quoted:m});



            const id = Date.now();


            const output =
            `/tmp/${id}.%(ext)s`;



            const cmd =
`
yt-dlp \
--extractor-args "youtube:player_client=android" \
--no-playlist \
--retries 5 \
--fragment-retries 5 \
-f bestaudio/best \
-x \
--audio-format mp3 \
--audio-quality 192K \
-o "${output}" \
"${url}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){


                    console.log(
                        'YT-DLP ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal download audio

📋 Log error:

${stderr.slice(0,1500)}`
                    },{quoted:m});

                }




                const file =
                fs.readdirSync('/tmp')
                .find(f =>
                    f.startsWith(id.toString()) &&
                    f.endsWith('.mp3')
                );



                if(!file){


                    return sock.sendMessage(sender,{
                        text:
`❌ File MP3 tidak ditemukan

📋 Output:
${stdout.slice(0,1000)}`
                    },{quoted:m});


                }




                const audioPath =
                path.join(
                    '/tmp',
                    file
                );




                await sock.sendMessage(sender,{
                    audio:
                    fs.readFileSync(audioPath),

                    mimetype:
                    'audio/mpeg',

                    fileName:
                    'audio.mp3',

                    caption:
                    '🎵 YouTube Audio Downloader'
                },{quoted:m});




                fs.unlinkSync(audioPath);



            });



        } catch(e){


            console.log(
                'PLAY ERROR:',
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