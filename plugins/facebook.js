const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: [
        'facebook',
        'fb',
        'fbdl'
    ],

    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const url = args[0];


            if (!url || !url.includes('facebook.com')) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link Facebook

Contoh:
.fb https://facebook.com/xxxxx`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Mengambil media Facebook...'
            },{quoted:m});



            const id = Date.now();

            const folder = `/tmp/${id}`;

            fs.mkdirSync(folder);



            const output =
            `${folder}/%(title)s.%(ext)s`;



            const cmd =
`
yt-dlp \
--no-playlist \
--retries 5 \
--write-thumbnail \
--skip-download \
-o "${output}" \
"${url}" ;

yt-dlp \
--no-playlist \
--retries 5 \
-f "bestvideo+bestaudio/best" \
--merge-output-format mp4 \
-o "${output}" \
"${url}"
`;



            exec(cmd, async(error, stdout, stderr)=>{


                if(error){


                    console.log(
                        'FACEBOOK ERROR:',
                        stderr
                    );


                    return sock.sendMessage(sender,{
                        text:
`❌ Gagal mengambil Facebook

📋 Log:
${stderr.slice(0,1500)}`
                    },{quoted:m});

                }



                const files =
                fs.readdirSync(folder);



                // =================
                // FOTO
                // =================

                const image =
                files.find(f =>
                    f.endsWith('.jpg') ||
                    f.endsWith('.jpeg') ||
                    f.endsWith('.png')
                );



                if(image){


                    await sock.sendMessage(sender,{

                        image:
                        fs.readFileSync(
                            path.join(folder,image)
                        ),

                        caption:
                        '✅ Facebook Image'

                    },{quoted:m});


                }



                // =================
                // VIDEO
                // =================

                const video =
                files.find(f =>
                    f.endsWith('.mp4')
                );



                if(video){


                    await sock.sendMessage(sender,{

                        video:
                        fs.readFileSync(
                            path.join(folder,video)
                        ),

                        caption:
                        '✅ Facebook Video'

                    },{quoted:m});


                }



                if(!image && !video){

                    await sock.sendMessage(sender,{
                        text:
                        '❌ Media tidak ditemukan'
                    },{quoted:m});

                }



                // hapus temp

                for(const file of files){

                    fs.unlinkSync(
                        path.join(folder,file)
                    );

                }


                fs.rmdirSync(folder);



            });



        } catch(e){


            console.log(
                'FB SYSTEM ERROR:',
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