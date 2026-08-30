const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


const cacheFile =
path.join(
    process.cwd(),
    'database',
    'youtube_cache.json'
);



function loadCache(){

    if(!fs.existsSync(cacheFile))
        return {};

    try{

        const data = JSON.parse(
            fs.readFileSync(cacheFile)
        );

        const now = Date.now();

        for(const id in data){

            if(
                now - data[id].time > 30 * 60 * 1000
            ){
                delete data[id];
            }

        }

        return data;

    }catch{

        return {};

    }

}


function saveCache(data){

    fs.mkdirSync(
        path.dirname(cacheFile),
        {
            recursive:true
        }
    );


    fs.writeFileSync(
        cacheFile,
        JSON.stringify(
            data,
            null,
            2
        )
    );

}





module.exports = {

    command:[
        'ytmp4',
        '144',
        '360',
        '480',
        '720'
    ],


    category:'downloader',



    operate: async ({
        sock,
        m,
        sender,
        args,
        command
    }) => {


        try{


            // =====================
            // PILIH RESOLUSI
            // =====================

            if([
                '144',
                '360',
                '480',
                '720'
            ].includes(command)){



                const quoted =
                m.message
                ?.extendedTextMessage
                ?.contextInfo;



                const msgId =
                quoted?.stanzaId;



                if(!msgId){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Reply pesan pilihan kualitas'
                    },{
                        quoted:m
                    });

                }



                const cache =
                loadCache();



                const data =
                cache[msgId];

                if(!data){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Data video tidak ditemukan / sudah expired'
                    },{
                        quoted:m
                    });

                }
                if(!data.qualities.includes(Number(command))){

    return sock.sendMessage(sender,{
        text:
        `❌ Kualitas ${command}p tidak tersedia

Tersedia:
${data.qualities.map(q=>q+'p').join(', ')}`
    },{
        quoted:m
    });

}



                return downloadVideo(
                    sock,
                    m,
                    sender,
                    data,
                    command,
                    msgId
                );

            }





            // =====================
            // COMMAND YT
            // =====================


            if(!args.length){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan judul/link YouTube

Contoh:
.yt faded`
                },{
                    quoted:m
                });

            }



            const input =
            args.join(' ');



            const target =
            (
                input.includes('youtube.com') ||
                input.includes('youtu.be')
            )
            ?
            input
            :
            `ytsearch1:${input}`;





            let cookies='';



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





            await sock.sendMessage(sender,{
                text:
                '⏳ Mengambil data YouTube...'
            },{
                quoted:m
            });





            const infoCmd =
`
yt-dlp ${cookies} \
--remote-components ejs:github \
--dump-json \
--no-playlist \
"${target}"
`;





            exec(
                infoCmd,
                async(err,stdout,stderr)=>{


                if(err){

                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal mengambil info

${stderr.slice(0,1000)}`
                    },{
                        quoted:m
                    });

                }




                let info;


try{

    info =
    JSON.parse(stdout);

}catch{

    return sock.sendMessage(sender,{
        text:'❌ Metadata error'
    },{
        quoted:m
    });

}


const formats = info.formats
.filter(f => f.height && f.vcodec !== 'none');


const qualities = [
    ...new Set(
        formats.map(f => f.height)
    )
]
.sort((a,b)=>a-b)
.filter(q =>
    [144,360,480,720].includes(q)
);


function formatSize(bytes){

    if(!bytes)
        return '-';

    const mb =
    bytes / 1024 / 1024;

    return mb.toFixed(2) + ' MB';

}


const qualityText =
qualities
.map(q => {

    const video =
    formats
    .filter(f =>
        f.height === q &&
        f.vcodec !== 'none'
    )
    .sort((a,b)=>
        (b.filesize || b.filesize_approx || 0) -
        (a.filesize || a.filesize_approx || 0)
    )[0];


    const audio =
info.formats
.filter(f =>
    f.acodec !== 'none' &&
    f.vcodec === 'none'
)
.sort((a,b)=>
    (b.abr || 0) -
    (a.abr || 0)
)[0];


    const videoSize =
    video?.filesize ||
    video?.filesize_approx ||
    0;


    const audioSize =
    audio?.filesize ||
    audio?.filesize_approx ||
    0;


    return `• .${q}p (±${formatSize((videoSize + audioSize) * 1.1)})`;
})
.join('\n');

// kirim thumbnail + info lengkap
if(info.thumbnail){

const description =
info.description ||
'Tidak ada deskripsi';


const likes =
info.like_count ?
info.like_count.toLocaleString('id-ID')
:
'-';


const views =
info.view_count ?
info.view_count.toLocaleString('id-ID')
:
'-';


const comments =
info.comment_count ?
info.comment_count.toLocaleString('id-ID')
:
'-';


const upload =
info.upload_date ?
`${info.upload_date.slice(6,8)}-${info.upload_date.slice(4,6)}-${info.upload_date.slice(0,4)}`
:
'-';



await sock.sendMessage(sender,{
    image:{
        url: info.thumbnail
    },

    caption:
`🎬 *${info.title || '-'}*

👤 *Channel*
${info.uploader || info.channel || '-'}

🆔 *Channel ID*
${info.channel_id || '-'}

👁 *Views*
${views}

👍 *Like*
${likes}

💬 *Comment*
${comments}

📅 *Upload*
${upload}

⏱ *Durasi*
${info.duration_string || '-'}

📂 *Kategori*
${info.categories?.join(', ') || '-'}

🌍 *Bahasa*
${info.language || '-'}

🔗 *Link*
${info.webpage_url || '-'}


📝 *Deskripsi*
${description}`

},{
    quoted:m
});

}


// pesan ini yang direply untuk pilih kualitas
const sent =
await sock.sendMessage(sender,{
    text:
`📥 Pilih kualitas:

${qualityText}

↩️ Reply pesan ini`
},{
    quoted:m
});


const cache =
loadCache();


cache[sent.key.id] = {

    target,

    info,

    cookies,

    qualities,

    time:
    Date.now()

};


saveCache(cache);


            });



        }catch(e){

            console.log(
                'YT ERROR:',
                e
            );


            sock.sendMessage(sender,{
                text:
                '❌ Error sistem'
            },{
                quoted:m
            });

        }

    }

};
async function downloadVideo(
    sock,
    m,
    sender,
    data,
    quality,
    msgId
){

    const id = Date.now();

    const folder =
    `/tmp/yt_${id}`;


    fs.mkdirSync(folder,{
        recursive:true
    });


    const output =
    `${folder}/video.%(ext)s`;


    await sock.sendMessage(sender,{
        text:
`⏳ Download ${quality}p...

🎬 ${data.info.title}`
    },{
        quoted:m
    });



    const cmd =
`
yt-dlp ${data.cookies} \
--remote-components ejs:github \
--no-playlist \
--no-mtime \
--retries 5 \
--fragment-retries 5 \
--concurrent-fragments 2 \
-f "bv*[height<=${quality}][vcodec^=avc]+ba[acodec^=mp4a]/b[height<=${quality}][vcodec^=avc]" \
--merge-output-format mp4 \
--postprocessor-args "ffmpeg:-movflags +faststart" \
-o "${output}" \
"${data.target}"
`;



    exec(cmd, async(error,stdout,stderr)=>{


        if(error){

            return sock.sendMessage(sender,{
                text:
`❌ Gagal download

${stderr.slice(0,1200)}`
            },{
                quoted:m
            });

        }



        const video =
        fs.readdirSync(folder)
        .find(
            f=>f.endsWith('.mp4')
        );



        if(!video){

            return sock.sendMessage(sender,{
                text:
                '❌ File video tidak ditemukan'
            },{
                quoted:m
            });

        }



        const filePath =
        path.join(
            folder,
            video
        );


        const size =
        fs.statSync(filePath).size / 1024 / 1024;



        console.log(
            `VIDEO SIZE ${size.toFixed(2)} MB`
        );



        await sock.sendMessage(sender,{
            video:{
                url:filePath
            },

            mimetype:
            'video/mp4',

            caption:
`🎬 ${data.info.title || 'YouTube'}

📺 Quality : ${quality}p
📦 Size : ${size.toFixed(2)} MB`

        },{
            quoted:m
        });

// hapus cache youtube
const cache =
loadCache();

delete cache[msgId];

saveCache(cache);
//hapus file sementara
        try{

            fs.rmSync(
                folder,
                {
                    recursive:true,
                    force:true
                }
            );

        }catch{}


    });

}