var aerodactylPerks = {};

var mainPokemonStats = {};

var score = 0;

function strongWeakImmune(type) {
    var response = {
        from: {
            weak: false,
            strong: false,
            immune: false
        }, to: {
            weak: false,
            strong: false,
            immune: false
        }
    }
    var keys = ['double_damage_from', 'double_damage_to', 'half_damage_from', 'half_damage_to', 'no_damage_from', 'no_damage_to'];
    var aerodactylTypes = ['flying', 'rock'];
    for (var i = 0; i < keys.length; i++) {
        var i_key = keys[i];
        for (var j = 0; j < aerodactylTypes.length; j++) {
            var currentType = aerodactylTypes[j];
            for (var k = 0; k < aerodactylPerks[currentType][i_key].length; k++) {
                if (aerodactylPerks[currentType][i_key][j].name === type) {
                    if (i === 0) {
                        response.from.strong = true;
                    } else if (i === 1){
                        response.to.strong = true;
                    } else if (i === 2){
                        response.from.weak = true;
                    } else if (i === 3){
                        response.to.weak = true;
                    } else if (i === 4){
                        response.from.immune = true;
                    } else if (i === 5){
                        response.to.immune = true;
                    }
                }
            }
        }
    }
    return response;
}

function pokeApiResponse(response){
    score = 0;
    var selectedPokemon = response.sprites.front_default;
    document.querySelector('.right .pokeImage').src = selectedPokemon;

    // compare pokemon types (not perfect since there are a lot of work to compare each and every type)
    var typesElement = document.querySelector('.right .types');
    typesElement.innerHTML = '';
    for (var i = 0; i < response.types.length; i++) {
        var pokeType = document.createElement('p');
        var span1 = document.createElement('span');
        span1.innerText = '⬤ ';
        var span2 = document.createElement('span');
        span2.innerText = response.types[i].type.name;
        var span3 = document.createElement('span');
        span3.innerText = ' ⬤';
        var pokePerk = strongWeakImmune(response.types[i].type.name);
        // right attacks left
        if (pokePerk.from.immune === true) {
            score += 25;
            span3.classList.add('colorGreen');
        } else if (pokePerk.from.strong === true && pokePerk.from.weak === true){
            // strong and weak cancels each other out
        }else if (pokePerk.from.strong === true) {
            score -= 5;
            span3.classList.add('colorBlue');
        } else if (pokePerk.from.weak === true) {
            score += 5;
            span3.classList.add('colorRed');
        }
        // left attacks right
        if (pokePerk.to.immune === true) {
            score -= 25;
            span1.classList.add('colorGreen');
        } else if (pokePerk.to.strong === true && pokePerk.to.weak === true) {
            // strong and weak cancels each other out
        } else if (pokePerk.to.strong === true) {
            score += 5;
            span1.classList.add('colorBlue');
        } else if (pokePerk.to.weak === true) {
            score -= 5;
            span1.classList.add('colorRed');
        }
        pokeType.appendChild(span1);
        pokeType.appendChild(span2);
        pokeType.appendChild(span3);
        typesElement.appendChild(pokeType);
    }
    
    // compare pokemon base XP
    document.querySelector('.right .baseXP').innerText = response.base_experience;
    if (mainPokemonStats.baseXP > response.base_experience) {
        document.querySelector('.right .baseXP').classList.remove('bestStat');
        document.querySelector('.left .baseXP').classList.add('bestStat');
    } else if (mainPokemonStats.baseXP < response.base_experience) {
        document.querySelector('.left .baseXP').classList.remove('bestStat');
        document.querySelector('.right .baseXP').classList.add('bestStat');
    }
    score += mainPokemonStats.baseXP - response.base_experience;

    // compare other stats such as health, speed, attack and defence
    for (var i = 0; i < response.stats.length; i++) {
        if (mainPokemonStats.stats[response.stats[i].stat.name] !== undefined) {
            score += mainPokemonStats.stats[response.stats[i].stat.name] - response.stats[i].base_stat
            if (response.stats[i].stat.name === 'hp') {
                document.querySelector('.left .baseHP').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseHP').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseHP').classList.remove('bestStat');
                    document.querySelector('.left .baseHP').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseHP').classList.remove('bestStat');
                    document.querySelector('.right .baseHP').classList.add('bestStat');
                }
            } else if (response.stats[i].stat.name === 'speed'){
                document.querySelector('.left .baseS').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseS').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseS').classList.remove('bestStat'); 
                    document.querySelector('.left .baseS').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseS').classList.remove('bestStat');
                    document.querySelector('.right .baseS').classList.add('bestStat'); 
                }
            } else if (response.stats[i].stat.name === 'special-defense'){
                document.querySelector('.left .baseSD').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseSD').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseSD').classList.remove('bestStat');
                    document.querySelector('.left .baseSD').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseSD').classList.remove('bestStat');
                    document.querySelector('.right .baseSD').classList.add('bestStat');   
                }
            } else if (response.stats[i].stat.name === 'special-attack'){
                document.querySelector('.left .baseSA').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseSA').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseSA').classList.remove('bestStat');
                    document.querySelector('.left .baseSA').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseSA').classList.remove('bestStat');
                    document.querySelector('.right .baseSA').classList.add('bestStat');
                }
            } else if (response.stats[i].stat.name === 'defense'){
                document.querySelector('.left .baseD').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseD').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseD').classList.remove('bestStat');
                    document.querySelector('.left .baseD').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseD').classList.remove('bestStat');
                    document.querySelector('.right .baseD').classList.add('bestStat');
                }
            } else if (response.stats[i].stat.name === 'attack'){
                document.querySelector('.left .baseA').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseA').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseA').classList.remove('bestStat');
                    document.querySelector('.left .baseA').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseA').classList.remove('bestStat');
                    document.querySelector('.right .baseA').classList.add('bestStat');
                }
            }
        }
    }

    document.querySelector('.scoreResult').innerText = score;
}

function pokeApiRequest(endpoint, callback) {
    var xml = new XMLHttpRequest();
    xml.open('GET', 'https://pokeapi.co/api/v2/' + endpoint);
    xml.onload = function(){
        try {
            var response = JSON.parse(this.response);
        } catch(e) {
            var response = {};
        }
        callback(response);
    }
    xml.send();
}

// 142 = Aerodactyl
pokeApiRequest('pokemon/142', function(response){
    var AerodactylImage = response.sprites.front_default;
    document.querySelector('.left .pokeImage').src = AerodactylImage;
    document.querySelector('header img').src = AerodactylImage;
    document.querySelector('footer img').src = AerodactylImage;
    var typesElement = document.querySelector('.left .types');
    for (var i = 0; i < response.types.length; i++) {
        var pokeType = document.createElement('p');
        pokeType.innerText = response.types[i].type.name;
        typesElement.appendChild(pokeType);
        pokeApiRequest('type/' + response.types[i].type.name, function(response){
            aerodactylPerks[response.name] = response.damage_relations;
        });
    }
    document.querySelector('.left .baseXP').innerText = response.base_experience;
    mainPokemonStats.baseXP = response.base_experience;
    mainPokemonStats.stats = {};
    for (var i = 0; i < response.stats.length; i++) {
        mainPokemonStats.stats[response.stats[i].stat.name] = response.stats[i].base_stat;
        if (response.stats[i].stat.name === 'hp') {
            document.querySelector('.left .baseHP').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'speed'){
            document.querySelector('.left .baseS').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'special-defense'){
            document.querySelector('.left .baseSD').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'special-attack'){
            document.querySelector('.left .baseSA').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'defense'){
            document.querySelector('.left .baseD').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'attack'){
            document.querySelector('.left .baseA').innerText = response.stats[i].base_stat
        }
    }
});

pokeApiRequest('pokemon/?limit=1000', function(response){
    var pokeSelect = document.querySelector('#pokeSelect');
    for (var i = 0; i < response.count; i++) {
        var pokeOption = document.createElement('option');
        pokeOption.value = response.results[i].name;
        pokeOption.innerText = response.results[i].name;
        pokeSelect.appendChild(pokeOption);
    }
});

document.querySelector('#pokeSelect').addEventListener('input', function(){
    pokeApiRequest('pokemon/' + this.value, pokeApiResponse);
});

function calcBG() {
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var imageHeight = 900;
    var imageWidth = 1350;
    var heightScale = windowHeight / imageHeight;
    var scroll = (window.pageYOffset) / (document.body.clientHeight - windowHeight);
    var pushDistance = -scroll * (windowHeight/5);
    if (windowWidth > imageWidth * heightScale) {
        document.body.style.background = 'url("img/mountains.jpg") 0px ' + pushDistance + 'px / 100vw 120vh no-repeat fixed';
    } else {
        document.body.style.background = 'url("img/mountains.jpg") 0px ' + pushDistance + 'px / auto 120vh no-repeat fixed';
    }
}

window.addEventListener('scroll', calcBG);
window.addEventListener('resize', calcBG);
calcBG();