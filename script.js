let countries = {}
const currentCountry = "Россия"

/**
 * 
 * @param {string} name 
 * @param {Array} allies 
 * @param {Array} enemies 
 * @param {Int32Array} militaryForce - 0 to 1000 
 * @param {Int32Array} respect - 0 to 100
 * @param {Int32Array} alliesRespect - 0 to 100
 */
function createCounrty(name, allies = [], enemies = [], militaryForce = 0, respect = 0, alliesRespect = Math.floor(Math.random() * 101)) {
    countries[name] = {'allies': allies, 'enemies': enemies, 'militaryForce': militaryForce, 'respect': respect, 'alliesRespect': alliesRespect}
}

createCounrty('Россия', ['Китай', 'Белоруссия'], ['США', "Украина", "Великобритания"], 250, 49)
createCounrty('Китай', ['Россия', 'Белоруссия'], ['США', "Тайвань"], 1000, 50, 50)
createCounrty('Белоруссия', ['Россия'], countries['Россия']['enemies'], 90, 100)
createCounrty('США', ['Великобритания', "Украина"], countries['Россия']['allies'], 450, 10, 100)
createCounrty('Украина', ['США', 'Великобритания'], ['Россия'], 150, 50, 30)
createCounrty('Великобритания', ['Украина', 'США'], ['Россия'], 100, 10, 60)
createCounrty("Тайвань", ['США'], ['Китай', 'Россия'], 10, 50, 10)

function printCountryInformation(country = currentCountry, initialAddition = 'Ваша страна - ') {
    alert(`
    ${initialAddition} ${country}. 
    Военная мощь - ${countries[country]['militaryForce']}, 
    ${country == currentCountry ? 'счастье ваших граждан' : 'уважение к вам'} - ${countries[country]['respect']}
    
    Враги страны - ${countries[country]['enemies']}
    Союзники страны - ${countries[country]['allies']}
    `)

    if (country == currentCountry && countries[currentCountry]['respect'] <= 0) {
        alert('Ваш народ был недоволен и вас свергли с поста правителя страны.')
        return true
    }
}

function parseCountriesInformationIntoString(countries) {
    let countriesString = ''

    for (country in countries) {
        if (country == currentCountry) {
            continue
        }

        countriesString = countriesString.concat(country, " союзники - ", countries[country]['allies'].join(', '), ", враги - ", countries[country]['enemies'].join(', '), 
        " уважение к вам - ", countries[country]['respect'], ", приблизительная военная сила - ", 
        countries[country]['militaryForce'] + Math.floor(Math.random() * 501), 
        "\n\n"
        )
    }

    return countriesString
}

function startCommunicationWithCountries(){
    let countryToAttack = ''
    for (let i = 0; i < 10; i++) {
        if (i == 9) {
            alert("Вы слишком долго ждали. Вас разбомбили")
            break
        } else {
            countries[currentCountry]['militaryForce'] += 50
            alert(`До ответных действий: ${ 9 - i }`)
        }
    
        proposedCountryToAttack = prompt(parseCountriesInformationIntoString(countries) + "На кого нападать?")
        
        console.log(proposedCountryToAttack)
        
        if (proposedCountryToAttack in countries && proposedCountryToAttack != currentCountry) {
            countryToAttack = proposedCountryToAttack;
            if (communicateWithCountry(countryToAttack)) {
                i = 0
                if (printCountryInformation(currentCountry)) {
                    break
                }
                continue
            }

            break
        } else {
            alert("Страны " + proposedCountryToAttack + " не существует, либо это вы")
        }
    }
}

function communicateWithCountry(country) {
    for (let i = 0; i < 10; i++) {
        if (i == 9) {
            alert(`Ваши войска слишком долго стояли на границе с ${country}. Их удачно убили`)
            return true
        } else {
            alert(`До ответных действий: ${ 9 - i }`)
        }

        chose = prompt(`Выберите действие
    
        1 - Завоевать
        2 - Заключить мир
        3 - Выбрать другую страну`)
        
        console.log(country)

        if (chose == '1') {
            return attackCountry(country)
        }
        else if (chose == '2') {
            friendWithCountry(country)
            return true
        }
        else if (chose == '3') {
            return false
        }

        alert('Такого варианта нет')
    }
}

function friendWithCountry(country) {
    if (countries[country]['respect'] >= 90) {
        alert('Вы успешно подружились с ' + country)
        countries[currentCountry]['respect'] += 5
        countries[currentCountry]['alliesRespect'] += 10
        countries[currentCountry]['allies'].push(allie)
        return true
    } else {
        alert('У вас не получилось подружится с ' + country + ' вашим гражданам это не понравилось')
        countries[currentCountry]['respect'] -= 10
        return false
    }
}

function attackCountry(country) {
    if (countries[country]['militaryForce'] <= countries[currentCountry]['militaryForce']) {
        if (countries[country]['alliesRespect'] >= 50) {
            countryForceWithAllies = countries[country]['militaryForce'] 
            for (enemyAllie in countries[country]['allies']) {
                countryForceWithAllies += enemyAllie in countries && enemyAllie != currentCountry ? countries[enemyAllie]['allies'] : 0
            }

            if (countryForceWithAllies <= countries[currentCountry]['militaryForce']) {
                alert('Вы успешно захватили эту страну, вы оказались сильнее её и её союзников. Что дальше?')
                return bombCountry(country)
            } else {
                alert('Вы бы успешно захватили эту страну, но к ней пришли на поддержку союзники.')
                return loseWar()
            }
        } else {
            alert('Вы успешно захватили эту страну, ей не смогли помочь союзники. Что дальше?')
            return bombCountry(country)
        }
    } else {
        alert('Вы не смогли захватить эту страну, так как их силы выше, чем ваши. Вашу армию разгромили.')
        return loseWar()
    }
}

function bombCountry(country) {
    for (allie in countries[country]['allies']) {
        if (!(allie in countries)) {
            break
        }

        countries[allie]['militaryForce'] += -10 + Math.round(Math.random()) * 20;
        countries[allie]['alliesRespect'] += Math.round(Math.random()) * 5;
        countries[currentCountry]['enemies'].push(allie)
    }

    countries[currentCountry]['militaryForce'] += countries[country]['militaryForce'] - Math.round(Math.random() * 30 ) - 10

    delete countries[country]

    if (Object.keys(countries).length <= 1) {
        alert('Поздравляем, вы разгромили все страны. Победа')
        return false
    }

    return true
}

function loseWar() {
    if (Math.round(Math.random()) == 0) {
        alert('Поражение')
        return false
    }

    alert('Вам повезло и ваше государство не стали захватывать, но вы понесли большие потери.')
    countries[currentCountry]['respect'] -= Math.round(Math.random()* (30 - 10) + 10);
    if (countries[currentCountry]['respect'] <= 0) {
        alert('Однако ваш народ был недоволен и вас свергли с поста правителя страны.')
        return false
    }

    countries[currentCountry]['militaryForce'] -= Math.round(Math.random()* (200 - 30) + 30);
    if (countries[currentCountry]['militaryForce'] <= 10) {
        alert('У вас разгромили всю армию, вы больше не способны к войне.')
        return false
    }

    countries[currentCountry]['alliesRespect'] -= Math.round(Math.random()* (40 - 10) + 10);
    if (countries[currentCountry]['alliesRespect'] <= 10) {
        alert('Ваши союзники крайне недовольны вами, вы были объявленны военным преступником и будете заключены за решётку.')
        return false
    }

    return true
}

printCountryInformation()

startCommunicationWithCountries()



