const {
    default: makeWASocket,
    DisconnectReason,
    fetchLatestBaileysVersion,
    initAuthCreds,
    proto
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const fs = require('fs');


let sockGlobal = null;
let restarting = false;


const OWNER_LOG =
'628812478704@s.whatsapp.net';


// ========================
// ERROR HANDLER
// ========================

process.on('uncaughtException', err => {

    console.log(
        'ERROR:',
        err.message
    );

});


process.on('unhandledRejection', err => {

    console.log(
        'PROMISE ERROR:',
        err
    );

});



// ========================
// SEND LOG OWNER
// ========================

async function sendLog(text){

    try{

        if(!sockGlobal)
            return;


        await sockGlobal.sendMessage(
            OWNER_LOG,
            {
                text
            }
        );


    }catch(e){

        console.log(
            'Log gagal:',
            e.message
        );

    }

}



// ========================
// SINGLE FILE AUTH
// ========================

const useSingleFileAuthState = (filename)=>{

let creds;
let keys = {};



if(fs.existsSync(filename)){

    try{

        const data =
        JSON.parse(
            fs.readFileSync(
                filename,
                'utf-8'
            )
        );


        creds = data.creds;
        keys = data.keys || {};


    }catch(e){

        console.log(
            'Session rusak'
        );

    }

}



const saveState = ()=>{

    try{

        fs.writeFileSync(
            filename,
            JSON.stringify(
                {
                    creds,
                    keys
                },
                (key,value)=>{

                    return Buffer.isBuffer(value)
                    ?
                    {
                        type:'Buffer',
                        data:value.toJSON().data
                    }
                    :
                    value;

                },
                2
            )
        );


    }catch(e){

        console.log(
            'Save session error:',
            e.message
        );

    }

};



if(!creds){

    creds = initAuthCreds();

}else{


    const restoreBuffers=(obj)=>{

        for(let key in obj){

            if(
                obj[key] &&
                typeof obj[key] === 'object'
            ){

                if(
                    obj[key].type === 'Buffer' &&
                    Array.isArray(obj[key].data)
                ){

                    obj[key] =
                    Buffer.from(
                        obj[key].data
                    );

                }else{

                    restoreBuffers(
                        obj[key]
                    );

                }

            }

        }

    };


    restoreBuffers(creds);
    restoreBuffers(keys);

}



return {

state:{

creds,

keys:{


get:(type,ids)=>{


if(!keys[type])
keys[type]={};


return ids.reduce(
(dict,id)=>{


let value =
keys[type][id];


if(value){


if(
type === 'app-state-sync-key'
){

value =
proto.Message
.AppStateSyncKeyData
.fromObject(value);

}


dict[id]=value;

}


return dict;


},{});


},



set:(data)=>{


for(let type in data){


if(!keys[type])
keys[type]={};


Object.assign(
keys[type],
data[type]
);


}


saveState();


}


}


},



saveCreds:
saveState


};


};




// ========================
// START BOT
// ========================

async function startBot(){

if(restarting)
return;


try{


const {
state,
saveCreds
}
=
useSingleFileAuthState(
'./session.json'
);



const {
version
}
=
await fetchLatestBaileysVersion();



const sock =
makeWASocket({

version,

logger:
pino({
level:'silent'
}),

auth:state,

printQRInTerminal:false,


syncFullHistory:false,

markOnlineOnConnect:false

});



sockGlobal = sock;



sock.ev.on(
'creds.update',
saveCreds
);



sock.ev.on(
'connection.update',
async(update)=>{


const {
connection,
lastDisconnect
}
=
update;



if(connection === 'open'){


console.log(
'\x1b[32mBOT ONLINE\x1b[0m'
);


sendLog(
`🟢 BOT ONLINE

🧠 RAM:
${(
process.memoryUsage().rss /
1024 /
1024
).toFixed(2)} MB`
);


}



if(connection === 'close'){


const reason =
lastDisconnect?.error?.output?.statusCode ||
lastDisconnect?.error?.statusCode ||
'unknown';



console
// ========================
// WELCOME SYSTEM
// ========================

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


    if(jam >= 4 && jam < 11)
        return '🌅 Selamat pagi';


    if(jam >= 11 && jam < 15)
        return '☀️ Selamat siang';


    if(jam >= 15 && jam < 18)
        return '🌇 Selamat sore';


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
}
=
update;



if(action !== 'add')
return;



const file =
'./welcome.json';



if(!fs.existsSync(file))
return;



const data =
JSON.parse(
fs.readFileSync(
file,
'utf-8'
)
);



if(!data[id])
return;



const group =
await sock
.groupMetadata(id)
.catch(()=>null);



const groupName =
group?.subject ||
'Group';



const memberCount =
group?.participants?.length ||
0;



for(const participant of participants){


const user =
typeof participant === 'string'
?
participant
:
participant.id ||
participant.jid;



if(!user)
continue;



let nomor =
user.split('@')[0];



if(nomor.length > 15){

nomor =
nomor.replace(/\D/g,'');

}



const caption =
`╭━━━〔 👋 WELCOME 〕

│ ${salamWIB()}

│ 👤 Member Baru:
│ @${nomor}

│ 🎉 Selamat bergabung di group

│ 🏠 Group:
│ ${groupName}

│ 👥 Total Member:
│ ${memberCount} orang

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




// ========================
// AUTO PAIRING CODE
// ========================

if(!state.creds.registered){


setTimeout(
async()=>{


const phoneNumber =
'628812478704';


const customCode =
'PRSTFBOT';



try{


const code =
await sock.requestPairingCode(
phoneNumber,
customCode
);



console.log(`

╔══════════════════════╗
║
║  PAIRING CODE
║
║  ${code}
║
╚══════════════════════╝

`);



sendLog(
`🔑 PAIRING CODE

${code}`
);



}catch(err){


console.log(
'Pairing error:',
err.message
);


}



},
5000
);


}
// ========================
// MESSAGE HANDLER
// ========================

sock.ev.on(
'messages.upsert',
async(chatUpdate)=>{


try{


const mek =
chatUpdate.messages[0];


if(!mek)
return;



setImmediate(()=>{


try{


require('./handler')
(
    sock,
    mek,
    chatUpdate
);



}catch(e){


console.log(
'Handler Error:',
e.message
);


}



});



}catch(err){


console.log(
'Message Error:',
err.message
);


}



});




// ========================
// BOT START
// ========================

console.log(
'BOT STARTED'
);



}catch(err){


console.log(
'START ERROR:',
err.message
);


sendLog(
`❌ START ERROR

${err.message}`
);



setTimeout(
startBot,
15000
);


}


}




// ========================
// FORMAT UPTIME
// ========================

function formatUptime(seconds){


const hari =
Math.floor(
seconds / 86400
);


const jam =
Math.floor(
(seconds % 86400) / 3600
);


const menit =
Math.floor(
(seconds % 3600) / 60
);


const detik =
Math.floor(
seconds % 60
);



let hasil=[];


if(hari)
hasil.push(
`${hari} Hari`
);


if(jam)
hasil.push(
`${jam} Jam`
);


if(menit)
hasil.push(
`${menit} Menit`
);


if(detik)
hasil.push(
`${detik} Detik`
);



return hasil.length
?
hasil.join(' ')
:
'0 Detik';


}



// ========================
// RAM MONITOR CONSOLE
// ========================

setInterval(()=>{


const ram =
process.memoryUsage()
.rss /
1024 /
1024;



console.log(
`RAM BOT:
${ram.toFixed(2)} MB`
);



},300000);




// ========================
// LOG OWNER SETIAP 3 JAM
// ========================

setInterval(
async()=>{


try{


if(!sockGlobal)
return;



const ram =
process.memoryUsage()
.rss /
1024 /
1024;



const heap =
process.memoryUsage()
.heapUsed /
1024 /
1024;



await sockGlobal.sendMessage(
OWNER_LOG,
{

text:
`📊 BOT MONITOR

🟢 Status:
Online

⏱️ Uptime:
${formatUptime(
process.uptime()
)}

🧠 RAM:
${ram.toFixed(2)} MB

⚙️ Heap:
${heap.toFixed(2)} MB

📅 Waktu:
${new Date()
.toLocaleString(
'id-ID',
{
timeZone:'Asia/Jakarta'
}
)}`

}

);



}catch(e){


console.log(
'Monitor error:',
e.message
);


}


},
3 * 60 * 60 * 1000
);




// ========================
// RUN
// ========================

startBot();