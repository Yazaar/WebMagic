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
        xml.open('get', 'https://badges.twitch.tv/v1/badges/channels/' + userId + '/display?language=en')
        xml.send()
    }
    
    let parseBadgeResponse = function(badgeData, username) {
        let data = []
        if (badgeData.badge_sets.subscriber === undefined) {
            loading = false
            alert(username + ' does not have any sub badges')
            return
        }
        let sub_badges = badgeData.badge_sets.subscriber.versions
        let sub_badge_keys = Object.keys(badgeData.badge_sets.subscriber.versions)

        for (let i of sub_badge_keys) {
            let isNew = true
            
            for (let j of data) {
                if (sub_badges[i].title === j.title) {
                    isNew = false
                    break
                }
            }

            if (isNew) {
                data.push({
                    title: sub_badges[i].title,
                    url: sub_badges[i].image_url_4x
                })
            }
        }
        resultData[username] = data
        insertData(data, username)
    }
    
    let insertData = function(data, username) {
        let resultElement = document.querySelector('#results')
    
        let user = document.createElement('h2')
        user.innerText = username
    
        let container = document.createElement('div')
        container.classList.add('subBadgeResult')
    
        for (let i of data) {
    
            let div = document.createElement('div')
            div.classList.add('subBadge')
    
            let img = document.createElement('img')
            img.src = i.url
            div.appendChild(img)
            
            let p = document.createElement('p')
            p.innerText = i.title
            div.appendChild(p)
            container.appendChild(div)
        }
        if (resultElement.children.length === 0) {
            resultElement.appendChild(user)
            resultElement.appendChild(container)
        } else {
            resultElement.insertBefore(container, resultElement.children[0])
            resultElement.insertBefore(user, resultElement.children[0])
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