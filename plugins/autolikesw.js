const fs = require('fs');
const path = require('path');

const settingFile = path.join(
    __dirname,
    '../setting.json'
);


module.exports = {

    category: 'owner',

    command: ['autolikesw'],

    ownerOnly: true,


    operate: async ({sock,m,args,sender}) => {


        let settings = {
            autoTyping:false,
            autoReadSw:false,
            autoLikeSw:false
        };


        if(fs.existsSync(settingFile)){

            try{

                settings = JSON.parse(
                    fs.readFileSync(settingFile)
                );

            }catch(e){}

        }



        let action = args[0]?.toLowerCase();



        if(action === 'on'){

            settings.autoLikeSw = true;

        }

        else if(action === 'off'){

            settings.autoLikeSw = false;

        }

        else {

            return sock.sendMessage(
                sender,
                {
                    text:
`Auto Like SW:
${settings.autoLikeSw ? 'ON ✅':'OFF ❌'}

Cara:
.autolikesw on
.autolikesw off`
                },
                {
                    quoted:m
                }
            );

        }



        fs.writeFileSync(
            settingFile,
            JSON.stringify(
                settings,
                null,
                2
            )
        );



        await sock.sendMessage(
            sender,
            {
                text:
                `✅ Auto Like SW ${action.toUpperCase()}`
            },
            {
                quoted:m
            }
        );

    }

};