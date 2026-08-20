module.exports = {

    category: 'tools',

    command: ['runtime'],

    operate: async ({ sock, m, sender }) => {

        let uptime = process.uptime();

        let hari = Math.floor(uptime / 86400);
        let jam = Math.floor((uptime % 86400) / 3600);
        let menit = Math.floor((uptime % 3600) / 60);
        let detik = Math.floor(uptime % 60);


        await sock.sendMessage(
            sender,
            {
                text:
`⏱️ *BOT RUNTIME*

Bot aktif selama:

${hari} hari
${jam} jam
${menit} menit
${detik} detik`
            },
            {
                quoted: m
            }
        );

    }

};