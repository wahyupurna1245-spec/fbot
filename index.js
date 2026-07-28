const {
    default: makeWASocket,
    DisconnectReason,
    fetchLatestBaileysVersion,
    initAuthCreds,
    proto
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const fs = require('fs');

const SESSION_FILE = './session.json';


// ================= SINGLE FILE SESSION =================

function useSingleFileAuthState(filename) {

    let creds;
    let keys = {};

    if (fs.existsSync(filename)) {

        try {

            const data = JSON.parse(
                fs.readFileSync(filename, 'utf-8')
            );

            creds = data.creds;
            keys = data.keys || {};

        } catch {

            console.log('Session rusak, membuat baru...');
        }
    }


    if (!creds) {

        creds = initAuthCreds();

    } else {

        restoreBuffers(creds);
        restoreBuffers(keys);

    }


    function restoreBuffers(obj) {

        if (!obj || typeof obj !== 'object') return;

        for (let key in obj) {

            if (
                obj[key]?.type === 'Buffer' &&
                Array.isArray(obj[key].data)
            ) {

                obj[key] = Buffer.from(obj[key].data);

            } else if (typeof obj[key] === 'object') {

                restoreBuffers(obj[key]);

            }
        }
    }


    function saveState() {

        fs.writeFileSync(
            filename,
            JSON.stringify(
                {
                    creds,
                    keys
                },
                (key, value) => {

                    if (Buffer.isBuffer(value)) {

                        return {
                            type: 'Buffer',
                            data: Array.from(value)
                        };

                    }

                    return value;

                },
                2
            )
        );
    }


    return {

        state: {

            creds,

            keys: {

                get: (type, ids) => {

                    if (!keys[type]) {
                        keys[type] = {};
                    }


                    return ids.reduce((result, id) => {

                        let value = keys[type][id];

                        if (value) {

                            if (
                                type === 'app-state-sync-key'
                            ) {

                                value =
                                proto.Message
                                .AppStateSyncKeyData
                                .fromObject(value);

                            }

                            result[id] = value;
                        }

                        return result;

                    }, {});
                },


                set: (data) => {

                    for (let type in data) {

                        if (!keys[type]) {
                            keys[type] = {};
                        }


                        Object.assign(
                            keys[type],
                            data[type]
                        );

                    }

                    saveState();

                }
            }
        },


        saveCreds: saveState
    };
}


// ======================================================


let starting = false;


async function startBot() {

    if (starting) return;

    starting = true;


    const { state, saveCreds } =
        useSingleFileAuthState(SESSION_FILE);


    const { version } =
        await fetchLatestBaileysVersion();


    const sock = makeWASocket({

        version,

        logger: pino({
            level: 'silent'
        }),

        auth: state,

        printQRInTerminal: false,

        syncFullHistory: false

    });


    sock.ev.on(
        'creds.update',
        saveCreds
    );


    sock.ev.on(
        'connection.update',
        async (update) => {

            const {
                connection,
                lastDisconnect
            } = update;


            if (connection === 'open') {

                console.log(
                    '✅ Bot berhasil terhubung ke WhatsApp'
                );

                starting = false;

            }


            if (connection === 'close') {


                const reason =
                lastDisconnect
                ?.error
                ?.output
                ?.statusCode;


                console.log(
                    '❌ Koneksi putus:',
                    reason
                );


                starting = false;


                if (
                    reason !== DisconnectReason.loggedOut
                ) {

                    console.log(
                        '🔄 Menghubungkan ulang...'
                    );

                    setTimeout(
                        startBot,
                        5000
                    );


                } else {


                    console.log(
                        'Session logout, hapus session.json'
                    );


                    if (
                        fs.existsSync(SESSION_FILE)
                    ) {

                        fs.unlinkSync(
                            SESSION_FILE
                        );

                    }
                }
            }
        }
    );



    // ================= PAIRING =================

    if (!state.creds.registered) {


        setTimeout(
            async () => {


                try {


                    const phoneNumber =
                    '628812478704';


                    console.log(
                        'Meminta kode pairing...'
                    );


                    let code =
                    await sock.requestPairingCode(
                        phoneNumber
                    );


                    code =
                    code.match(/.{1,4}/g)
                    ?.join('-') || code;


                    console.log(
                        `Kode Pairing:
${code}`
                    );


                } catch (err) {


                    console.error(
                        'Pairing gagal:',
                        err.message
                    );

                }


            },
            10000
        );

    }



    // ================= MESSAGE =================


    sock.ev.on(
        'messages.upsert',
        async (chatUpdate) => {


            try {


                const mek =
                chatUpdate.messages[0];


                if (!mek) return;


                require('./handler')(
                    sock,
                    mek,
                    chatUpdate
                );


            } catch (err) {


                console.error(
                    'Handler error:',
                    err
                );

            }

        }
    );

}


startBot();