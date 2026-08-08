const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['youtube','yt','ytmp4'],
    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            if(!args.length){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan judul atau link YouTube

Contoh:
.youtube alan walker`
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
`⏳ Mengambil video...

🎬 ${input}`
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
`❌ Gagal mengambil data

${stderr.slice(0,1000)}`
                    },{quoted:m});

                }



                let info;

                try{
                    info = JSON.parse(stdout);
                }catch{

                    return sock.sendMessage(sender,{
                        text:'❌ Data video gagal dibaca'
                    },{quoted:m});

                }



                const title =
                info.title || '-';


                const caption =
`🎬 *${title}*

👤 Channel:
${info.uploader || '-'}

⏱ Durasi:
${info.duration_string || '-'}

👀 Views:
${info.view_count ? Number(info.view_count).toLocaleString('id-ID') : '-'}

👍 Like:
${info.like_count ? Number(info.like_count).toLocaleString('id-ID') : '-'}

💬 Komentar:
${info.comment_count ? Number(info.comment_count).toLocaleString('id-ID') : '-'}

📅 Upload:
${info.upload_date || '-'}

📝 Deskripsi:
${info.description || '-'}`;



                const downloadCmd =
`yt-dlp ${cookies} --remote-components ejs:github --no-playlist -f "best[height<=720]/best" --merge-output-format mp4 --write-thumbnail -o "${output}" "${target}"`;



                exec(downloadCmd, async(error,so,se)=>{


                    if(error){

                        return sock.sendMessage(sender,{
                            text:
`❌ Gagal download

${se.slice(0,1200)}`
                        },{quoted:m});

                    }



                    const files =
                    fs.readdirSync('/tmp')
                    .filter(f =>
                        f.startsWith(id.toString())
                    );



                    const video =
                    files.find(f =>
                        f.endsWith('.mp4')
                    );


                    const thumb =
                    files.find(f =>
                        f.endsWith('.jpg') ||
                        f.endsWith('.webp')
                    );



                    if(!video){

                        return sock.sendMessage(sender,{
                            text:
                            '❌ Video tidak ditemukan'
                        },{quoted:m});

                    }



                    if(thumb){

                        await sock.sendMessage(sender,{
                            image:
                            fs.readFileSync(`/tmp/${thumb}`),

                            caption:
                            caption.slice(0,3500)

                        },{quoted:m});

                    }else{

                        await sock.sendMessage(sender,{
                            text:
                            caption.slice(0,3500)

                        },{quoted:m});

                    }



                    await sock.sendMessage(sender,{
                        video:
                        fs.readFileSync(`/tmp/${video}`),

                        mimetype:
                        'video/mp4',

                        fileName:
                        `${title}.mp4`

                    },{quoted:m});



                    for(const file of files){

                        try{
                            fs.unlinkSync(`/tmp/${file}`);
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