document.documentElement.style.overflow = "hidden";

document.addEventListener('DOMContentLoaded', () => {
  setupSplitTextAnimation();
  history.scrollRestoration = 'manual'
  window.scrollTo(0, 0);
});

window.onload = function () {
  document.getElementById("loading").classList.toggle("fadeOut");
  document.documentElement.style.overflow = "visible";
  playAnimation();
}

// デバッグ用
// setTimeout(() => {
//   document.getElementById("loading").classList.toggle("fadeOut");
//   document.documentElement.style.overflow = "visible";
//   playSplitTextAnimation();
// }, 1000); // 3000ミリ秒後に発火

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

function playAnimation() {
  const targets = document.querySelectorAll(".playAnimation");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-animated'); 
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -10% 0px"
  });

  targets.forEach((target) => observer.observe(target));
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

function setupSplitTextAnimation() {
  const targets = document.querySelectorAll(".splitTextAnimation");
  
  targets.forEach((target) => {
    const textContent = target.innerText;
    target.textContent = '';

    textContent.split('').forEach((char, index) => {
      if (char === '\n') {
        const br = document.createElement('br');
        target.appendChild(br);
        return; 
      }

      const span = document.createElement('span');
      span.innerText = char === ' ' ? '\u00A0' : char; 
      span.style.setProperty('--delay', index); 
      span.classList.add('char');
      target.appendChild(span);
    });
  });
}

async function getInitialToken() {
  const url = 'https://thebase.in';
  
  // application/x-www-form-urlencoded 形式で送信するパラメータ
  const params = new URLSearchParams({
    grant_type: 'authorization_code', // 固定
    client_id: '741721a812a0b703d066efdfd0923d67',
    client_secret: '3be3fb6ec3fc5f73a18f71ac0ba31830',
    code: '0191c22e1b7c0df0dcf8cd5f8706a673', 
    redirect_uri: 'https://tamisama.ik-aqua.workers.dev/shop'
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    console.log(data);
    // 【重要】ここで返ってくる access_token と refresh_token をデータベース等に安全に保存します
  } catch (error) {
    console.error('トークン取得エラー:', error);
  }
}
