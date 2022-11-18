let body = document.body;

let h = window.innerHeight;
let w = window.innerWidth;

console.log(w,h);

window.addEventListener('resize', () =>{
  h = window.innerHeight;
  w = window.innerWidth;
  console.log(w,h);
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let channels = ['letsbrock'];
const client = new tmi.Client({
  channels: channels
});
let square = document.getElementById('square');
let size = 100;

let stickers = 3;

function putStickerOn(){
  let sticker = document.createElement('img');
  let widthPlace = getRandomInt(w - size);
  //if (widthPlace <= size) widthPlace = widthPlace + size;
  let heightPlace = getRandomInt(h - size);
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

client.on("connected", () => console.log('Reading from Twitch! ✅'));
client.connect();
client.on('message', (channel, tags, message, self) => {
  putStickerOn();
  if (tags['custom-reward-id'] === 'test'){

  }
});