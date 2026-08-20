module.exports = {

    command: [
        'image',
        'img'
    ],

    category: 'search',


    operate: async ({ sock, m, sender, args }) => {

        try {

            const fetch =
            (await import('node-fetch')).default;


            let jumlah =
            parseInt(args[args.length - 1]) || 1;


            if(jumlah > 5)
                jumlah = 5;


            const query =
            isNaN(args[args.length - 1])
            ? args.join(' ')
            : args.slice(0,-1).join(' ');



            if(!query){

                return sock.sendMessage(sender,{
                    text:
`⚠️ Masukkan kata kunci

Contoh:
.img anime

atau:
.img anime 3`
                },{quoted:m});

            }



            await sock.sendMessage(sender,{
                text:
`🔎 Mencari gambar HD:
${query}`
            },{quoted:m});



            const search =
            await fetch(
`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
{
headers:{
'User-Agent':'Mozilla/5.0'
}
});



            const html =
            await search.text();



            const vqd =
            html.match(/vqd=['"]?([^&"']+)/)?.[1];



            if(!vqd)
            throw new Error('Token pencarian gagal');



            const api =
`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}`;



            const data =
            await (
                await fetch(api,{
                    headers:{
                        'User-Agent':'Mozilla/5.0',
                        'Referer':'https://duckduckgo.com/'
                    }
                })
            ).json();



            let results =
            data.results || [];



            if(!results.length)
            throw new Error('Gambar tidak ditemukan');



            // RANDOM SHUFFLE

            results =
            results.sort(
                ()=>Math.random()-0.5
            );



            let sent = 0;



            for(const item of results){


                if(sent >= jumlah)
                    break;



                const url =
                item.image ||
                item.thumbnail;



                if(!url)
                    continue;



                try{


                    const img =
                    await fetch(url);



                    const buffer =
                    await img.buffer();



                    await sock.sendMessage(sender,{

                        image:buffer,

                        caption:
`🖼️ Random HD Image

🔎 ${query}

📌 ${sent+1}/${jumlah}`

                    },{quoted:m});



                    sent++;


                }catch{}



            }



            if(!sent){

                throw new Error(
                    'Semua gambar gagal diambil'
                );

            }



        }catch(e){

            console.log(
                'IMAGE ERROR:',
                e
            );


            await sock.sendMessage(sender,{
                text:
`❌ Gagal mencari gambar

${e.message}`
            },{quoted:m});

        }

    }

};