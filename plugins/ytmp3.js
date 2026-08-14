const { exec } = require('child_process');
const fs = require('fs');

module.exports = {

    command: [
        'ytmp3',
        'mp3'
    ],

    category: 'downloader',

    operate: async ({ sock, m, sender, args }) => {

        try {

            if(!args.length){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan judul atau link YouTube

Contoh:
.ytmp3 The Drum`
                },{quoted:m});

            }


            const input = args.join(' ');

            const id = Date.now();

            const folder = `/tmp/ytmp3_${id}`;

            fs.mkdirSync(folder,{
                recursive:true
            });


            const output =
            `${folder}/%(title)s.%(ext)s`;


            const target =
            (input.includes('youtube.com') ||
            input.includes('youtu.be'))
            ? input
            : `ytsearch1:${input}`;



            let cookies = '';

            const cookiePath =
            `${process.cwd()}/media/cookies.txt`;


            if(fs.existsSync(cookiePath)){

                cookies =
                `--cookies "${cookiePath}"`;

            }



            await sock.sendMessage(sender,{
                text:
`⏳ Mohon tunggu...

🎵 Sedang memproses audio`
            },{quoted:m});



            const cmd = `
yt-dlp ${cookies} \
--remote-components ejs:github \
--no-playlist \
-x \
--audio-format mp3 \
--audio-quality 192K \
-o "${output}" \
"${target}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){

                    console.log(stderr);

                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal download audio`
                    },{quoted:m});

                }



                const files =
                fs.readdirSync(folder);


                const mp3 =
                files.find(f =>
                    f.endsWith('.mp3')
                );



                if(!mp3){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ File MP3 tidak ditemukan'
                    },{quoted:m});

                }



                await sock.sendMessage(sender,{
                    document:
                    fs.readFileSync(
                        `${folder}/${mp3}`
                    ),

                    mimetype:
                    'audio/mpeg',

                    fileName:
                    mp3

                },{quoted:m});



                for(const file of files){

                    try{

                        fs.unlinkSync(
                            `${folder}/${file}`
                        );

                    }catch{}

                }



                try{

                    fs.rmdirSync(folder);

                }catch{}



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