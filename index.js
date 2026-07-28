const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion, BufferJSON } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

const sessionFile = './session.json';

function loadSession() {
    if (!fs.existsSync(sessionFile)) {
        return {
            creds: {},
            keys: {}
        };
    }

    return JSON.parse(
        fs.readFileSync(sessionFile, 'utf-8'),
        BufferJSON.reviver
    );
}

function saveSession(state) {
    fs.writeFileSync(
        sessionFile,
        JSON.stringify(state, BufferJSON.replacer, 2)
    );
}

async function startBot() {

    const state = loadSession();

    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true,
    });


    sock.ev.on('creds.update', () => {
        saveSession(state);
    });


    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            console.log('\x1b[32mBot berhasil terhubung ke WhatsApp!\x1b[0m');

        } else if (connection === 'close') {

            const reason = lastDisconnect?.error?.output?.statusCode;

            console.log(`Koneksi terputus: ${reason}`);

            if (reason !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log('Logout. Hapus session.json untuk pairing ulang.');
                fs.rmSync('./session.json', { force: true });
            }
        }
    });


    if (!state.creds.registered) {

        setTimeout(async () => {

            const phoneNumber = '628812478704';

            try {

                let code = await sock.requestPairingCode(phoneNumber);

                code = code?.match(/.{1,4}/g)?.join('-') || code;

                console.log(`Kode Pairing:
\x1b[32m${code}\x1b[0m`);

            } catch (err) {
                console.error('Gagal mengambil kode pairing:', err);
            }

        }, 3000);
    }


    sock.ev.on('messages.upsert', async (chatUpdate) => {

        try {

            const mek = chatUpdate.messages[0];

            if (!mek) return;

            require('./handler')(sock, mek, chatUpdate);

        } catch (err) {

            console.error('Error messages.upsert:', err);

        }

    });
}


startBot();