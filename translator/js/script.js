document.addEventListener('DOMContentLoaded', (e) => {
    const menuBtn = document.querySelectorAll('.js-menu-btn')
    const detectLanguage = document.getElementById('source-auto')
    const sourceFrom = document.getElementById('source-from')
    const sourceTo = document.getElementById('source-to')
    const targetFrom = document.getElementById('target-from')
    const targetTo = document.getElementById('target-to')
    const fromSelect = document.getElementById('from-select')
    const toSelect = document.getElementById('to-select')
    const searchDropdown = document.getElementById('search-dropdown')
    const dropdownGroup = document.getElementById('dropdown-group')
    const dropdown = document.getElementById('dropdown')
    const fromText = document.getElementById('translate-text')
    const toText = document.getElementById('translated-text')
    const characterCount = document.getElementById('character-count')
    const translateBtn = document.getElementById('translate-btn')
    const switchLanguageBtn = document.getElementById('switch-language')
    const loader = document.getElementById('loader')
    const fromListenBtn = document.getElementById('from-listen')
    const toListenBtn = document.getElementById('to-listen')
    const copyBtn = document.getElementById('copy')
    let dropdownActive = ''
    let from = 'en'
    let to = 'fr'

    fetch("./assets/json/languages.json")
        .then((response) => response.json())
        .then((data) => {
            populateLanguages(data)
        })

    const populateLanguages = (data) => {
        data.forEach((row, i) => {
            if (i > 0) {
                const item = Object.assign(document.createElement('li'), {
                    className: 'custom-option',
                    textContent: row.language
                })
                item.setAttribute('data-value', row.code)
                dropdown.appendChild(item)
            }
        })
    }

    async function translate(text, from, to) {
        const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/text'
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': 'a3d2a5e0c1msh12a87bb8eb2b5f3p1d31cfjsn175c5924cea0',
                'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
            },
            body: new URLSearchParams({
                from: from,
                to: to,
                text: text
            })
        }

        try {
            const response = await fetch(url, options)
            const result = await response.json()
            toText.value = result.trans
            loader.classList.add('hidden')
            loader.classList.remove('animate')
        } catch (error) {
            console.error(error)
        }
    }
    translateBtn.addEventListener('click', (e) => {
        const words = document.getElementById('translate-text').value
        // translate(words, from, to)
        loader.classList.remove('hidden')
        loader.classList.add('animate')

        // TRIAL
        toText.value = words
    })

    detectLanguage.addEventListener('click', (e) => {
        from = 'auto'
    })

    const dropdownListener = (e, targetDropdown, otherDropdown) => {
        e.preventDefault()
        targetDropdown.classList.toggle('selected')
        if (!otherDropdown.classList.contains('selected')) {
            dropdownGroup.classList.toggle('open')
        } else {
            otherDropdown.classList.remove('selected')
        }
        searchDropdown.value = ''
        searchDropdown.focus()
    }
    sourceFrom.addEventListener('click', (e) => {
        if (sourceFrom.classList.contains('active')) {
            dropdownListener(e, sourceFrom, targetTo)
            dropdownActive = 'from'
        }
    })
    fromSelect.addEventListener('click', (e) => {
        dropdownListener(e, fromSelect, toSelect)
        dropdownActive = 'from'
    })
    targetTo.addEventListener('click', (e) => {
        if (targetTo.classList.contains('active')) {
            dropdownListener(e, targetTo, sourceFrom)
            dropdownActive = 'to'
        }
    })
    toSelect.addEventListener('click', (e) => {
        dropdownListener(e, toSelect, fromSelect)
        dropdownActive = 'to'
    })

    const updateCharacterCount = () => {
        characterCount.textContent = fromText.value.length
    }
    fromText.addEventListener('input', (e) => {
        if (fromText.value.length === 0) {
            fromListenBtn.classList.add('hidden')
            toListenBtn.classList.add('hidden')
            copyBtn.classList.add('hidden')
            toText.value = ''
        } else {
            fromListenBtn.classList.remove('hidden')
        }
        updateCharacterCount()
    })
    toText.addEventListener('selectionchange', (e) => {
        if (toText.value.length === 0) {
            toListenBtn.classList.add('hidden')
            copyBtn.classList.add('hidden')
        } else {
            toListenBtn.classList.remove('hidden')
            copyBtn.classList.remove('hidden')
        }
    })

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let audio = null
    let audioText = null

    const fetchAudio = async (text, languageCode) => {
        const url = `https://text-to-speech27.p.rapidapi.com/speech?text=${text}&lang=${languageCode}`
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'ef5e31c14bmsh100b01bc3c80a50p1e817fjsn19ee1d5a23d6',
                'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com'
            }
        }

        try {
            await fetch(url, options)
                .then(data => data.arrayBuffer())
                .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
                .then(decodedAudio => {
                    audioText = text
                    audio = decodedAudio
                    return
                })
        } catch (error) {
            console.error(error)
        }
    }

    let soundPlaying = null
    const fetchmp3 = async () => {
        await fetch('./assets/british.mp3')
            .then(data => data.arrayBuffer())
            .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
                audio = decodedAudio
            })
    }
    function playback(listenBtnId) {
        console.log(document.getElementById(listenBtnId).classList.contains('listening'))
        if (document.getElementById(listenBtnId).classList.contains('listening')) {
            const playSound = ctx.createBufferSource();
            soundPlaying = playSound
            playSound.buffer = audio;
            playSound.connect(ctx.destination);
            playSound.start(ctx.currentTime);
            playSound.addEventListener('ended', () => {
                document.getElementById(listenBtnId).classList.remove('listening')
            })
        }
    }

    const synth = window.speechSynthesis
    const listen = (text, languageCode, listenBtn) => {
        listenBtn.classList.toggle('listening')
        let listenBtnActiveId = listenBtn.id
        if (synth.speaking) {
            synth.cancel()
            if (listenBtn === fromListenBtn)
                listenBtnActiveId = toListenBtn.id
            else if (listenBtn === toListenBtn)
                listenBtnActiveId = fromListenBtn.id
        }
        if (soundPlaying) {
            soundPlaying.stop()
        }

        if (languageCode === 'en') {
            if (listenBtn.classList.contains('listening')) {
                const speech = new SpeechSynthesisUtterance()
                speech.text = text
                synth.speak(speech)
                speech.addEventListener('end', (e) => {
                    document.getElementById(listenBtnActiveId).classList.remove('listening')
                })
            }
        } else if (audio !== null) {
            playback(listenBtn.id)
        } else if (audio === null) {
            // fetchAudio(text, languageCode)
            //     .then(() => playback())
            fetchmp3()
                .then(() => playback(listenBtn.id))
        }
    }
    fromListenBtn.addEventListener('click', (e) => {
        listen(fromText.value, from, fromListenBtn)
    })
    toListenBtn.addEventListener('click', (e) => {
        listen(toText.value, to, toListenBtn)
    })

    switchLanguageBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const temp = from
        from = to
        to = temp
        const tempText = fromText.value
        fromText.value = toText.value
        toText.value = tempText
        updateCharacterCount()
    })

    const menuBtnListener = (element) => {
        element.classList.add('active')
        const i = Array.from(menuBtn).findIndex(btn => btn === element)
        if (i !== 0) {
            if (!menuBtn[0].classList.contains('active'))
                menuBtn[5 - i].classList.add('active')

            menuBtn.forEach((btn, j) => {
                if (i > 2 && menuBtn[0].classList.contains('active')) {
                    if (j > 2 && j != i && j !== 5 - i)
                        btn.classList.remove('active')
                } else if (j != i && j !== 5 - i)
                    btn.classList.remove('active')
            })
        } else {
            for (let i = 1; i <= 2; i++) {
                if (menuBtn[i].classList.contains('active'))
                    menuBtn[i].classList.remove('active')
            }
        }
    }

    const refreshDropdown = () => {
        Array.from(dropdown.children).forEach(option => {
            option.classList.remove('hidden')
        })
    }

    const closeDropdown = () => {
        dropdownActive = ''
        dropdownGroup.classList.remove('open')
        document.querySelector('.selected').classList.remove('selected')
        refreshDropdown()
    }

    searchDropdown.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') {
            closeDropdown()
        } else if (e.key === 'Enter') {
            const a = Array.from(dropdown.children).filter(option => !option.classList.contains('hidden'))
            a[0].click()
        } else {
            Array.from(dropdown.children).forEach(option => {
                if (!option.textContent.toLowerCase().includes(searchDropdown.value.toLowerCase())) {
                    option.classList.add('hidden')
                } else {
                    option.classList.remove('hidden')
                }
            })
        }
    })

    window.addEventListener('click', (e) => {
        if (e.target.closest('.js-menu-btn')) {
            menuBtnListener(e.target)
        }

        if (e.target.closest('.custom-option')) {
            const code = e.target.getAttribute('data-value')
            if (dropdownActive === 'from') {
                from = code
                sourceFrom.textContent = e.target.textContent
                targetFrom.textContent = e.target.textContent
                menuBtnListener(sourceFrom)
            } else if (dropdownActive === 'to') {
                to = code
                sourceTo.textContent = e.target.textContent
                targetTo.textContent = e.target.textContent
                menuBtnListener(targetTo)
            }
            console.log(dropdownActive)
            console.log(from, '-', to)
        }

        if (!e.target.closest('.select') && !e.target.closest('#drodpown-group')
            && dropdownGroup.classList.contains('open') && !e.target.closest('.search-dropdown')
            && !e.target.closest('#source-from') && !e.target.closest('#target-to')
            || e.target.closest('.custom-option')) {
            closeDropdown()
        }
    })

    const copy = (textarea) => {
        textarea.select()
        textarea.setSelectionRange(0, 99999) /* For mobile devices */

        // Copy the selected text to the clipboard
        document.execCommand("copy")

        // textarea.setSelectionRange(0, 0)
    }

    copyBtn.addEventListener('click', (e) => {
        copy(document.getElementById('translated-text'))
    })
})