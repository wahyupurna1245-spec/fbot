module.exports = {

    command: ['owner', 'creator'],
    category: 'info',


    operate: async ({ sock, m, sender }) => {


        const nomor = '628812478704';


        await sock.sendMessage(sender, {

            contacts: {

                displayName: 'wahyupurnaa_',

                contacts: [
                    {
                        vcard:
`BEGIN:VCARD
VERSION:3.0
FN:wahyupurnaa_
TEL;type=CELL;type=VOICE;waid=${nomor}:${nomor}
END:VCARD`
                    }
                ]

            }

        }, {
            quoted: m
        });


    }

};