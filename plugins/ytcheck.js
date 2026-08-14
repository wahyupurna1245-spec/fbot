const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);


module.exports = {

    command: [
        'ytcheck'
    ],

    category: 'tools',


    operate: async ({ sock, m, sender }) => {

        try {


            const { stdout: version } =
            await execPromise(
                'yt-dlp --version'
            );


            const { stdout: extractors } =
            await execPromise(
                'yt-dlp --list-extractors'
            );


            const tiktok =
            extractors
            .split('\n')
            .filter(
                x => x.toLowerCase()
                .includes('tiktok')
            );



            await sock.sendMessage(sender,{
                text:
`📥 *YT-DLP CHECK*

Version:
${version.trim()}


🎵 TikTok Extractor:

${tiktok.length ?
tiktok.join('\n') :
'❌ Tidak ditemukan'}


✅ Status:
${tiktok.length ?
'YT-DLP mendukung TikTok' :
'Tidak support TikTok'}`
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