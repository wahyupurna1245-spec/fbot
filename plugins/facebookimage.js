const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: [
        'facebookimage',
        'fbimage',
        'fbimg'
    ],

    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const url = args[0];


            if(!url || !url.includes('facebook')) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link gambar Facebook

Contoh:
.fbimg https://facebook.com/photo/xxxxx`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Mengambil gambar Facebook...'
            },{quoted:m});



            const id = Date.now();

            const folder =
            `/tmp/fbimg_${id}`;


            fs.mkdirSync(folder);



            const output =
            `${folder}/%(title)s.%(ext)s`;



            const cmd =
`
yt-dlp \
--no-playlist \
--skip-download \
--write-thumbnail \
--convert-thumbnails jpg \
-o "${output}" \
"${url}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){

                    console.log(
                        'FB IMAGE ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal mengambil gambar Facebook

📋 Log:
${stderr.slice(0,1500)}`
                    },{quoted:m});

                }



                const files =
                fs.readdirSync(folder);



                const image =
                files.find(f =>
                    f.endsWith('.jpg') ||
                    f.endsWith('.jpeg') ||
                    f.endsWith('.png')
                );



                if(!image){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Gambar tidak ditemukan'
                    },{quoted:m});

                }



                await sock.sendMessage(sender,{

                    image:
                    fs.readFileSync(
                        path.join(folder,image)
                    ),

                    caption:
                    '✅ Facebook Image Downloader'

                },{quoted:m});



                fs.unlinkSync(
                    path.join(folder,image)
                );

                fs.rmdirSync(folder);



            });



        } catch(e){

            console.log(
                'FB IMAGE SYSTEM:',
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