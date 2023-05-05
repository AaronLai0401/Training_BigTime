const d = document;

const DOM = {
  brightnessSlide,

  courier,
  monaco,
  cancelPrefsButton,
  darkModeCheck,
  darkModeTxt,

  incMinute10,
  incMinute1,
  incSecond10,
  incSecond1,

  minutes10: 0,
  minutes1: 0,

  prefsIcon: 0,
  prefsScreen: 0,

  resetStopwatchButton: 0,
  resetTimerButton: 0,
  savePrefsButton: 0,

  seconds10: 0,
  seconds1: 0,

  setTimerScreen: 0,
  startStopwatchButton: 0,
  startTimerButton: 0,

  stopModeButton: 0,
  stopMinutes: 0,
  stopScreen: 0,
  stopSeconds: 0,

  timerMinute10: 0,
  timerMinute1: 0,
  timerMinutes: 0,

  timerModeButton: 0,
  timerScreen: 0,

  timerSecond10: 0,
  timerSecond1: 0,
  timerSeconds: 0,
};

// initialize DOM
for (let element in DOM) {
  DOM[element] = d.getElementById(element);
}

function padNum(num) {
  if (num < 10) num = "0" + num;
  return num;
}

// -----------------  模式 -----------------

// 模式切換switch2stopwatch
DOM.stopModeButton.addEventListener("click", switch2stopwatch);
function switch2stopwatch() {
  DOM.setTimerScreen.style.display = "none";
  DOM.stopScreen.style.display = "block";
  toggleModeButtons(DOM.stopModeButton, DOM.timerModeButton);
  currentMode = "stopScreen";
}

// 模式切換switch2timer
DOM.timerModeButton.addEventListener("click", switch2timer);
function switch2timer() {
  DOM.setTimerScreen.style.display = "block";
  DOM.stopScreen.style.display = "none";
  toggleModeButtons(DOM.timerModeButton, DOM.stopModeButton);
  currentMode = "setTimerScreen";
}

// 切換時的ACTIVE狀態
function toggleModeButtons(but1, but2) {
  but1.style.color = RGB(colorPref);
  but1.style.backgroundColor = "#ccc";
  but2.style.color = RGB(colorPref);
  but2.style.backgroundColor = "#000";
}

// -----------------  ** -----------------

// 回傳當前時間
function getSeconds() {
  // return # of seconds since epoch
  return ~~(new Date().getTime() / 1000);
}

let stopwatchInterval; // used with clearInterval

// ----------------- 碼表FN -----------------
DOM.startStopwatchButton.addEventListener("click", startStopwatch);

function startStopwatch(event) {
  event.stopPropagation();
  toggleStopButtons("none");

  let startTime =
    getSeconds() -
    parseInt(DOM.stopMinutes.innerHTML) * 60 -
    parseInt(DOM.stopSeconds.innerHTML);

  stopwatchInterval = setInterval(function () {
    let elapsed = getSeconds() - startTime;
    DOM.stopSeconds.innerHTML = padNum(elapsed % 60);
    DOM.stopMinutes.innerHTML = padNum(~~(elapsed / 60) % 60);
  }, 1000);

  d.body.addEventListener("click", stopStopwatch);
}


function stopStopwatch() {
  d.body.removeEventListener("click", stopStopwatch);
  clearInterval(stopwatchInterval);
  toggleStopButtons("inline");
}

function toggleStopButtons(displayValue) {
  DOM.startStopwatchButton.style.display =
    DOM.resetStopwatchButton.style.display =
    DOM.timerModeButton.style.display =
    DOM.stopModeButton.style.display =
    DOM.prefsIcon.style.display =
      displayValue;
}

// Reset For 重製碼表
DOM.resetStopwatchButton.addEventListener("click", resetStopwatch);
function resetStopwatch(event) {
  event.stopPropagation();
  DOM.stopSeconds.innerHTML = DOM.stopMinutes.innerHTML = "00";
}

// ----------------- ** --------------------

// ----------------- 計時器FN -----------------
let countdown = 0;
let timerInterval; // used with clearInterval

DOM.startTimerButton.addEventListener("click", startTimer);

function startTimer(event) {
  event.stopPropagation();

  countdown =
    DOM.timerMinute10.innerHTML * 600 +
    DOM.timerMinute1.innerHTML * 60 +
    DOM.timerSecond10.innerHTML * 10 +
    parseInt(DOM.timerSecond1.innerHTML);

  let startTime = getSeconds() + countdown;

  DOM.timerSeconds.innerHTML = padNum(countdown % 60);
  DOM.timerMinutes.innerHTML = padNum(~~(countdown / 60));

  toggleTimerButtons("none");
  DOM.timerScreen.style.display = "block";

  timerInterval = setInterval(function () {
    countdown = startTime - getSeconds();
    if (countdown < 0) {
      countdown = Math.abs(countdown);

      let tmp = d.body.style.backgroundColor;
      d.body.style.backgroundColor = DOM.timerScreen.style.color;
      DOM.timerScreen.style.color = tmp;
    }
    if (countdown < 60) {
      DOM.timerSeconds.innerHTML = padNum(countdown);
      DOM.timerMinutes.innerHTML = "00";
    } else {
      DOM.timerSeconds.innerHTML = padNum(countdown % 60);
      DOM.timerMinutes.innerHTML = padNum(~~(countdown / 60));
    }
  }, 1000);

  d.body.addEventListener("click", stopTimer);
}

function stopTimer() {
  d.body.removeEventListener("click", stopTimer);
  clearInterval(timerInterval);

  let minutes = padNum(~~(countdown/ 60));
  DOM.timerMinute10.innerHTML = ~~(minutes / 10);
  DOM.timerMinute1.innerHTML = minutes % 10;

  let seconds = padNum(countdown % 60);
  DOM.timerSecond10.innerHTML = ~~(seconds / 10);
  DOM.timerSecond1.innerHTML = seconds % 10 || "0";

  DOM.timerScreen.style.display = "none";
  toggleTimerButtons("block");
  savePrefs();
}

function toggleTimerButtons(displayValue) {
  DOM.timerModeButton.style.display =
    DOM.stopModeButton.style.display =
    DOM.setTimerScreen.style.display =
    DOM.prefsIcon.style.display =
      displayValue;
}

// -----------------  ** ----------------------

// -----------------  箭頭按鈕 -----------------
let arrowVals = {
  incMinute10: { target: "timerMinute10", value: 1 },
  decMinute10: { target: "timerMinute10", value: -1 },
  incMinute1: { target: "timerMinute1", value: 1 },
  decMinute1: { target: "timerMinute1", value: -1 },
  incSecond10: { target: "timerSecond10", value: 1 },
  decSecond10: { target: "timerSecond10", value: -1 },
  incSecond1: { target: "timerSecond1", value: 1 },
  decSecond1: { target: "timerSecond1", value: -1 },
};

// 綁定所有箭頭按鈕的click事件
const arrows = d.querySelectorAll(".arrow");
for (let x = 0; x < arrows.length; ++x) {
  let arrow = arrows[x];
  arrow.addEventListener("click", function (event) {
    let arrow = arrowVals[this.id];
    DOM[arrow.target].innerHTML =
      (parseInt(DOM[arrow.target].innerHTML) + arrow.value) % 10;
    if (DOM[arrow.target].innerHTML == -1) DOM[arrow.target].innerHTML = 9;
    if (arrow.target == "timerMinute10" && DOM.timerMinute10.innerHTML > 9)
      DOM.timerMinute10.innerHTML = 9;
    if (arrow.target == "timerSecond10" && DOM.timerSecond10.innerHTML > 9)
      DOM.timerSecond10.innerHTML = 9;
  });
}

// ------------------  ** -----------------------

// 重製按鈕(歸零)
DOM.resetTimerButton.addEventListener("click", resetTimer);
function resetTimer(event) {
  event.stopPropagation();
  countdown = 0;
  DOM.timerMinute10.innerHTML =
    DOM.timerMinute1.innerHTML =
    DOM.timerSecond10.innerHTML =
    DOM.timerSecond1.innerHTML =
      "0";
}

// ---------------切換到設定面板 ---------------
DOM.prefsIcon.addEventListener("click", showPrefs);
function showPrefs() {
  // hide currentMode, show prefs
  DOM[currentMode].style.display = "none";
  toggleStopButtons("none");
  DOM.prefsScreen.style.display = "block";
}

function togglePrefs() {
  // hide prefs, return to currentMode
  DOM.prefsScreen.style.display = "none";
  toggleStopButtons("inline");
  DOM[currentMode].style.display = "block";
}
// ----------------- ** ------------------------


// ----------------使用者偏好設定 ----------------

// const buttons = document.querySelectorAll("button");
const startButtons = document.querySelectorAll(".startButton");
const modeButtonIcons = document.querySelectorAll(".modeButtonIcon");
const functionButtonIcons = document.querySelectorAll(".functionButtonIcon");
const checkPrefButtons = document.querySelectorAll(".checkPrefButton");

// console.log(modeButtonIcons[0]);

// 字體偏好設定
let fonts = d.querySelectorAll("#prefsTable p");
let fontVals = {
  courier: "Courier",
  monaco: "Monaco, Menlo",
};
for (let x = 0; x < fonts.length; ++x) {
  let font = fonts[x];
  font.addEventListener("click", function (event) {
    fontPref = this.id;
    this.style.borderColor = "#ddd";
    for (let y = 0; y < fonts.length; ++y) {
      if (fonts[y].id != this.id) {
        DOM[fonts[y].id].style.borderColor = "#000";
      }
    }
  });
}


// 綁定顏色按鈕的click事件
let colors = d.querySelectorAll("#colors span");
for (let x = 0; x < colors.length; ++x) {
  let color = colors[x];
  color.addEventListener("click", function (event) {
    colorPref = this.id;
    DOM.prefsScreen.style.color = RGB(colorPref);
  });
}

// Dark Mode 按鈕的事件監聽器
DOM.darkModeCheck.addEventListener("change", function () {
  darkColor = this.checked ? colorPref : "white";
  updateStyles();
});

// Dark Mode 顏色雙向綁定
colors.forEach((btnColors) => {
  btnColors.addEventListener("click", function () {
    if (DOM.darkModeCheck.checked) {
      darkColor = this.id;
    }
    updateStyles();
  });
});

// Dark Mode 更新按鈕樣式
function updateStyles() {
  modeButtonIcons.forEach((dkMode) => (dkMode.style.stroke = RGB(darkColor)));
  functionButtonIcons.forEach((dkMode) => (dkMode.style.fill = RGB(darkColor)));
  checkPrefButtons.forEach((dkMode) => (dkMode.style.color = RGB(darkColor)));
  startButtons.forEach((dkMode) => (dkMode.style.color = RGB(darkColor)));
  arrows.forEach((dkMode) => (dkMode.style.color = RGB(darkColor)));
  DOM.darkModeTxt.style.color = RGB(darkColor);
}

// 儲存使用者偏好
DOM.savePrefsButton.addEventListener("click", savePrefs);
function savePrefs() {
  DOM.stopScreen.style.fontFamily =
    DOM.setTimerScreen.style.fontFamily =
    DOM.timerScreen.style.fontFamily =
      fontVals[fontPref];

  DOM.stopScreen.style.color =
    DOM.setTimerScreen.style.color =
    DOM.timerScreen.style.color =
      DOM.prefsScreen.style.color;

  // 儲存在localStorage端
  localStorage.setItem("fontPref", fontPref);
  localStorage.setItem("colorPref", colorPref);
  localStorage.setItem("brightPref", DOM.brightnessSlide.valueAsNumber);
  localStorage.setItem("darkModePref", darkColor);
  localStorage.setItem("darkModeCheck", DOM.darkModeCheck.checked);

  d.body.style.backgroundColor = "#000"; // need this for timeout

  togglePrefs();
}

// 取消此次設定，回到上一次的設定
DOM.cancelPrefsButton.addEventListener("click", cancelPrefs);
function cancelPrefs() {
  togglePrefs();
  DOM.prefsScreen.style.color = DOM.stopScreen.style.color;
  DOM.darkModeCheck.checked = true;

  modeButtonIcons.forEach((cl) => (cl.style.stroke = DOM.stopScreen.style.color));
  functionButtonIcons.forEach((cl) => (cl.style.fill = DOM.stopScreen.style.color));
  checkPrefButtons.forEach((cl) => (cl.style.color = DOM.stopScreen.style.color));
  startButtons.forEach((cl) => (cl.style.color = DOM.stopScreen.style.color));
  arrows.forEach((cl) => (cl.style.color = DOM.stopScreen.style.color));
  DOM.darkModeTxt.style.color = DOM.stopScreen.style.color;
}

// 亮度調整
DOM.brightnessSlide.addEventListener("input", function () {
  DOM.prefsScreen.style.color = RGB(colorPref);
  modeButtonIcons.forEach((opacity) => (opacity.style.stroke = RGB(colorPref)));
  functionButtonIcons.forEach(
    (opacity) => (opacity.style.fill = RGB(colorPref))
  );
  checkPrefButtons.forEach((opacity) => (opacity.style.color = RGB(colorPref)));
  startButtons.forEach((opacity) => (opacity.style.color = RGB(colorPref)));
  arrows.forEach((opacity) => (opacity.style.color = RGB(colorPref)));
  DOM.darkModeTxt.style.color = RGB(colorPref);
});

function RGB(color) {
  let colorVals = {
    red: { r: 1, g: 0, b: 0 },
    green: { r: 0, g: 1, b: 0 },
    cyan: { r: 0, g: 1, b: 1 },
    yellow: { r: 1, g: 1, b: 0 },
    white: { r: 1, g: 1, b: 1 },
  };

  let brightness = DOM.brightnessSlide.valueAsNumber;

  return (
    "rgb(" +
    colorVals[color].r * brightness +
    "," +
    colorVals[color].g * brightness +
    "," +
    colorVals[color].b * brightness +
    ")"
  );
}

// ---------------- ** ----------------

/// INIT

let fontPref = localStorage.getItem("fontPref") || "courier";
DOM[fontPref].style.borderColor = "#ddd";

let brightPref = localStorage.getItem("brightPref") || 255;
DOM.brightnessSlide.value = brightPref;

let colorPref = localStorage.getItem("colorPref") || "red";
DOM.prefsScreen.style.color = RGB(colorPref);

let darkModeChecked = localStorage.getItem("darkModeCheck") || false;
let darkColor = localStorage.getItem("darkModePref") || "white";

// buttons.forEach((dkMode) => (dkMode.style.color = RGB(darkColor)));

// 除了Screen外的預設
modeButtonIcons.forEach((dkMode) => (dkMode.style.stroke = RGB(darkColor)));
functionButtonIcons.forEach((dkMode) => (dkMode.style.fill = RGB(darkColor)));
arrows.forEach((dkMode) => (dkMode.style.color = RGB(darkColor)));
startButtons.forEach((dkMode) => (dkMode.style.color = RGB(darkColor)));
checkPrefButtons.forEach((dkMode) => (dkMode.style.color = RGB(darkColor)));
DOM.darkModeTxt.style.color = RGB(darkColor);

let currentMode = "stopScreen"; // 預設為stopScreen

savePrefs();

switch2stopwatch();
