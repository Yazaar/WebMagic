let LowerLimit
let scores = {'wins':0, 'losses':0}
if (true){
    let ws
    let TMI
    let timeout
    let username
    let channel
    let command
    let win
    let start
    let current
    let bot
    let caster
    let IdentifyMessage
    let balance = 0
    let MainLoop
    let SecondaryLoop
    let checkStreamStatusInterval
    let LatestMessage
    let NewMessage = false

    let closeConnection = function(){
        clearInterval(MainLoop)
        clearInterval(SecondaryLoop)
        clearInterval(checkStreamStatusInterval)
        ws.close()
    }

    let checkStreamStatus = function(){
        let statusXML = new XMLHttpRequest()
        statusXML.onreadystatechange = function(event){
            if (event.currentTarget.readyState === 4){
                if (JSON.parse(this.response).data.length == 1){
                    sendMessage('/me [Yazaar Gamble Script] Noticed that you went live, the script has been terminated automatically for your own convenience. Have an awesome stream!')
                    console.log('STREAMER WENT LIVE, I CAN NOT LET YOU CONTINUE USING MY SCRIPT (TO AVOID FLOODING)')
                    closeConnection()
                }
            }
        }
        statusXML.open('get', 'https://api.twitch.tv/helix/streams?user_login=daxtroid')
        statusXML.setRequestHeader('Client-ID', 'plzvnzktffhy4r23znsp0x0j7x0d1w')
        statusXML.send()
    }

    let sendMessage = function(message) {
        ws.send("PRIVMSG #" + channel + " :" + message + "\r\n")
    }

    let StartGamble = function() {
        if (NewMessage === true){
            NewMessage = false
            if (win.test(LatestMessage) === true){
                if (current === start){
                    current = start+1
                } else {
                    current = start
                }
                sendMessage(command + ' ' + current)
                return
            }
            current = current * 2
            sendMessage(command + ' ' + current)
            return
        }
        sendMessage(command + ' ' + current)
        return
    }

    let StartTTV = function(TMI, username, channel){
        if (window.location.protocol === 'https:'){
            ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443')
        } else {
            ws = new WebSocket('ws://irc-ws.chat.twitch.tv:80')
        }

        ws.onopen = (message) => {
            console.log('Connecting...')
            ws.send("PASS " + TMI + "\r\n")
            ws.send("NICK " + username + "\r\n")
            ws.send("JOIN #" + channel + "\r\n")
        }

        ws.onmessage = (message) => {
            if (caster.test(message.data) && message.data.toLowerCase().includes('--disablegamblescript')){
                closeConnection()
                console.log('The caster for the channel took action and disabled this script')
                sendMessage('Got it, disabling the script right now')
                return
            }
            if (message.data === "PING :tmi.twitch.tv\r\n") {
                ws.send("PONG :tmi.twitch.tv\r\n")
                return
            }
            if(message.data.includes(':End of /NAMES list')){
                if (! message.data.includes('PRIVMSG')){
                    console.log('Connected!')
                    sendMessage(command + ' ' + current)
                }
                return
            }
            let msg = message.data
            if (bot.test(msg) === false){
                return
            }
            if (IdentifyMessage.test(msg) === false){
                return
            }
            if (win.test(msg)){
                scores.wins++
            } else {
                scores.losses++
            }
            document.getElementById('winrate').innerHTML = ((scores.wins/(scores.wins+scores.losses))*100).toFixed(2) + '%'

            if (win.test(msg)){
                balance += current
            } else {
                balance -= current
            }

            if (balance < LowerLimit){
                console.log('Whoops... You seem to have bypassed your lower limit, sorry :) But I am disabling the auto gamble right now!')
                clearInterval(MainLoop)
                clearInterval(SecondaryLoop)
            }

            document.getElementById('balance').innerHTML = new String(balance).valueOf()

            NewMessage = true
            LatestMessage = msg
        }
        
        ws.onclose = (message) => {
            console.log(message)
        }
        
        ws.onerror = (message) => {
            console.log(message)
        }
    }

    document.getElementById('go').addEventListener('click', () => {
        for (let i of document.querySelectorAll('input')){
            if (i.value === ''){
                console.log('Please fill all inputs...')
                return
            }
        }
        TMI = document.getElementById('TMI').value
        timeout = parseInt(document.getElementById('timeout').value)
        username = document.getElementById('username').value
        channel = document.getElementById('channel').value
        command = document.getElementById('command').value
        start = parseInt(document.getElementById('start').value)
        LowerLimit = parseInt(document.getElementById('LowerLimit').value)

        win = document.getElementById('win').value
        bot = document.getElementById('bot').value.toLowerCase()
        if (isNaN(timeout) || isNaN(start) || isNaN(LowerLimit)){
            console.log('"timeout", "start gamble" and "Lower limit" have to be ints :)')
            return
        }
        if (timeout < 1 || start < 1){
            console.log('"timeout" and "start gamble" have to be 1 or larger :)')
            return
        }
        if (TMI.substr(0,6) !== 'oauth:'){
            console.log('Invalid TMI')
            return
        }

        let checkStreamXML = new XMLHttpRequest()
        checkStreamXML.onreadystatechange = function(event){
            if (event.currentTarget.readyState === 4){
                let XMLRes = JSON.parse(this.response)
                if (XMLRes.data.length != 1){
                    bot = new RegExp('^:' + bot + '!' + bot + '@' + bot + '\.tmi\.twitch\.tv')
                    caster = new RegExp('^:' + channel.toLowerCase() + '!' + channel.toLowerCase() + '@' + channel.toLowerCase() + '\.tmi\.twitch\.tv')
                    IdentifyMessage = RegExp(document.getElementById('IdentifyMessage').value)
                    win = new RegExp(document.getElementById('win').value)
                    current = start
                    StartTTV(TMI, username, channel)
                    MainLoop = setInterval(StartGamble , timeout)
                    SecondaryLoop = setInterval(()=>{
                        sendMessage('/me [Yazaar Gamble Script] Is this script annoying you? If so, take action as the caster and type "--DisableGambleScript" to exit immediately! Sorry for the inconvenience... NotLikeThis')
                    }, timeout*8)
                    checkStreamStatusInterval = setInterval(checkStreamStatus, 30000)
                } else {
                    console.log('the streamer is live, I can not let you proceed using my script')
                }
            }
        }
        checkStreamXML.open('get', 'https://api.twitch.tv/helix/streams?user_login=' + channel)
        checkStreamXML.setRequestHeader('Client-ID', 'plzvnzktffhy4r23znsp0x0j7x0d1w')
        checkStreamXML.send()
    })
}