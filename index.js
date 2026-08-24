const {
    default: makeWASocket,
    DisconnectReason,
    fetchLatestBaileysVersion,
    initAuthCreds,
    proto
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const fs = require('fs');

const welcomeDB = require('./database/welcome');

const SESSION = './session.json';


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
                fs.readFileSync(filename,'utf8')
            );

            creds = data.creds;
            keys = data.keys || {};

        }catch(e){
            console.log('Session rusak, membuat baru...');
        }
    }


    const restoreBuffers = (obj)=>{
        if(!obj) return;

        for(let key in obj){

            if(obj[key] && typeof obj[key] === 'object'){

                if(obj[key].type === 'Buffer'){

                    obj[key] =
                    Buffer.from(
                        obj[key].data
                    );

                }else{

                    restoreBuffers(obj[key]);

                }

            }

        }
    };


    if(!creds){

        creds = initAuthCreds();

    }else{

        restoreBuffers(creds);
        restoreBuffers(keys);

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


    return {

        state:{

            creds,

            keys:{

                get(type,ids){

                    if(!keys[type])
                        keys[type]={};


                    return ids.reduce((obj,id)=>{

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

                            obj[id]=value;

                        }

                        return obj;

                    },{});

                },


                set(data){

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

        saveCreds:saveState

    };

};



async function startBot(){

    const {
        state,
        saveCreds
    } =
    useSingleFileAuthState(SESSION);



    const {
        version
    } =
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
            } = update;


            if(connection === 'open'){

                console.log(
                    '\x1b[32mBOT TERHUBUNG ✓\x1b[0m'
                );

            }


            if(connection === 'close'){

                const reason =
                lastDisconnect
                ?.error
                ?.output
                ?.statusCode;


                console.log(
                    'Connection close:',
                    reason
                );


                if(
                    reason !==
                    DisconnectReason.loggedOut
                ){

                    setTimeout(()=>{
                        startBot();
                    },3000);


                }else{

                    if(fs.existsSync(SESSION))
                        fs.unlinkSync(SESSION);

                }

            }

        }
    );
        // ========================
    // PAIRING CODE
    // ========================
    if(!state.creds.registered){

        setTimeout(async()=>{

            try{

                const code =
                await sock.requestPairingCode(
                    '628812478704',
                    'PRSTFBOT'
                );


                console.log(`
╔══════════════════╗
║ PAIRING CODE
║ ${code}
╚══════════════════╝
                `);


            }catch(e){

                console.log(
                    'Pairing gagal:',
                    e.message
                );

            }


        },10000);

    }



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


                if(update.action !== 'add')
                    return;


                if(!welcomeDB.enabled)
                    return;


                const file =
                './welcome.json';


                if(!fs.existsSync(file))
                    return;



                const data =
                JSON.parse(
                    fs.readFileSync(
                        file,
                        'utf8'
                    )
                );


                if(!data[update.id])
                    return;



                const group =
                await sock.groupMetadata(update.id)
                .catch(()=>null);



                const groupName =
                group?.subject ||
                'Group';



                const memberCount =
                group?.participants?.length ||
                0;



                for(const participant of update.participants){


                    const user =
                    typeof participant === 'string'
                    ?
                    participant
                    :
                    participant.id;



                    if(!user)
                        continue;



                    const nomor =
                    user.split('@')[0];



                    const text =
                    welcomeDB.text({

                        salam:salamWIB(),

                        nomor,

                        groupName,

                        memberCount

                    });



                    await sock.sendMessage(
                        update.id,
                        {
                            text,
                            mentions:[
                                user
                            ]
                        }
                    );


                }



            }catch(e){

                console.log(
                    'Welcome error:',
                    e.message
                );

            }

        }
    );



    // ========================
    // HANDLER PESAN
    // ========================
    sock.ev.on(
        'messages.upsert',
        async(chatUpdate)=>{

            try{

                const mek =
                chatUpdate.messages[0];


                if(!mek)
                    return;



                require('./handler')(
                    sock,
                    mek,
                    chatUpdate
                );


            }catch(e){

                console.log(
                    'Handler error:',
                    e.message
                );

            }

        }
    );


    return sock;

}



// ========================
// START
// ========================
startBot()
.catch(e=>{

    console.log(
        'Start bot error:',
        e.message
    );

});