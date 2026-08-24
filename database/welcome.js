module.exports = {

enabled: true,

text: ({
    salam,
    nomor,
    groupName,
    memberCount
}) =>

`╭━━〔 ✨ WELCOME ✨ 〕
│
│ ${salam}
│
│ 🧑 Member Baru
│ » @${nomor}
│
│ 📌 Group
│ » ${groupName}
│
│ 👥 Member Sekarang
│ » ${memberCount} orang
│
│ 🚀 Status
│ » Bergabung berhasil
│
╰━━━━━━━━━━━━━━`

};