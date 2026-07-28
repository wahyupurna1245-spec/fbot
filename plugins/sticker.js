const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
category: 'tools',
    command: ['s', 'sticker', 'stiker'],
    operate: async ({ sock, m, sender }) => {
        try {
            const isQuotedImage = m.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
            const isImage = m.message.imageMessage || isQuotedImage;

            if (!isImage) {
                return await sock.sendMessage(sender, { text: 'Kirim atau balas gambar dengan caption *.s*' }, { quoted: m });
            }

            const mediaMsg = isQuotedImage ? { message: m.message.extendedTextMessage.contextInfo.quotedMessage } : m;
            const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {}, { logger: console, reuploadRequest: sock.updateMediaMessage });

            const tmpFile = path.join(__dirname, `../tmp_${Date.now()}.jpg`);
            const outFile = path.join(__dirname, `../sticker_${Date.now()}.webp`);

            fs.writeFileSync(tmpFile, buffer);

            // Eksekusi ffmpeg langsung untuk convert ke format stiker webp
            exec(`ffmpeg -i "${tmpFile}" -vcodec libwebp -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -q:v 80 "${outFile}"`, async (err) => {
                if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);

                if (err) {
                    console.error(err);
                    return await sock.sendMessage(sender, { text: 'Gagal membuat stiker!' }, { quoted: m });
                }

                await sock.sendMessage(sender, { sticker: fs.readFileSync(outFile) }, { quoted: m });

                if (fs.existsSync(outFile)) fs.unlinkSync(outFile);
            });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(sender, { text: 'Terjadi kesalahan sistem.' }, { quoted: m });
        }
    }
};