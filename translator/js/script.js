document.addEventListener('DOMContentLoaded', () => {
  const detectLanguageBtn = document.getElementById('detect-language')
  const fromSelectBtn = document.getElementById('from-select')
  const toSelectBtn = document.getElementById('to-select')
  const fromExpandBtn = document.getElementById('from-expand')
  const toExpandBtn = document.getElementById('to-expand')
  const searchDropdownText = document.getElementById('search-dropdown')
  const clearSearchBtn = document.getElementById('clear-search')
  const dropdownGroup = document.getElementById('dropdown-group')
  const dropdown = document.getElementById('dropdown')
  const fromTextarea = document.getElementById('translate-text')
  const toTextarea = document.getElementById('translated-text')
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
    .then((data) => {
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
    })

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
      if (response.status === 429)
        toTextarea.value = result.message
      else
        toTextarea.value = result.trans
      loader.classList.add('hidden')
      loader.classList.remove('animate')
      toListenBtn.classList.remove('hidden')
      copyBtn.classList.remove('hidden')
    } catch (error) {
      console.error(error)
    }
  }
  translateBtn.addEventListener('click', () => {
    if (fromTextarea.value !== '') {
      const text = document.getElementById('translate-text').value
      loader.classList.remove('hidden')
      loader.classList.add('animate')
      // FINAL VERSION
      // translate(text, from, to)

      // TRIAL VERSION
      toTextarea.value = text
      toListenBtn.classList.remove('hidden')
      copyBtn.classList.remove('hidden')
      setTimeout(() => {
        loader.classList.add('hidden')
        loader.classList.remove('animate')
      }, 2000)
    }
  })

  // Menu language selection
  detectLanguageBtn.addEventListener('click', () => {
    from = 'auto'
    switchLanguageBtn.classList.add('cursor-default')
    detectLanguageBtn.classList.add('active')
    if (fromSelectBtn.classList.contains('active'))
      fromSelectBtn.classList.remove('active')
  })
  const switchMenu = () => {
    const temp = from
    from = to
    to = temp
    const switchLanguage = fromSelectBtn.textContent
    fromSelectBtn.textContent = toSelectBtn.textContent
    toSelectBtn.textContent = switchLanguage
  }
  window.addEventListener('click', (e) => {
    // select language from dropdown
    if (e.target.closest('.custom-option')) {
      const code = e.target.getAttribute('data-value')
      if (dropdownActive === 'from') {
        if (code !== to) {
          from = code
          fromSelectBtn.setAttribute('data-value', from)
          fromSelectBtn.textContent = e.target.textContent
          if (detectLanguageBtn.classList.contains('active')) {
            detectLanguageBtn.classList.remove('active')
            fromSelectBtn.classList.add('active')
          }
        } else {
          switchMenu()
        }
      } else if (dropdownActive === 'to') {
        if (code !== from) {
          to = code
          toSelectBtn.textContent = e.target.textContent
        } else {
          switchMenu()
        }
      }
    }

    // close dropdown
    if (!e.target.closest('.select') && !e.target.closest('#drodpown-group')
      && dropdownGroup.classList.contains('open') && !e.target.closest('.search-dropdown')
      && !e.target.closest('.active') && !e.target.closest('.js-expand')
      && !e.target.closest('#clear-search')
      || e.target.closest('#detect-language') && dropdownGroup.classList.contains('open')
      || e.target.closest('.custom-option')) {
      closeDropdown()
    }
  })

  // Custom dropdown
  let isFromActive = false
  const refreshDropdown = () => {
    Array.from(dropdown.children).forEach(option => {
      if (!['', 'auto'].includes(option.getAttribute('data-value')))
        option.classList.remove('hidden')
      if (option.classList.contains('active-language'))
        option.classList.remove('active-language')
      if (option.classList.contains('is-clone'))
        option.remove()
    })
  }
  const closeDropdown = () => {
    dropdownActive = ''
    dropdownGroup.classList.remove('open')
    document.querySelector('.selected').classList.remove('selected')
    clearSearchBtn.classList.add('hidden')
  }
  const openDropdown = (targetDropdown) => {
    refreshDropdown()
    if (!detectLanguageBtn.classList.contains('active') || detectLanguageBtn.classList.contains('active') && targetDropdown === fromExpandBtn
      || detectLanguageBtn.classList.contains('active') && targetDropdown === toSelectBtn)
      dropdownGroup.classList.toggle('open')
    if (document.querySelector('.selected'))
      document.querySelector('.selected').classList.remove('selected')
    if (dropdownGroup.classList.contains('open'))
      targetDropdown.classList.toggle('selected')
    searchDropdownText.value = ''
    if (screen.width > 840)
      searchDropdownText.focus()
  }
  const checkActiveLanguage = (source) => {
    Array.from(dropdown.children).forEach(option => {
      if (option.getAttribute('data-value') === source) {
        option.classList.add('active-language')
      }
    })
  }
  const fromDropdown = (btn) => {
    btn.classList.add('active')
    if (from !== fromSelectBtn.getAttribute('data-value'))
      from = fromSelectBtn.getAttribute('data-value')
    if (screen.width <= 840)
      dropdown.children[0].classList.remove('hidden')
    dropdownActive = 'from'
    openDropdown(btn)
    checkActiveLanguage(from)
    if (detectLanguageBtn.classList.contains('active') && btn === fromSelectBtn) {
      detectLanguageBtn.classList.remove('active')
      fromSelectBtn.classList.add('active')
      switchLanguageBtn.classList.remove('cursor-default')
    }
    isFromActive = true
  }
  const toDropdown = () => {
    if (screen.width <= 840)
      dropdown.children[0].classList.add('hidden')

    dropdownActive = 'to'
    openDropdown(toSelectBtn)
    checkActiveLanguage(to)
    isFromActive = false
  }
  const searchLanguage = (searchText = '') => {
    if (searchText === '') {
      refreshDropdown()
      checkActiveLanguage(isFromActive ? from : to)
    } else {
      const result = Array.from(dropdown.children).filter(option => {
        option.classList.add('hidden')
        if (option.classList.contains('is-clone'))
          option.remove()
        else
          return option.textContent.toLowerCase().includes(searchText)
      })

      result.sort((option1, option2) => {
        return option1.textContent.toLowerCase().indexOf(searchText) > option2.textContent.toLowerCase().indexOf(searchText)
      })

      result.forEach((option) => {
        const clone = option.cloneNode(true)
        clone.classList.remove('hidden')
        clone.classList.add('is-clone')
        dropdown.appendChild(clone)
      })

      if (result.length === 0)
        document.querySelector('.no-result').classList.remove('hidden')
    }
  }
  fromSelectBtn.addEventListener('click', () => {
    fromDropdown(fromSelectBtn)
  })
  fromExpandBtn.addEventListener('click', () => {
    fromDropdown(fromExpandBtn)
  })
  toSelectBtn.addEventListener('click', () => {
    toDropdown()
  })
  toExpandBtn.addEventListener('click', () => {
    toDropdown()
  })
  let activeIndex = 1
  searchDropdownText.addEventListener('keyup', (e) => {
    if (searchDropdownText.value.length > 0)
      clearSearchBtn.classList.remove('hidden')
    else
      clearSearchBtn.classList.add('hidden')
    if (e.key === 'Enter') {
      const a = Array.from(dropdown.children).filter(option => !option.classList.contains('hidden'))
      a[0].click()
    } else {
      searchLanguage(searchDropdownText.value.toLowerCase())
    }
    if (e.key === 'ArrowDown') {
      if (!dropdown.children[0].classList.contains('hidden'))
        activeIndex = 0
      dropdown.children[activeIndex].focus()
    }
  })
  window.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('custom-option')) {
      e.preventDefault()
      let col = getComputedStyle(dropdown)['grid-template-columns'].split(' ').length
      switch (e.key) {
        case 'ArrowUp':
          if (activeIndex > col) {
            activeIndex -= col
          }
          break
        case 'ArrowDown':
          if (activeIndex < Array.from(dropdown.children).length - col)
            activeIndex += col
          break
        case 'ArrowLeft':
          if (activeIndex > 1 && col > 1)
            activeIndex -= 1
          break
        case 'ArrowRight':
          if (activeIndex < Array.from(dropdown.children).length - 1 && col > 1)
            activeIndex += 1
          break
        case ' ':
        case 'Enter':
          dropdown.children[activeIndex].click()
          break
      }
      dropdown.children[activeIndex].focus()
    }
  })
  clearSearchBtn.addEventListener('click', () => {
    searchDropdownText.value = ''
    searchLanguage()
    clearSearchBtn.classList.add('hidden')
  })
  window.addEventListener('keydown', (e) => {
    if (dropdownGroup.classList.contains('open') && e.key === 'Escape')
      dropdownGroup.classList.remove('open')
  })

  // Textarea character count
  const updateCharacterCount = () => {
    characterCount.textContent = fromTextarea.value.length
  }
  fromTextarea.addEventListener('input', () => {
    if (fromTextarea.value.length === 0) {
      fromListenBtn.classList.add('hidden')
      toListenBtn.classList.add('hidden')
      copyBtn.classList.add('hidden')
      toTextarea.value = ''
      clearTextBtn.classList.add('hidden')
      toListenBtn.classList.add('hidden')
      copyBtn.classList.add('hidden')
    } else {
      fromListenBtn.classList.remove('hidden')
      clearTextBtn.classList.remove('hidden')
    }
    updateCharacterCount()
  })
  clearTextBtn.addEventListener('click', () => {
    removePopover()
    fromTextarea.value = ''
    toTextarea.value = ''
    updateCharacterCount()
    fromListenBtn.classList.add('hidden')
    clearTextBtn.classList.add('hidden')
    toListenBtn.classList.add('hidden')
    copyBtn.classList.add('hidden')
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
  let ttsSupported = false
  let activeListenBtnId = null
  // Api limit audio
  const fetchApiLimit = async () => {
    try {
      const response = await fetch('./assets/api-limit-msg.mp3')
      const result = await response.arrayBuffer()
      const decodedAudio = await ctx.decodeAudioData(result)
      audio = decodedAudio
    } catch (error) {
      console.error(error)
    }
  }
  // Fetch supported languages for Text to speech
  const fetchTtsSupportedLanguage = async () => {
    return fetch('./assets/json/voices.json')
      .then((response) => response.json())
  }
  const fetchAudio = async (text, languageCode) => {
    const url = `https://text-to-speech27.p.rapidapi.com/speech?text=${text}&lang=${languageCode}`
    const options = {
      method: 'GET',
      headers: {
        // FINAL
        // 'X-RapidAPI-Key': 'ef5e31c14bmsh100b01bc3c80a50p1e817fjsn19ee1d5a23d6',
        'X-RapidAPI-Key': '',
        'X-RapidAPI-Host': 'text-to-speech27.p.rapidapi.com'
      }
    }

    try {
      const response = await fetch(url, options)
      if (response.status === 429) {
        fetchApiLimit()
          .then(() => {
            playback(activeListenBtnId)
          })
      } else {
        const result = await response.arrayBuffer()
        const decodedAudio = await ctx.decodeAudioData(result)
        audio = decodedAudio
      }
      /* await fetch(url, options)
        .then(data => data.arrayBuffer())
        .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
        .then(decodedAudio => {
          audio = decodedAudio
        }) */
    } catch (error) {
      console.error(error)
    }
  }
  let soundPlaying = null
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
      // FINAL VERSION
      // fetchAudio(text, languageCode)
      //     .then(() => {
      //         removeListenLoader()
      //         playback(listenBtn.id)
      //     })
      // TRIAL VERSION
      // fetchmp3()
      fetchApiLimit()
        .then(() => {
          removeListenLoader()
          playback(listenBtn.id)
        })

      // test limit
      // testLimit()
      //   .then(() => {
      //     removeListenLoader()
      //     playback(listenBtn.id)
      //   })
    }
  }
  const checkTtsLanguage = (data, element, languageCode) => {
    let text = 'Listen'
    if (Object.entries(data).filter(([key]) => key === languageCode).length === 0) {
      ttsSupported = false
      text = 'Language is not supported'
      element.classList.add('disabled')
    } else {
      ttsSupported = true
      element.classList.remove('disabled')
    }
    if (element.classList.contains('listening'))
      text = 'Stop'
  }
  // Listen button listener
  fetchTtsSupportedLanguage()
    .then((data) => {
      const listenHover = (element, languageCode) => {
        let text = 'Listen'
        if (Object.entries(data).filter(([key]) => key === languageCode).length === 0) {
          ttsSupported = false
          text = 'Language is not supported'
          element.classList.add('disabled')
        } else {
          ttsSupported = true
          element.classList.remove('disabled')
        }
        if (element.classList.contains('listening'))
          text = 'Stop'
        document.querySelector(`div[data-popover="${element.id}"]`).textContent = text
        // createPopover(element, text, 'top')
      }
      fromListenBtn.addEventListener('click', () => {
        activeListenBtnId = fromListenBtn.id
        listenHover(fromListenBtn, from)
        // removePopover()
        if (ttsSupported)
          listen(fromTextarea.value, from, fromListenBtn)
      })
      fromListenBtn.addEventListener('mouseenter', () => {
        listenHover(fromListenBtn, from)
      })
      /* fromListenBtn.addEventListener('mouseleave', () => {
        removePopover()
      }) */
      toListenBtn.addEventListener('click', () => {
        activeListenBtnId = toListenBtn.id
        listenHover(toListenBtn, to)
        // removePopover()
        if (ttsSupported)
          listen(toTextarea.value, to, toListenBtn)
      })
      toListenBtn.addEventListener('mouseenter', () => {
        listenHover(toListenBtn, to)
      })
      /* toListenBtn.addEventListener('mouseleave', () => {
        removePopover()
      }) */
    })

  // Swtich language
  switchLanguageBtn.addEventListener('click', () => {
    if (!detectLanguageBtn.classList.contains('active') && from !== 'auto') {
      // removePopover()
      const temp = from
      from = to
      to = temp
      const switchText = fromTextarea.value
      fromTextarea.value = toTextarea.value
      toTextarea.value = switchText
      const switchLanguage = fromSelectBtn.textContent
      fromSelectBtn.textContent = toSelectBtn.textContent
      toSelectBtn.textContent = switchLanguage
    }
    updateCharacterCount()
  })
  /* switchLanguageBtn.addEventListener('mouseenter', () => {
    if (detectLanguageBtn.classList.contains('active')) {
      switchLanguageBtn.style.cursor = 'default'
    }
    createPopover(switchLanguageBtn, 'Switch language', 'bottom')
  })
  switchLanguageBtn.addEventListener('mouseleave', () => {
    removePopover()
  }) */

  // Copy translated text
  let isCopying = false
  const copy = () => {
    toTextarea.select()
    toTextarea.setSelectionRange(0, 99999) /* For mobile devices */

    // Copy the selected text to the clipboard
    document.execCommand("copy")

    // Deselect
    toTextarea.setSelectionRange(0, 0)

    createPopover(copyBtn, 'Copied', 'top')
    setTimeout(() => {
      removePopover()
      isCopying = false
    }, 1500)
  }
  copyBtn.addEventListener('click', () => {
    copy()
    setTimeout(() => {
      document.querySelector('div[data-popover="copy"]').textContent = "Copied"
      setTimeout(() => {
        document.querySelector('div[data-popover="copy"]').textContent = "Copy"
      }, 1000)
    }, 200)
    /* removePopover()
    isCopying = true */
  })
  /* copyBtn.addEventListener('mouseenter', () => {
    if (!isCopying) {
      createPopover(copyBtn, 'Copy', 'top')
    }
  })
  copyBtn.addEventListener('mouseleave', () => {
    removePopover()
  }) */
  // Popover
  let timeout = null
  function createPopover(element, text, position) {
    /* const popover = Object.assign(document.createElement('div'), {
      className: 'popover',
      id: 'popover',
      textContent: text
    })
    // element.parentElement.appendChild(popover)
    popover.style.opacity = 0

    let top = element.offsetTop
    if (position === 'top')
      top -= element.offsetHeight
    else if (position === 'bottom')
      top += element.offsetHeight + 15
    popover.style.top = top + 'px'

    let left = element.offsetLeft
    if (screen.width < left + popover.offsetWidth)
      left = left - popover.offsetWidth + 30
    popover.style.left = left + 'px'

    timeout = setTimeout(() => {
      popover.style.opacity = 1
    }, 250) */
  }
  function removePopover() {
    // clearTimeout(timeout)
    // if (document.getElementById('popover'))
    //   document.getElementById('popover').remove()
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

  const popovers = document.querySelectorAll('.popover')
  popovers.forEach((popover) => {
    const popoverTarget = document.querySelector(`#${popover.getAttribute('data-popover')}`)
    popoverTarget.addEventListener('mouseenter', () => {
      let top = popoverTarget.offsetTop
      if (popover.getAttribute('data-popover-position') === 'top')
        top -= popoverTarget.offsetHeight
      else
        top += popoverTarget.offsetHeight + 15
      popover.style.top = top + 'px'
      let left = popoverTarget.offsetLeft
      if (screen.width < left + popover.offsetWidth)
        left = left - popover.offsetWidth + 30
      popover.style.left = left + 'px'
      popover.classList.add('show-popover')
    })
    popoverTarget.addEventListener('mouseleave', () => {
      popover.classList.remove('show-popover')
    })
  })

  async function testLimit() {
    const url = 'https://cloudlabs-text-to-speech.p.rapidapi.com/synthesize';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': '1a853aef0emshaf37245598f7ce2p1c9ba0jsn36b39191e5e1',
        'X-RapidAPI-Host': 'cloudlabs-text-to-speech.p.rapidapi.com'
      },
      body: new URLSearchParams({
        voice_code: 'en-US-1',
        text: 'hello, what is your name?',
        speed: '1.00',
        pitch: '1.00',
        output_type: 'audio_url'
      })
    };

    try {
      const response = await fetch(url, options);
      if (response.status === 429) {
        console.log(await response.json())
        fetchApiLimit()
          .then(() => {
            // playback(activeListenBtnId)
          })
      } else {
        const result = await response.arrayBuffer()
        const decodedAudio = await ctx.decodeAudioresult(result)
        audio = decodedAudio
      }
    } catch (error) {
      console.error(error.message)
    }
  }
  testLimit()
})