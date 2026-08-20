const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);


module.exports = {

    command: [
        'pkglist'
    ],

    category: 'tools',


    operate: async ({ sock, m, sender }) => {

        try {


            const cek = async (cmd) => {

                try {

                    const { stdout } =
                    await execPromise(cmd);

                    return stdout.trim();

                } catch {

                    return 'Tidak terdeteksi';

                }

            };



            const data = {

                'Node.js':
                await cek('node -v'),

                'NPM':
                await cek('npm -v'),

                'Python':
                await cek('python3 --version'),

                'YT-DLP':
                await cek('yt-dlp --version'),

                'FFmpeg':
                await cek('ffmpeg -version'),

                'FFprobe':
                await cek('ffprobe -version'),

                'Deno':
                await cek('deno --version'),

                'Git':
                await cek('git --version'),

                'Wget':
                await cek('wget --version'),

                'Curl':
                await cek('curl --version')

            };



            const ffmpeg =
            data['FFmpeg']
            .split('\n')[0];


            const ffprobe =
            data['FFprobe']
            .split('\n')[0];


            const deno =
            data['Deno']
            .split('\n')[0];


            const text =
`🛠️ *SYSTEM TOOLS LIST*

🟢 Node.js
${data['Node.js']}

📦 NPM
${data['NPM']}

🐍 Python
${data['Python']}

🎬 FFmpeg
${ffmpeg}

🔊 FFprobe
${ffprobe}

📥 YT-DLP
${data['YT-DLP']}

🦕 Deno
${deno}

📂 Git
${data['Git']}

⬇️ Wget
${data['Wget'].split('\n')[0]}

🌐 Curl
${data['Curl'].split('\n')[0]}
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
        }

    }

};