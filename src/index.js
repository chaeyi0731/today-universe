// app.js
function component(elementNode, attributes, children) {
  let elementStr = `<${elementNode}`;
  for (let key in attributes) {
    elementStr += ` ${key}="${attributes[key]}"`;
  }
  elementStr += '>';
  if (children) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        elementStr += child;
      } else {
        elementStr += component(child.elementNode, child.attributes, child.children);
      }
    });
  }
  elementStr += `</${elementNode}>`;
  return elementStr;
}

window.addEventListener('hashchange', () => {
  const contentDiv = document.getElementById('root');
  const hash = window.location.hash.substr(1);

  switch (hash) {
    case 'page1':
      contentDiv.innerHTML = component('h1', {}, ['오늘의 천문학', component('button', { onclick: 'changePage("page2")' }, ['시작하기'])]);
      break;
    case 'page2':
      contentDiv.innerHTML = component('div', {}, [
        component('h1', {}, ['오늘의 천문학']),
        component('input', { type: 'date' }),
        component('button', { onclick: 'fetchData()' }, ['데이터 가져오기']),
        component('div', { id: 'result' })
      ]);
      break;
    default:
      contentDiv.innerHTML = component('h1', {}, [
        '반갑습니다. 접속할 때 보이는 페이지(처럼보이는) element입니다.',
  ])}
});

// 초기 페이지 설정
window.location.hash = 'page1';

// 페이지 전환 함수
function changePage(page) {
  window.location.hash = page;
}

function fetchData() {
  // NASA API 키
  const apiKey = 'kPaqXTtaN1YmenxQ6wEdzTovcXk8iv7fa7EMS9c8';
  // 오늘의 날짜를 가져오는 코드 (현재 날짜를 사용)
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const currentDate = `${year}-${month}-${day}`;

  // NASA API 주소
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;

  // API 호출
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = component('div', {}, [
        component('h2', {}, [data.title]),
        component('p', {}, [data.date]),
        component('p', {}, [data.explanation]),
        component('img', { src: data.url, alt: data.title })
      ]);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = '데이터를 가져오는 중 오류가 발생했습니다.';
    });
  }
