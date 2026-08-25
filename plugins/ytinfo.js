const { exec } = require('child_process');
const util = require('util');
const path = require('path');
const fs = require('fs');

const execPromise = util.promisify(exec);

module.exports = {

    command: ['ytinfo','youtubeinfo'],
    category: 'downloader',

    operate: async ({
        sock,
        m,
        sender,
        args
    }) => {

        try {

            if(!args || !args.length){
                return sock.sendMessage(
                    sender,
                    {
                        text:
`╭━━〔 📺 YT INFO 〕
│
│ Contoh:
│ .ytinfo https://youtube.com/watch?v=xxx
│
╰━━━━━━━━━━━━`
                    },
                    {quoted:m}
                );
            }


            const query = args.join(' ');

            const cookies =
            path.join(
                process.cwd(),
                'media',
                'cookies.txt'
            );


            let cookieArg = '';

            if(fs.existsSync(cookies)){
                cookieArg =
                `--cookies "${cookies}"`;
            }
await sock.sendMessage(sender,{
    text:
`⏳ Sedang memproses info YouTube...

🔎 Mencari:
${query}

Mohon tunggu...`
},{quoted:m});
const target =
(
    query.includes('youtube.com') ||
    query.includes('youtu.be')
)
? query
: `ytsearch1:${query}`;


const command =
`yt-dlp ${cookieArg} \
--remote-components ejs:github \
--dump-json \
--no-playlist \
"${target}"`;
            const {
                stdout
            } = await execPromise(command,{
                maxBuffer:1024*1024*20
            });


            const data =
            JSON.parse(stdout);



            function formatNumber(num){

                if(!num)
                    return 'Tidak diketahui';

                return Number(num)
                .toLocaleString('id-ID');
            }


            function formatDuration(sec){

                if(!sec)
                    return '-';

                let h =
                Math.floor(sec/3600);

                let m =
                Math.floor(
                    (sec%3600)/60
                );

                let s =
                sec%60;


                return (
                    h ? h+' jam ' : ''
                )
                +
                (
                    m ? m+' menit ' : ''
                )
                +
                s+' detik';
            }



            let formats =
            data.formats
            ?.filter(
                x=>x.height
            )
            ?.map(
                x=>x.height+'p'
            )
            ?.filter(
                (v,i,a)=>
                a.indexOf(v)===i
            )
            ?.sort(
                (a,b)=>
                parseInt(a)-parseInt(b)
            )
            ?.join(', ');


            if(!formats)
                formats='Tidak diketahui';



            let desc =
            data.description ||
            'Tidak ada deskripsi';


            if(desc.length > 500){
                desc =
                desc.substring(0,500)
                +'...';
            }



            let text =
`〔 📺 YOUTUBE INFO 〕
🎬 Judul
${data.title || '-'}
👤 Channel
${data.channel || data.uploader || '-'}
👥 Subscriber
${formatNumber(data.channel_follower_count)}
👀 Views
${formatNumber(data.view_count)}
👍 Like
${formatNumber(data.like_count)}
⏱ Durasi
${formatDuration(data.duration)}
📅 Upload
${data.upload_date || '-'}
🎞 Resolusi
${formats}
🔗 URL
${data.webpage_url || query}

〔 📝 DESKRIPSI 〕

${desc}
`;



            await sock.sendMessage(
                sender,
                {
                    image:{
                        url:
                        data.thumbnail
                    },
                    caption:text
                },
                {
                    quoted:m
                }
            );


        } catch(e){

            console.log(
                'YTINFO ERROR:',
                e.message
            );


            await sock.sendMessage(
                sender,
                {
                    text:
`❌ Gagal mengambil info YouTube

${e.message}`
                },
                {
                    quoted:m
                }
            );

        }

    }

};