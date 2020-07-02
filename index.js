const store = {
  keyboardActive: false,
  speed: 1.00
};

const stateHandler = {
  set(target, property, value, _receiver) {
    if (property === 'speed') {
      if (value < 0.1) {
        value = 0.1;
      }
      const display = document.querySelector('.speed-display');
      display.innerHTML = value.toFixed(2);
    }
    return Reflect.set(target, property, value);
  }
};

const state = new Proxy(store, stateHandler);

const handleDocumentClick = (event, $headers) => {
  const path = event.path || (event.composedPath && event.composedPath());
  state.keyboardActive = false;

  ($headers || []).forEach(($header) => {
    state.keyboardActive |= path.includes($header);
  });

  if (event.target.getAttribute('data-testid') === "audio-play") {
    (document.querySelectorAll('audio') || [])
      .forEach($audio => $audio.playbackRate = state.speed);
  }
}

const handleDocumentKeyPress = (event) => {
  if (state.keyboardActive) {
    if (event.code === 'KeyD') state.speed += 0.1;
    if (event.code === 'KeyS') state.speed -= 0.1;
  }
}

const createUI = ($root) => {
  const $speedContainer = document.createElement("div");
  $speedContainer.classList.add("speed-container");
  $root.appendChild($speedContainer)

  const $minusButton = document.createElement("button")
  $minusButton.innerHTML = "-"
  $minusButton.classList.add("speed-button")
  $speedContainer.appendChild($minusButton)

  const $speedDisplay = document.createElement("span");
  $speedDisplay.innerHTML = state.speed.toFixed(2);
  $speedDisplay.classList.add("speed-display");
  $speedContainer.appendChild($speedDisplay)

  const $plusButton = document.createElement("button")
  $plusButton.innerHTML = "+"
  $plusButton.classList.add("speed-button")
  $speedContainer.appendChild($plusButton)

  $minusButton.addEventListener("click", () =>  state.speed -= 0.1)
  $plusButton.addEventListener("click", () => state.speed += 0.1)
}


let attempts = 10;
const waitLoading = setInterval(() => {
  const $headers = document.querySelectorAll('header') || [];
  const $header = $headers[0];
  if ($header) {
    clearInterval(waitLoading)
    createUI($header);
    document.addEventListener('click', event => handleDocumentClick(event, $headers));
    document.addEventListener('keypress', handleDocumentKeyPress);
  }
  attempts--;
  if (!attempts) {
    clearInterval(waitLoading);
  }
}, 1000)
