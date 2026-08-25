const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['play'],
    category: 'downloader',


    operate: async ({
        sock,
        m,
        sender,
        args
    }) => {

        try {

            if(!args.length){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan judul lagu

Contoh:
.play faded`
                },{
                    quoted:m
                });

            }


            const input =
            args.join(' ');


            const id =
            Date.now();


            const output =
            `/tmp/${id}.%(ext)s`;



            const target =
            (
                input.includes('youtube.com') ||
                input.includes('youtu.be')
            )
            ?
            input
            :
            `ytsearch1:${input}`;



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



            await sock.sendMessage(sender,{
                text:
`⏳ Mengambil audio...

🎵 ${input}`
            },{
                quoted:m
            });



            const cmd =
`
yt-dlp ${cookies} \
--remote-components ejs:github \
--no-playlist \
-f "bestaudio[ext=m4a]/bestaudio" \
-o "${output}" \
"${target}"
`;



            exec(
                cmd,
                async(error,stdout,stderr)=>{


                    if(error){

                        console.log(
                            stderr
                        );

                        return sock.sendMessage(sender,{
                            text:
                            '❌ Gagal download audio'
                        },{
                            quoted:m
                        });

                    }



                    const file =
                    fs.readdirSync('/tmp')
                    .find(
                        x =>
                        x.startsWith(
                            id.toString()
                        )
                    );



                    if(!file){

                        return sock.sendMessage(sender,{
                            text:
                            '❌ File audio tidak ditemukan'
                        },{
                            quoted:m
                        });

                    }



                    await sock.sendMessage(sender,{
                        
                        audio:
                        fs.readFileSync(
                            `/tmp/${file}`
                        ),

                        mimetype:
                        'audio/mp4',

                        ptt:false,

                        fileName:
                        `${input}.m4a`

                    },{
                        quoted:m
                    });



                    try{

                        fs.unlinkSync(
                            `/tmp/${file}`
                        );

                    }catch{}



                }
            );


        }catch(e){

            console.log(
                'PLAY ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
                '❌ Error sistem'
            },{
                quoted:m
            });

        }

    }

};