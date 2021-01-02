const server = "http://localhost:50095"
const logfile = "D:\\マインクラフト\\mmc-stable-win32\\MultiMC\\instances\\1.16.4\\.minecraft\\logs\\latest.log"
const interval = 1500

const http = require("http")
const fs = require("fs")
const iconv = require("iconv-lite")

var lines = 0;

fs.readFile(logfile, (err, rawdata) => {
    if (err) throw err;
    const initbuf = new Buffer.from(rawdata);
    const initdata = iconv.decode(initbuf, "Shift_JIS");
    lines = initdata.split("\r\n").length - 1
    setInterval(checkChat, interval)
})

function checkChat() {
    fs.readFile(logfile, (err, rawdata) => {
        if (err) throw err;
        const buf = new Buffer.from(rawdata);
        const data = iconv.decode(buf, "Shift_JIS");
        const splitdata = data.split("\r\n")
        if (splitdata.length - 1 < lines) lines = 0
        while (lines < splitdata.length - 1) {
            const text = splitdata[lines++]
            console.log(text)
            extractChat(text)
        }
    })
}

function extractChat(text) {
    text.match(/(\<.+\> .*)/)
    if (!RegExp.$1) return;
    const message = RegExp.$1;
    sendBouyomiHttp(message)
}

function sendBouyomiHttp(message) {
    const req = http.get(encodeURI(server + "/talk?text=" + message))
    req.on("error", (err) => {
        // console.log(err);
        req.abort()
        req.destroy()
        req.end()
    })
}