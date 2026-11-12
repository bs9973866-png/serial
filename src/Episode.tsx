import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const SCENE = 32 * FPS;

type PersonProps = {
  x: number; y: number; scale?: number; coat: string; hair: string;
  skin?: string; facing?: "left" | "right"; mood?: "calm" | "sad" | "smile";
  accent?: string; frame?: number;
};

const Person: React.FC<PersonProps> = ({
  x,y,scale=1,coat,hair,skin="#E8B99B",facing="right",mood="calm",accent="#F4D7C5",frame=0
}) => {
  const flip = facing === "left" ? -1 : 1;
  const blink = Math.sin(frame / 53) > 0.985 ? 0.12 : 1;
  const sway = Math.sin(frame / 41) * 0.65;
  return (
    <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${scale * flip} ${scale})`}>
      <ellipse cx="0" cy="0" rx="91" ry="19" fill="#080916" opacity=".38"/>
      {/* Legs, shoes and layered clothing give the characters a solid silhouette. */}
      <path d="M-43 -78 L-48 -12 Q-49 0 -34 0 L-13 0 L-7 -75Z" fill="#252B40"/>
      <path d="M7 -75 L13 0 L37 0 Q51 0 47 -13 L42 -78Z" fill="#252B40"/>
      <path d="M-48 -13 Q-42 -4 -10 -7 L-8 0 L-38 3 Q-54 2 -48 -13Z" fill="#171B2B"/>
      <path d="M12 -7 L45 -13 Q52 -2 39 3 L14 2Z" fill="#171B2B"/>
      <path d="M-48 -3 Q-65 0 -69 12 Q-48 19 -15 12 L-13 3Z" fill="#111827"/>
      <path d="M13 3 L15 12 Q48 19 69 12 Q65 0 48 -3Z" fill="#111827"/>
      <path d="M-48 -177 Q0 -204 48 -177 L57 -73 Q4 -47 -56 -73Z" fill={coat}/>
      <path d="M-36 -168 L-7 -139 L-23 -92 L-49 -111Z" fill={accent} opacity=".16"/>
      <path d="M36 -168 L7 -139 L23 -92 L49 -111Z" fill="#080916" opacity=".12"/>
      <path d="M-7 -174 L0 -137 L8 -174" fill="none" stroke={accent} strokeWidth="4" opacity=".7"/>
      {/* Sleeves and hands */}
      <path d="M-43 -169 Q-65 -157 -72 -111 L-86 -67 Q-89 -54 -76 -49 Q-63 -47 -58 -62 L-37 -111Z" fill={coat}/>
      <path d="M43 -169 Q65 -157 72 -111 L86 -67 Q89 -54 76 -49 Q63 -47 58 -62 L37 -111Z" fill={coat}/>
      <path d="M-83 -60 Q-91 -51 -82 -42 Q-72 -35 -63 -49 L-60 -62Z" fill={skin}/>
      <path d="M83 -60 Q91 -51 82 -42 Q72 -35 63 -49 L60 -62Z" fill={skin}/>
      <path d="M-28 -178 Q-31 -196 -25 -207 L25 -207 Q31 -196 28 -178" fill={skin}/>
      {/* Face and hair */}
      <path d="M-43 -224 Q-48 -263 0 -267 Q49 -264 43 -224 L37 -190 Q27 -166 0 -164 Q-28 -166 -38 -190Z" fill={skin}/>
      <path d="M-46 -229 Q-57 -280 2 -280 Q58 -276 48 -222 L32 -237 Q11 -251 -12 -232 L-34 -210Z" fill={hair}/>
      <path d="M-43 -230 Q-61 -210 -43 -177 L-29 -190 L-31 -225 M35 -240 Q59 -221 43 -181 L30 -194Z" fill={hair}/>
      <path d="M-23 -214 Q-13 -220 -5 -214 M12 -214 Q22 -220 30 -213" stroke="#3A2930" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <circle cx="-14" cy="-207" r="3" fill="#282333" opacity={blink}/><circle cx="20" cy="-207" r="3" fill="#282333" opacity={blink}/>
      <path d={mood === "smile" ? "M-9 -184 Q2 -173 14 -184" : mood === "sad" ? "M-8 -177 Q2 -184 13 -177" : "M-8 -180 L13 -180"} stroke="#8A4F55" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M-28 -155 L0 -132 L29 -155" fill="none" stroke={accent} strokeWidth="5" opacity=".8"/>
      <path d="M-24 -122 L-5 -108 L-24 -91 M24 -122 L5 -108 L24 -91" stroke={accent} strokeWidth="4" fill="none" opacity=".7"/>
      <path d="M-48 -73 Q0 -55 48 -73" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity=".12"/>
    </g>
  );
};

const WindowLight: React.FC<{x:number;y:number;w:number;h:number}> = ({x,y,w,h}) => (
  <g opacity=".85">
    <rect x={x} y={y} width={w} height={h} rx="8" fill="#9CC6E8" opacity=".16"/>
    <path d={`M${x+w/2} ${y} V${y+h} M${x} ${y+h/2} H${x+w}`} stroke="#B7D9F4" strokeWidth="8" opacity=".3"/>
    <path d={`M${x+12} ${y+h} L${x+w+120} ${y+h+220} H${x+120}Z`} fill="#E8B9A0" opacity=".08"/>
  </g>
);

const Backdrop: React.FC<{place:number;frame:number}> = ({place,frame}) => {
  const drift = interpolate(frame,[0,SCENE],[0,24],{extrapolateRight:"clamp"});
  if (place === 0 || place === 2 || place === 5 || place === 8) {
    return <g>
      <rect width={W} height={H} fill="#171C31"/>
      <rect y="0" width={W} height="730" fill="#202941"/>
      <rect y="730" width={W} height="350" fill="#343447"/>
      <path d="M0 730 H1920" stroke="#77758B" strokeWidth="5" opacity=".5"/>
      <WindowLight x={180-drift} y={110} w={320} h={430}/>
      <WindowLight x={650-drift} y={110} w={320} h={430}/>
      <WindowLight x={1120-drift} y={110} w={320} h={430}/>
      <rect x="1450" y="510" width="310" height="220" rx="8" fill="#343A50"/>
      <rect x="1480" y="540" width="250" height="18" fill="#71738A"/>
      <rect x="1480" y="580" width="250" height="18" fill="#71738A"/>
      <rect x="1480" y="620" width="250" height="18" fill="#71738A"/>
      <g fill="#D3BDA2" opacity=".75">
        <rect x="250" y="700" width="390" height="25" rx="6"/>
        <rect x="290" y="725" width="18" height="100"/><rect x="580" y="725" width="18" height="100"/>
        <rect x="830" y="700" width="390" height="25" rx="6"/>
        <rect x="870" y="725" width="18" height="100"/><rect x="1160" y="725" width="18" height="100"/>
      </g>
      <text x="960" y="80" textAnchor="middle" fill="#AEBBD4" fontSize="24" letterSpacing="12">ШКОЛА № 17</text>
    </g>;
  }
  if (place === 1 || place === 4 || place === 6) {
    return <g>
      <rect width={W} height={H} fill="#1A2035"/>
      <path d="M0 0 H1920 V770 L0 890Z" fill="#252D46"/>
      <path d="M0 0 L550 0 L340 820 L0 900Z" fill="#30364D"/>
      <path d="M0 900 L1920 760 V1080 H0Z" fill="#39364A"/>
      {Array.from({length:8},(_,i)=><g key={i}>
        <rect x={180+i*220} y={100+i%2*20} width="125" height="610" rx="12" fill="#131B2E" opacity=".9"/>
        <rect x={194+i*220} y={118+i%2*20} width="97" height="575" rx="8" fill={i%2?"#35415C":"#3B405A"}/>
      </g>)}
      <path d="M0 885 L1920 760" stroke="#77758A" strokeWidth="8" opacity=".35"/>
      <text x="960" y="90" textAnchor="middle" fill="#AEBBD4" fontSize="23" letterSpacing="12">КОРИДОР</text>
    </g>;
  }
  if (place === 9) {
    const lampPulse = 0.78 + Math.sin(frame/31)*0.035;
    return <g>
      <rect width={W} height={H} fill="#0B1020"/>
      <rect y="0" width={W} height="780" fill="#151A2D"/>
      <path d="M0 780 H1920 V1080 H0Z" fill="#272438"/>
      <rect x="1280" y="110" width="390" height="410" rx="10" fill="#0B1020"/>
      <rect x="1298" y="128" width="354" height="374" rx="5" fill="#26334A"/>
      <path d="M1475 128 V502 M1298 315 H1652" stroke="#75819B" strokeWidth="8" opacity=".5"/>
      <path d="M1298 360 Q1450 285 1652 375 V502 H1298Z" fill="#6B6381" opacity=".28"/>
      <rect x="260" y="560" width="900" height="32" rx="8" fill="#59475A"/>
      <rect x="300" y="592" width="28" height="260" fill="#44394D"/>
      <rect x="1090" y="592" width="28" height="260" fill="#44394D"/>
      <rect x="340" y="480" width="145" height="80" rx="8" fill="#B48C75" opacity=".35"/>
      <path d="M410 480 Q420 390 470 405 Q505 420 485 480Z" fill="#6F806F"/>
      <path d="M410 480 Q365 420 380 395 Q420 385 440 450" fill="#809078"/>
      <rect x="760" y="490" width="250" height="70" rx="8" fill="#D8C9B3"/>
      <path d="M785 510 H980 M785 530 H940" stroke="#9E8D84" strokeWidth="4" opacity=".7"/>
      <path d="M1420 630 L1420 400 L1540 400 L1540 630Z" fill="#3B354A"/>
      <path d="M1480 400 L1480 270" stroke="#D7A77D" strokeWidth="13"/>
      <path d="M1410 275 Q1480 210 1550 275 L1530 300 H1430Z" fill="#E5B98C" opacity={lampPulse}/>
      <ellipse cx="1480" cy="360" rx="210" ry="250" fill="#E6B17D" opacity=".07"/>
      <text x="960" y="90" textAnchor="middle" fill="#AEBBD4" fontSize="23" letterSpacing="12">КОМНАТА АРТЁМА</text>
    </g>;
  }
  if (place === 3 || place === 7) {
    return <g>
      <rect width={W} height={H} fill="#101A2B"/>
      <rect y="0" width={W} height="820" fill="#17263A"/>
      <rect y="820" width={W} height="260" fill="#25283A"/>
      <WindowLight x={190} y={90} w={500} h={540}/>
      <g fill="#3C3443">
        <rect x="850" y="220" width="700" height="490" rx="10"/>
        <rect x="830" y="200" width="740" height="24" rx="8"/>
        {Array.from({length:4},(_,i)=><rect key={i} x={875} y={280+i*100} width="650" height="13" fill="#887C75" opacity=".6"/>)}
      </g>
      <g fill="#D8B98B" opacity=".8">
        <rect x="930" y="290" width="70" height="72"/><rect x="1020" y="290" width="110" height="72"/>
        <rect x="1190" y="390" width="90" height="65"/><rect x="1360" y="490" width="100" height="70"/>
      </g>
      <text x="960" y="90" textAnchor="middle" fill="#AEBBD4" fontSize="23" letterSpacing="12">БИБЛИОТЕКА</text>
    </g>;
  }
  return <g>
    <rect width={W} height={H} fill="#10182B"/>
    <rect y="0" width={W} height="650" fill="#19243C"/>
    <path d="M0 650 H1920 V1080 H0Z" fill="#25283A"/>
    <path d="M0 0 H1920 V180 Q960 250 0 180Z" fill="#11182A"/>
    <rect x="120" y="600" width="1680" height="22" rx="10" fill="#7D879D" opacity=".4"/>
    <g fill="#F5C78D" opacity=".85">
      {Array.from({length:12},(_,i)=><circle key={i} cx={130+i*150} cy={300+(i%3)*42} r="3"/>)}
    </g>
    <text x="960" y="90" textAnchor="middle" fill="#AEBBD4" fontSize="23" letterSpacing="12">ОСТАНОВКА</text>
  </g>;
};

type SceneData = {
  place:number; title:string; line:string; sub?:string; art:"alone"|"meet"|"tease"|"talk"|"note"|"walk"|"reveal"|"end";
  tint?:string;
};

const scenes:SceneData[] = [
  {place:0,title:"ЧУЖАЯ ПАРТА",line:"Я заметил её не в тот день, когда она вошла в класс.",sub:"А в тот, когда понял: она уже знает обо мне кое-что.",art:"alone"},
  {place:1,title:"ОБЫЧНОЕ УТРО",line:"Кирилл умел находить слабые места. Моё — тишина.",sub:"— Эй, художник. Опять прячешься за тетрадкой?",art:"tease"},
  {place:0,title:"НОВОЕ МЕСТО",line:"Она выбрала парту рядом со мной. Хотя свободных было полно.",sub:"— Здесь занято? — спросила Лера.",art:"meet"},
  {place:3,title:"МЕЖДУ СТРОК",line:"В библиотеке она увидела рисунок, который я никому не показывал.",sub:"— Ты всё ещё рисуешь такие окна?",art:"talk"},
  {place:1,title:"ЧУЖИЕ СЛОВА",line:"Кирилл сказал, что Лера общается со мной из жалости.",sub:"Я сделал вид, что мне всё равно. Получилось плохо.",art:"tease"},
  {place:0,title:"ПОСЛЕ ЗВОНКА",line:"Она оставила на моей парте маленькую записку.",sub:"«Приходи в библиотеку. Мне нужно кое-что спросить».",art:"note"},
  {place:3,title:"СТАРЫЙ РИСУНОК",line:"Лера узнала рисунок. И почему-то сразу перестала улыбаться.",sub:"— Откуда он у тебя? — тихо спросила она.",art:"reveal"},
  {place:7,title:"ТО, ЧТО ПОМНИТ ОНА",line:"Она рассказала, что видела этот рисунок много лет назад.",sub:"— Ты тогда сказал, что однажды закончишь его.",art:"talk"},
  {place:8,title:"ПОЧЕРК",line:"Вечером я нашёл в тетради ещё одну записку.",sub:"Почерк был мой. Но я не помнил, чтобы писал это.",art:"note"},
  {place:9,title:"НЕЗАКОНЧЕННАЯ ИСТОРИЯ",line:"На листке стояла дата трёхлетней давности.",sub:"«Если ты это читаешь — значит, Лера всё-таки вернулась».",art:"end"}
];

const CharacterStage: React.FC<{art:SceneData["art"];frame:number}> = ({art,frame}) => {
  const bob = Math.sin(frame/17)*7;
  const slide = interpolate(frame,[0,SCENE],[80,0],{extrapolateRight:"clamp"});
  return (
    <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0}}>
      {art === "alone" && <>
        <Person x={690} y={890+bob} scale={1.18} coat="#303C58" hair="#25202B" frame={frame} mood="sad"/>
        <g transform={`translate(840 710) rotate(-5) scale(${interpolate(frame,[0,SCENE],[.92,1],{extrapolateRight:"clamp"})})`}>
          <rect width="200" height="150" rx="12" fill="#E9E3D6"/>
          <rect x="12" y="12" width="176" height="126" rx="5" fill="#F4F0E8"/>
          <path d="M28 112 V42 H102 V112 M28 76 H102 M65 42 V112" stroke="#78869B" strokeWidth="4" fill="none"/>
          <path d="M108 112 Q130 82 150 93 T178 55" stroke="#6D7895" strokeWidth="4" fill="none"/>
          <path d="M20 20 V130" stroke="#C18FA7" strokeWidth="2" opacity=".7"/>
          <path d="M40 122 H170" stroke="#A8A2A0" strokeWidth="2" opacity=".55"/>
        </g>
        <path d="M1020 180 Q1260 80 1430 200" stroke="#9AA9C6" strokeWidth="3" strokeDasharray="8 18" opacity=".35" fill="none"/>
      </>}
      {art === "tease" && <>
        <Person x={620+slide} y={895+bob} scale={1.08} coat="#303C58" hair="#25202B" frame={frame} mood="sad"/>
        <Person x={1160-slide*.4} y={895-bob} scale={1.1} coat="#6A3C55" hair="#191A28" frame={frame} mood="calm" facing="left"/>
        <g transform="translate(1130 440)">
          <path d="M0 0 Q150 -80 300 0 L270 120 Q140 150 20 115Z" fill="#111827" opacity=".9"/>
          <text x="150" y="48" textAnchor="middle" fill="#E7DDEB" fontSize="25">ОПЯТЬ РИСУЕШЬ?</text>
          <text x="150" y="84" textAnchor="middle" fill="#C7BDCF" fontSize="18">ХУДОЖНИК НАШЁЛСЯ.</text>
        </g>
      </>}
      {art === "meet" && <>
        <Person x={690} y={895+bob} scale={1.12} coat="#303C58" hair="#25202B" frame={frame} mood="calm"/>
        <Person x={1220-interpolate(frame,[0,SCENE],[160,0],{extrapolateRight:"clamp"})} y={895-bob} scale={1.1} coat="#B4A4C8" hair="#6A4358" frame={frame} mood="smile" facing="left" accent="#F5D7E8"/>
        <g transform="translate(950 405)">
          <rect width="350" height="105" rx="24" fill="#F1EAF0"/><path d="M42 105 L25 142 L90 105" fill="#F1EAF0"/>
          <text x="175" y="66" textAnchor="middle" fill="#343046" fontSize="32">Здесь занято?</text>
        </g>
      </>}
      {art === "talk" && <>
        <Person x={670} y={900+bob} scale={1.12} coat="#303C58" hair="#25202B" frame={frame} mood="calm"/>
        <Person x={1200} y={900-bob} scale={1.12} coat="#B4A4C8" hair="#6A4358" frame={frame} mood="smile" facing="left" accent="#F5D7E8"/>
        <g transform="translate(720 360)">
          <rect width="480" height="210" rx="18" fill="#E8E3DB"/>
          <rect x="24" y="24" width="432" height="162" rx="8" fill="#C7D1D8"/>
          <path d="M55 150 Q120 30 210 100 T410 58" stroke="#566C87" strokeWidth="8" fill="none"/>
          <path d="M55 160 L420 160" stroke="#8796A5" strokeWidth="4"/>
        </g>
      </>}
      {art === "note" && <>
        <Person x={710} y={900+bob} scale={1.14} coat="#303C58" hair="#25202B" frame={frame} mood="sad"/>
        <g transform={`translate(${1020} ${650+Math.sin(frame/20)*8}) rotate(-7)`}>
          <rect width="330" height="220" rx="12" fill="#F3E9D8"/>
          <path d="M35 65 H280 M35 105 H240 M35 145 H260" stroke="#A7A0A0" strokeWidth="4" opacity=".6"/>
          <path d="M35 180 Q130 145 250 180" stroke="#9C6684" strokeWidth="5" fill="none"/>
          <text x="165" y="48" textAnchor="middle" fill="#4B4353" fontSize="20" letterSpacing="3">ЛЕРА</text>
          <text x="165" y="98" textAnchor="middle" fill="#4B4353" fontSize="23">Приходи в библиотеку.</text>
          <text x="165" y="132" textAnchor="middle" fill="#4B4353" fontSize="21">Мне нужно спросить.</text>
          <path d="M105 170 Q165 160 225 170" stroke="#A46E8A" strokeWidth="3" fill="none"/>
        </g>
      </>}
      {art === "reveal" && <>
        <Person x={690} y={900+bob} scale={1.1} coat="#303C58" hair="#25202B" frame={frame} mood="calm"/>
        <Person x={1220} y={900-bob} scale={1.1} coat="#B4A4C8" hair="#6A4358" frame={frame} mood="sad" facing="left" accent="#F5D7E8"/>
        <g transform="translate(820 390) rotate(3)">
          <rect width="330" height="245" rx="8" fill="#EEE7D9"/>
          <rect x="18" y="18" width="294" height="209" rx="4" fill="#C6D3D8"/>
          <path d="M42 185 Q95 30 160 125 T285 75" stroke="#5E6C89" strokeWidth="8" fill="none"/>
          <text x="165" y="213" textAnchor="middle" fill="#46516A" fontSize="18">2019</text>
        </g>
      </>}
      {art === "walk" && <>
        <Person x={690+Math.sin(frame/15)*25} y={900+bob} scale={1.08} coat="#303C58" hair="#25202B" frame={frame} mood="calm"/>
        <Person x={1160+Math.sin(frame/15)*25} y={900-bob} scale={1.08} coat="#B4A4C8" hair="#6A4358" frame={frame} mood="smile" facing="left" accent="#F5D7E8"/>
      </>}
      {art === "end" && <>
        <Person x={700} y={900+bob} scale={1.1} coat="#303C58" hair="#25202B" frame={frame} mood="sad"/>
        <g transform="translate(980 430) rotate(-4)">
          <rect width="360" height="250" rx="10" fill="#F4EBDC"/>
          <path d="M45 70 H310 M45 112 H285 M45 154 H300" stroke="#A9A0A0" strokeWidth="4"/>
          <path d="M52 38 Q115 22 168 38" stroke="#B78BA3" strokeWidth="3" fill="none" opacity=".8"/>
          <text x="180" y="184" textAnchor="middle" fill="#7E4C6B" fontSize="22" letterSpacing="2">2019</text>
          <text x="180" y="218" textAnchor="middle" fill="#4D4052" fontSize="16">ЕСЛИ ТЫ ЭТО ЧИТАЕШЬ...</text>
        </g>
        <circle cx="1450" cy="270" r="160" fill="#B18ABF" opacity={interpolate(frame,[0,SCENE],[0,.16],{extrapolateRight:"clamp"})}/>
      </>}
    </svg>
  );
};

const Dust: React.FC<{frame:number}> = ({frame}) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0,pointerEvents:"none"}}>
    {Array.from({length:34},(_,i)=>{
      const x = (i*173 + Math.sin(frame/48+i*2.1)*28 + 1920) % 1920;
      const y = (i*97 - frame*(0.18+(i%4)*0.08) + 1300) % 1080;
      const r = 1.4 + (i%4)*0.65;
      const opacity = 0.08 + ((i*7)%5)*0.025;
      return <circle key={i} cx={x} cy={y} r={r} fill="#F5DCCB" opacity={opacity}/>;
    })}
  </svg>
);

const Scene: React.FC<{data:SceneData;index:number}> = ({data,index}) => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame,[0,24],[0,1],{extrapolateRight:"clamp"});
  const outro = interpolate(frame,[SCENE-24,SCENE],[1,0],{extrapolateLeft:"clamp"});
  const zoom = interpolate(frame,[0,SCENE],[1.055,1.015],{extrapolateRight:"clamp"});
  const cameraX = interpolate(frame,[0,SCENE],[18,-18],{extrapolateRight:"clamp"});
  const captionY = interpolate(frame,[8,30],[70,0],{extrapolateRight:"clamp"});
  return (
    <AbsoluteFill style={{backgroundColor:"#101525",overflow:"hidden"}}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0,transform:`translateX(${cameraX}px) scale(${zoom})`,transformOrigin:"center center"}}>
        <Backdrop place={data.place} frame={frame}/>
        <rect width={W} height={H} fill="#080C18" opacity=".22"/>
        <rect width={W} height={H} fill="url(#shade)"/>
        <defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060914" stopOpacity=".2"/><stop offset=".7" stopColor="#060914" stopOpacity="0"/><stop offset="1" stopColor="#060914" stopOpacity=".55"/></linearGradient></defs>
      </svg>
      <div style={{position:"absolute",inset:0,transform:`translateX(${cameraX}px) scale(${zoom})`,transformOrigin:"center center"}}><CharacterStage art={data.art} frame={frame}/></div>
      <AbsoluteFill style={{pointerEvents:"none",background:"radial-gradient(ellipse at 50% 42%, transparent 38%, rgba(3,5,14,.28) 100%)"}}/>
      <AbsoluteFill style={{pointerEvents:"none",background:"linear-gradient(180deg, rgba(3,5,14,.34) 0%, transparent 18%, transparent 76%, rgba(3,5,14,.42) 100%)"}}/>
      <Dust frame={frame}/>
      <div style={{position:"absolute",top:0,left:0,right:0,height:22,background:"#050711",opacity:.72}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:22,background:"#050711",opacity:.72}}/>
      <AbsoluteFill style={{justifyContent:"flex-end",padding:"0 120px 110px",opacity:intro*outro,transform:`translateY(${captionY}px)`}}>
        <div style={{width:10,height:80,background:"#D7A7C9",marginBottom:24,boxShadow:"0 0 24px #D7A7C9"}}/>
        <div style={{fontFamily:"Arial, sans-serif",fontSize:23,letterSpacing:9,color:"#D7A7C9",fontWeight:700,marginBottom:18}}>{String(index+1).padStart(2,"0")} / 10　{data.title}</div>
        <div style={{fontFamily:"Arial, sans-serif",fontSize:43,lineHeight:1.28,color:"#F6F1F4",fontWeight:500,maxWidth:1450,textShadow:"0 5px 25px #000"}}>{data.line}</div>
        {data.sub && <div style={{fontFamily:"Arial, sans-serif",fontSize:29,lineHeight:1.35,color:"#C9C6D4",marginTop:20,maxWidth:1250}}>{data.sub}</div>}
      </AbsoluteFill>
      <div style={{position:"absolute",right:70,top:56,color:"#B9AFC7",fontSize:18,letterSpacing:5,fontFamily:"Arial",opacity:.75}}>ЧУЖАЯ ПАРТА</div>
      <div style={{position:"absolute",left:0,bottom:0,height:5,width:`${(frame/SCENE)*100}%`,background:"#D7A7C9",boxShadow:"0 0 18px #D7A7C9"}}/>
    </AbsoluteFill>
  );
};

const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame,[0,25,105,140],[0,1,1,0],{extrapolateRight:"clamp"});
  const scale = interpolate(frame,[0,140],[1.08,1],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:"radial-gradient(ellipse at 50% 45%, #4A354D 0%, #171B31 48%, #080B15 100%)",justifyContent:"center",alignItems:"center",opacity}}>
    <div style={{transform:`scale(${scale})`,textAlign:"center"}}>
      <div style={{fontFamily:"Arial",fontSize:24,letterSpacing:15,color:"#D7A7C9",marginBottom:28}}>ИСТОРИЯ, КОТОРУЮ Я НЕ ПОМНИЛ</div>
      <div style={{fontFamily:"Arial",fontSize:112,fontWeight:800,letterSpacing:8,color:"#F7F0F5",textShadow:"0 0 45px #D7A7C9"}}>ЧУЖАЯ ПАРТА</div>
      <div style={{fontFamily:"Arial",fontSize:27,letterSpacing:7,color:"#B9B0C6",marginTop:34}}>СЕРИЯ 01 · ВОЗВРАЩЕНИЕ</div>
      <div style={{width:180,height:3,background:"#D7A7C9",margin:"45px auto 0",boxShadow:"0 0 20px #D7A7C9"}}/>
    </div>
  </AbsoluteFill>;
};

const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame,[0,20,110,150],[0,1,1,0],{extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:"#090D19",justifyContent:"center",alignItems:"center",opacity}}>
    <div style={{fontFamily:"Arial",fontSize:58,color:"#F5EDF3",letterSpacing:6,textAlign:"center"}}>А ТЫ БЫ ВСПОМНИЛ?</div>
    <div style={{fontFamily:"Arial",fontSize:25,color:"#BDAFC2",letterSpacing:7,marginTop:35}}>ПРОДОЛЖЕНИЕ СЛЕДУЕТ</div>
  </AbsoluteFill>;
};

export const Episode: React.FC = () => {
  return (
    <AbsoluteFill style={{background:"#080B15"}}>
      <Sequence from={0} durationInFrames={150}><Opening/></Sequence>
      {scenes.map((scene,i)=>(
        <Sequence key={i} from={150+i*SCENE} durationInFrames={SCENE}>
          <Scene data={scene} index={i}/>
        </Sequence>
      ))}
      <Sequence from={150+scenes.length*SCENE} durationInFrames={150}><Closing/></Sequence>
    </AbsoluteFill>
  );
};
