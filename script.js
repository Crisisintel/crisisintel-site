(function(){
        if(!document.getElementById('leaflet-css')){
          var lc=document.createElement('link');
          lc.id='leaflet-css'; lc.rel='stylesheet';
          lc.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(lc);
        }
        function initShipMap(){
          if(typeof L==='undefined'){
            var ls=document.createElement('script');
            ls.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            ls.onload=buildMap; document.head.appendChild(ls);
          } else { buildMap(); }
        }

        function buildMap(){
          var map = L.map('shipmap',{
            zoomControl:true,
            scrollWheelZoom:false,
            minZoom:2, maxZoom:10
          }).setView([20, 30], 2);

          // Dark tile layer
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
            maxZoom:19,
            attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>'
          }).addTo(map);

          // OpenSeaMap nautical overlay
          L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png',{
            maxZoom:18, opacity:0.5
          }).addTo(map);

          // ── SHIPPING LANES (polylines) ──
          var laneStyle   = {color:'#ff6633', weight:2, opacity:0.55, dashArray:'6,4'};
          var altStyle    = {color:'#a259ff', weight:2, opacity:0.45, dashArray:'4,6'};
          var lngStyle    = {color:'#00c8ff', weight:1.5, opacity:0.45, dashArray:'3,5'};

          // Persian Gulf → Hormuz → Arabian Sea → Red Sea → Suez → Med → Europe
          L.polyline([
            [26.0,52.5],[26.5,56.5],[15.0,52.0],[12.5,43.3],[28.0,33.0],[30.5,32.3],
            [33.0,28.0],[36.5,14.0],[38.5,10.0],[43.0,10.0],[51.5,0.5],[51.0,-1.0]
          ], laneStyle).addTo(map).bindTooltip('Main Oil Route: Persian Gulf → Suez → Europe',{sticky:true});

          // Persian Gulf → Hormuz → Indian Ocean → Malacca → Asia
          L.polyline([
            [26.5,56.5],[20.0,65.0],[10.0,70.0],[1.5,80.0],[1.5,103.8],[14.0,108.0],
            [22.5,114.0],[31.0,122.0]
          ], laneStyle).addTo(map).bindTooltip('Oil Route: Hormuz → Malacca → China/Asia',{sticky:true});

          // Cape of Good Hope alternative (avoid Red Sea/Suez)
          L.polyline([
            [51.0,-1.0],[43.0,10.0],[15.0,18.0],[-10.0,13.0],[-34.5,18.5],
            [-20.0,35.0],[-5.0,45.0],[12.5,43.3]
          ], altStyle).addTo(map).bindTooltip('Alternative: Cape of Good Hope (avoid Red Sea)',{sticky:true});

          // US Gulf → Atlantic → Europe
          L.polyline([
            [29.0,-90.0],[30.0,-88.0],[25.0,-80.0],[38.0,-30.0],[51.0,-1.0]
          ], laneStyle).addTo(map).bindTooltip('US LNG / Oil: Gulf of Mexico → Atlantic → Europe',{sticky:true});

          // Panama Canal route: US West Coast → Panama → Atlantic
          L.polyline([
            [37.0,-122.0],[20.0,-108.0],[9.0,-79.6],[12.0,-70.0],[20.0,-65.0],[25.0,-80.0]
          ], laneStyle).addTo(map).bindTooltip('Americas Route: Pacific → Panama Canal → Atlantic',{sticky:true});

          // Qatar LNG → Asia (via Malacca)
          L.polyline([
            [25.3,51.5],[20.0,62.0],[10.0,70.0],[1.5,103.8],[22.5,114.0],[31.0,122.0],[35.6,139.7]
          ], lngStyle).addTo(map).bindTooltip('Qatar LNG → Japan/Korea/China',{sticky:true});

          // Russia Baltic → Europe
          L.polyline([
            [60.0,28.0],[57.5,21.0],[57.5,10.5],[53.5,8.0],[51.9,4.5],[51.0,-1.0]
          ], {color:'#ff4444',weight:1.5,opacity:0.4,dashArray:'4,6'}).addTo(map)
            .bindTooltip('Russia Baltic Oil / LNG → NW Europe',{sticky:true});

          // Lombok alternative to Malacca (deep water, VLCCs)
          L.polyline([
            [1.5,103.8],[-6.0,108.0],[-8.5,115.7],[-10.0,120.0],[1.5,125.0],[14.0,108.0]
          ], altStyle).addTo(map).bindTooltip('Lombok Strait — VLCC Alternative to Malacca',{sticky:true});

          // ── CHOKEPOINTS ──
          var points = [
            {name:'Strait of Hormuz',lat:26.5,lng:56.5,risk:'HIGH',
             detail:'~20% global oil + 30% global LNG transits daily.<br>Iran closure threat during US-Iran tensions.',
             flow:'17–21M bbl/day'},
            {name:'Bab el-Mandeb (Red Sea)',lat:12.5,lng:43.3,risk:'HIGH',
             detail:'Houthi attacks ongoing since Oct 2023.<br>Major carriers diverted to Cape of Good Hope.<br>Transit volume down ~42%.',
             flow:'~6M bbl/day (reduced)'},
            {name:'Suez Canal',lat:30.5,lng:32.3,risk:'MEDIUM',
             detail:'Transits down ~40% due to Red Sea crisis.<br>Egypt revenue loss ~$1B/month.<br>Canal deepening ongoing.',
             flow:'~5M bbl/day equiv'},
            {name:'Strait of Malacca',lat:1.5,lng:103.8,risk:'MEDIUM',
             detail:'~40% global trade, ~80% China oil imports.<br>Piracy declining. Depth limits VLCCs.<br>Lombok/Sunda used as alternatives.',
             flow:'~16M bbl/day'},
            {name:'Bosphorus Strait',lat:41.1,lng:29.0,risk:'MEDIUM',
             detail:'Turkey controls access (Montreux Convention).<br>Russian Black Sea oil exports reduced post-sanctions.<br>Transit delays reported.',
             flow:'~3M bbl/day'},
            {name:'Panama Canal',lat:9.0,lng:-79.6,risk:'MEDIUM',
             detail:'2024 drought reduced transits by 36%.<br>LNG tanker backlogs. US-Asia LNG delays.<br>New lanes added but drought risk persists.',
             flow:'~800K bbl/day equiv'},
            {name:'Strait of Dover',lat:51.0,lng:1.5,risk:'LOW',
             detail:'Busiest shipping lane in the world.<br>~500 vessels/day. Post-Brexit frictions manageable.<br>UK-EU energy imports stable.',
             flow:'~2M bbl/day equiv'},
            {name:'Lombok Strait',lat:-8.5,lng:115.7,risk:'LOW',
             detail:'Primary alternative to Malacca for VLCCs.<br>Deep water allows largest tankers.<br>Indonesia waters — politically stable.',
             flow:'~3M bbl/day (VLCC)'},
            {name:'Cape of Good Hope',lat:-34.5,lng:18.5,risk:'LOW',
             detail:'Main alternative to Suez/Red Sea.<br>Adds ~14 days + $1M+ extra fuel per voyage.<br>Port congestion at Durban increasing.',
             flow:'Rerouted (surge)'},
            {name:'Gulf of Guinea',lat:3.0,lng:3.0,risk:'MEDIUM',
             detail:'Nigeria + Angola oil export hub.<br>Piracy activity elevated in Nigerian waters.<br>Offshore FPSO security incidents reported.',
             flow:'~4M bbl/day (regional)'},
            {name:'Arctic Northern Sea Route',lat:74.0,lng:90.0,risk:'LOW',
             detail:'Russia controls access. Seasonal route (summer).<br>LNG tankers from Yamal terminal.<br>Sanctions limiting Western participation.',
             flow:'~30M tons/year LNG'},
          ];

          points.forEach(function(p){
            var color = p.risk==='HIGH' ? '#ff4444' : p.risk==='MEDIUM' ? '#ffaa00' : '#00ffa6';
            var size  = p.risk==='HIGH' ? 14 : p.risk==='MEDIUM' ? 11 : 9;
            var icon = L.divIcon({
              className:'',
              html:'<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+color+';border:2px solid rgba(255,255,255,0.7);box-shadow:0 0 10px '+color+',0 0 20px '+color+'44;cursor:pointer;"></div>',
              iconSize:[size,size], iconAnchor:[size/2,size/2]
            });
            L.marker([p.lat,p.lng],{icon:icon}).addTo(map).bindPopup(
              '<div style="min-width:200px;font-family:Arial;background:#0c0c0c;color:#ccc;border:1px solid #2a2a2a;border-radius:8px;padding:12px;">' +
              '<div style="color:'+color+';font-weight:bold;font-size:13px;margin-bottom:6px;">🚢 '+p.name+'</div>' +
              '<div style="background:'+color+'22;border:1px solid '+color+'44;border-radius:4px;padding:3px 8px;display:inline-block;font-size:10px;color:'+color+';font-weight:bold;margin-bottom:8px;">'+p.risk+' RISK</div>' +
              '<div style="font-size:11px;color:#888;line-height:1.6;">'+p.detail+'</div>' +
              '<div style="margin-top:8px;padding-top:8px;border-top:1px solid #1a1a1a;font-size:10px;color:#555;">⚡ Flow: <span style="color:#aaa;">'+p.flow+'</span></div>' +
              '</div>',
              {maxWidth:260, className:'dark-popup'}
            );
          });
        }

        if(document.readyState==='loading'){
          document.addEventListener('DOMContentLoaded',initShipMap);
        } else { setTimeout(initShipMap,100); }
      })();



// ═══════════════════════════════════════
// CIRCUIT / PARTICLE BACKGROUND
// ═══════════════════════════════════════
(function(){
  const canvas = document.getElementById('circuitCanvas');
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles / nodes
  const particles = [];
  const COUNT = 55;
  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      vx: (Math.random()-0.5)*0.3,
      vy: (Math.random()-0.5)*0.3,
      r: Math.random()*2+0.5,
      pulse: Math.random()*Math.PI*2
    });
  }

  // Energy pulses along connections
  const pulses = [];
  function spawnPulse(p1,p2){
    pulses.push({x:p1.x,y:p1.y,tx:p2.x,ty:p2.y,t:0,speed:0.008+Math.random()*0.012});
  }

  let lastPulse = 0;

  function draw(ts){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Spawn pulses occasionally
    if(ts-lastPulse > 700){
      const i = Math.floor(Math.random()*particles.length);
      const j = Math.floor(Math.random()*particles.length);
      if(i!==j) spawnPulse(particles[i],particles[j]);
      lastPulse = ts;
    }

    // Move particles
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.pulse += 0.03;
      if(p.x<0||p.x>canvas.width) p.vx*=-1;
      if(p.y<0||p.y>canvas.height) p.vy*=-1;
    });

    // Draw connections
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x;
        const dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<150){
          const alpha=(1-dist/150)*0.12;
          ctx.strokeStyle=`rgba(0,255,166,${alpha})`;
          ctx.lineWidth=0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    particles.forEach(p=>{
      const glow = 0.4+0.4*Math.sin(p.pulse);
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,166,${glow})`;
      ctx.fill();
    });

    // Draw pulses
    for(let i=pulses.length-1;i>=0;i--){
      const pulse=pulses[i];
      pulse.t+=pulse.speed;
      if(pulse.t>=1){ pulses.splice(i,1); continue; }
      const cx=pulse.x+(pulse.tx-pulse.x)*pulse.t;
      const cy=pulse.y+(pulse.ty-pulse.y)*pulse.t;
      ctx.beginPath();
      ctx.arc(cx,cy,2.5,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,166,${1-pulse.t})`;
      ctx.fill();
      // Trail
      ctx.beginPath();
      ctx.arc(cx,cy,5,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,166,${(1-pulse.t)*0.2})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();


// ═══════════════════════════════════════
// HERO CANVAS — PRICE WAVEFORM
// ═══════════════════════════════════════
(function(){
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width = canvas.offsetWidth || window.innerWidth;
    canvas.height = canvas.offsetHeight || 500;
  }
  resize();
  window.addEventListener('resize', resize);

  let t = 0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const W=canvas.width, H=canvas.height;

    // Draw multiple sine waves like a market chart
    const waves = [
      {amp:18,freq:0.012,speed:0.4,color:'rgba(0,255,166,0.12)',lw:1.5},
      {amp:10,freq:0.022,speed:0.7,color:'rgba(0,255,166,0.07)',lw:1},
      {amp:25,freq:0.007,speed:0.2,color:'rgba(162,89,255,0.06)',lw:1.5},
    ];

    waves.forEach(w=>{
      ctx.beginPath();
      ctx.strokeStyle=w.color;
      ctx.lineWidth=w.lw;
      for(let x=0;x<=W;x+=2){
        const y = H*0.5 + Math.sin(x*w.freq + t*w.speed)*w.amp
                        + Math.sin(x*w.freq*2.1 + t*w.speed*1.3)*w.amp*0.4;
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.stroke();
    });

    t+=0.6;
    requestAnimationFrame(draw);
  }
  draw();
})();


// ═══════════════════════════════════════
// NODE CANVAS — DATA FLOW BETWEEN PANELS
// ═══════════════════════════════════════
(function(){
  const canvas = document.getElementById('nodeCanvas');
  const ctx = canvas.getContext('2d');

  function resize(){
    canvas.width = canvas.offsetWidth || 800;
    canvas.height = 120;
  }
  resize();
  window.addEventListener('resize', resize);

  // Flowing data packets
  const NODES = 8;
  const nodes = Array.from({length:NODES},(_,i)=>({
    x: (canvas.width/(NODES-1))*i,
    y: 60 + Math.sin(i*0.8)*20
  }));

  const packets = [];
  for(let i=0;i<6;i++){
    packets.push({seg:i%( NODES-1),t:Math.random(),speed:0.004+Math.random()*0.006});
  }

  // Labels for nodes
  const labels = ['ENERGY','OIL','GAS','CRYPTO','BTC','GOLD','SILVER','RISK'];

  let t=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Recalculate node positions if canvas resized
    for(let i=0;i<NODES;i++){
      nodes[i].x = (canvas.width/(NODES-1))*i;
    }

    // Draw connecting lines
    for(let i=0;i<NODES-1;i++){
      const g=ctx.createLinearGradient(nodes[i].x,0,nodes[i+1].x,0);
      g.addColorStop(0,'rgba(0,255,166,0.15)');
      g.addColorStop(1,'rgba(0,255,166,0.05)');
      ctx.strokeStyle=g;
      ctx.lineWidth=1;
      ctx.setLineDash([4,6]);
      ctx.beginPath();
      ctx.moveTo(nodes[i].x,nodes[i].y);
      ctx.lineTo(nodes[i+1].x,nodes[i+1].y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw nodes
    nodes.forEach((n,i)=>{
      const pulse=0.6+0.4*Math.sin(t*0.05+i);
      // Outer ring
      ctx.beginPath();
      ctx.arc(n.x,n.y,10,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,255,166,${pulse*0.3})`;
      ctx.lineWidth=1;
      ctx.stroke();
      // Inner dot
      ctx.beginPath();
      ctx.arc(n.x,n.y,4,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,255,166,${pulse})`;
      ctx.fill();
      // Label
      ctx.fillStyle=`rgba(0,255,166,0.5)`;
      ctx.font='9px Arial';
      ctx.textAlign='center';
      ctx.fillText(labels[i]||'', n.x, n.y+24);
    });

    // Move packets
    packets.forEach(p=>{
      p.t += p.speed;
      if(p.t>=1){ p.t=0; p.seg=(p.seg+1)%(NODES-1); }
      const n1=nodes[p.seg], n2=nodes[p.seg+1];
      const px=n1.x+(n2.x-n1.x)*p.t;
      const py=n1.y+(n2.y-n1.y)*p.t;
      // Glow
      const grd=ctx.createRadialGradient(px,py,0,px,py,8);
      grd.addColorStop(0,'rgba(0,255,166,0.9)');
      grd.addColorStop(1,'rgba(0,255,166,0)');
      ctx.beginPath();
      ctx.arc(px,py,8,0,Math.PI*2);
      ctx.fillStyle=grd;
      ctx.fill();
      // Dot
      ctx.beginPath();
      ctx.arc(px,py,2.5,0,Math.PI*2);
      ctx.fillStyle='#00ffa6';
      ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();


// ═══════════════════════════════════════
// SIDEBAR TOGGLE
// ═══════════════════════════════════════
function toggleFolder(id, el){
  const all = ['energy','crypto','commodities'];
  all.forEach(m=>{
    if(m!==id){
      document.getElementById(m).classList.remove('open');
      document.querySelectorAll('.folder').forEach(f=>{
        if(f.getAttribute('onclick')&&f.getAttribute('onclick').includes(`'${m}'`))
          f.classList.remove('open');
      });
    }
  });
  const menu=document.getElementById(id);
  const isOpen=menu.classList.contains('open');
  menu.classList.toggle('open',!isOpen);
  el.classList.toggle('open',!isOpen);
}

// ═══════════════════════════════════════
// CHART
// ═══════════════════════════════════════
function loadChart(symbol,el){
  document.querySelectorAll('.item').forEach(i=>i.classList.remove('active'));
  if(el) el.classList.add('active');
  document.getElementById('chart').innerHTML=
    `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#00ffa6;font-size:14px;gap:8px;">
    <span style="animation:pulse 1s infinite;display:inline-block;">◈</span> Loading <b>${symbol}</b>…
    </div>`;
  function tryLoad(n){
    if(typeof TradingView!=="undefined"){
      document.getElementById('chart').innerHTML="";
      new TradingView.widget({
        width:"100%",height:550,symbol,
        interval:"60",theme:"dark",
        container_id:"chart",
        allow_symbol_change:true,
        save_image:false
      });
    } else if(n>0){ setTimeout(()=>tryLoad(n-1),600); }
    else {
      document.getElementById('chart').innerHTML=
        `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ff4444;flex-direction:column;gap:10px;">
        <span style="font-size:28px;">⚠</span><span>Chart failed to load. Refresh.</span></div>`;
    }
  }
  tryLoad(15);
}


function loadNews(){
  const news=[
    {title:"Iran Threatens to Close Strait of Hormuz Amid US Sanctions Escalation",source:"Reuters",url:"#",img:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",tag:"🔴 BREAKING"},
    {title:"OPEC+ Calls Emergency Meeting as Oil Prices Drop Below $80 Per Barrel",source:"Bloomberg",url:"#",img:"https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=400&q=80",tag:"⚡ ENERGY"},
    {title:"Red Sea Crisis: 12 More Tankers Reroute Around Cape of Good Hope This Week",source:"Financial Times",url:"#",img:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80",tag:"🌊 SHIPPING"},
    {title:"Bitcoin Surges 8% as Investors Flee Traditional Markets on Geopolitical Fears",source:"CoinDesk",url:"#",img:"https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&q=80",tag:"₿ CRYPTO"},
    {title:"Ukraine War Disrupts European Natural Gas Supply Routes for Third Winter",source:"BBC News",url:"#",img:"https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400&q=80",tag:"🌍 GEOPOLITICS"},
    {title:"Gold Hits Record $2,900 as Central Banks Accelerate Reserve Diversification",source:"CNBC",url:"#",img:"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&q=80",tag:"⛏ COMMODITIES"}
  ];
  let html="";
  news.forEach(n=>{
    html+=`<div class="news-card">
      <div style="position:relative;">
        <img src="${n.img}" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80'">
        <span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.75);color:#00ffa6;font-size:10px;padding:3px 7px;border-radius:4px;font-weight:bold;">${n.tag}</span>
        <span style="position:absolute;bottom:4px;right:6px;color:rgba(255,255,255,0.4);font-size:9px;">Photo: Unsplash</span>
      </div>
      <div class="news-content">
        <b>${n.title}</b>
        <p style="color:#666;font-size:12px;margin:4px 0;">${n.source}</p>
        <a href="${n.url}" target="_blank">Read →</a>
      </div>
    </div>`;
  });
  document.getElementById('news').innerHTML=html;
}


// ═══════════════════════════════════════
// LIVE TICKER — ENERGY · CRYPTO · COMMODITIES
// Sumber: Binance WS (crypto) + CoinGecko (crypto fallback+metals)
//         + Yahoo Finance proxy via allorigins (energy+metals)
// ═══════════════════════════════════════

const TICKER_STATE = {
  // Energy
  WTI:   { price:0, chg:0, cat:'ENERGY', cls:'cat-energy', sym:'WTI Oil',   dp:2 },
  BRENT: { price:0, chg:0, cat:'ENERGY', cls:'cat-energy', sym:'Brent',     dp:2 },
  NATGAS:{ price:0, chg:0, cat:'ENERGY', cls:'cat-energy', sym:'Nat Gas',   dp:3 },
  // Crypto
  BTC:   { price:0, chg:0, cat:'CRYPTO', cls:'cat-crypto', sym:'BTC',       dp:0 },
  ETH:   { price:0, chg:0, cat:'CRYPTO', cls:'cat-crypto', sym:'ETH',       dp:2 },
  BNB:   { price:0, chg:0, cat:'CRYPTO', cls:'cat-crypto', sym:'BNB',       dp:2 },
  SOL:   { price:0, chg:0, cat:'CRYPTO', cls:'cat-crypto', sym:'SOL',       dp:2 },
  XRP:   { price:0, chg:0, cat:'CRYPTO', cls:'cat-crypto', sym:'XRP',       dp:4 },
  DOGE:  { price:0, chg:0, cat:'CRYPTO', cls:'cat-crypto', sym:'DOGE',      dp:5 },
  ADA:   { price:0, chg:0, cat:'CRYPTO', cls:'cat-crypto', sym:'ADA',       dp:4 },
  // Commodities / Metals
  GOLD:  { price:0, chg:0, cat:'METAL',  cls:'cat-metal',  sym:'Gold',      dp:2 },
  SILVER:{ price:0, chg:0, cat:'METAL',  cls:'cat-metal',  sym:'Silver',    dp:2 },
  PLAT:  { price:0, chg:0, cat:'METAL',  cls:'cat-metal',  sym:'Platinum',  dp:2 },
  PALL:  { price:0, chg:0, cat:'METAL',  cls:'cat-metal',  sym:'Palladium', dp:2 },
};

const TICKER_ORDER = [
  'WTI','BRENT','NATGAS','|',
  'BTC','ETH','BNB','SOL','XRP','DOGE','ADA','|',
  'GOLD','SILVER','PLAT','PALL'
];

function fmtTickerPrice(key){
  const d = TICKER_STATE[key];
  if(!d || !d.price) return '…';
  const p = parseFloat(d.price);
  if(key==='BTC'||key==='GOLD'||key==='PALL'||key==='PLAT')
    return '$'+p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  return '$'+p.toFixed(d.dp);
}

function chgSpan(chg){
  if(chg===0||chg===null||chg===undefined) return '';
  const v = parseFloat(chg);
  const sign = v>=0 ? '▲' : '▼';
  const cls  = v>=0 ? 'tick-up' : 'tick-down';
  return `<span class="${cls}">${sign}${Math.abs(v).toFixed(2)}%</span>`;
}

function renderTicker(){
  let html = '';
  TICKER_ORDER.forEach(k=>{
    if(k==='|'){ html+=`<span class="tick-sep">·</span>`; return; }
    const d = TICKER_STATE[k];
    if(!d) return;
    html += `<span class="tick-item">
      <span class="tick-cat ${d.cls}">${d.cat}</span>
      <span class="tick-sym">${d.sym}</span>
      <span class="tick-price">${fmtTickerPrice(k)}</span>
      ${chgSpan(d.chg)}
    </span>`;
  });
  const el = document.getElementById('tickerTrack');
  if(el) el.innerHTML = html + html;
}

// ── CRYPTO: Binance WebSocket — tick-by-tick real-time ──
function connectBinanceWS(){
  const pairs = ['btcusdt','ethusdt','bnbusdt','solusdt','xrpusdt','dogeusdt','adausdt'];
  const streams = pairs.map(p=>p+'@miniTicker').join('/');
  let ws;
  try{
    ws = new WebSocket('wss://stream.binance.com:9443/stream?streams='+streams);
  }catch(e){ setTimeout(connectBinanceWS,5000); return; }
  const map = {BTCUSDT:'BTC',ETHUSDT:'ETH',BNBUSDT:'BNB',SOLUSDT:'SOL',XRPUSDT:'XRP',DOGEUSDT:'DOGE',ADAUSDT:'ADA'};
  ws.onmessage = function(e){
    try{
      const msg = JSON.parse(e.data);
      const t = msg.data;
      if(!t||!t.s) return;
      const sym = map[t.s];
      if(sym){
        const prev = TICKER_STATE[sym].price;
        const curr = parseFloat(t.c);
        TICKER_STATE[sym].price = curr;
        // 24h change = (close - open) / open * 100
        if(t.o) TICKER_STATE[sym].chg = ((curr - parseFloat(t.o)) / parseFloat(t.o)) * 100;
      }
    }catch(ex){}
  };
  ws.onclose = function(){ setTimeout(connectBinanceWS,3000); };
  ws.onerror = function(){ try{ws.close();}catch(e){} };
}

// ── CRYPTO fallback + METALS via CoinGecko (free, no key) ──
async function fetchCoinGecko(){
  try{
    const ids = 'bitcoin,ethereum,binancecoin,solana,ripple,dogecoin,cardano,gold,silver,platinum,palladium';
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids='+ids+'&vs_currencies=usd&include_24hr_change=true';
    const r = await fetch(url);
    if(!r.ok) throw 0;
    const d = await r.json();
    const map = {
      bitcoin:'BTC', ethereum:'ETH', binancecoin:'BNB', solana:'SOL',
      ripple:'XRP',  dogecoin:'DOGE', cardano:'ADA'
    };
    // Only update crypto if WS hasn't populated yet
    Object.entries(map).forEach(([id,sym])=>{
      if(d[id]){
        if(!TICKER_STATE[sym].price || TICKER_STATE[sym].price===0){
          TICKER_STATE[sym].price = d[id].usd;
        }
        if(TICKER_STATE[sym].chg===0) TICKER_STATE[sym].chg = d[id].usd_24h_change||0;
      }
    });
    // Metals — CoinGecko has gold/silver/platinum/palladium
    if(d.gold)      { TICKER_STATE.GOLD.price   = d.gold.usd;      TICKER_STATE.GOLD.chg   = d.gold.usd_24h_change||0; }
    if(d.silver)    { TICKER_STATE.SILVER.price = d.silver.usd;    TICKER_STATE.SILVER.chg = d.silver.usd_24h_change||0; }
    if(d.platinum)  { TICKER_STATE.PLAT.price   = d.platinum.usd;  TICKER_STATE.PLAT.chg   = d.platinum.usd_24h_change||0; }
    if(d.palladium) { TICKER_STATE.PALL.price   = d.palladium.usd; TICKER_STATE.PALL.chg   = d.palladium.usd_24h_change||0; }
  }catch(e){}
}

// ── ENERGY: Yahoo Finance via allorigins CORS proxy ──
// Symbols: CL=F (WTI), BZ=F (Brent), NG=F (Nat Gas)
async function fetchEnergy(){
  const symbols = [{yf:'CL=F',k:'WTI'},{yf:'BZ=F',k:'BRENT'},{yf:'NG=F',k:'NATGAS'}];
  for(const {yf,k} of symbols){
    try{
      const url = 'https://query1.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(yf)+'?interval=1m&range=1d';
      const proxy = 'https://api.allorigins.win/get?url='+encodeURIComponent(url);
      const r = await fetch(proxy);
      if(!r.ok) continue;
      const wrapper = await r.json();
      const data = JSON.parse(wrapper.contents);
      const meta = data?.chart?.result?.[0]?.meta;
      if(meta){
        const price = meta.regularMarketPrice || meta.previousClose;
        const prev  = meta.chartPreviousClose || meta.previousClose || price;
        TICKER_STATE[k].price = price;
        TICKER_STATE[k].chg   = prev ? ((price-prev)/prev)*100 : 0;
      }
    }catch(e){}
  }
}

// ── BOOT ──
renderTicker();
connectBinanceWS();
fetchCoinGecko();
fetchEnergy();

// Refresh display every second (crypto WS updates state continuously)
setInterval(renderTicker, 1000);
// Re-fetch metals+crypto fallback every 60s
setInterval(fetchCoinGecko, 60000);
// Re-fetch energy every 60s
setInterval(fetchEnergy, 60000);

// ═══════════════════════════════════════
// RISK MONITOR — RSS NEWS SCANNER
// Scans multiple RSS feeds every 5 minutes
// Highlights regions/chokepoints with recent news
// ═══════════════════════════════════════

// RSS Feeds — semua dengan explicit open RSS license / permissive ToS
// NYT dihapus (ToS strict untuk aggregasi komersial)
const RISK_RSS_FEEDS = [
  { url:'https://feeds.reuters.com/reuters/topNews',        source:'Reuters' },
  { url:'https://feeds.reuters.com/reuters/businessNews',   source:'Reuters' },
  { url:'https://feeds.bbci.co.uk/news/world/rss.xml',      source:'BBC News' },
  { url:'https://www.aljazeera.com/xml/rss/all.xml',        source:'Al Jazeera' },
  { url:'https://feeds.skynews.com/feeds/rss/world.xml',    source:'Sky News' },
  { url:'https://rss.dw.com/rdf/rss-en-world',              source:'DW News' },
];

// Each risk item: id => array of keywords to match in headline/description
const RISK_KEYWORDS = {
  'risk-iran':       ['iran','israel','irgc','tehran','hormuz','nuclear deal','sanctions iran','rouhani','khamenei'],
  'risk-redsea':     ['red sea','houthi','yemen','bab el-mandeb','gulf of aden','shipping attack','tanker attack'],
  'risk-ukraine':    ['ukraine','russia war','kyiv','nato russia','zelensky','putin','crimea','kharkiv','drone russia'],
  'risk-taiwan':     ['taiwan','pla exercise','taiwan strait','taipei','china military','tsmc','semiconductor supply'],
  'risk-scs':        ['south china sea','spratly','paracel','philippines china','beijing military','nine-dash'],
  'risk-baltic':     ['baltic sea','nord stream','pipeline sabotage','finland nato','sweden nato','kaliningrad'],
  'risk-venezuela':  ['venezuela','pdvsa','maduro','caracas sanctions','oil venezuela'],
  'risk-westafrica': ['nigeria oil','niger coup','mali','sahel','west africa','boko haram','gulf of guinea','burkina'],
  'risk-hormuz':     ['strait of hormuz','iran oil','gulf oil blockade','hormuz closure'],
  'risk-babmandeb':  ['bab el-mandeb','houthi ship','red sea attack','aden gulf','shipping divert'],
  'risk-suez':       ['suez canal','canal traffic','egypt canal','shipping suez','suez blockage'],
  'risk-malacca':    ['strait of malacca','singapore shipping','malacca piracy','tanker malacca'],
  'risk-bosphorus':  ['bosphorus','istanbul strait','turkey tanker','black sea oil','montreux'],
  'risk-panama':     ['panama canal','canal drought','panama shipping','canal delay'],
  'risk-dover':      ['strait of dover','english channel shipping','north sea route','dover port'],
  'risk-lombok':     ['lombok strait','indonesia vlcc','bali strait','sunda strait'],
  'risk-arctic':     ['arctic route','northern sea route','yamal lng','russia arctic','icebreaker'],
};

// Store latest matched headlines per region
const riskNewsCache = {};
let riskScanCount = 0;

async function fetchRSSFeed(feedObj) {
  const { url, source } = feedObj;
  const proxy = 'https://api.allorigins.win/get?url=' + encodeURIComponent(url);
  try {
    const r = await fetch(proxy, {signal: AbortSignal.timeout(8000)});
    if (!r.ok) return [];
    const data = await r.json();
    const xml = data.contents;
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const items = doc.querySelectorAll('item');
    const results = [];
    items.forEach(item => {
      const title   = item.querySelector('title')?.textContent || '';
      const desc    = item.querySelector('description')?.textContent || '';
      const link    = item.querySelector('link')?.textContent || '#';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      results.push({
        title:   title.trim(),
        desc:    desc.replace(/<[^>]+>/g,'').trim(),
        link,
        pubDate,
        source   // attach source label for attribution
      });
    });
    return results.slice(0, 15);
  } catch(e) { return []; }
}

function timeAgo(pubDate) {
  if (!pubDate) return '';
  try {
    const d = new Date(pubDate);
    const diff = Math.floor((Date.now() - d.getTime()) / 60000);
    if (diff < 1)  return 'just now';
    if (diff < 60) return diff + 'm ago';
    const h = Math.floor(diff / 60);
    if (h < 24)    return h + 'h ago';
    return Math.floor(h/24) + 'd ago';
  } catch(e) { return ''; }
}

async function scanRiskNews(manual = false) {
  const statusEl = document.getElementById('risk-scan-status');
  const lastScanEl = document.getElementById('risk-last-scan');
  if (statusEl) statusEl.textContent = '⟳ Scanning...';

  // Fetch all feeds in parallel
  const allItems = [];
  const results = await Promise.allSettled(RISK_RSS_FEEDS.map(feedObj => fetchRSSFeed(feedObj)));
  results.forEach(r => { if (r.status === 'fulfilled') allItems.push(...r.value); });

  if (allItems.length === 0) {
    if (statusEl) statusEl.textContent = 'No data';
    return;
  }

  let alertCount = 0;

  // Match each risk item
  Object.entries(RISK_KEYWORDS).forEach(([id, keywords]) => {
    const el = document.getElementById(id);
    if (!el) return;

    // Find best matching headline (most keyword matches, most recent)
    let bestMatch = null;
    let bestScore = 0;

    allItems.forEach(item => {
      const text = (item.title + ' ' + item.desc).toLowerCase();
      let score = 0;
      keywords.forEach(kw => { if (text.includes(kw.toLowerCase())) score++; });
      if (score > 0 && score >= bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    });

    const pillEl = document.getElementById('pill-' + id.replace('risk-',''));
    
    if (bestMatch && bestScore >= 1) {
      // Flash the card
      el.classList.remove('news-alert');
      void el.offsetWidth; // force reflow
      el.classList.add('news-alert');
      setTimeout(() => el.classList.remove('news-alert'), 7000);

      // Mark card as having news (dot indicator) instead of inline pill
      if (pillEl) {
        const shortTitle = bestMatch.title.length > 52
          ? bestMatch.title.slice(0, 52) + '…'
          : bestMatch.title;
        const ago = timeAgo(bestMatch.pubDate);
        const src = bestMatch.source || 'News';
        // Keep pill data hidden but store for modal
        pillEl.innerHTML =
          `<span style="color:#00ffa6;font-size:8px;font-weight:bold;">📰 ${src}</span>` +
          `<span style="color:#555;font-size:8px;"> · ${ago}</span><br>` +
          `<span style="color:#ccc;">${shortTitle}</span>` +
          `<span style="color:#333;font-size:8px;"> — click to read</span>`;
        pillEl.title = `${bestMatch.title}\n\nSource: ${src}\nClick to open original article at ${src}`;
        // Show the dot indicator instead of inline pill
        el.classList.add('has-news');
        pillEl.onclick = () => window.open(bestMatch.link, '_blank', 'noopener,noreferrer');
        riskNewsCache[id] = bestMatch;
      }
      alertCount++;
    } else {
      // No recent news — keep pill hidden but don't clear if cached
      if (pillEl && !riskNewsCache[id]) {
        pillEl.classList.remove('visible');
      }
    }
  });

  // Update status
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  riskScanCount++;
  if (statusEl) {
    statusEl.textContent = alertCount > 0
      ? `⚡ ${alertCount} active alert${alertCount>1?'s':''}`
      : '✓ No new alerts';
    statusEl.style.color = alertCount > 0 ? '#ffcc44' : '#2a6a4a';
  }
  if (lastScanEl) {
    lastScanEl.textContent = `Last scan: ${timeStr} · ${allItems.length} headlines · Sources: Reuters, BBC, Al Jazeera, Sky News, DW`;
    lastScanEl.style.color = '#2a4a3a';
  }
  if (manual && statusEl) {
    setTimeout(() => { if(statusEl) statusEl.style.color = '#333'; }, 4000);
  }
}

// INIT
// ═══════════════════════════════════════
loadNews();

window.addEventListener('load',function(){
  function initChart(n){
    if(typeof TradingView!=="undefined"){
      document.getElementById('chart').innerHTML="";
      new TradingView.widget({
        width:"100%",height:550,symbol:"TVC:USOIL",
        interval:"60",theme:"dark",
        container_id:"chart",
        allow_symbol_change:true,
        save_image:false
      });
    } else if(n>0){ setTimeout(()=>initChart(n-1),600); }
  }
  initChart(20);

  // Risk monitor: first scan after 3s, then every 5 minutes
  setTimeout(() => scanRiskNews(), 3000);
  setInterval(() => scanRiskNews(), 5 * 60 * 1000);
});

// ═══════════════════════════════════════
// ADMIN PANEL
// ═══════════════════════════════════════
// Password stored as obfuscated hash (djb2 variant — works on local files without HTTPS)
// Hash of "crisis2026" = 1704837741
const ADMIN_PASS_HASH = 499308092;

function hashPassword(str) {
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0x7fffffff; // keep positive 31-bit int
  }
  return hash;
}

function openAdminPanel(){
  document.getElementById('adminLoginOverlay').style.display='flex';
  document.getElementById('adminPwInput').value='';
  document.getElementById('adminPwInput').focus();
  document.getElementById('adminLoginErr').style.display='none';
}

function checkAdminLogin(){
  const val = document.getElementById('adminPwInput').value;
  const hashed = hashPassword(val);
  if(hashed === ADMIN_PASS_HASH){
    document.getElementById('adminLoginOverlay').style.display='none';
    document.getElementById('adminPanelOverlay').style.display='flex';
    loadAdminData();
  } else {
    document.getElementById('adminLoginErr').style.display='block';
    document.getElementById('adminPwInput').value='';
  }
}

function closeAdmin(){
  document.getElementById('adminPanelOverlay').style.display='none';
}

function adminTab(tab){
  document.querySelectorAll('.adm-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.adm-section').forEach(s=>s.style.display='none');
  event.target.classList.add('active');
  document.getElementById('adm-'+tab).style.display='block';
}

// ── Load current data into admin form ──
function loadAdminData(){
  // Alert banner
  const alertEl = document.querySelector('.alert-scroll');
  if(alertEl) document.getElementById('adm-alert-text').value = alertEl.innerText.trim();

  // Risk items
  const riskItems = document.querySelectorAll('.risk-item');
  const riskContainer = document.getElementById('adm-risk-list');
  riskContainer.innerHTML = '';
  riskItems.forEach((item,i)=>{
    const region = item.querySelector('.region')?.innerText || '';
    const levelEl = item.querySelector('.level');
    const level = levelEl?.classList.contains('high') ? 'HIGH' : levelEl?.classList.contains('medium') ? 'MEDIUM' : 'LOW';
    riskContainer.innerHTML += `
      <div class="adm-risk-row" data-index="${i}">
        <input class="adm-input adm-risk-region" value="${region}" placeholder="Region" style="width:120px">
        <select class="adm-select adm-risk-level">
          <option value="HIGH" ${level==='HIGH'?'selected':''}>🔴 HIGH</option>
          <option value="MEDIUM" ${level==='MEDIUM'?'selected':''}>🟡 MEDIUM</option>
          <option value="LOW" ${level==='LOW'?'selected':''}>🟢 LOW</option>
        </select>
        <button class="adm-del-btn" onclick="this.parentElement.remove()">✕</button>
      </div>`;
  });

  // News
  loadAdminNews();

  // Stats
  const statBoxes = document.querySelectorAll('.stat-box');
  statBoxes.forEach((box,i)=>{
    const num = box.querySelector('.num')?.innerText || '';
    const lbl = box.querySelector('.label')?.innerText || '';
    const ni = document.getElementById('adm-stat-num-'+i);
    const li = document.getElementById('adm-stat-lbl-'+i);
    if(ni) ni.value = num;
    if(li) li.value = lbl;
  });

  // Calendar rows
  const calRows = document.querySelectorAll('.cal-table tbody tr');
  const calContainer = document.getElementById('adm-cal-list');
  calContainer.innerHTML = '';
  calRows.forEach((row,i)=>{
    const cells = row.querySelectorAll('td');
    const time = cells[0]?.innerText||'';
    const event = cells[1]?.innerText||'';
    const prev = cells[3]?.innerText||'';
    const fcast = cells[4]?.innerText||'';
    const statusEl = cells[5]?.querySelector('.cal-tag');
    const status = statusEl?.classList.contains('tag-live')?'live': statusEl?.classList.contains('tag-done')?'done':'upcoming';
    calContainer.innerHTML += `
      <div class="adm-cal-row">
        <input class="adm-input" value="${time}" placeholder="Time" style="width:70px">
        <input class="adm-input" value="${event}" placeholder="Event" style="flex:1;min-width:120px">
        <input class="adm-input" value="${prev}" placeholder="Prev" style="width:70px">
        <input class="adm-input" value="${fcast}" placeholder="Fcast" style="width:70px">
        <select class="adm-select">
          <option value="upcoming" ${status==='upcoming'?'selected':''}>Upcoming</option>
          <option value="live" ${status==='live'?'selected':''}>● LIVE</option>
          <option value="done" ${status==='done'?'selected':''}>Done</option>
        </select>
        <button class="adm-del-btn" onclick="this.parentElement.remove()">✕</button>
      </div>`;
  });


}

function loadAdminNews(){
  const newsCards = document.querySelectorAll('.news-card');
  const newsContainer = document.getElementById('adm-news-list');
  newsContainer.innerHTML = '';
  newsCards.forEach((card,i)=>{
    const title = card.querySelector('b')?.innerText || '';
    const source = card.querySelector('p')?.innerText || '';
    const url = card.querySelector('a')?.href || '#';
    const img = card.querySelector('img')?.src || '';
    const tag = card.querySelector('span[style]')?.innerText || '';
    newsContainer.innerHTML += `
      <div class="adm-news-row" style="border:1px solid #222;border-radius:6px;padding:10px;margin-bottom:8px;">
        <div style="display:flex;gap:8px;margin-bottom:6px;">
          <input class="adm-input adm-news-tag" value="${tag}" placeholder="Tag e.g. 🔴 BREAKING" style="width:140px">
          <input class="adm-input adm-news-source" value="${source}" placeholder="Source" style="flex:1">
          <button class="adm-del-btn" onclick="this.closest('.adm-news-row').remove()">✕</button>
        </div>
        <input class="adm-input adm-news-title" value="${title}" placeholder="Headline" style="width:100%;margin-bottom:6px;">
        <div style="display:flex;gap:8px;">
          <input class="adm-input adm-news-url" value="${url}" placeholder="URL" style="flex:1">
          <input class="adm-input adm-news-img" value="${img}" placeholder="Image URL" style="flex:1">
        </div>
      </div>`;
  });
}

function addNewsRow(){
  const newsContainer = document.getElementById('adm-news-list');
  newsContainer.innerHTML += `
    <div class="adm-news-row" style="border:1px solid #222;border-radius:6px;padding:10px;margin-bottom:8px;">
      <div style="display:flex;gap:8px;margin-bottom:6px;">
        <input class="adm-input adm-news-tag" value="🔴 BREAKING" placeholder="Tag" style="width:140px">
        <input class="adm-input adm-news-source" value="" placeholder="Source" style="flex:1">
        <button class="adm-del-btn" onclick="this.closest('.adm-news-row').remove()">✕</button>
      </div>
      <input class="adm-input adm-news-title" value="" placeholder="Headline" style="width:100%;margin-bottom:6px;">
      <div style="display:flex;gap:8px;">
        <input class="adm-input adm-news-url" value="#" placeholder="URL" style="flex:1">
        <input class="adm-input adm-news-img" value="" placeholder="Image URL" style="flex:1">
      </div>
    </div>`;
}

function addRiskRow(){
  document.getElementById('adm-risk-list').innerHTML += `
    <div class="adm-risk-row">
      <input class="adm-input adm-risk-region" value="New Region" placeholder="Region" style="width:120px">
      <select class="adm-select adm-risk-level">
        <option value="HIGH">🔴 HIGH</option>
        <option value="MEDIUM" selected>🟡 MEDIUM</option>
        <option value="LOW">🟢 LOW</option>
      </select>
      <button class="adm-del-btn" onclick="this.parentElement.remove()">✕</button>
    </div>`;
}

function addCalRow(){
  document.getElementById('adm-cal-list').innerHTML += `
    <div class="adm-cal-row">
      <input class="adm-input" value="12:00" placeholder="Time" style="width:70px">
      <input class="adm-input" value="New Event" placeholder="Event" style="flex:1;min-width:120px">
      <input class="adm-input" value="—" placeholder="Prev" style="width:70px">
      <input class="adm-input" value="—" placeholder="Fcast" style="width:70px">
      <select class="adm-select">
        <option value="upcoming" selected>Upcoming</option>
        <option value="live">● LIVE</option>
        <option value="done">Done</option>
      </select>
      <button class="adm-del-btn" onclick="this.parentElement.remove()">✕</button>
    </div>`;
}

// ── Apply all changes ──

// ── LIVE EVENT URL MAPPING ──
function getLiveUrl(eventName) {
  var e = eventName.toLowerCase();
  // USA - Bureau of Labor Statistics
  if (e.includes('non-farm') || e.includes('nonfarm') || e.includes('unemployment') || e.includes('jobless'))
    return 'https://www.bls.gov/news.release/empsit.nr0.htm';
  if (e.includes('cpi') || e.includes('consumer price'))
    return 'https://www.bls.gov/news.release/cpi.nr0.htm';
  if (e.includes('ppi') || e.includes('producer price'))
    return 'https://www.bls.gov/news.release/ppi.nr0.htm';
  if (e.includes('pmi') && (e.includes('us') || e.includes('ism')))
    return 'https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/';
  if (e.includes('pmi') && e.includes('uk'))
    return 'https://www.spglobal.com/marketintelligence/en/mi/research-analysis/uk-pmi.html';
  if (e.includes('pmi') && (e.includes('germany') || e.includes('german') || e.includes('de')))
    return 'https://www.spglobal.com/marketintelligence/en/mi/research-analysis/germany-pmi.html';
  // Federal Reserve
  if (e.includes('fed') || e.includes('powell') || e.includes('fomc') || e.includes('federal reserve'))
    return 'https://www.federalreserve.gov/newsevents/speeches.htm';
  if (e.includes('interest rate') && e.includes('us'))
    return 'https://www.federalreserve.gov/monetarypolicy/openmarket.htm';
  // OPEC
  if (e.includes('opec'))
    return 'https://www.opec.org/opec_web/en/press_room/press_releases.htm';
  // ECB
  if (e.includes('ecb') || e.includes('european central'))
    return 'https://www.ecb.europa.eu/press/pr/date/html/index.en.html';
  // Germany
  if (e.includes('germany') || e.includes('german') || e.includes('cpi') && e.includes('de'))
    return 'https://www.destatis.de/EN/Themes/Economy/Prices/Consumer-Price-Index/_node.html';
  // UK
  if (e.includes('uk') || e.includes('boe') || e.includes('bank of england'))
    return 'https://www.bankofengland.co.uk/news';
  // China
  if (e.includes('china') || e.includes('chinese'))
    return 'http://english.customs.gov.cn/';
  // GDP
  if (e.includes('gdp') && e.includes('us'))
    return 'https://www.bea.gov/news/schedule';
  if (e.includes('gdp'))
    return 'https://data.worldbank.org/indicator/NY.GDP.MKTP.CD';
  // Retail Sales
  if (e.includes('retail sales') && e.includes('us'))
    return 'https://www.census.gov/retail/index.html';
  // Default fallback - investing.com economic calendar
  return 'https://www.investing.com/economic-calendar/';
}

function applyAdminChanges(){
  // 1. Alert Banner
  const alertText = document.getElementById('adm-alert-text').value.trim();
  const alertScroll = document.querySelector('.alert-scroll');
  if(alertScroll && alertText){
    alertScroll.innerHTML = alertText + '&nbsp;&nbsp;&nbsp;' + alertText;
    document.getElementById('alertBanner').style.display='flex';
  }

  // 2. Risk Monitor
  const riskRows = document.querySelectorAll('.adm-risk-row');
  const riskContainer = document.querySelector('.risk-row');
  if(riskContainer){
    riskContainer.innerHTML = '';
    riskRows.forEach(row=>{
      const region = row.querySelector('.adm-risk-region').value;
      const level = row.querySelector('.adm-risk-level').value;
      const cls = level==='HIGH'?'high':level==='MEDIUM'?'medium':'low';
      const dotCls = 'dot-'+cls;
      riskContainer.innerHTML += `<div class="risk-item"><div class="region">${region}</div><div class="level ${cls}"><span class="risk-dot ${dotCls}"></span>${level}</div></div>`;
    });
  }

  // 3. News cards
  const newsRows = document.querySelectorAll('.adm-news-row');
  let newsHtml = '';
  newsRows.forEach(row=>{
    const tag = row.querySelector('.adm-news-tag').value;
    const source = row.querySelector('.adm-news-source').value;
    const title = row.querySelector('.adm-news-title').value;
    const url = row.querySelector('.adm-news-url').value;
    const img = row.querySelector('.adm-news-img').value;
    newsHtml += `<div class="news-card">
      <div style="position:relative;">
        <img src="${img}" onerror="this.src='https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80'">
        <span style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.75);color:#00ffa6;font-size:10px;padding:3px 7px;border-radius:4px;font-weight:bold;">${tag}</span>
      </div>
      <div class="news-content">
        <b>${title}</b>
        <p style="color:#666;font-size:12px;margin:4px 0;">${source}</p>
        <a href="${url}" target="_blank">Read →</a>
      </div>
    </div>`;
  });
  document.getElementById('news').innerHTML = newsHtml;

  // 4. Stats
  const statBoxes = document.querySelectorAll('.stat-box');
  statBoxes.forEach((box,i)=>{
    const ni = document.getElementById('adm-stat-num-'+i);
    const li = document.getElementById('adm-stat-lbl-'+i);
    if(ni && box.querySelector('.num')) box.querySelector('.num').innerText = ni.value;
    if(li && box.querySelector('.label')) box.querySelector('.label').innerText = li.value;
  });

  // 5. Economic Calendar
  const calRows = document.querySelectorAll('.adm-cal-row');
  const tbody = document.querySelector('.cal-table tbody');
  if(tbody){
    tbody.innerHTML = '';
    calRows.forEach(row=>{
      const inputs = row.querySelectorAll('.adm-input');
      const time = inputs[0].value;
      const event = inputs[1].value;
      const prev = inputs[2].value;
      const fcast = inputs[3].value;
      const status = row.querySelector('.adm-select').value;
      const tagClass = status==='live'?'tag-live':status==='done'?'tag-done':'tag-upcoming';
      const tagText = status==='live'?'● LIVE':status==='done'?'Done':'Upcoming';
      const liveUrl = getLiveUrl(event);
      const tagEl = status==='live' && liveUrl
        ? `<a href="${liveUrl}" target="_blank" class="cal-tag tag-live" style="text-decoration:none;display:inline-block;">● LIVE</a>`
        : `<span class="cal-tag ${tagClass}">${tagText}</span>`;
      tbody.innerHTML += `<tr>
        <td>${time}</td><td>${event}</td>
        <td class="imp-medium">●● MED</td>
        <td>${prev}</td><td>${fcast}</td>
        <td>${tagEl}</td>
      </tr>`;
    });
  }



  // Show success
  const toast = document.getElementById('adm-toast');
  toast.style.display = 'block';
  toast.style.opacity = '1';
  setTimeout(()=>{ toast.style.opacity='0'; setTimeout(()=>toast.style.display='none',400); }, 2500);
}



// ══════════════════════════════════════════
// CRISIS TIMELINE — AUTO RSS FEED (1hr refresh)
// ══════════════════════════════════════════

var tlCurrentTab = 'energy';
var tlRefreshInterval = null;
var tlNextUpdateTime = null;

// RSS feeds per category via rss2json proxy (no CORS issues)
var tlFeeds = {
  energy: [
    'https://feeds.reuters.com/reuters/businessNews',
    'https://www.ft.com/rss/home/uk',
    'https://feeds.bloomberg.com/energy/news.rss'
  ],
  geopolitics: [
    'https://feeds.reuters.com/Reuters/worldNews',
    'https://rss.dw.com/rdf/rss-en-world',
    'https://feeds.bbci.co.uk/news/world/rss.xml'
  ],
  crypto: [
    'https://cointelegraph.com/rss',
    'https://coindesk.com/arc/outboundfeeds/rss/',
    'https://decrypt.co/feed'
  ],
  oil: [
    'https://oilprice.com/rss/main',
    'https://feeds.reuters.com/reuters/companyNews',
    'https://www.ogj.com/rss'
  ]
};

// Google News RSS queries per category (CORS-safe via proxy)
var tlGoogleQueries = {
  energy: 'energy+crisis+oil+gas+geopolitical',
  geopolitics: 'geopolitical+crisis+war+sanctions+conflict',
  crypto: 'bitcoin+ethereum+crypto+market+crisis',
  oil: 'OPEC+oil+gas+pipeline+energy+supply'
};

var tlTagClass = {
  energy: 'tl-tag-energy',
  geopolitics: 'tl-tag-geo',
  crypto: 'tl-tag-crypto',
  oil: 'tl-tag-oil'
};
var tlTagLabel = {
  energy: '⚡ ENERGY',
  geopolitics: '🌐 GEO',
  crypto: '◈ CRYPTO',
  oil: '🛢 OIL'
};

function setTlTab(btn, tab) {
  document.querySelectorAll('.tl-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  tlCurrentTab = tab;
  fetchTimeline(true);
}

function timeAgo(dateStr) {
  var now = new Date();
  var then = new Date(dateStr);
  if (isNaN(then)) return '';
  var diff = Math.floor((now - then) / 1000);
  if (diff < 60) return diff + 's ago';
  if (diff < 3600) return Math.floor(diff/60) + 'm ago';
  if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
  return Math.floor(diff/86400) + 'd ago';
}

function formatTlDate(dateStr) {
  var d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
}

function fetchTimeline(force) {
  var feed = document.getElementById('tl-feed');
  var statusText = document.getElementById('tl-status-text');
  var statusDot = document.getElementById('tl-status-dot');
  if (!feed) return;

  feed.innerHTML = '<div class="tl-skeleton"><div class="tl-skel-item"></div><div class="tl-skel-item"></div><div class="tl-skel-item"></div><div class="tl-skel-item"></div><div class="tl-skel-item"></div></div>';
  statusText.textContent = 'Fetching live events...';
  statusDot.style.background = '#ffaa00';
  statusDot.style.boxShadow = '0 0 8px #ffaa00';

  var query = tlGoogleQueries[tlCurrentTab] || 'energy+crisis';
  var rssUrl = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=en-US&gl=US&ceid=US:en';

  // Try multiple proxies in sequence
  var proxies = [
    'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl) + '&count=10',
    'https://api.allorigins.win/get?url=' + encodeURIComponent(rssUrl),
    'https://corsproxy.io/?' + encodeURIComponent(rssUrl)
  ];

  function tryProxy(idx) {
    if (idx >= proxies.length) {
      showTlError();
      return;
    }
    fetch(proxies[idx], {signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined})
      .then(function(r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function(data) {
        var items = [];
        // rss2json format
        if (data.items && data.items.length) {
          items = data.items;
        }
        // allorigins / corsproxy format - raw XML
        else if (data.contents) {
          var xml = new DOMParser().parseFromString(data.contents, 'text/xml');
          xml.querySelectorAll('item').forEach(function(item) {
            var title = item.querySelector('title');
            var link = item.querySelector('link');
            var pubDate = item.querySelector('pubDate');
            var desc = item.querySelector('description');
            items.push({
              title: title ? title.textContent : '',
              link: link ? (link.textContent || link.getAttribute('href') || '#') : '#',
              pubDate: pubDate ? pubDate.textContent : '',
              description: desc ? desc.textContent.replace(/<[^>]+>/g,'').substring(0,160) : ''
            });
          });
        }
        if (!items.length) throw new Error('Empty');
        renderTimeline(items.slice(0,10));
        statusText.textContent = 'Updated ' + new Date().toLocaleTimeString('en-US', {hour:'2-digit',minute:'2-digit'});
        statusDot.style.background = '#00ffa6';
        statusDot.style.boxShadow = '0 0 8px #00ffa6';
        scheduleNextUpdate();
      })
      .catch(function() {
        tryProxy(idx + 1);
      });
  }

  tryProxy(0);
}

function renderTimeline(items) {
  var feed = document.getElementById('tl-feed');
  var tag = tlCurrentTab;
  var html = '';
  var now = new Date();

  items.forEach(function(item, i) {
    var title = item.title || 'Untitled';
    // Strip Google News source suffix " - Source Name"
    title = title.replace(/\s*-\s*[^-]+$/, '');
    var link = item.link || '#';
    var pub = item.pubDate || item.published || '';
    var ago = timeAgo(pub);
    var dateStr = formatTlDate(pub);
    var desc = (item.description || item.content || '').replace(/<[^>]+>/g,'').substring(0,140);
    if (desc.length === 140) desc += '…';

    // Is it recent (within 3 hours)?
    var isLive = false;
    if (pub) {
      var diffH = (now - new Date(pub)) / 3600000;
      isLive = diffH < 3;
    }

    var dotClass = isLive ? 'tl-dot-live' : 'tl-dot';

    html += '<div class="tl-item" style="animation:fadeInUp 0.4s ease ' + (i*0.06) + 's both;">';
    html += '<div class="' + dotClass + '"></div>';
    html += '<div class="tl-text">';
    html += '<h4 style="font-size:14px;line-height:1.4;">';
    html += '<span class="tl-tag ' + tlTagClass[tag] + '">' + tlTagLabel[tag] + '</span>';
    if (isLive) html += '<span class="tl-live-badge">● LIVE</span>';
    html += ' <a href="' + link + '" target="_blank" style="color:#00ffa6;text-decoration:none;">' + title + '</a>';
    html += '</h4>';
    if (desc) html += '<p style="margin-top:4px;">' + desc + '</p>';
    html += '<div class="tl-source">';
    html += '<span class="tl-time-ago">' + (ago || dateStr) + '</span>';
    html += '&nbsp;·&nbsp;<a href="' + link + '" target="_blank">Read full article →</a>';
    html += '</div>';
    html += '</div></div>';
  });

  feed.innerHTML = html || '<p class="tl-error">No events found. Try another category.</p>';
}

function showTlError() {
  var feed = document.getElementById('tl-feed');
  var statusText = document.getElementById('tl-status-text');
  var statusDot = document.getElementById('tl-status-dot');
  feed.innerHTML = '<p class="tl-error">⚠ Could not load live feed. Check your connection.<br><br><button onclick="fetchTimeline(true)" style="background:#111;border:1px solid #333;color:#00ffa6;padding:7px 18px;border-radius:6px;cursor:pointer;font-size:12px;">Try Again</button></p>';
  statusText.textContent = 'Feed unavailable';
  statusDot.style.background = '#ff4444';
  statusDot.style.boxShadow = '0 0 8px #ff4444';
  scheduleNextUpdate();
}

function scheduleNextUpdate() {
  if (tlRefreshInterval) clearTimeout(tlRefreshInterval);
  tlNextUpdateTime = new Date(Date.now() + 900000); // 15 minutes
  updateNextUpdateDisplay();
  tlRefreshInterval = setTimeout(function(){ fetchTimeline(true); }, 900000);
  // Update countdown every minute
  setInterval(function(){
    if (tlNextUpdateTime) updateNextUpdateDisplay();
  }, 30000);
}

function updateNextUpdateDisplay() {
  var el = document.getElementById('tl-next-update');
  if (!el || !tlNextUpdateTime) return;
  var diff = Math.max(0, Math.floor((tlNextUpdateTime - Date.now()) / 60000));
  el.textContent = diff > 0 ? 'Next refresh in ' + diff + 'm' : 'Updating...';
}

// Fade in animation
var tlStyle = document.createElement('style');
tlStyle.textContent = '@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}';
document.head.appendChild(tlStyle);

// Init on page load
document.addEventListener('DOMContentLoaded', function() {
  fetchTimeline(true);
});


// ── AUTO-LINK ALL LIVE TAGS ON LOAD ──
document.addEventListener('DOMContentLoaded', function() {
  linkLiveTags();
});
function linkLiveTags() {
  document.querySelectorAll('.cal-table tbody tr').forEach(function(row) {
    var liveTag = row.querySelector('.tag-live');
    if (liveTag && liveTag.tagName !== 'A') {
      var eventCell = row.cells[1];
      if (eventCell) {
        var url = getLiveUrl(eventCell.textContent);
        var a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = liveTag.className;
        a.style.cssText = 'text-decoration:none;display:inline-block;';
        a.innerHTML = liveTag.innerHTML;
        liveTag.parentNode.replaceChild(a, liveTag);
      }
    }
  });
}

// ── MOBILE MENU ──
function toggleMobileMenu(){
  const btn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  btn.classList.toggle('open');
  drawer.classList.toggle('open');
}
function closeMobileMenu(){
  document.getElementById('hamburgerBtn').classList.remove('open');
  document.getElementById('mobileDrawer').classList.remove('open');
}
// Close drawer when clicking outside
document.addEventListener('click', function(e){
  const btn = document.getElementById('hamburgerBtn');
  const drawer = document.getElementById('mobileDrawer');
  if(drawer.classList.contains('open') && !drawer.contains(e.target) && !btn.contains(e.target)){
    closeMobileMenu();
  }
});

var modalContent = {
  docs: {
    title: "📄 Documentation",
    body: `<p class="modal-h">Overview</p><p class="modal-p">Crisis Intelligence is a real-time intelligence platform monitoring global energy markets, cryptocurrency markets, geopolitical risks, and maritime shipping disruptions.</p><hr class="modal-hr"><p class="modal-h">Features</p><p class="modal-p"><strong style="color:#ccc">Live Market Chart</strong> — Real-time charts for energy, crypto, and commodities via TradingView.</p><p class="modal-p"><strong style="color:#ccc">Global Risk Monitor</strong> — Geopolitical risk levels and shipping chokepoint status across key regions.</p><p class="modal-p"><strong style="color:#ccc">Energy Shipping Routes</strong> — Interactive map of major maritime shipping lanes with risk assessment.</p><p class="modal-p"><strong style="color:#ccc">Fear &amp; Greed Index</strong> — Market sentiment tracker.</p><p class="modal-p"><strong style="color:#ccc">Economic Calendar</strong> — Upcoming high-impact economic events.</p><hr class="modal-hr"><p class="modal-h">Follow Us</p><p class="modal-p">Stay updated: <a href="https://x.com/CrisisEnergy_" target="_blank" style="color:#00ffa6;">@CrisisEnergy_</a> on X (Twitter)</p>`
  },
  privacy: {
    title: "🔒 Privacy Policy",
    body: `<p class="modal-h">Data Collection</p><p class="modal-p">Crisis Intelligence does not collect, store, or sell personal data. No account registration is required.</p><hr class="modal-hr"><p class="modal-h">Third-Party Services</p><p class="modal-p">Embedded TradingView charts, map tiles from CARTO/OpenStreetMap, and public market data APIs may independently process connection metadata per their own privacy policies. We do not transmit user data to these services.</p><hr class="modal-hr"><p class="modal-h">Cookies</p><p class="modal-p">We use only essential session cookies for admin authentication. No tracking or advertising cookies are used.</p><hr class="modal-hr"><p class="modal-h">Contact</p><p class="modal-p">Privacy questions: <a href="https://x.com/CrisisEnergy_" target="_blank" style="color:#00ffa6;">@CrisisEnergy_</a> &nbsp;·&nbsp; <span style="color:#555;font-size:11px;">Last updated: March 2026</span></p>`
  },
  terms: {
    title: "📋 Terms of Service",
    body: `<p class="modal-h">1. Informational Use Only</p><p class="modal-p">All content on Crisis Intelligence is provided for <strong style="color:#ff4444">informational and educational purposes only</strong>. Nothing constitutes financial, investment, trading, legal, or professional advice of any kind.</p><hr class="modal-hr"><p class="modal-h">2. No Liability</p><p class="modal-p">Crisis Intelligence and its operators accept no liability for any trading or investment decisions made based on information displayed here. Market data may be delayed or inaccurate. Use of this platform is entirely at your own risk.</p><hr class="modal-hr"><p class="modal-h">3. Intellectual Property</p><p class="modal-p">The Crisis Intelligence name, logo, and original platform design are protected by copyright. Third-party content (market data, charts, news, map tiles) remains the property of its respective owners.</p><hr class="modal-hr"><p class="modal-h">4. Changes</p><p class="modal-p">We may update these Terms at any time. Continued use constitutes acceptance. &nbsp;·&nbsp; <span style="color:#555;font-size:11px;">Last updated: March 2026</span></p>`
  },
  license: {
    title: "⚖️ Licenses",
    body: `<p class="modal-h">Open Source Libraries</p><p class="modal-p"><strong style="color:#ccc">Leaflet.js</strong> — <a href="https://github.com/Leaflet/Leaflet/blob/main/LICENSE" target="_blank" style="color:#00ffa6;">BSD 2-Clause License</a></p><p class="modal-p"><strong style="color:#ccc">OpenStreetMap</strong> — Map data © OpenStreetMap contributors, <a href="https://opendatacommons.org/licenses/odbl/" target="_blank" style="color:#00ffa6;">ODbL</a></p><p class="modal-p"><strong style="color:#ccc">OpenSeaMap</strong> — <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" style="color:#00ffa6;">CC BY-SA 2.0</a></p><p class="modal-p"><strong style="color:#ccc">CARTO</strong> — Tiles under <a href="https://carto.com/legal/" target="_blank" style="color:#00ffa6;">CARTO tile service terms</a></p><hr class="modal-hr"><p class="modal-h">Third-Party APIs</p><p class="modal-p"><strong style="color:#ccc">TradingView</strong> — Charts embedded under widget license. <a href="https://www.tradingview.com/policies/" target="_blank" style="color:#00ffa6;">TradingView Policies</a></p><p class="modal-p"><strong style="color:#ccc">Binance</strong> — Public API. <a href="https://www.binance.com/en/terms" target="_blank" style="color:#00ffa6;">Binance Terms</a></p><p class="modal-p"><strong style="color:#ccc">CoinGecko</strong> — Free public API. <a href="https://www.coingecko.com/en/api/terms" target="_blank" style="color:#00ffa6;">CoinGecko API Terms</a></p><p class="modal-p"><strong style="color:#ccc">Yahoo Finance</strong> — Public API for energy/commodity prices.</p><p class="modal-p"><strong style="color:#ccc">metals.live</strong> — Precious metals spot prices.</p><p class="modal-p" style="color:#555;font-size:11px;margin-top:16px;">© 2026 Crisis Intelligence. All rights reserved.</p>`
  },
  dataattrib: {
    title: "📡 Data Sources",
    body: `<p class="modal-h">Charts</p><p class="modal-p">Powered by <a href="https://www.tradingview.com/" target="_blank" style="color:#00ffa6;">TradingView</a> free widget. Chart data is owned by TradingView Inc. and its data partners.</p><hr class="modal-hr"><p class="modal-h">Cryptocurrency Prices</p><p class="modal-p"><a href="https://www.binance.com/" target="_blank" style="color:#00ffa6;">Binance</a> public WebSocket API (real-time) and <a href="https://www.coingecko.com/" target="_blank" style="color:#00ffa6;">CoinGecko</a> public REST API (fallback). Data for display only — not for resale.</p><hr class="modal-hr"><p class="modal-h">Energy &amp; Commodities</p><p class="modal-p"><a href="https://finance.yahoo.com/" target="_blank" style="color:#00ffa6;">Yahoo Finance</a> and <a href="https://metals.live/" target="_blank" style="color:#00ffa6;">metals.live</a> public APIs. Prices may be delayed up to 15 minutes. Not suitable for real-time trading.</p><hr class="modal-hr"><p class="modal-h">Maps</p><p class="modal-p">Base tiles: © <a href="https://carto.com/attributions" target="_blank" style="color:#00ffa6;">CARTO</a>. Map data: © <a href="https://www.openstreetmap.org/copyright" target="_blank" style="color:#00ffa6;">OpenStreetMap contributors</a> (ODbL). Nautical: © <a href="https://www.openseamap.org" target="_blank" style="color:#00ffa6;">OpenSeaMap</a> (CC BY-SA). Shipping routes are illustrative approximations.</p><hr class="modal-hr"><p class="modal-h">News</p><p class="modal-p">Headlines aggregated from public RSS feeds. Only titles are shown — no article body is reproduced or stored. All rights remain with original publishers. Every headline links to its source.</p><p class="modal-p" style="color:#555;font-size:11px;">Last updated: March 2026</p>`
  }
};
function openModal(key) {
  var data = modalContent[key];
  if (!data) return;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalBody').innerHTML = data.body;
  var modal = document.getElementById('infoModal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('infoModal').style.display = 'none';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

// Inject news-dot span into every risk-item
document.querySelectorAll('.risk-item').forEach(function(el){
  var dot = document.createElement('div');
  dot.className = 'risk-news-dot';
  el.appendChild(dot);
  el.addEventListener('click', function(){ openRiskModal(el.id); });
});

function openRiskModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  var region = el.querySelector('.region') ? el.querySelector('.region').textContent : id;
  var modal = document.getElementById('riskNewsModal');
  var titleEl = document.getElementById('riskModalTitle');
  var metaEl  = document.getElementById('riskModalMeta');
  var actionEl= document.getElementById('riskModalAction');
  document.getElementById('riskModalRegion').textContent = region;

  var item = riskNewsCache[id];
  if (item) {
    titleEl.textContent = item.title;
    var ago = timeAgo(item.pubDate);
    var src = item.source || 'News';
    metaEl.innerHTML = '<span class="meta-src">📰 ' + src + '</span>' +
      (ago ? '<span style="color:#444">·</span><span>' + ago + '</span>' : '');
    actionEl.innerHTML = '<a class="risk-modal-read" href="' + item.link + '" target="_blank" rel="noopener noreferrer">Read full article ↗</a>';
  } else {
    titleEl.textContent = '';
    metaEl.innerHTML = '';
    actionEl.innerHTML = '<div class="risk-modal-no-news">No recent headlines matched for this region.</div>';
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRiskModal() {
  document.getElementById('riskNewsModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeRiskModal(); });

(function(){
  // ── State ──
  var gciData = {
    energy:  { score:82, delta:+2.1, label:'HIGH',     history:[70,72,75,78,80,81,82] },
    crypto:  { score:54, delta:-1.4, label:'MEDIUM',   history:[60,58,57,55,54,53,54] },
    supply:  { score:77, delta:+4.8, label:'HIGH',     history:[65,68,70,72,74,76,77] },
    geo:     { score:91, delta:+5.3, label:'CRITICAL', history:[78,80,83,85,87,89,91] }
  };

  function composite(d){ return Math.round((d.energy.score+d.crypto.score+d.supply.score+d.geo.score)/4); }

  function levelColor(lbl){
    return lbl==='CRITICAL'?'#ff4444':lbl==='HIGH'?'#ff8844':lbl==='MEDIUM'?'#ffaa00':'#00ffa6';
  }
  function levelBg(lbl){
    return lbl==='CRITICAL'?'rgba(255,30,30,0.15)':lbl==='HIGH'?'rgba(255,68,68,0.12)':lbl==='MEDIUM'?'rgba(255,170,0,0.12)':'rgba(0,255,166,0.08)';
  }
  function levelBorder(lbl){
    return lbl==='CRITICAL'?'rgba(255,30,30,0.35)':lbl==='HIGH'?'rgba(255,68,68,0.25)':lbl==='MEDIUM'?'rgba(255,170,0,0.25)':'rgba(0,255,166,0.2)';
  }

  function scoreToLabel(s){
    if(s>=85) return 'CRITICAL';
    if(s>=65) return 'HIGH';
    if(s>=40) return 'MEDIUM';
    return 'LOW';
  }

  function updateUI(d){
    // Composite
    var comp = composite(d);
    var compLabel = scoreToLabel(comp);
    var compColor = levelColor(compLabel);
    document.getElementById('gci-score-num').textContent = comp;
    document.getElementById('gci-score-num').style.color = compColor;
    document.getElementById('gci-score-num').style.textShadow = '0 0 20px '+compColor+'88';
    var lbl = document.getElementById('gci-score-label');
    lbl.textContent = compLabel;
    lbl.style.color = compColor;
    lbl.style.background = levelBg(compLabel);
    lbl.style.borderColor = levelBorder(compLabel);
    document.getElementById('gci-score-bar').style.width = comp+'%';
    document.getElementById('gci-score-bar').style.background = comp>=85?'linear-gradient(90deg,#ff6600,#ff0000)':comp>=65?'linear-gradient(90deg,#ffaa00,#ff4444)':'linear-gradient(90deg,#ffdd00,#ffaa00)';

    // Composite delta
    var totalDelta = ((d.energy.delta+d.crypto.delta+d.supply.delta+d.geo.delta)/4).toFixed(1);
    var dEl = document.getElementById('gci-delta');
    dEl.textContent = (totalDelta>0?'▲ +':'▼ ')+totalDelta;
    dEl.style.color = totalDelta>0?'#ff4444':'#00ffa6';

    // Per-category
    var cats = [
      {key:'energy', scoreEl:'gci-energy-score', barEl:'gci-energy-bar', badgeEl:'gci-energy-badge', deltaEl:'gci-energy-delta'},
      {key:'crypto', scoreEl:'gci-crypto-score', barEl:'gci-crypto-bar', badgeEl:'gci-crypto-badge', deltaEl:'gci-crypto-delta'},
      {key:'supply', scoreEl:'gci-supply-score', barEl:'gci-supply-bar', badgeEl:'gci-supply-badge', deltaEl:'gci-supply-delta'},
      {key:'geo',    scoreEl:'gci-geo-score',    barEl:'gci-geo-bar',    badgeEl:'gci-geo-badge',    deltaEl:'gci-geo-delta'},
    ];
    cats.forEach(function(c){
      var cat = d[c.key];
      cat.label = scoreToLabel(cat.score);
      document.getElementById(c.scoreEl).textContent = cat.score;
      document.getElementById(c.barEl).style.width = cat.score+'%';
      var badge = document.getElementById(c.badgeEl);
      badge.textContent = cat.label;
      badge.style.color = levelColor(cat.label);
      badge.style.background = levelBg(cat.label);
      badge.style.borderColor = levelBorder(cat.label);
      var dE = document.getElementById(c.deltaEl);
      dE.textContent = (cat.delta>0?'▲ +':'▼ ')+Math.abs(cat.delta).toFixed(1)+' today';
      dE.style.color = cat.delta>0?'#ff4444':'#00ffa6';
    });

    // Last update
    var now = new Date();
    document.getElementById('gci-last-update').textContent =
      'Updated ' + now.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});

    drawSparkline(d);
  }

  // ── Sparkline Canvas ──
  function drawSparkline(d){
    var canvas = document.getElementById('gciSparkCanvas');
    if(!canvas) return;
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio||1);
    canvas.height = 70 * (window.devicePixelRatio||1);
    var ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1);
    var W = canvas.offsetWidth, H = 70;
    ctx.clearRect(0,0,W,H);

    var series = [
      {data:d.energy.history, color:'#ff9a3c'},
      {data:d.crypto.history,  color:'#a259ff'},
      {data:d.supply.history,  color:'#00c8ff'},
      {data:d.geo.history,     color:'#ff4444'},
    ];

    series.forEach(function(s){
      var min=Math.min.apply(null,s.data), max=Math.max.apply(null,s.data);
      var range = max-min || 10;
      var pad = 6;
      ctx.beginPath();
      s.data.forEach(function(v,i){
        var x = pad + (i/(s.data.length-1))*(W-2*pad);
        var y = H-pad - ((v-min)/range)*(H-2*pad);
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      });
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      // Dot at end
      var last = s.data[s.data.length-1];
      var lx = W-pad;
      var ly = H-pad - ((last-min)/range)*(H-2*pad);
      ctx.beginPath();
      ctx.arc(lx,ly,3,0,Math.PI*2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = 1;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // ── Simulated Real-Time Updates ──
  // In production, this would call a real API.
  // Here we simulate small fluctuations every 12 seconds.
  function nudge(val, max, min){
    var delta = (Math.random()-0.5)*2.5;
    return Math.min(max, Math.max(min, Math.round((val+delta)*10)/10));
  }

  function tick(){
    // Nudge scores
    gciData.energy.score = nudge(gciData.energy.score, 95, 30);
    gciData.crypto.score = nudge(gciData.crypto.score, 95, 20);
    gciData.supply.score = nudge(gciData.supply.score, 95, 30);
    gciData.geo.score    = nudge(gciData.geo.score,    98, 60);

    // Update deltas
    gciData.energy.delta = parseFloat(((Math.random()-0.4)*4).toFixed(1));
    gciData.crypto.delta = parseFloat(((Math.random()-0.5)*3).toFixed(1));
    gciData.supply.delta = parseFloat(((Math.random()-0.4)*4).toFixed(1));
    gciData.geo.delta    = parseFloat(((Math.random()-0.3)*5).toFixed(1));

    // Shift history
    ['energy','crypto','supply','geo'].forEach(function(k){
      gciData[k].history.push(gciData[k].score);
      if(gciData[k].history.length>7) gciData[k].history.shift();
    });

    updateUI(gciData);
  }

  // Integrate with real market data from the existing ticker/crypto prices
  // Energy score nudged by BTC change direction as a proxy
  function syncWithMarketData(){
    var btcEl = document.querySelector('.tick-item .tick-up, .tick-item .tick-down');
    if(btcEl){
      var isUp = btcEl.classList.contains('tick-up');
      // If crypto market is up, stress goes down a bit
      gciData.crypto.score = Math.max(20, Math.min(95, gciData.crypto.score + (isUp ? -0.5 : 0.5)));
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateUI(gciData);
    setInterval(function(){
      syncWithMarketData();
      tick();
    }, 12000);
    // Redraw sparkline on resize
    window.addEventListener('resize', function(){ drawSparkline(gciData); });
  });
})();