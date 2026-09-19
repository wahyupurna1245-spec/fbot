const https = require('https');

function requestTikWM(url) {
    return new Promise((resolve, reject) => {
        const data = new URLSearchParams({
            url,
            hd: '1'
        }).toString();

        const req = https.request(
            'https://www.tikwm.com/api/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(data),
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 30000
            },
            res => {
                let body = '';

                res.on('data', chunk => {
                    body += chunk;
                });

                res.on('end', () => {
                    try {
                        resolve(JSON.parse(body));
                    } catch {
                        reject(new Error('Response API tidak valid'));
                    }
                });
            }
        );

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('API timeout'));
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function downloadVideo(url) {
    return new Promise((resolve, reject) => {
        https.get(
            url,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                timeout: 60000
            },
            res => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    return downloadVideo(res.headers.location)
                        .then(resolve)
                        .catch(reject);
                }

                if (res.statusCode !== 200) {
                    return reject(
                        new Error(`Video gagal diambil (${res.statusCode})`)
                    );
                }

                const chunks = [];
                let size = 0;

                res.on('data', chunk => {
                    size += chunk.length;

                    // Batas 80 MB
                    if (size > 80 * 1024 * 1024) {
                        res.destroy();
                        reject(new Error('Ukuran video terlalu besar'));
                        return;
                    }

                    chunks.push(chunk);
                });

                res.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });

                res.on('error', reject);
            }
        ).on('timeout', function () {
            this.destroy();
            reject(new Error('Download video timeout'));
        }).on('error', reject);
    });
}

module.exports = {
    category: 'downloader',

    command: ['tt3'],

    operate: async ({ sock, m, args, sender }) => {
        let loading;

        try {
            const input = args.join(' ').trim();

            if (!input) {
                return sock.sendMessage(
                    sender,
                    {
                        text: 'Kirim link TikTok.\n\nContoh:\n.tt https://www.tiktok.com/@user/video/123456789'
                    },
                    { quoted: m }
                );
            }

            // Hanya menerima link TikTok
            if (
                !input.includes('tiktok.com') &&
                !input.includes('vt.tiktok.com') &&
                !input.includes('vm.tiktok.com')
            ) {
                return sock.sendMessage(
                    sender,
                    {
                        text: 'Link tidak valid.\nKirim link video TikTok saja.'
                    },
                    { quoted: m }
                );
            }

            loading = await sock.sendMessage(
                sender,
                {
                    text: '⏳ Mengambil video TikTok...'
                },
                { quoted: m }
            );

            const api = await requestTikWM(input);

            if (api?.code !== 0 || !api?.data) {
                throw new Error(
                    api?.msg || 'TikTok gagal diproses'
                );
            }

            const data = api.data;

            // Prioritas HD, fallback ke play biasa
            const videoUrl =
                data.hdplay ||
                data.play;

            if (!videoUrl) {
                throw new Error('Link video tidak ditemukan');
            }

            const video = await downloadVideo(videoUrl);

            if (!video?.length) {
                throw new Error('Video kosong');
            }

            const username =
                data.author?.unique_id ||
                data.author?.nickname ||
                '-';

            const title =
                data.title ||
                'TikTok Video';

            await sock.sendMessage(
                sender,
                {
                    video,
                    caption:
                        `🎬 *TikTok*\n\n` +
                        `👤 ${username}\n` +
                        `📝 ${title}`,
                    mimetype: 'video/mp4'
                },
                { quoted: m }
            );

            if (loading?.key) {
                await sock.sendMessage(
                    sender,
                    {
                        delete: loading.key
                    }
                );
            }

        } catch (e) {

            console.log(
                '[TIKTOK ERROR]',
                e?.stack || e?.message || e
            );

            if (loading?.key) {
                try {
                    await sock.sendMessage(
                        sender,
                        {
                            delete: loading.key
                        }
                    );
                } catch {}
            }

            await sock.sendMessage(
                sender,
                {
                    text:
                        `❌ Gagal download TikTok.\n\n` +
                        `${e?.message || 'Terjadi kesalahan'}`
                },
                { quoted: m }
            );
        }
    }
};