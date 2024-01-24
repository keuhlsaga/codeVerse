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
    let dropdownActive = '';
    let from = 'en'
    let to = 'fr'

    fetch("./assets/json/languages.json")
        .then((response) => response.json())
        .then((data) => {
            populateLanguages(data)
        });

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

    // fetch language from api
    /* const fetchLanguage = async () => {
        const url = 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages'
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'a3d2a5e0c1msh12a87bb8eb2b5f3p1d31cfjsn175c5924cea0',
                'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
            }
        }

        try {
            const response = await fetch(url, options)
            const result = await response.json()
            console.log(result)
            const dropdown = document.querySelector('.dropdown')

            result.forEach((row, i) => {
                if (i > 0) {
                    const item = Object.assign(document.createElement('li'), {
                        className: 'custom-option',
                        textContent: row.language
                    })
                    item.setAttribute('data-value', row.code)
                    dropdown.appendChild(item)
                }
            })

        } catch (error) {
            console.error(error)
        }
    }
    fetchLanguage() */

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
        console.log('ey')
        if (toText.value.length === 0) {
            toListenBtn.classList.add('hidden')
            copyBtn.classList.add('hidden')
        } else {
            toListenBtn.classList.remove('hidden')
            copyBtn.classList.remove('hidden')
        }
    })
    fromListenBtn.addEventListener('click', (e) => {
        fromListenBtn.classList.toggle('listening')
        // HERE
        let speech = new SpeechSynthesisUtterance()
        speech.text = fromText.value
        window.speechSynthesis.speak(speech)
    })
    toListenBtn.addEventListener('click', (e) => {
        toListenBtn.classList.toggle('listening')
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
        }

        if (e.key === 'Enter') {
            // STOP
        }

        Array.from(dropdown.children).forEach(option => {
            if (!option.textContent.toLowerCase().includes(searchDropdown.value.toLowerCase())) {
                option.classList.add('hidden')
            } else {
                option.classList.remove('hidden')
            }
        })
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
        textarea.select();
        textarea.setSelectionRange(0, 99999); /* For mobile devices */

        // Copy the selected text to the clipboard
        document.execCommand("copy");
    }

    copyBtn.addEventListener('click', (e) => {
        copy(document.getElementById('translated-text'))
    })

    console.log(window.speechSynthesis.getVoices())
})

/* let speech = new SpeechSynthesisUtterance()
let voices = []
let voiceSelect = document. querySe1ector("se1ect")

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices()
    speech. voice = voices[0]
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)))
}

voiceSelect.addEventListener('change', () => {
    speech.voice = voices[voiceSelect.value]
})

speech.text = 'speech'
window.speechSynthesis.speak(speech) */