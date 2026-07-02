const API = "https://www.themealdb.com/api/json/v1/1";
const grid = document.getElementById('grid');
const statusText = document.getElementById('statusText');
const statusEl = document.getElementById('status');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const quickTags = document.getElementById('quickTags');
const overlay = document.getElementById('overlay');
const detailContent = document.getElementById('detailContent');

const QUICK = ["Chicken", "Beef", "Pasta", "Dessert", "Vegetarian", "Seafood", "Breakfast"];

function setStatus(text, isError=false){
  statusText.textContent = text;
  statusEl.style.display = 'flex';
  statusText.style.color = isError ? 'var(--rust)' : '';
}

function renderQuickTags(){
  quickTags.innerHTML = QUICK.map(t => `<span class="chip" data-term="${t}">${t}</span>`).join('');
  quickTags.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      searchInput.value = chip.dataset.term;
      doSearch();
    });
  });
}

async function loadCategories(){
  try{
    const res = await fetch(`${API}/list.php?c=list`);
    const data = await res.json();
    const cats = (data.meals || []).map(m => m.strCategory).sort();
    categorySelect.innerHTML = `<option value="">All categories</option>` +
      cats.map(c => `<option value="${c}">${c}</option>`).join('');
  }catch(e){
    console.error('Category load failed', e);
  }
}

function skeletonCards(n=8){
  grid.innerHTML = Array.from({length:n}).map(()=>`
    <div class="skeleton">
      <div class="thumb"></div>
      <div class="line" style="width:40%"></div>
      <div class="line" style="width:75%"></div>
    </div>
  `).join('');
}

async function doSearch(){
  const term = searchInput.value.trim();
  const category = categorySelect.value;
  skeletonCards();
  setStatus('Searching the index…');

  try{
    let meals = [];

    if(category && !term){
      const res = await fetch(`${API}/filter.php?c=${encodeURIComponent(category)}`);
      const data = await res.json();
      meals = data.meals || [];
    } else {
      const res = await fetch(`${API}/search.php?s=${encodeURIComponent(term)}`);
      const data = await res.json();
      meals = data.meals || [];
      if(category){
        meals = meals.filter(m => true); // search.php doesn't return category reliably filtered; fallback below
      }
    }

    if(!meals.length){
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1">No recipes found${term ? ` for “${term}”` : ''}. Try another search term or category.</div>`;
      setStatus('No results.', true);
      return;
    }

    renderResults(meals);
    setStatus(`${meals.length} recipe${meals.length===1?'':'s'} found${term ? ` for “${term}”` : category ? ` in ${category}` : ''}.`);
  }catch(err){
    console.error(err);
    grid.innerHTML = `<div class="error" style="grid-column:1/-1">Couldn't reach the recipe index (${err.message || 'network error'}). If you're viewing this inside a chat preview pane, try opening the downloaded HTML file directly in a browser tab instead.</div>`;
    setStatus('Request failed.', true);
  }
}

function renderResults(meals){
  grid.innerHTML = meals.map((m, i) => `
    <div class="recipe-card" data-id="${m.idMeal}">
      <img class="thumb" src="${m.strMealThumb}" alt="${m.strMeal}" loading="lazy">
      <div class="body">
        <div class="tab-num">FILE #${String(i+1).padStart(3,'0')}</div>
        <h3>${m.strMeal}</h3>
        <div class="meta">
          ${m.strCategory ? `<span>${m.strCategory}</span>` : ''}
          ${m.strArea ? `<span>${m.strArea}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.recipe-card').forEach(card=>{
    card.addEventListener('click', ()=> openDetail(card.dataset.id));
  });
}

async function openDetail(id){
  detailContent.innerHTML = `<div style="padding:60px;text-align:center;font-family:'IBM Plex Mono',monospace;color:var(--ink-soft)">Pulling the recipe card…</div>`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  try{
    const res = await fetch(`${API}/lookup.php?i=${id}`);
    const data = await res.json();
    const m = (data.meals || [])[0];
    if(!m){ throw new Error('Not found'); }

    const ingredients = [];
    for(let i=1; i<=20; i++){
      const ing = m[`strIngredient${i}`];
      const measure = m[`strMeasure${i}`];
      if(ing && ing.trim()){
        ingredients.push({ name: ing.trim(), measure: (measure||'').trim() });
      }
    }

    const steps = (m.strInstructions || '')
      .split(/\r?\n+/)
      .map(s => s.trim())
      .filter(Boolean);

    detailContent.innerHTML = `
      <div class="detail-hero">
        <img src="${m.strMealThumb}" alt="${m.strMeal}">
        <div class="info">
          <button class="close-btn" id="closeBtn">✕</button>
          <h2>${m.strMeal}</h2>
          <div class="meta">
            ${m.strCategory ? `<span>${m.strCategory}</span>` : ''}
            ${m.strArea ? `<span>${m.strArea}</span>` : ''}
          </div>
          ${m.strSource ? `<a class="source-link" href="${m.strSource}" target="_blank" rel="noopener">Original source ↗</a>` : (m.strYoutube ? `<a class="source-link" href="${m.strYoutube}" target="_blank" rel="noopener">Watch on YouTube ↗</a>` : '')}
        </div>
      </div>
      <div class="detail-body">
        <div class="ticket">
          <h4>Ingredients</h4>
          <hr class="rule">
          ${ingredients.map(i => `
            <div class="ingredient-row">
              <span class="name">${i.name}</span>
              <span class="amt">${i.measure || '—'}</span>
            </div>
          `).join('')}
          <div class="total"><span>Items</span><span>${ingredients.length}</span></div>
        </div>
        <div class="instructions">
          <h4>Instructions</h4>
          ${steps.map((s,i) => `
            <div class="step">
              <div class="num">${i+1}</div>
              <p>${s}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('closeBtn').addEventListener('click', closeDetail);
  }catch(err){
    console.error(err);
    detailContent.innerHTML = `<div class="error" style="margin:20px">Couldn't load this recipe. <button class="btn-ghost" id="closeBtn2" style="margin-left:8px">Close</button></div>`;
    document.getElementById('closeBtn2').addEventListener('click', closeDetail);
  }
}

function closeDetail(){
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

overlay.addEventListener('click', (e)=>{
  if(e.target === overlay) closeDetail();
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeDetail();
});

async function loadRandom(){
  skeletonCards(1);
  setStatus('Pulling a random card from the box…');
  try{
    const res = await fetch(`${API}/random.php`);
    const data = await res.json();
    const meal = (data.meals || [])[0];
    if(meal){
      renderResults([meal]);
      setStatus(`Random pick: ${meal.strMeal}.`);
    }
  }catch(err){
    console.error(err);
    grid.innerHTML = `<div class="error" style="grid-column:1/-1">Couldn't reach the recipe index (${err.message || 'network error'}). If you're viewing this inside a chat preview pane, try opening the downloaded HTML file directly in a browser tab instead.</div>`;
    setStatus('Request failed.', true);
  }
}

document.getElementById('searchBtn').addEventListener('click', doSearch);
document.getElementById('randomBtn').addEventListener('click', loadRandom);
searchInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') doSearch(); });
categorySelect.addEventListener('change', ()=>{ if(categorySelect.value) doSearch(); });

renderQuickTags();
loadCategories();
loadRandom();
