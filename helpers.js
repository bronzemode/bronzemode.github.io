const CORS = 'https://cors-anywhere.herokuapp.com/';

const DEFAULT_MIN = 500;

let itemMin = 0;
let itemMax = 0;

const updateSliderRange = () => {
  const filter = document.getElementById('ha-filter');
  filter.min = itemMin;
  filter.max = itemMax;
  document.getElementById('ha-filter-min').innerHTML = `${itemMin}`;
  document.getElementById('ha-filter-max').innerHTML = `${itemMax}`;
}

const updateView = () => {
  const filter = document.getElementById('ha-filter');
  const items = document.getElementById('items').querySelectorAll('img');

  document.getElementById('ha-filter-min').innerHTML = `${filter.value}`;

  for (let item of items) {
    const price = getPrice(item.id);
    if (price >= filter.value) {
      item.style.display = 'inline';
    } else {
      item.style.display = 'none';
    }
  }
}

const createImage = (item) => {
  const img = document.createElement('img');
  const name = getName(item.id);
  img.id = `${item.id}`;
  img.src = `https://www.osrsbox.com/osrsbox-db/items-icons/${item.id}.png`;
  img.title = `${name} (${item.id}) @ ${item.time}`;
  return img;
}

const getPrice = (id) => {
  const data = ITEM_DATA[`${id}`] || { highalch: 0 };
  return parseInt(data['highalch']);
}

const getName = (id) => {
  const data = ITEM_DATA[`${id}`] || { name: 'null' };
  return data['name'];
}

const addImages = (parent, data) => {
  try {
    const items = JSON.parse(data);

    for (let item of items) {
      const price = getPrice(item.id);

      if (price < itemMin) {
        itemMin = price;
      }

      if (price > itemMax) {
        itemMax = price;
      }

      parent.appendChild(createImage(item));
    }
  } catch (err) {
    console.log(err);
    parent.appendChild(document.createTextNode('None!'));
  }
}

const showItems = (callback) => {
  const dataEl = document.getElementById('acc-data');
  const itemsEl = document.getElementById('items');
  const input = dataEl.value;
  
  itemsEl.innerHTML = '';
  
  if (input.startsWith('http')) {
    itemMin = Number.MAX_VALUE;
    itemMax = Number.MIN_VALUE;

    var x = new XMLHttpRequest();
    x.open('GET', CORS + input);
    x.onload = () => {
      addImages(itemsEl, x.responseText);
      updateSliderRange();
      if (callback) {
        callback();
      }
    };
    x.send();

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
  showItems(() => {
    document.getElementById('ha-filter').value = params.has('min') ? params.get('min') : DEFAULT_MIN;
    updateView();
  });
}

document.getElementById('ha-filter').oninput = () => updateView();
