const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');


module.exports = {

    command: ['vn'],
    category: 'downloader',


    operate: async ({ sock, m, sender, args }) => {

        try {

            if (!args.length) return;


            const input = args.join(' ');

            const id = Date.now();

            const opus =
            `/tmp/${id}.ogg`;


            const target =
            (input.includes('youtube.com') ||
            input.includes('youtu.be'))
            ? input
            : `ytsearch1:${input}`;



            let ytArgs = [

                '--no-playlist',

                '-f',
                'bestaudio[acodec=opus]/bestaudio',

                '-o',
                '-',

                target
            ];



            const cookiePath =
            path.join(
                process.cwd(),
                'media',
                'cookies.txt'
            );


            if(fs.existsSync(cookiePath)){

                ytArgs.unshift(
                    '--cookies',
                    cookiePath
                );

            }



            ytArgs.unshift(
                '--remote-components',
                'ejs:github'
            );



            const yt =
            spawn(
                'yt-dlp',
                ytArgs
            );



            const ff =
            spawn(
                'ffmpeg',
                [
                    '-y',

                    '-i',
                    'pipe:0',

                    '-vn',

                    '-c:a',
                    'libopus',

                    '-b:a',
                    '48k',

                    opus
                ]
            );



            yt.stdout.pipe(ff.stdin);



            let errorLog = '';

            yt.stderr.on('data',data=>{
                errorLog += data.toString();
            });



            ff.on('close', async(code)=>{


                if(code !== 0 ||
                   !fs.existsSync(opus)){

                    console.log(errorLog);

                    return;

                }



                await sock.sendMessage(sender,{

                    audio:
                    fs.readFileSync(opus),

                    mimetype:
                    'audio/ogg; codecs=opus',

                    ptt:true

                },{quoted:m});



                try{
                    fs.unlinkSync(opus);
                }catch{}


            });



        }catch(e){

            console.log(e);

        }

    }

};