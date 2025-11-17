// script.js — для Лабораторної №4
// Підключити у кожному HTML перед закриваючим </body>:
// <script src="script.js"></script>

// Вибрані значення X та Y для "Увага!":
const ATTENTION_INTERVAL_MS = 5000; // X = 5 секунд (як приклад)
const ATTENTION_VISIBLE_MS = 2000;  // Y = 2 секунди (як приклад)

/* ---------- 1) ВИПАДАЮЧЕ ПІДМЕНЮ (на головній сторінці) ---------- */
function initDropdownOnMain() {
  // знаходимо кнопку/посилання "Новини культури" у nav на головній сторінці
  const cultureBtn = document.querySelector('body.main-page nav a[data-dropdown="culture"]');
  if (!cultureBtn) return;

  // батьківський li
  const li = cultureBtn.closest('li');
  if (!li) return;

  // обробник кліку: переключає клас open у li
  cultureBtn.addEventListener('click', function (e) {
    e.preventDefault(); // не переходимо по посиланню
    li.classList.toggle('open');
  });

  // закрити підменю при кліку поза ним
  document.addEventListener('click', function (e) {
    if (!li.contains(e.target)) {
      li.classList.remove('open');
    }
  });

  // доступність: закриття по Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') li.classList.remove('open');
  });
}

/* ---------- 2) ПОШУК НОВИН НА СТОРІНЦІ culture.html ---------- */
function initCultureSearch() {
  const searchInput = document.querySelector('.culture-search input[type="text"]');
  const searchBtn = document.querySelector('.culture-search button');
  const articles = Array.from(document.querySelectorAll('body.culture-page main article'));

  if (!searchInput || !searchBtn || !articles.length) return;

  function performSearch() {
    const q = searchInput.value.trim().toLowerCase();
    articles.forEach(article => {
      const titleEl = article.querySelector('h3');
      const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
      if (!q || titleText.includes(q)) {
        article.style.display = ''; // показати
      } else {
        article.style.display = 'none'; // сховати
      }
    });
  }

  // пошук по натисканню кнопки
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch();
  });

  // і додатково live-пошук під Enter
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });
}

/* ---------- 3) "Увага!" для суспільно важливої новини ---------- */
function initAttentionMarkers() {
  // знаходимо всі статті, що мають data-important="true"
  const importantArticles = Array.from(document.querySelectorAll('body.culture-page main article[data-important="true"]'));
  if (!importantArticles.length) return;

  importantArticles.forEach(article => {
    // знаходимо заголовок і wrapper
    let title = article.querySelector('h3');
    if (!title) return;

    // створюємо span.attention якщо немає
    const wrapper = document.createElement('span');
    wrapper.className = 'culture-title-wrapper';

    // переміщаємо title всередину wrapper
    title.parentNode.insertBefore(wrapper, title);
    wrapper.appendChild(title);

    // створюємо span attention
    const att = document.createElement('span');
    att.className = 'attention';
    att.textContent = 'Увага!';

    wrapper.appendChild(att);

    // функція, яка показує увагу на Y мс
    function showAttention() {
      att.classList.add('visible');
      setTimeout(() => {
        att.classList.remove('visible');
      }, ATTENTION_VISIBLE_MS);
    }

    // періодичний показ кожні X мс
    setInterval(() => {
      showAttention();
    }, ATTENTION_INTERVAL_MS);
  });
}

/* ---------- 4) Tooltip і зміна textarea на сторінці feedback.html ---------- */
function initFeedbackTooltip() {
  const wrapper = document.querySelector('.feedback-textarea-wrapper');
  if (!wrapper) return;
  const textarea = wrapper.querySelector('textarea');
  const tooltip = wrapper.querySelector('.feedback-tooltip');

  if (!textarea || !tooltip) return;

  // наводимо мишкою — додаємо клас, який змінює фон/рамку і показує tooltip
  textarea.addEventListener('mouseenter', () => wrapper.classList.add('active'));
  textarea.addEventListener('focus', () => wrapper.classList.add('active'));

  textarea.addEventListener('mouseleave', () => {
    if (document.activeElement !== textarea) wrapper.classList.remove('active');
  });
  textarea.addEventListener('blur', () => wrapper.classList.remove('active'));
}

/* ---------- 5) Ініціалізація всього при DOMContentLoaded ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initDropdownOnMain();
  initCultureSearch();
  initAttentionMarkers();
  initFeedbackTooltip();

  // невеликий поліс: якщо користувач на головній і має малий екран, робимо додаткові класи (CSS обробить)
  // (ці дії не є необхідними, бо CSS media query працює за розміром viewport)
});
