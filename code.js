
let wRatio = 0.04;
let hRatio = 0.055;

let size = 190;
let mins = 5;

let big3 = ['elliotisacoolguy', 'lbx0', 'kickthepj', 'coollike'];
let big3logged = []; 

const urlParams = new URLSearchParams(window.location.search);
let limit = 1000;
if (urlParams.get('limit')) limit = parseInt(urlParams.get('limit'));
if (urlParams.get('mins')) mins = parseInt(urlParams.get('mins'));
let stickerCount = 0;

// WINDOW SETTINGS
let h = window.innerHeight;
let w = window.innerWidth;
let wPercent = w * wRatio;
let hPercent = h * hRatio;

console.log(w,h);

window.addEventListener('resize', () =>{
  h = window.innerHeight;
  w = window.innerWidth;
  wPercent = w * wRatio;
  hPercent = h * hRatio;
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
function putStickerOn(settings){
  let sticker = document.createElement('img');
  
  // PLACEMENT
  let widthPlace = getRandomInt(w);
  let heightPlace = getRandomInt(h);
  if (!settings.shiny) {
    widthPlace = widthPlace - (size/1.5);
    heightPlace = heightPlace - (size/1.5);
  }
  if (heightPlace >= hPercent && heightPlace <= h - hPercent && widthPlace >= wPercent && widthPlace <= w - wPercent) {
    let whichWay = getRandomInt(2);
    if (flip) {
      heightPlace = getRandomInt(hPercent);
      if (whichWay) heightPlace = heightPlace + (h - hPercent - (size/1.5));
    } else {
      widthPlace = getRandomInt(wPercent)
      if (whichWay) widthPlace = widthPlace + (w - wPercent  - (size/1.5));
    }
    flip = !flip;
  }

  //RANDOM
  let rotation = getRandomInt(360);
  let stickerVariant = getRandomInt(stickers);
  let resize = getRandomInt(60) + (size - 20); 

  //SETTINGS
  sticker.style.setProperty('--spin', rotation + 'deg');
  sticker.style.left = widthPlace + 'px';
  sticker.style.top = heightPlace + 'px';
  sticker.style.width = resize + 'px';
  sticker.style.zIndex = 1;
  sticker.src = `./stickers/Sticker${stickerVariant}.png`;
  if (settings.shiny){
    sticker.style.zIndex = 10;
    sticker.style.filter = "brightness(1.5) contrast(1.5) drop-shadow(0 0 0.5em gold)";
  }

  document.body.appendChild(sticker);
  stickerCount++;
  if (stickerCount > limit){
    let StickList = document.body.getElementsByTagName('img');
    document.body.removeChild(StickList[0]);
  }
  //BIG 3 FINAL STICKER
  if (big3logged.length === big3.length){
    
  }
  setTimeout(()=>{
    if (!document.body.contains(sticker)) return;
    sticker.animate([{opacity:1},{opacity:0}], {duration:9000, fill:'forwards'})
  }, (50000 * mins))
  setTimeout(()=>{
    if (!document.body.contains(sticker)) return;
    document.body.removeChild(sticker)
  }, (60000 * mins))
}

//TMI.js TRIGGER
client.on("connected", () => console.log('Reading from Twitch! ✅'));
client.connect();
client.on('message', (channel, tags, message, self) => {
  if (tags['custom-reward-id'] === '697b3a57-f063-4125-a453-d44f08ecab4a'){
    console.log('Sticker redeemed by ' + tags.username);
    putStickerOn({shiny: false, tags: tags});
  }
});

if (urlParams.get('demo')) {
  setInterval(()=>{
    //let shinyMaybe = getRandomInt(4);
    //shinyMaybe = !shinyMaybe;
    putStickerOn({shiny:false, tags:{username:null}})
  }, 1000);
};
