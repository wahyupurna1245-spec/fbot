const https = require('https');

function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';

            res.on('data', chunk => data += chunk);

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });

        }).on('error', reject);
    });
}


module.exports = {

    command: ['cuaca', 'weather'],
    category: 'tools',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const kota = args.join(' ');

            if (!kota) {
                return sock.sendMessage(sender, {
                    text: '⚠️ Contoh:\n.cuaca Jakarta'
                }, { quoted: m });
            }


            await sock.sendMessage(sender, {
                text: '🌤️ Mencari cuaca...'
            }, { quoted: m });



            const geo = await get(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id&format=json`
            );


            if (!geo.results || !geo.results.length) {
                return sock.sendMessage(sender, {
                    text: '❌ Kota tidak ditemukan.'
                }, { quoted: m });
            }


            const lokasi = geo.results[0];


            const weather = await get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lokasi.latitude}&longitude=${lokasi.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
            );


            const c = weather.current;


            const kondisi = {
                0: '☀️ Cerah',
                1: '🌤️ Cerah berawan',
                2: '⛅ Berawan',
                3: '☁️ Mendung',
                61: '🌧️ Hujan',
                63: '🌧️ Hujan sedang',
                65: '🌧️ Hujan lebat',
                95: '⛈️ Badai'
            };


            const text =
`╭─「 🌤️ CUACA」
│
├ 📍 Kota:
│ ${lokasi.name}, ${lokasi.country}
│
├ 🌡️ Suhu:
│ ${c.temperature_2m}°C
│
├ 💧 Kelembapan:
│ ${c.relative_humidity_2m}%
│
├ 💨 Angin:
│ ${c.wind_speed_10m} km/h
│
├ ☁️ Kondisi:
│ ${kondisi[c.weather_code] || 'Tidak diketahui'}
│
╰────────────`;



            await sock.sendMessage(sender, {
                text
            }, { quoted: m });



        } catch (err) {

            console.error('CUACA ERROR:', err);

            await sock.sendMessage(sender, {
                text: '❌ Error mengambil data cuaca.'
            }, { quoted: m });

        }

    }
};