let FORM_DATA = {}

const inputs = document.querySelectorAll('input')
const labels = document.querySelectorAll('label')
const errors = document.querySelectorAll('p')
const form = document.querySelector('form')
const modal = document.querySelector('.modal')
const message = document.querySelector('.message-text')
const signUpBtn = document.querySelector('.sign-up')
const closeBtn = document.querySelector('.close-btn')

inputs.forEach((input, index) => {
  const label = labels[index]
  const error = errors[index]

  input.addEventListener('focus', () => {
    label.classList.add('active')
  })

  input.addEventListener('blur', () => {
    checkForm(input, error, label)

    // If after blur event mistakes appeared we should track the proccess of mistakes correction on input event
    input.addEventListener('input', () => checkForm(input, error, label))
  })
})

form.addEventListener('submit', (e) => {
  e.preventDefault()

  signUpBtn.disabled = true
  submitForm()

  // Check if all fields of form were filled properly
  if (Object.values(FORM_DATA).length !== inputs.length) {
    signUpBtn.disabled = false

    return
  }

  const loader = createLoader()

  signUpBtn.textContent = ''
  signUpBtn.append(loader)

  // Imitation of fetch request and indication of loading process
  setTimeout(() => {
    showMessage()
    resetForm()

    modal.addEventListener('click', closeModal)
    closeBtn.addEventListener('keydown', closeModalByKey)
  }, 2000)
})

function checkInput(type, text) {
  if (type === 'email') {
    const emailFormat = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
    )

    return text.match(emailFormat)
  }

  return text.length > 3 && text.length < 15
}

function checkForm(input, error, label) {
  const text = input.value.trim()
  const inputType = input.type

  const isValid = checkInput(inputType, text)

  if (isValid) {
    FORM_DATA[input.name] = text

    input.style.outline = '1px solid rgb(98, 189, 98)'
    input.style.borderBottom = '1px solid transparent'

    label.style.color = 'rgb(98, 189, 98)'

    error.classList.remove('error')
  } else {
    input.style.outline = '1px solid rgb(242, 76, 76)'
    input.style.borderBottom = '1px solid transparent'

    label.style.color = 'rgb(242, 76, 76)'

    error.classList.add('error')
  }
}

function createLoader() {
  const span = document.createElement('span')

  span.classList.add('loader')

  return span
}

function submitForm() {
  inputs.forEach((input, index) => {
    const label = labels[index]
    const error = errors[index]

    label.classList.add('active')

    checkForm(input, error, label)

    input.addEventListener('input', () => checkForm(input, error, label))
  })
}

function showMessage() {
  const { name, surname } = FORM_DATA

  const h2 = document.createElement('h2')

  h2.innerText = `Hi ${name} ${surname}! It's nice to meet you 😊 !`
  message.append(h2)

  modal.classList.add('active')
}

function closeModal(e) {
  const isButton =
    e.target.classList.contains('close-btn') || e.target.classList.contains('modal-btn')

  if (isButton) {
    modal.classList.remove('active')
    message.innerHTML = ''
  }
}

function closeModalByKey(e) {
  const isKeyPressed = e.key === 'Enter' || e.key === ' '

  if (isKeyPressed) {
    modal.classList.remove('active')
    message.innerHTML = ''
  }
}

function resetForm() {
  FORM_DATA = {}

  signUpBtn.innerHTML = 'Sign up'
  signUpBtn.disabled = false

  inputs.forEach((input) => {
    input.value = ''

    input.style.outline = ''
    input.style.borderBottom = ''
  })

  labels.forEach((label) => {
    label.classList.remove('active')
    label.style.color = ''
  })
}
