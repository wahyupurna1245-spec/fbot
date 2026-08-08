module.exports = {

    category: 'utility',

    command: [
        'jadwalsholat',
        'sholat'
    ],


    operate: async ({ sock, m, sender, args }) => {

        try {

            const fetch =
            (await import('node-fetch')).default;


            const kota =
                args.join(' ') || 'Jakarta';



            await sock.sendMessage(sender,{
                text:
                `⏳ Mengambil jadwal sholat ${kota}...`
            },{quoted:m});



            const url =
`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(kota)}&country=Indonesia&method=11`;



            const response =
                await fetch(url);



            const res =
                await response.json();



            if(
                !res.data ||
                !res.data.timings
            ){

                return sock.sendMessage(sender,{
                    text:
                    '❌ Jadwal sholat tidak ditemukan'
                },{quoted:m});

            }



            const t =
                res.data.timings;



            const date =
                res.data.date.readable;



            await sock.sendMessage(sender,{
                text:
`🕌 *JADWAL SHOLAT*

📍 Kota:
${kota}

📅 Tanggal:
${date}

🌅 Subuh:
${t.Fajr}

☀️ Dzuhur:
${t.Dhuhr}

🌤 Ashar:
${t.Asr}

🌇 Maghrib:
${t.Maghrib}

🌙 Isya:
${t.Isha}

✨ Semoga ibadah lancar`
            },{quoted:m});



        } catch(e){

            console.log(
                'SHOLAT ERROR:',
                e
            );


            sock.sendMessage(sender,{
                text:
                '❌ Gagal mengambil jadwal sholat'
            },{quoted:m});

        }

    }

};