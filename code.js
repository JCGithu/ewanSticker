
let wRatio = 0.10;
let hRatio = 0.16;

let size = 100;

const urlParams = new URLSearchParams(window.location.search);

// WINDOW SETTINGS
let h = window.innerHeight;
let w = window.innerWidth;
let wPercent = w * wRatio;
let hPercent = h * hRatio;

console.log(w,h);

window.addEventListener('resize', () =>{
  h = window.innerHeight;
  w = window.innerWidth;
  wPercent = w * ratio;
  hPercent = h * ratio;
  console.log(w,h);
  document.body.innerHTML = '';
})

//FUNCTION TOOLS
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//TMI.js
let channels = ['letsbrock'];
if (urlParams.get('channel')) channels = [urlParams.get('channel')];
const client = new tmi.Client({
  channels: channels
});
let square = document.getElementById('square');
let flip = true;

// FUNCTIONS
function putStickerOn(){
  let sticker = document.createElement('img');
  let widthPlace = getRandomInt(w - size);
  //if (widthPlace <= size) widthPlace = widthPlace + size;
  let heightPlace = getRandomInt(h - size);

  if (heightPlace >= hPercent && heightPlace <= h - hPercent && widthPlace >= wPercent && widthPlace <= w - wPercent) {
    console.log(heightPlace, widthPlace);
    let whichWay = getRandomInt(2);
    if (flip) {
      heightPlace = getRandomInt(hPercent);
      if (whichWay) heightPlace = heightPlace + (h-(hPercent+size));
    } else {
      widthPlace = getRandomInt(wPercent)
      if (whichWay) widthPlace = widthPlace + (w - (wPercent+size));
    }
    flip = !flip;
  }

  //if (heightPlace <= size) heightPlace = heightPlace + size;
  let rotation = getRandomInt(360);
  let stickerVariant = getRandomInt(stickers);
  let resize = getRandomInt(30) + (size - 20); 
  //sticker.style.transform = `rotate(${rotation}deg)`;
  sticker.style.setProperty('--spin', rotation + 'deg');
  sticker.style.left = widthPlace + 'px';
  sticker.style.top = heightPlace + 'px';
  sticker.style.width = resize + 'px';
  sticker.src = `./Sticker${stickerVariant}.png`;
  document.body.appendChild(sticker);
  setTimeout(()=>{
    sticker.animate([{opacity:1},{opacity:0}], {duration:9000, fill:'forwards'})
  }, 50000)
  setTimeout(()=>{
    document.body.removeChild(sticker)
  }, 60000)
}

//TMI.js TRIGGER
client.on("connected", () => console.log('Reading from Twitch! ✅'));
client.connect();
client.on('message', (channel, tags, message, self) => {
  putStickerOn();
  if (tags['custom-reward-id'] === 'test'){

  }
});

if (urlParams.get('demo')) setInterval(putStickerOn, 1500);
