const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);


module.exports = {

    command: [
        'checkdl',
        'checkmedia'
    ],

    category: 'owner',

    ownerOnly: true,


    operate: async ({ sock, m, sender }) => {

        try {

            const cek = async (cmd) => {

                try {

                    const { stdout, stderr } =
                    await execPromise(cmd);

                    return (stdout || stderr)
                    .trim();

                } catch(e){

                    return '❌ Error';

                }

            };



            const ytdlp =
            await cek(
            'yt-dlp --version'
            );



            const ffmpeg =
            await cek(
            'ffmpeg -version'
            );



            const cookieFiles = [

                'media/cookies.txt',
                'media/yt-cookies.txt',
                'media/ig-cookies.txt',
                'media/fb-cookies.txt',
                'media/tiktok-cookies.txt'

            ];



            let cookies = '';



            for(const file of cookieFiles){

                cookies +=
`${file}

${fs.existsSync(file)
? '✅ Ada'
: '❌ Tidak ada'}

`;

            }



            const extractors =
            await cek(
            'yt-dlp --list-extractors'
            );



            const cekSite = (name) => {

                return extractors
                .toLowerCase()
                .includes(name)
                ? '✅ Support'
                : '❌ Tidak';

            };



            const text =
`📥 *DOWNLOADER CHECK*

⚙️ Tools

YT-DLP:
${ytdlp}

FFmpeg:
${ffmpeg.split('\n')[0]}


🍪 COOKIE FILE

${cookies}

🌐 Extractor

▶️ YouTube:
${cekSite('youtube')}

🎵 TikTok:
${cekSite('tiktok')}

📷 Instagram:
${cekSite('instagram')}

📘 Facebook:
${cekSite('facebook')}

🐦 Twitter/X:
${cekSite('twitter')}

`;



            await sock.sendMessage(sender,{
                text
            },{quoted:m});



        } catch(e){

            await sock.sendMessage(sender,{
                text:
`❌ ERROR

${e.message}`
            },{quoted:m});

        }

    }

};