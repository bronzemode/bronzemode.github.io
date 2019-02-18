const createImage = (item) => {
  const img = document.createElement('img');
  img.src = `https://www.osrsbox.com/osrsbox-db/items-icons/${item.id}.png`;
  img.title = `${item.id} @ ${item.time}`;
  return img;
}

const addImages = (parent, data) => {
  try {
    const items = JSON.parse(data);
    for (let item of items) {
      parent.appendChild(createImage(item));
    }
  } catch (_) {
    parent.appendChild(document.createTextNode('None!'));
  }
}

const showItems = () => {
  const dataEl = document.getElementById('acc-data');
  const itemsEl = document.getElementById('items');
  const input = dataEl.value;
  
  itemsEl.innerHTML = '';
  
  if (input.startsWith('http')) {
    fetch(input)
      .then(res => res.text())
      .then(res => addImages(itemsEl, res));
  } else {
    addImages(itemsEl, input);
  }
};

const params = window.location.search
  .substring(1)
  .split('&')
  .map(v => v.split('='))
  .reduce((map, [key, value]) => map.set(key, decodeURIComponent(value)), new Map()); 

if (params.has('data')) {
  let data = params.get('data');
  if (!data.startsWith('http') && !data.startsWith('[') && !data.startsWith('{')) {
    data = 'https://hastebin.com/raw/' + data;
  }
  document.getElementById('acc-data').value = data;
  showItems();
}
