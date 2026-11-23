(async () => {
  const info = await window.aboutApi.getInfo();
  document.title = `About ${info.product}`;
  document.getElementById('product').textContent = info.product;
  document.getElementById('version').textContent = `Version ${info.version}`;
  document.getElementById('description').textContent = info.description;
  document.getElementById('copyright').textContent = info.copyright;

  const list = document.getElementById('links');
  for (const l of info.links) {
    const a = document.createElement('a');
    a.href = l.url;
    a.textContent = l.label;
    a.addEventListener('click', (e) => { e.preventDefault(); window.aboutApi.openLink(l.url); });
    const li = document.createElement('li');
    li.appendChild(a);
    list.appendChild(li);
  }

  const copy = document.getElementById('copy');
  copy.addEventListener('click', async () => {
    await window.aboutApi.copyDetails();
    copy.textContent = 'Copied';
  });
  document.getElementById('close').addEventListener('click', () => window.aboutApi.close());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.aboutApi.close(); });
})();
