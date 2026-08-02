const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['ytmp3'],
    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const input = args.join(' ');


            if (!input) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link atau judul lagu

Contoh:
.ytmp3 Cinta Luar Biasa

atau:
.ytmp3 https://youtu.be/xxxxx`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Mengambil audio...'
            },{quoted:m});



            const target =
            (input.includes('youtube.com') || input.includes('youtu.be'))
            ? input
            : `ytsearch1:${input}`;



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
"${target}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){

                    console.log(
                        'YTMP3 ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal download MP3

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
                        '❌ File MP3 tidak ditemukan'
                    },{quoted:m});

                }



                const audioPath =
                path.join('/tmp',file);



                await sock.sendMessage(sender,{
                    audio:
                    fs.readFileSync(audioPath),

                    mimetype:
                    'audio/mpeg',

                    fileName:
                    'audio.mp3',

                    caption:
                    '🎵 YouTube MP3 Downloader'
                },{quoted:m});



                fs.unlinkSync(audioPath);


            });



        } catch(e){

            console.log(e);

            sock.sendMessage(sender,{
                text:
                '❌ Error sistem'
            },{quoted:m});

        }

    }

};