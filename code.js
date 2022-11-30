// VARIABLES FOR YOU!

// GUTTER SIZE, this is the percentage of the sides the stickers can take up. So currently 5% width either side.
let wRatio = 0.05;
let hRatio = 0.12;

//Number of Stickers currently. Don't need to update this too much, it'll search for new ones on loading.
let stickers = 10;

// The max size of stickers, and the amount they can shrink by (applied randomly).
let size = 200;
let sizeVariance = 50;

// Sticker limit and the time before they fade in mins.
let mins = 10;
let limit = 1000;

// All the rest can be left for now

let big3 = ['elliotisacoolguy', 'lbx0', 'kickthepj', 'coollike'];
let big3logged = []; 

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('limit')) limit = parseInt(urlParams.get('limit'));
if (urlParams.get('mins')) mins = parseInt(urlParams.get('mins'));
let stickerCount = 0;

let leftPlace = 0, rightPlace = 0, topPlace = 0, bottomPlace = 0, noPlace = 0;

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

function inRange(x, min, max){
  return x >= min && x <= max;
}

//TMI.js
let channels = ['letsbrock'];
if (urlParams.get('channel')) channels = [urlParams.get('channel')];
const client = new tmi.Client({
  channels: channels
});
let square = document.getElementById('square');

// FUNCTIONS
function putStickerOn(settings){
  let sticker = document.createElement('img');
  
  // PLACEMENT
  let resize = getRandomInt(sizeVariance) + (size - sizeVariance); 
  let imgCenter = resize / 2;

  let widthPlace = getRandomInt(w) - imgCenter;
  let heightPlace = getRandomInt(h) - imgCenter;

  let minH = hPercent - imgCenter;
  let maxH = h - hPercent - imgCenter;
  let minW = wPercent - imgCenter;
  let maxW = w - wPercent - imgCenter;

  if (inRange(heightPlace, minH, maxH) && inRange(widthPlace, minW, maxW) ) {
    let flip = getRandomInt(2);
    let pickDirection = getRandomInt(2);

    if (flip) {
      // MOVE VERTICALLY
      let withinHrange = getRandomInt(hPercent);
      if (pickDirection) {
        //BOTTOM
        bottomPlace++
        heightPlace = h - withinHrange - imgCenter;
      } else {
        //TOP
        topPlace++
        heightPlace = withinHrange - imgCenter;
      };
    } else {
      // MOVE HORIZONTALLY
      let withinWRange = getRandomInt(wPercent);
      if (pickDirection) {
        // RIGHT
        rightPlace++
        widthPlace = w - withinWRange - imgCenter;
      } else {
        //LEFT
        leftPlace++
        widthPlace = withinWRange - imgCenter;
      }
    }
  }

  //RANDOM
  let rotation = getRandomInt(360);
  let stickerVariant = getRandomInt(stickers);


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
    sticker.animate([{opacity:1},{opacity:0}], {duration:3000, fill:'forwards'})
  }, (55000 * mins))
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
    //putStickerOn({shiny: false, tags: tags});
  }
  if (tags.badges.broadcaster || tags.badges.moderator ){
    if (message === '!addSticker') putStickerOn({shiny: false, tags: tags});
  }
});

if (urlParams.get('demo')) {
  setInterval(()=>{
    //let shinyMaybe = getRandomInt(4);
    //shinyMaybe = !shinyMaybe;
    putStickerOn({shiny:false, tags:{username:null}});
  }, 200);
};

const StreamerBot = new WebSocket("ws://localhost:8080/");
StreamerBot.onopen = () => {
  console.log("Connected to StreamerBot");
  let Subscribe = {
    request: "Subscribe",
    events: {
      Twitch: ["Follow", "Cheer", "Sub", "Resub", "GiftSub", "GiftBomb", "RewardRedemption"],
    },
    id: "123",
  };
  StreamerBot.send(JSON.stringify(Subscribe));
  StreamerBot.onmessage = async (data) => {
    data = JSON.parse(data.data).data;
    console.log(data);
    if (!data) return;
    if (data.rewardId === "697b3a57-f063-4125-a453-d44f08ecab4a") {
      console.log("REDEEMED!");
      putStickerOn({shiny:false, tags:{}});
    }
  };
};

// CHECK FOR NEW STICKERS
var url = window.location.href;
function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return (http.status != 404);
}
