const { exec } = require('child_process');
const fs = require('fs');


module.exports = {

    category: 'downloader',

    command: ['instagram', 'ig', 'igdl'],


    operate: async ({ sock, m, args, sender }) => {

        try {

            const url = args[0];


            if (!url || !url.includes('instagram')) {

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link Instagram

Contoh:
.ig https://instagram.com/reel/xxxx`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
                '⏳ Mengambil media Instagram...'
            },{quoted:m});



            const id = Date.now();


            const file =
            `/tmp/ig-${id}.%(ext)s`;



            // ambil metadata

            exec(
`yt-dlp --print "%(title)s" --print "%(description)s" "${url}"`,
            async(metaErr, meta)=>{


                const data =
                    meta.split('\n');


                const title =
                    data[0] || 'Instagram';



                const description =
                    data.slice(1)
                    .join('\n') || '-';



                const caption =
`✅ *Instagram Downloader*

📌 Judul:
${title}

📝 Deskripsi:
${description}`;



                exec(
`yt-dlp -o "${file}" "${url}"`,
                async(err)=>{


                    if(err){

                        console.log(err);

                        return sock.sendMessage(sender,{
                            text:
                            '❌ Gagal download Instagram'
                        },{quoted:m});

                    }



                    const files =
                    fs.readdirSync('/tmp')
                    .filter(f =>
                        f.startsWith(`ig-${id}`)
                    );



                    if(!files.length){

                        return sock.sendMessage(sender,{
                            text:
                            '❌ File tidak ditemukan'
                        },{quoted:m});

                    }



                    for(const f of files){


                        const media =
                        `/tmp/${f}`;



                        const ext =
                        f.split('.')
                        .pop()
                        .toLowerCase();



                        if([
                            'jpg',
                            'jpeg',
                            'png',
                            'webp'
                        ].includes(ext)){


                            await sock.sendMessage(sender,{
                                image:
                                fs.readFileSync(media),
                                caption
                            },{quoted:m});


                        } else {


                            await sock.sendMessage(sender,{
                                video:
                                fs.readFileSync(media),
                                caption
                            },{quoted:m});

                        }



                        fs.unlinkSync(media);

                    }


                });


            });



        } catch(e){

            console.log(
                'IG ERROR:',
                e
            );


            sock.sendMessage(sender,{
                text:
                '❌ Error downloader Instagram'
            },{quoted:m});

        }

    }

};