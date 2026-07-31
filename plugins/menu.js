const fs = require('fs');
const path = require('path');

module.exports = {
    command: ['help'],
    category: 'main',
    ownerOnly: false,

    operate: async ({ sock, m, sender, prefix }) => {

        try {

            const pluginPath = __dirname;
            let menu = {};


            const files = fs.readdirSync(pluginPath)
                .filter(file =>
                    file.endsWith('.js') &&
                    file !== 'menu.js'
                );


            for (const file of files) {

                try {

                    const plugin =
                        require(
                            path.join(pluginPath, file)
                        );


                    if (!plugin.command) continue;


                    const category =
                        plugin.category || 'other';


                    if (!menu[category]) {
                        menu[category] = [];
                    }


                    const cmds =
                        Array.isArray(plugin.command)
                        ? plugin.command
                        : [plugin.command];


                    menu[category].push(...cmds);


                } catch (e) {

                    console.log(
                        `Gagal membaca ${file}`
                    );

                }

            }



            let teks =
`╭━━━〔 🤖 BOT MENU 〕━━━╮
┃
`;


            for (const kategori in menu) {

                teks +=
`┃ ✨ *${kategori.toUpperCase()}*
`;


                menu[kategori].forEach(cmd => {

                    teks +=
`┃ • ${prefix}${cmd}
`;

                });


                teks += `┃
`;

            }



            teks +=
`╰━━━━━━━━━━━━━━━━━━╯

⚡ Bot aktif
📌 Total plugin: ${files.length}
`;



            // MEDIA
            const gambar =
                path.join(
                    __dirname,
                    '../media/menu.jpg'
                );


            const audio =
                path.join(
                    __dirname,
                    '../media/menu.mp3'
                );



            // KIRIM GAMBAR + MENU

            if (fs.existsSync(gambar)) {

                await sock.sendMessage(
                    sender,
                    {
                        image:
                            fs.readFileSync(gambar),
                        caption: teks
                    },
                    {
                        quoted: m
                    }
                );


            } else {


                await sock.sendMessage(
                    sender,
                    {
                        text: teks
                    },
                    {
                        quoted: m
                    }
                );

            }



            // KIRIM AUDIO

            if (fs.existsSync(audio)) {

                await sock.sendMessage(
                    sender,
                    {
                        audio:
                            fs.readFileSync(audio),
                        mimetype:
                            'audio/mpeg'
                    },
                    {
                        quoted: m
                    }
                );

            }


        } catch (err) {

            console.log(
                'Menu Error:',
                err
            );

        }

    }
};