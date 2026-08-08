const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['setaudio'],
    category: 'owner',
    ownerOnly: true,


    operate: async ({ sock, m, sender, args }) => {

        try {

            const input = args.join(' ');


            if (!input) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan judul atau link YouTube

Contoh:
.setaudio Cinta Luar Biasa

atau:
.setaudio https://youtu.be/xxxxx`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
`⏳ Mengambil audio untuk voice note...

🎵 ${input}`
            },{quoted:m});



            const target =
            (input.includes('youtube.com') ||
            input.includes('youtu.be'))
            ? input
            : `ytsearch1:${input}`;



            const id = Date.now();


            const output =
            `/tmp/${id}.%(ext)s`;



            let cookies = '';

            const cookiePath =
            path.join(
                process.cwd(),
                'media',
                'cookies.txt'
            );


            if(fs.existsSync(cookiePath)){

                cookies =
                `--cookies "${cookiePath}"`;

            }



            const cmd =
`
yt-dlp ${cookies} \
--remote-components ejs:github \
--no-playlist \
--retries 5 \
--fragment-retries 5 \
-f "bestaudio/best" \
-x \
--audio-format mp3 \
--audio-quality 192K \
-o "${output}" \
"${target}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){

                    console.log(
                        'SETAUDIO ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal download audio

📋 Log:
${stderr.slice(0,1500)}`
                    },{quoted:m});

                }



                const mp3 =
                fs.readdirSync('/tmp')
                .find(f =>
                    f.startsWith(id.toString()) &&
                    f.endsWith('.mp3')
                );



                if(!mp3){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ File audio tidak ditemukan'
                    },{quoted:m});

                }



                const mp3Path =
                path.join('/tmp',mp3);



                const media =
                path.join(
                    process.cwd(),
                    'media'
                );


                if(!fs.existsSync(media)){

                    fs.mkdirSync(media,{
                        recursive:true
                    });

                }



                const oggPath =
                path.join(
                    media,
                    'menu.ogg'
                );



                exec(
`ffmpeg -y -i "${mp3Path}" -c:a libopus -b:a 48k "${oggPath}"`,
                async(err)=>{


                    if(err){

                        console.log(err);

                        return sock.sendMessage(sender,{
                            text:
                            '❌ Gagal convert voice note'
                        },{quoted:m});

                    }



                    try{
                        fs.unlinkSync(mp3Path);
                    }catch{}



                    await sock.sendMessage(sender,{
                        text:
`✅ Berhasil

🎙 Menu voice note sudah dibuat
📁 media/menu.ogg`
                    },{quoted:m});


                });



            });



        }catch(e){

            console.log(e);

            sock.sendMessage(sender,{
                text:
                '❌ Error sistem'
            },{quoted:m});

        }

    }

};