document.addEventListener('DOMContentLoaded', (e) => {
    const detectLanguage = document.getElementById('detect-language')
    const fromSelect = document.getElementById('from-select')
    const toSelect = document.getElementById('to-select')
    const fromExpand = document.getElementById('from-expand')
    const toExpand = document.getElementById('to-expand')
    const searchDropdown = document.getElementById('search-dropdown')
    const dropdownGroup = document.getElementById('dropdown-group')
    const dropdown = document.getElementById('dropdown')
    const fromText = document.getElementById('translate-text')
    const toText = document.getElementById('translated-text')
    const clearTextBtn = document.getElementById('clear-text-btn')
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

    // Fetch languages
    fetch('./assets/json/languages.json')
        .then((response) => response.json())
        .then((data) => populateLanguages(data))
    const populateLanguages = (data) => {
        data.forEach((row, i) => {
            if (i > 0) {
                const item = Object.assign(document.createElement('li'), {
                    className: 'custom-option',
                    textContent: row.language,
                    tabIndex: '0'
                })
                item.setAttribute('data-value', row.code)
                dropdown.appendChild(item)
            }
        })
    }

    // Translate text
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
    translateBtn.addEventListener('click', () => {
        const words = document.getElementById('translate-text').value
        // translate(words, from, to)
        loader.classList.remove('hidden')
        loader.classList.add('animate')

        // TRIAL
        toText.value = words
    })

    // Menu language selection
    detectLanguage.addEventListener('click', () => {
        from = 'auto'
        detectLanguage.classList.add('active')
        if (fromSelect.classList.contains('active'))
            fromSelect.classList.remove('active')
    })
    window.addEventListener('click', (e) => {
        if (e.target.closest('.custom-option')) {
            const code = e.target.getAttribute('data-value')
            if (dropdownActive === 'from') {
                from = code
                fromSelect.textContent = e.target.textContent
            } else if (dropdownActive === 'to') {
                to = code
                toSelect.textContent = e.target.textContent
            }
        }

        if (!e.target.closest('.select') && !e.target.closest('#drodpown-group')
            && dropdownGroup.classList.contains('open') && !e.target.closest('.search-dropdown')
            && !e.target.closest('.active') && !e.target.closest('.js-expand')
            || e.target.closest('#detect-language') && dropdownGroup.classList.contains('open')
            || e.target.closest('.custom-option')) {
            closeDropdown()
            console.log('hi')
        }
    })

    // Custom dropdown
    const openDropdown = (targetDropdown) => {
        // if (!detectLanguage.classList.contains('active') && targetDropdown !== fromSelect)
        if (!detectLanguage.classList.contains('active') || detectLanguage.classList.contains('active') && targetDropdown === toSelect)
            dropdownGroup.classList.toggle('open')
        if (document.querySelector('.selected'))
            document.querySelector('.selected').classList.remove('selected')
        if (dropdownGroup.classList.contains('open'))
            targetDropdown.classList.toggle('selected')
        searchDropdown.value = ''
        searchDropdown.focus()
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
    const fromDropdown = (element) => {
        if (screen.width <= 840)
            dropdown.children[0].style.display = 'block'
        openDropdown(element)
        dropdownActive = 'from'
        if (detectLanguage.classList.contains('active')) {
            detectLanguage.classList.remove('active')
            fromSelect.classList.add('active')
        }
    }
    const toDropdown = () => {
        if (screen.width <= 840)
            dropdown.children[0].style.display = 'none'
        openDropdown(toSelect)
        dropdownActive = 'to'
    }
    fromSelect.addEventListener('click', () => {
        fromSelect.classList.add('active')
        fromDropdown(fromSelect)
    })
    fromExpand.addEventListener('click', () => {
        fromDropdown(fromExpand)
    })
    toSelect.addEventListener('click', () => {
        toDropdown()
    })
    toExpand.addEventListener('click', () => {
        toDropdown()
    })
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
        if (e.key === 'ArrowDown') {
            dropdown.children[0].focus()
        }
    })
    window.addEventListener('keydown', (e) => {
        if (dropdownGroup.classList.contains('open') && e.key === 'Escape')
            dropdownGroup.classList.remove('open')
    })
    window.addEventListener('resize', () => {
        if (screen.width <= 840) {
            Array.from(dropdown.children).forEach((option) => {
                if (option.getAttribute('data-value') === from) {
                    sourceFrom.textContent = option.textContent
                    sourceFrom.setAttribute('data-value', option.getAttribute('data-value'))
                } else if (option.getAttribute('data-value') === to) {
                    targetTo.textContent = option.textContent
                    targetTo.setAttribute('data-value', option.getAttribute('data-value'))
                }
            })
        }
    })

    // Textarea character count
    const updateCharacterCount = () => {
        characterCount.textContent = fromText.value.length
    }
    fromText.addEventListener('input', () => {
        if (fromText.value.length === 0) {
            fromListenBtn.classList.add('hidden')
            toListenBtn.classList.add('hidden')
            copyBtn.classList.add('hidden')
            toText.value = ''
            clearTextBtn.classList.add('hidden')
        } else {
            fromListenBtn.classList.remove('hidden')
            clearTextBtn.classList.remove('hidden')
        }
        updateCharacterCount()
    })
    // Show/hide control buttons
    toText.addEventListener('selectionchange', () => {
        if (toText.value.length === 0) {
            toListenBtn.classList.add('hidden')
            copyBtn.classList.add('hidden')
        } else {
            toListenBtn.classList.remove('hidden')
            copyBtn.classList.remove('hidden')
        }
    })
    clearTextBtn.addEventListener('click', () => {
        fromText.value = ''
        toText.value = ''
        updateCharacterCount()
        fromListenBtn.classList.add('hidden')
        clearTextBtn.classList.add('hidden')
    })
    clearTextBtn.addEventListener('mouseenter', () => {
        createPopover(clearTextBtn, 'Clear Text', 'bottom')
    })
    clearTextBtn.addEventListener('mouseleave', () => {
        removePopover()
    })

    // Text to speech
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    let audio = null
    let audioText = null
    let ttsSupported = false
    // Fetch supported languages for TTS
    const fetchTtsSupportedLanguage = async () => {
        return fetch('./assets/json/voices.json')
            .then((response) => response.json())
    }
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
        if (soundPlaying)
            soundPlaying.stop()

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
            listenLoader(listenBtn)
            // fetchAudio(text, languageCode)
            //     .then(() => {
            //         removeListenLoader()
            //         playback(listenBtn.id)
            //     })
            fetchmp3()
                .then(() => {
                    removeListenLoader()
                    playback(listenBtn.id)
                })
        }
    }
    // Listen button listener
    fetchTtsSupportedLanguage()
        .then((data) => {
            const listenHover = (element, languageCode) => {
                let text = 'Listen'
                if (Object.entries(data).filter(([key]) => key === languageCode).length === 0) {
                    ttsSupported = false
                    text = 'Language is not supported'
                } else {
                    ttsSupported = true
                }
                if (element.classList.contains('listening'))
                    text = 'Stop'
                createPopover(element, text, 'top')
            }
            fromListenBtn.addEventListener('click', () => {
                removePopover()
                if (ttsSupported)
                    listen(fromText.value, from, fromListenBtn)
            })
            fromListenBtn.addEventListener('mouseenter', () => {
                listenHover(fromListenBtn, from)
            })
            fromListenBtn.addEventListener('mouseleave', () => {
                removePopover()
            })
            toListenBtn.addEventListener('click', () => {
                removePopover()
                if (ttsSupported)
                    listen(toText.value, to, toListenBtn)
            })
            toListenBtn.addEventListener('mouseenter', () => {
                listenHover(toListenBtn, to)
            })
            toListenBtn.addEventListener('mouseleave', () => {
                removePopover()
            })
        })

    // Swtich language
    switchLanguageBtn.addEventListener('click', () => {
        if (!detectLanguage.classList.contains('active')) {
            removePopover()
            const temp = from
            from = to
            to = temp
            const switchText = fromText.value
            fromText.value = toText.value
            toText.value = switchText
            const switchLanguage = fromSelect.textContent
            fromSelect.textContent = toSelect.textContent
            toSelect.textContent = switchLanguage
        }
        updateCharacterCount()
    })
    switchLanguageBtn.addEventListener('mouseenter', () => {
        if (detectLanguage.classList.contains('active')) {
            switchLanguageBtn.style.cursor = 'default'
        }
        createPopover(switchLanguageBtn, 'Switch language', 'bottom')
    })
    switchLanguageBtn.addEventListener('mouseleave', () => {
        if (detectLanguage.classList.contains('active')) {
            switchLanguageBtn.style.cursor = 'pointer'
        }
        removePopover()
    })

    // Copy translated text
    let isCopying = false
    const copy = (textarea) => {
        textarea.select()
        textarea.setSelectionRange(0, 99999) /* For mobile devices */

        // Copy the selected text to the clipboard
        document.execCommand("copy")

        textarea.setSelectionRange(0, 0)

        createPopover(copyBtn, 'Copied', 'top')
        setTimeout(() => {
            removePopover()
            isCopying = false
        }, 1500)
    }
    copyBtn.addEventListener('click', () => {
        removePopover()
        isCopying = true
        copy(document.getElementById('translated-text'))
    })
    copyBtn.addEventListener('mouseenter', () => {
        if (!isCopying) {
            createPopover(copyBtn, 'Copy', 'top')
        }
    })
    copyBtn.addEventListener('mouseleave', () => {
        removePopover()
    })
    // Popover
    let timeout = null
    function createPopover(element, text, position) {
        const popover = Object.assign(document.createElement('span'), {
            className: 'popover',
            id: 'popover',
            textContent: text
        })
        element.parentElement.appendChild(popover)
        popover.style.opacity = 0

        let top = element.offsetTop
        if (position === 'top')
            top -= element.offsetHeight
        else if (position === 'bottom')
            top += element.offsetHeight + 15
        popover.style.top = top + 'px'

        let left = element.offsetLeft
        console.log(left - popover.offsetWidth)
        if (screen.width < left + popover.offsetWidth)
            left = left - popover.offsetWidth + 30
        popover.style.left = left + 'px'

        timeout = setTimeout(() => {
            popover.style.opacity = 1
        }, 250)
    }
    function removePopover() {
        clearTimeout(timeout)
        if (document.getElementById('popover'))
            document.getElementById('popover').remove()
    }
    // Listen loader
    function listenLoader(element) {
        const loader = Object.assign(document.createElement('div'), {
            className: 'listen-loader'
        })
        element.appendChild(loader)
    }
    function removeListenLoader() {
        document.querySelector('.listen-loader').remove()
    }
})