/* eslint-disable linebreak-style */
const Keyboard = {
  elements: {
    main: null,
    textarea: null,
    keysContainer: null,
    keys: [],
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    state: 'en', // 'en', 'enShift', 'ru', 'ruShift'
    layout: {},
  },

  init() {
    this.properties.state = (sessionStorage.getItem('layout')) ? sessionStorage.getItem('layout').substr(0, 2) : 'en';
    // this.properties.capsLock = sessionStorage.getItem('capsLock') || false;
    // console.log(this.properties.state);
    // console.log(this.properties.capsLock);
    // this.properties.value = sessionStorage.getItem('value') || '';

    // Create keys data arrays
    const keyLayout = ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace', 'Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Enter', 'CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight', 'ControlLeft', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
    const en = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'Enter', 'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\', 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', '▲', 'Shift', 'Ctrl', 'Alt', ' ', 'Alt', 'Ctrl', '◀', '▼', '▶'];
    const enShift = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace', 'Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}', 'Enter', 'CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', '|', 'Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', '▲', 'Shift', 'Ctrl', 'Alt', ' ', 'Alt', 'Ctrl', '◀', '▼', '▶'];
    const ru = ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'Enter', 'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '\\', 'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', '▲', 'Shift', 'Ctrl', 'Alt', ' ', 'Alt', 'Ctrl', '◀', '▼', '▶'];
    const ruShift = ['Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'Backspace', 'Tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ', 'Enter', 'CapsLock', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', '/', 'Shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', '▲', 'Shift', 'Ctrl', 'Alt', ' ', 'Alt', 'Ctrl', '◀', '▼', '▶'];
    const specialButtons = ['Tab', 'Backspace', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'Space', 'Backslash'];
    const darkButtons = ['Backquote', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight', 'AltLeft', 'AltRight', 'ControlRight'].concat(specialButtons);

    // Create layout object
    const layout = {};
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keyLayout.length; ++i) {
      layout[keyLayout[i]] = {
        en: en[i],
        enShift: enShift[i],
        ru: ru[i],
        ruShift: ruShift[i],
      };
    }
    this.layout = layout;

    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.textarea = document.createElement('textarea');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard');
    this.elements.textarea.classList.add('keyboard-input');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys(keyLayout, layout, specialButtons, darkButtons));
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.textarea);
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Connect keyboard for textarea
    this.open(document.querySelector('.keyboard-input').value, (currentValue) => {
      document.querySelector('.keyboard-input').value = currentValue;
    });
  },


  createKeys(keyLayout, layout, specialButtons, darkButtons) {
    const fragment = document.createDocumentFragment();

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['Backspace', 'Enter', 'Backslash', 'ShiftRight'].indexOf(key) !== -1;
      const isDoubleButton = (specialButtons.indexOf(key) !== -1);
      const isDarkButton = (darkButtons.indexOf(key) !== -1);

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.setAttribute('id', key);
      keyElement.classList.add('keyboard__key');
      keyElement.textContent = layout[key].ru;
      if (isDarkButton) {
        keyElement.classList.add('keyboard__key--special');
      }

      if (isDoubleButton) {
        keyElement.classList.add('keyboard__key--wide');
      }

      if (key === 'Space') {
        keyElement.classList.add('keyboard__key--extra-wide');
      }

      keyElement.textContent = layout[key][this.properties.state];

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });


    document.addEventListener('mouseover', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('keyboard__key')) {
        e.target.classList.add('keyboard__key--mouse');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('keyboard__key')) {
        e.preventDefault();
        e.target.classList.remove('keyboard__key--mouse');
      }
    });

    window.addEventListener('keydown', (e) => {
      const el = document.getElementById(e.code);
      if (el && el.classList.contains('keyboard__key')) {
        e.preventDefault();
        el.classList.add('keyboard__key--mouse');
        this.eventChecker(e.code, e);
      }
    });

    window.addEventListener('keyup', (e) => {
      const el = document.getElementById(e.code);
      if (el && el.classList.contains('keyboard__key')) {
        e.preventDefault();
        el.classList.remove('keyboard__key--mouse');
        this.eventCheckerUp(e.code, e);
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('keyboard__key')) {
        this.eventChecker(e.target.id, e.target);
      }
    });

    document.addEventListener('mouseup', (e) => {
      if (e.target.classList.contains('keyboard__key')) {
        this.eventCheckerUp(e.target.id, e.target);
      }
    });

    return fragment;
  },

  eventChecker(key, e) {
    const keyElement = document.getElementById(key);
    switch (key) {
      case 'Backspace':
        this.properties.value = this.properties.value.slice(0, -1);
        this.triggerEvent('oninput');
        break;

      case 'CapsLock':
        keyElement.classList.add('keyboard__key--activatable');
        this.toggleCapsLock();
        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
        break;

      case 'Enter':
        this.properties.value += '\n';
        this.triggerEvent('oninput');
        break;

      case 'Tab':
        this.properties.value += '\t';
        this.triggerEvent('oninput');
        break;

      case 'Space':
        this.properties.value += ' ';
        this.triggerEvent('oninput');
        break;

      case 'AltRight':
        this.triggerEvent('oninput');
        break;

      case 'AltLeft':
        if (e.shiftKey === true) {
          this.switchLayout();
        }
        break;

      case 'ShiftRight':
        this.shiftDown();
        break;

      case 'ShiftLeft':
        this.shiftDown();
        if (e.ctrlKey === true) {
          this.switchLayout();
        }
        if (e.altlKey === true) {
          this.switchLayout();
        }
        break;

      case 'ControlRight':
        this.triggerEvent('oninput');
        break;

      case 'ControlLeft':
        if (e.shiftKey === true) {
          this.switchLayout();
        }
        break;

      default:
        this.properties.value += this.layout[key][this.properties.state];
        this.triggerEvent('oninput');
        break;
    }
  },

  eventCheckerUp(key, e) {
    switch (key) {

      case 'ShiftRight':
        this.shiftUp();
        break;

      case 'ShiftLeft':
        this.shiftUp();
        break;

      default:
        break;
    }
  },

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  switchLayout() {
    const st = this.properties.state.substr(0, 2);

    if (st !== 'ru') {
      this.properties.state = this.properties.state.replace('en', 'ru');

    } else {
      this.properties.state = this.properties.state.replace('ru', 'en');
    }

    this.toggleShift();

    sessionStorage.setItem('layout', this.properties.state);
  },

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    if (this.properties.capsLock) {
      this.properties.state = (`${this.properties.state}Shift`);

    } else {
      this.properties.state = this.properties.state.substr(0, 2);
    }

    this.toggleShift();

    sessionStorage.setItem('capsLock', this.properties.capsLock);
  },

  toggleShift() {
    this.elements.keys.forEach((el) => {
      if (el.childElementCount === 0) {
        el.textContent = this.layout[el.id][this.properties.state];
      }
    });
  },

  shiftDown() {
    if (!this.properties.capsLock) {
      this.properties.state = (`${this.properties.state}Shift`);
      this.toggleShift();
    }
  },

  shiftUp() {
    if (!this.properties.capsLock) {
      this.properties.state = this.properties.state.substr(0, 2);
      this.toggleShift();
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    // sessionStorage.setItem('value', this.properties.value);
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
  },
};

window.addEventListener('DOMContentLoaded', () => {
  Keyboard.init();
});