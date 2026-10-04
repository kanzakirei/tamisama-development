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
// 【重要】PowerShellで取得した access_token 
const ACCESS_TOKEN = '4d039fcba7b480afd2a84a0cfd86a5c2';

document.getElementById('fetch-btn').addEventListener('click', async () => {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '読み込み中...';

  // ⭕️ 正しいBASE APIのURLに修正し、頭にCORS回避用プロキシを付与
  const baseApiUrl = 'https://thebase.in';
  const url = 'https://eu.org' + baseApiUrl;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTPエラー! ステータス: ${response.status}`);
    }

    const data = await response.json();
    resultDiv.innerHTML = ''; // クリア

    if (!data.items || data.items.length === 0) {
      resultDiv.innerHTML = '<p>商品が見つかりませんでした。</p>';
      return;
    }

    // 商品一覧をループ処理して画面に表示
    data.items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'item-card';

      // 画像URLの取得（一番最初の画像。BASEは構造によって仕様が異なる場合があるためフォールバックを用意）
      const imgUrl = item.image_url_1 || item.image_url || 'https://placeholder.com';

      card.innerHTML = `
        <img src="${imgUrl}" alt="${item.title}" style="max-width:100%; height:150px; object-fit:cover; border-radius:4px;">
        <div class="item-title" style="font-weight:bold; margin:10px 0 5px 0; font-size:14px;">${item.title}</div>
        <div class="item-price" style="color:#d9534f; font-size:16px; font-weight:bold;">¥${Number(item.price).toLocaleString()}</div>
        <div class="item-stock" style="font-size:12px; color:#666; margin-top:5px;">在庫: ${item.stock || '0'}</div>
      `;
      resultDiv.appendChild(card);
    });

  } catch (error) {
    console.error('エラー詳細:', error);
    resultDiv.innerHTML = `<p class="error">取得失敗: ${error.message}<br>※トークンの期限切れ（1時間）の可能性があります。</p>`;
  }
});