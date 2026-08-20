const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['play'],
    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            if (!args.length) {
                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan judul atau link YouTube

Contoh:
.play the drum`
                },{quoted:m});
            }


            const input = args.join(' ');
            const id = Date.now();

            const output =
            `/tmp/${id}.%(ext)s`;


            const target =
            (input.includes('youtube.com') ||
            input.includes('youtu.be'))
            ? input
            : `ytsearch1:${input}`;



            await sock.sendMessage(sender,{
                text:
`⏳ Mengambil data...

🎵 ${input}`
            },{quoted:m});



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



            const infoCmd =
`yt-dlp ${cookies} --remote-components ejs:github --dump-json --no-playlist "${target}"`;



            exec(infoCmd,(err,stdout,stderr)=>{


                if(err){

                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal mengambil informasi

${stderr.slice(0,800)}`
                    },{quoted:m});

                }



                let info;

                try{
                    info = JSON.parse(stdout);
                }catch{

                    return sock.sendMessage(sender,{
                        text:'❌ Metadata gagal dibaca'
                    },{quoted:m});

                }



                const title =
                info.title || '-';

                const channel =
                info.uploader || info.channel || '-';

                const duration =
                info.duration_string || '-';

                const views =
                info.view_count
                ? Number(info.view_count).toLocaleString('id-ID')
                : '-';

                const likes =
                info.like_count
                ? Number(info.like_count).toLocaleString('id-ID')
                : '-';



                let upload = '-';

                if(info.upload_date){

                    const d = info.upload_date;

                    upload =
                    `${d.slice(6,8)}-${d.slice(4,6)}-${d.slice(0,4)}`;

                }



                const desc =
                info.description || '-';



                const caption =
`🎵 *Judul:*
${title}

👤 *Channel:*
${channel}

⏱ *Durasi:*
${duration}

👀 *Views:*
${views}

👍 *Like:*
${likes}

📅 *Upload:*
${upload}

📝 *Deskripsi:*
${desc}`;



                const downloadCmd =
`yt-dlp ${cookies} --remote-components ejs:github --no-playlist --write-thumbnail -x --audio-format mp3 --audio-quality 0 -o "${output}" "${target}"`;



                exec(downloadCmd, async(error,so,se)=>{


                    if(error){

                        return sock.sendMessage(sender,{
                            text:
`❌ Gagal download

${se.slice(0,1000)}`
                        },{quoted:m});

                    }



                    const files =
                    fs.readdirSync('/tmp')
                    .filter(f =>
                        f.startsWith(id.toString())
                    );



                    const mp3 =
                    files.find(f =>
                        f.endsWith('.mp3')
                    );


                    const thumb =
                    files.find(f =>
                        f.endsWith('.jpg') ||
                        f.endsWith('.webp')
                    );



                    if(thumb){

                        await sock.sendMessage(sender,{
                            image:
                            fs.readFileSync(`/tmp/${thumb}`),

                            caption:
                            caption.slice(0,4000)

                        },{quoted:m});

                    } else {

                        await sock.sendMessage(sender,{
                            text:
                            caption.slice(0,4000)

                        },{quoted:m});

                    }



                    if(mp3){

                        await sock.sendMessage(sender,{
                            audio:
                            fs.readFileSync(`/tmp/${mp3}`),

                            mimetype:'audio/mpeg',

                            fileName:
                            `${title}.mp3`

                        },{quoted:m});

                    }



                    for(const file of files){

                        try{
                            fs.unlinkSync(
                                `/tmp/${file}`
                            );
                        }catch{}

                    }


                });



            });



        }catch(e){

            console.log(e);

            sock.sendMessage(sender,{
                text:'❌ Error sistem'
            },{quoted:m});

        }

    }

};