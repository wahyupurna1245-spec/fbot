const os = require('os');
const { performance } = require('perf_hooks');


function formatSize(bytes) {

    const units = [
        'B',
        'KB',
        'MB',
        'GB',
        'TB'
    ];

    let i = 0;

    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }

    return `${bytes.toFixed(2)} ${units[i]}`;
}



function runtime(sec) {

    let d = Math.floor(sec / 86400);
    let h = Math.floor((sec % 86400) / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = Math.floor(sec % 60);


    return [
        d ? `${d} Hari` : '',
        h ? `${h} Jam` : '',
        m ? `${m} Menit` : '',
        s ? `${s} Detik` : ''
    ]
    .filter(Boolean)
    .join(' ') || '0 Detik';

}



function getCpuLoad() {

    const cpus = os.cpus();

    let idle = 0;
    let total = 0;


    for (let cpu of cpus) {

        for (let type in cpu.times) {
            total += cpu.times[type];
        }

        idle += cpu.times.idle;

    }


    return (
        100 -
        Math.round(
            idle / total * 100
        )
    );

}



module.exports = {

    category: 'tools',

    command: [
        'ping',
        'test',
        'bot',
        'status'
    ],



    operate: async ({
        sock,
        m,
        sender
    }) => {


        const start =
        performance.now();



        let loading =
        await sock.sendMessage(sender, {

            text:
`╭─「 ⚡ SYSTEM CHECK 」
│
│ 🔄 Mengambil data...
│
│ [■■■□□□□□□□] 30%
╰────────────`

        }, {
            quoted: m
        });



        await new Promise(
            resolve => setTimeout(resolve,700)
        );



        const ping =
        (
            performance.now()
            -
            start
        )
        .toFixed(2);



        const totalRam =
        os.totalmem();


        const freeRam =
        os.freemem();


        const usedRam =
        totalRam - freeRam;



        const nodeMemory =
        process.memoryUsage();



        const cpu =
        os.cpus();



        const network =
        Object.values(
            os.networkInterfaces()
        )
        .flat()
        .find(
            x => x.family === 'IPv4'
        );



        const result =
`
╭━━「 🤖 BOT SYSTEM 」━━╮

┃ 🟢 STATUS
┃ ├ Online
┃ └ Stable

┃ 🏓 RESPONSE
┃ └ ${ping} ms

┃ ⏱️ UPTIME
┃ └ ${runtime(process.uptime())}


┃ ⚙️ PROCESS
┃ ├ PID : ${process.pid}
┃ ├ Node : ${process.version}
┃ ├ RAM App : ${formatSize(nodeMemory.rss)}
┃ ├ Heap Used : ${formatSize(nodeMemory.heapUsed)}
┃ └ Heap Total : ${formatSize(nodeMemory.heapTotal)}


┃ 🖥️ SERVER
┃ ├ OS : ${os.type()}
┃ ├ Platform : ${os.platform()}
┃ ├ Architecture : ${os.arch()}
┃ ├ Hostname : ${os.hostname()}
┃ └ CPU Core : ${cpu.length}


┃ 🔥 CPU
┃ ├ Model :
┃ │ ${cpu[0]?.model || 'Unknown'}
┃ │
┃ ├ Speed :
┃ │ ${cpu[0]?.speed || 0} MHz
┃ │
┃ └ Load :
┃   ${getCpuLoad()}%


┃ 🧠 MEMORY
┃ ├ Used :
┃ │ ${formatSize(usedRam)}
┃ │
┃ ├ Free :
┃ │ ${formatSize(freeRam)}
┃ │
┃ └ Total :
┃   ${formatSize(totalRam)}


┃ 🌐 NETWORK
┃ └ IP :
┃   ${network?.address || 'Unknown'}


┃ 📅 SERVER TIME
┃ └ ${new Date()
.toLocaleString('id-ID')}


╰━━━━━━━━━━━━━━╯

🚀 Bot berjalan normal
`;



        await sock.sendMessage(sender, {

            text: result,

            edit: loading.key

        });


    }

};