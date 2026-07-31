module.exports = {

    category: 'downloader',

    command: [
        'tiktok',
        'tt',
        'tiktokdl',
        'ttsearch',
        'tiktoksearch'
    ],


    operate: async ({ sock, m, args, sender }) => {

        try {

            const fetch =
            (await import('node-fetch')).default;


            const input =
                args.join(' ');



            if(!input){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan link atau kata pencarian

Contoh:
.tt https://vt.tiktok.com/xxxx

atau:
.tt mobil keren`
                },{quoted:m});

            }



            const loading =
            await sock.sendMessage(sender,{
                text:
                '⏳ Memproses TikTok...'
            },{quoted:m});



            let videoUrl;
            let title = '-';
            let description = '-';
            let username = '-';



            // =====================
            // LINK TIKTOK
            // =====================

            if(input.includes('tiktok.com')){


                const response =
                await fetch(
`https://www.tikwm.com/api/?url=${encodeURIComponent(input)}`
                );


                const res =
                await response.json();



                if(!res.data?.play){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Gagal mengambil video TikTok'
                    },{quoted:m});

                }



                videoUrl =
                    res.data.play;


                title =
                    res.data.title ||
                    'TikTok Video';


                description =
                    res.data.title ||
                    '-';


                username =
                    res.data.author?.unique_id ||
                    res.data.author?.nickname ||
                    '-';


            }



            // =====================
            // SEARCH TIKTOK
            // =====================

            else {


                const response =
                await fetch(
`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(input)}`
                );


                const res =
                await response.json();



                const video =
                res.data?.videos?.[0];



                if(!video?.play){

                    return sock.sendMessage(sender,{
                        text:
                        '❌ Video TikTok tidak ditemukan'
                    },{quoted:m});

                }



                videoUrl =
                    video.play;


                title =
                    video.title ||
                    'TikTok Video';


                description =
                    video.title ||
                    '-';


                username =
                    video.author?.unique_id ||
                    video.author?.nickname ||
                    '-';


            }



            const bufferRes =
                await fetch(videoUrl);



            const videoBuffer =
                await bufferRes.buffer();



            await sock.sendMessage(sender,{
                video:
                videoBuffer,

                caption:
`✅ *TikTok Downloader*

👤 Akun:
${username}

📌 Judul:
${title}

📝 Deskripsi:
${description}`
            },{quoted:m});



            await sock.sendMessage(sender,{
                delete:
                loading.key
            });



        } catch(e){


            console.log(
                'TIKTOK ERROR:',
                e
            );


            sock.sendMessage(sender,{
                text:
                '❌ Error downloader TikTok'
            },{quoted:m});


        }

    }

};