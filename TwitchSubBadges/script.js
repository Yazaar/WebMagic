if (true) {
    document.querySelector('#usernameInput').focused = false
    document.querySelector('#usernameInput').addEventListener('focus', function(){
        this.focused = true
    })

    document.querySelector('#usernameInput').addEventListener('blur', function(){
        this.focused = false
    })
    
    let startSearch = function(username) {
        if (typeof (username) != 'string') {
            loading = false
            return
        }
        if (username.length == 0) {
            loading = false
            return
        }
    
        let xml = new XMLHttpRequest()
        xml.onreadystatechange = function () {
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    let xmlData = JSON.parse(xml.response).data
                    if(xmlData.length > 0){
                        getBadges(xmlData[0].id, xmlData[0].login)
                    } else {
                        alert(username + ' not found')
                        loading = false
                    }
                } else {
                    let xmlData = JSON.parse(xml.response)
                    if (xmlData.error === 'Unauthorized') {
                        createToken()
                    } else {
                        alert('error getting userid...')
                    }
                    loading = false
                }
            }
        }

        xml.open('get', 'https://api.twitch.tv/helix/users?login=' + username)
        xml.setRequestHeader('Client-Id', client_id)
        xml.setRequestHeader('Authorization', 'Bearer ' + access_token)
        xml.send()
    }
    
    let getBadges = function(userId, username) {
        let xml = new XMLHttpRequest()
        xml.onreadystatechange = function () {
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    parseBadgeResponse(JSON.parse(xml.response), username)
                } else {
                    loading = false
                    alert('error getting badges...')
                }
            }
        }
        xml.open('get', 'https://api.twitch.tv/helix/chat/badges?broadcaster_id=' + userId)
        xml.setRequestHeader('Client-Id', client_id)
        xml.setRequestHeader('Authorization', 'Bearer ' + access_token)
        xml.send()
    }

    let parseBadgeResponse = function(badgeData, username) {
        let data = {
            'Tier 1 sub badges': [],
            'Tier 2 sub badges': [],
            'Tier 3 sub badges': []
        }

        if (badgeData.data === undefined || badgeData.data.length == 0) {
            loading = false
            alert(username + ' does not have any sub badges')
            return
        }
        let badges = badgeData.data
        console.log(badges)

        for (let i of badges) {
            if (i.set_id === 'subscriber') {
                for (let j of i.versions) {
                    let set_item = {
                        title: j.title,
                        url: j.image_url_4x
                    }

                    switch (toTier(j.id)) {
                        case 1:
                            data['Tier 1 sub badges'].push(set_item)
                            break
                        case 2:
                            data['Tier 2 sub badges'].push(set_item)
                            break
                        case 3:
                            data['Tier 3 sub badges'].push(set_item)
                            break
                    }
                }
            }

        }
        resultData[username] = data
        insertData(data, username)
    }

    let toTier = function(raw_id) {
        if (raw_id.length === 1) return 1
        return parseInt(raw_id[0])
    }

    let insertData = function(data, username) {
        let resultElement = document.querySelector('#results')

        let wrapper = document.createElement('div')

        let user = document.createElement('h2')
        user.innerText = username
        wrapper.appendChild(user)

        let data_keys = Object.keys(data)
        for (let i of data_keys) {
            if (data[i].length == 0) continue

            let badge_type = document.createElement('h3')
            badge_type.innerText = i
            wrapper.appendChild(badge_type)

            let container = document.createElement('div')
            container.classList.add('subBadgeResult')

            for (let j of data[i]) {
                let div = document.createElement('div')
                div.classList.add('subBadge')

                let img = document.createElement('img')
                img.src = j.url
                div.appendChild(img)

                let p = document.createElement('p')
                p.innerText = j.title
                div.appendChild(p)
                container.appendChild(div)
            }

            wrapper.appendChild(container)
        }

        if (resultElement.children.length === 0) {
            resultElement.appendChild(wrapper)
        } else {
            resultElement.insertBefore(wrapper, resultElement.children[0])
        }
        loading = false
    }

    document.querySelector('#searchButton').addEventListener('click', function(){
        if (processingInput === true){
            return
        }
        let username = document.querySelector('#usernameInput').value
        document.querySelector('#usernameInput').value = ''
        processInput(username)
    })
    
    let processInput =  function(data) {
        if (loading === true) {
            return
        }
        
        let username = data.replace(/\s/g, '').replace(/&/g, '').toLowerCase()
        
        if (username.length === 0) {
            return
        }
    
        loading = true
        
        if (Object.keys(resultData).includes(username)){
            insertData(resultData[username], username)
            return
        }
        
        if (searched.includes(username)){
            loading = false
            return
        }
    
    
        searched = username
        startSearch(username)
    }

    let createToken = function() {
        window.location = 'https://id.twitch.tv/oauth2/authorize?client_id=' + client_id + '&response_type=token&redirect_uri=' + window.location.protocol + '//' + window.location.host + window.location.pathname
    }

    let getToken = function() {
        let p = new URLSearchParams(window.location.hash.substring(1))
        window.location.hash = ''

        let at = p.get('access_token')
        
        if (at === null) {
            return localStorage.getItem('TTV:Sub Badge Viewer') || null
        }

        let newToken = document.querySelector('#newTokenLoaded')

        if (newToken !== null) {
            newToken.style.display = 'block'
            setTimeout(function() {
                newToken.style.display = 'none'
            }, 10000)
        }

        localStorage.setItem('TTV:Sub Badge Viewer', at)

        return at
    }

    let getUsers = function() {
        let params = new URLSearchParams(window.location.search)
        if (params.get("user") === null) {
            return
        }

        processingInput = true
        params = params.getAll("user")
        processInput(params.shift())

        let loop = setInterval(() => {
            if (loading === false){
                if(params.length > 0){
                    processInput(params.shift())
                } else {
                    loading = false
                    processingInput = false
                    clearInterval(loop)
                }
            }
        }, 100)
    }
    
    window.addEventListener("keypress", (e) => {
        if (document.querySelector('#usernameInput').focused && e.key == "Enter") {
            document.querySelector('#searchButton').click()
        }
    })

    let client_id = 'y2xo7519lrrijps6yurfnrehdaubry'
    let access_token = getToken()
    let searched = []
    let resultData = {}
    let loading = false
    let processingInput = false

    getUsers()
}