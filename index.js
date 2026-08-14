const { default: makeWASocket, DisconnectReason, fetchLatestBaileysVersion, initAuthCreds, proto } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
// ========================
// --- FUNGSI SINGLE FILE AUTH (SESSION.JSON) ---
// ========================
const useSingleFileAuthState = (filename) => {
    let creds, keys = {};
    if (fs.existsSync(filename)) {
        try {
            const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
            creds = data.creds;
            keys = data.keys || {};
        } catch (e) {
            console.log("File session rusak, membuat baru...");
        }
    }

    const saveState = () => {
        fs.writeFileSync(filename, JSON.stringify({ creds, keys }, (key, value) => {
            return Buffer.isBuffer(value) ? { type: 'Buffer', data: value.toJSON().data } : value;
        }, 2));
    };

    if (!creds) {
        creds = initAuthCreds();
    } else {
        const restoreBuffers = (obj) => {
            for (let key in obj) {
                if (obj[key] && typeof obj[key] === 'object') {
                    if (obj[key].type === 'Buffer' && Array.isArray(obj[key].data)) {
                        obj[key] = Buffer.from(obj[key].data);
                    } else {
                        restoreBuffers(obj[key]);
                    }
                }
            }
        };
        restoreBuffers(creds);
        restoreBuffers(keys);
    }

    return {
        state: {
            creds,
            keys: {
                get: (type, ids) => {
                    if (!keys[type]) keys[type] = {};
                    return ids.reduce((dict, id) => {
                        let value = keys[type][id];
                        if (value) {
                            if (type === 'app-state-sync-key' && value) {
                                value = proto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            dict[id] = value;
                        }
                        return dict;
                    }, {});
                },
                set: (data) => {
                    for (let type in data) {
                        if (!keys[type]) keys[type] = {};
                        for (let id in data[type]) {
                            keys[type][id] = data[type][id];
                        }
                    }
                    saveState();
                }
            }
        },
        saveCreds: saveState
    };
};
// ========================

async function startBot() {
    const { state, saveCreds } = useSingleFileAuthState('./session.json');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'open') {
            console.log('\x1b[32mBot berhasil terhubung ke WhatsApp!\x1b[0m');
        } else if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode;
            console.log(`Koneksi terputus karena ${reason}, mencoba menghubungkan ulang...`);
            if (reason !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log('Perangkat telah keluar dari sesi, menghapus session.json...');
                if (fs.existsSync('./session.json')) fs.unlinkSync('./session.json');
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);
    
// =========================
// WELCOME SYSTEM
// =========================
function salamWIB(){
    const jam =
    Number(
        new Date()
        .toLocaleString(
            'id-ID',
            {
                timeZone:'Asia/Jakarta',
                hour:'2-digit',
                hour12:false
            }
        )
    );
    if(jam >= 4 && jam < 11){

        return '🌅 Selamat pagi';
    }
    if(jam >= 11 && jam < 15){
        return '☀️ Selamat siang';
    }
    if(jam >= 15 && jam < 18){
        return '🌇 Selamat sore';
    }
    return '🌙 Selamat malam';
}
sock.ev.on(
'group-participants.update',
async(update)=>{
try{
const {
id,
participants,
action
}=update;
// hanya member masuk
if(action !== 'add')
return;
const file =
'./welcome.json';
if(!fs.existsSync(file))
return;
const data =
JSON.parse(
fs.readFileSync(file)
);
if(!data[id])
return;
const group =
await sock.groupMetadata(id)
.catch(()=>null);
const groupName =
group?.subject || 'Group';
const memberCount =
group?.participants?.length || 0;
for(const participant of participants){
const user =
typeof participant === 'string'
? participant
: participant.id ||
participant.jid;
if(!user)
continue;
let nomor =
user.split('@')[0];
// jika LID
if(nomor.length > 15){
    nomor =
    nomor.replace(/\D/g,'');
}
const caption =
`╭━━━〔 👋 WELCOME 〕
│
│ ${salamWIB()}
│
│ 👤 Member Baru:
│ @${nomor}
│
│ 🎉 Selamat bergabung di group
│
│ 🏠 Group:
│ ${groupName}
│
│ 👥 Total Member:
│ ${memberCount} orang
│
╰━━━━━━━━━━━━━━━╯`;
await sock.sendMessage(
id,
{
    text:caption,
    mentions:[
        user
    ]
}
);
}
}catch(err){
console.log(
'Welcome Error:',
err.message
);
}
});
// ============================
// ========================
// Cek dan minta pairing code otomatis setelah socket siap
// ========================
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            const phoneNumber = '628812478704';
            console.log(`Meminta kode pairing untuk nomor: ${phoneNumber}...`);
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join('-') || code;
                console.log(`Kode Pairing WhatsApp kamu: \x1b[32m${code}\x1b[0m`);
            } catch (err) {
                console.error('Gagal mengambil kode pairing:', err);
            }
        }, 3000);
    }
// ========================
// Handler Pesan Masuk & Status Masuk
// ========================
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek) return;
            
            require('./handler')(sock, mek, chatUpdate);
        } catch (err) {
            console.error('Error di messages.upsert:', err);
        }
    });
}

startBot();
