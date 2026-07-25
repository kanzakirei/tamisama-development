document.documentElement.style.overflow = "hidden";

window.onload = function () {
  document.getElementById("loading").classList.toggle("fadeOut");
  document.documentElement.style.overflow = "visible";
}

function request(_endPoint, _json, _onSuccessed = null, _onErrored = null) {
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  const request = new Request(_endPoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: headers,
    body: _json
  });
  fetch(request)
    .then(response => {
      if (_onSuccessed != null) _onSuccessed(response);
    })
    .catch(error => {
      if (_onErrored != null) _onErrored(error);
    });
}

function onClickedContactButton() {
  const nameForm = document.getElementById("nameForm");
  const messageForm = document.getElementById("messageForm");

  if (nameForm && nameForm.value && messageForm && messageForm.value) {
    document.getElementById('formWrapper').style.display = 'none';
    document.getElementById('waitMessage').style.display = 'block';

    var api = "https://script.google.com/macros/s/AKfycbwyoAxPpNTmtEjGvoYi5qdz4cu8SvUfJpWAmhe-wSGQHCWK-kFSmn2UddnrUdbdo4yO/exec";
    var json = JSON.stringify({ name: nameForm.value, message: messageForm.value });
    request(api, json, function (json) {
      document.getElementById('waitMessage').style.display = 'none';
      document.getElementById('thxMessage').style.display = 'block';
    });
  }
}

function onClickedNavigationButton(element) {
  element.classList.toggle("active");
  let navigation = document.getElementById("navigation");
  if (navigation.classList.length > 0) {
    navigation.classList.toggle("fadeIn");
    navigation.classList.toggle("fadeOut");
  }
  else {
    navigation.classList.add("fadeIn");
  }
}

function textSplitAnimation() {
  const textContainer = document.querySelector('.splitTextAnimation');
  const textContent = textContainer.textContent;
  textContainer.textContent = ''; // 一度テキストを空にする
  textContent.split('').forEach((char, index) => {
    const span = document.createElement('span');
    // 空白文字が消えないように処理
    span.textContent = char === ' ' ? '\u00A0' : char; 
    span.style.animationDelay = `${index * 0.08}s`; 
    textContainer.appendChild(span);
  });
}
textSplitAnimation();