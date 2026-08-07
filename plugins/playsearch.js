const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: [
        'playsearch',
        'ps'
    ],

    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const query = args.join(' ');


            if (!query) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan judul lagu

Contoh:
.ps Cinta Luar Biasa`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
`🔎 Mencari lagu:

${query}`
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
-f bestaudio/best \
-x \
--audio-format mp3 \
--audio-quality 192K \
-o "${output}" \
"ytsearch1:${query}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){


                    console.log(
                        'PLAYSEARCH ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal mencari lagu

📋 Log:

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
`❌ File audio tidak ditemukan

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
                    `${query}.mp3`,

                    caption:
`🎵 *Play Search*

🔎 ${query}`
                },{quoted:m});



                fs.unlinkSync(audioPath);



            });



        } catch(e){


            console.log(
                'PLAYSEARCH SYSTEM ERROR:',
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