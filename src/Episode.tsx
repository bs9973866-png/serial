import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from "remotion";

const W = 1920;
const H = 1080;
const FPS = 30;
const SCENE = 32 * FPS;

type PersonProps = {
  x: number; y: number; scale?: number; coat: string; hair: string;
  skin?: string; facing?: "left" | "right"; mood?: "calm" | "sad" | "smile";
  accent?: string;
};

const Person: React.FC<PersonProps> = ({
  x,y,scale=1,coat,hair,skin="#E8B99B",facing="right",mood="calm",accent="#F4D7C5"
}) => {
  const flip = facing === "left" ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * flip} ${scale})`}>
      <ellipse cx="0" cy="0" rx="94" ry="22" fill="#080916" opacity=".38"/>
      <path d="M-47 -180 L-63 -35 Q-3 -6 58 -35 L43 -181 Q0 -211 -47 -180Z" fill={coat}/>
      <path d="M-43 -40 L-55 0 L-33 0 L-12 -38 M14 -38 L34 0 L57 0 L43 -43" fill="#22263A"/>
      <path d="M-31 -174 L-48 -103 L-26 -93 L-5 -151 M28 -174 L49 -108 L27 -96 L8 -150" fill={coat}/>
      <path d="M-40 -183 Q-48 -256 0 -258 Q52 -255 43 -182 L29 -160 L-29 -160Z" fill={skin}/>
      <path d="M-43 -205 Q-53 -274 5 -271 Q57 -267 47 -207 L31 -223 Q10 -242 -12 -222 L-32 -194Z" fill={hair}/>
      <path d="M-40 -208 Q-57 -191 -39 -170 L-27 -181 L-28 -215 M35 -224 Q58 -211 42 -177 L29 -186Z" fill={hair}/>
      <path d="M-22 -206 Q-12 -212 -4 -206 M12 -206 Q22 -212 29 -205" stroke="#3A2930" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d={mood === "smile" ? "M-9 -183 Q2 -173 14 -183" : mood === "sad" ? "M-8 -177 Q2 -184 13 -177" : "M-8 -180 L13 -180"} stroke="#8A4F55" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M-28 -156 L0 -129 L29 -156" fill="none" stroke={accent} strokeWidth="5" opacity=".8"/>
      <path d="M-24 -125 L-5 -111 L-24 -92 M24 -125 L5 -111 L24 -92" stroke={accent} strokeWidth="4" fill="none" opacity=".7"/>
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
        <Person x={690} y={890+bob} scale={1.18} coat="#303C58" hair="#25202B" mood="sad"/>
        <g transform="translate(840 710) rotate(-5)">
          <rect width="200" height="150" rx="12" fill="#E9E3D6"/><path d="M28 112 Q70 35 120 80 T175 38" stroke="#6D7895" strokeWidth="7" fill="none"/>
        </g>
        <path d="M1020 180 Q1260 80 1430 200" stroke="#9AA9C6" strokeWidth="3" strokeDasharray="8 18" opacity=".35" fill="none"/>
      </>}
      {art === "tease" && <>
        <Person x={620+slide} y={895+bob} scale={1.08} coat="#303C58" hair="#25202B" mood="sad"/>
        <Person x={1160-slide*.4} y={895-bob} scale={1.1} coat="#6A3C55" hair="#191A28" mood="calm" facing="left"/>
        <g transform="translate(1130 440)">
          <path d="M0 0 Q150 -80 300 0 L270 120 Q140 150 20 115Z" fill="#111827" opacity=".9"/>
          <text x="150" y="52" textAnchor="middle" fill="#E7DDEB" fontSize="28">ОПЯТЬ РИСУЕШЬ?</text>
        </g>
      </>}
      {art === "meet" && <>
        <Person x={690} y={895+bob} scale={1.12} coat="#303C58" hair="#25202B" mood="calm"/>
        <Person x={1220-interpolate(frame,[0,SCENE],[160,0],{extrapolateRight:"clamp"})} y={895-bob} scale={1.1} coat="#B4A4C8" hair="#6A4358" mood="smile" facing="left" accent="#F5D7E8"/>
        <g transform="translate(950 405)">
          <rect width="350" height="105" rx="24" fill="#F1EAF0"/><path d="M42 105 L25 142 L90 105" fill="#F1EAF0"/>
          <text x="175" y="66" textAnchor="middle" fill="#343046" fontSize="32">Здесь занято?</text>
        </g>
      </>}
      {art === "talk" && <>
        <Person x={670} y={900+bob} scale={1.12} coat="#303C58" hair="#25202B" mood="calm"/>
        <Person x={1200} y={900-bob} scale={1.12} coat="#B4A4C8" hair="#6A4358" mood="smile" facing="left" accent="#F5D7E8"/>
        <g transform="translate(720 360)">
          <rect width="480" height="210" rx="18" fill="#E8E3DB"/>
          <rect x="24" y="24" width="432" height="162" rx="8" fill="#C7D1D8"/>
          <path d="M55 150 Q120 30 210 100 T410 58" stroke="#566C87" strokeWidth="8" fill="none"/>
          <path d="M55 160 L420 160" stroke="#8796A5" strokeWidth="4"/>
        </g>
      </>}
      {art === "note" && <>
        <Person x={710} y={900+bob} scale={1.14} coat="#303C58" hair="#25202B" mood="sad"/>
        <g transform={`translate(${1020} ${650+Math.sin(frame/20)*8}) rotate(-7)`}>
          <rect width="330" height="220" rx="12" fill="#F3E9D8"/>
          <path d="M35 65 H280 M35 105 H240 M35 145 H260" stroke="#A7A0A0" strokeWidth="4" opacity=".6"/>
          <path d="M35 180 Q130 145 250 180" stroke="#9C6684" strokeWidth="5" fill="none"/>
          <text x="165" y="45" textAnchor="middle" fill="#4B4353" fontSize="22">ДЛЯ ТЕБЯ</text>
        </g>
      </>}
      {art === "reveal" && <>
        <Person x={690} y={900+bob} scale={1.1} coat="#303C58" hair="#25202B" mood="calm"/>
        <Person x={1220} y={900-bob} scale={1.1} coat="#B4A4C8" hair="#6A4358" mood="sad" facing="left" accent="#F5D7E8"/>
        <g transform="translate(820 390) rotate(3)">
          <rect width="330" height="245" rx="8" fill="#EEE7D9"/>
          <rect x="18" y="18" width="294" height="209" rx="4" fill="#C6D3D8"/>
          <path d="M42 185 Q95 30 160 125 T285 75" stroke="#5E6C89" strokeWidth="8" fill="none"/>
          <text x="165" y="213" textAnchor="middle" fill="#46516A" fontSize="18">2019</text>
        </g>
      </>}
      {art === "walk" && <>
        <Person x={690+Math.sin(frame/15)*25} y={900+bob} scale={1.08} coat="#303C58" hair="#25202B" mood="calm"/>
        <Person x={1160+Math.sin(frame/15)*25} y={900-bob} scale={1.08} coat="#B4A4C8" hair="#6A4358" mood="smile" facing="left" accent="#F5D7E8"/>
      </>}
      {art === "end" && <>
        <Person x={700} y={900+bob} scale={1.1} coat="#303C58" hair="#25202B" mood="sad"/>
        <g transform="translate(980 430) rotate(-4)">
          <rect width="360" height="250" rx="10" fill="#F4EBDC"/>
          <path d="M45 70 H310 M45 112 H285 M45 154 H300" stroke="#A9A0A0" strokeWidth="4"/>
          <text x="180" y="210" textAnchor="middle" fill="#7E4C6B" fontSize="25" fontWeight="bold">2019</text>
        </g>
        <circle cx="1450" cy="270" r="160" fill="#B18ABF" opacity={interpolate(frame,[0,SCENE],[0,.16],{extrapolateRight:"clamp"})}/>
      </>}
    </svg>
  );
};

const Scene: React.FC<{data:SceneData;index:number}> = ({data,index}) => {
  const frame = useCurrentFrame();
  const intro = interpolate(frame,[0,24],[0,1],{extrapolateRight:"clamp"});
  const outro = interpolate(frame,[SCENE-24,SCENE],[1,0],{extrapolateLeft:"clamp"});
  const zoom = interpolate(frame,[0,SCENE],[1.035,1],{extrapolateRight:"clamp"});
  const captionY = interpolate(frame,[8,30],[70,0],{extrapolateRight:"clamp"});
  return (
    <AbsoluteFill style={{backgroundColor:"#101525",overflow:"hidden"}}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position:"absolute",inset:0,transform:`scale(${zoom})`}}>
        <Backdrop place={data.place} frame={frame}/>
        <rect width={W} height={H} fill="#080C18" opacity=".22"/>
        <rect width={W} height={H} fill="url(#shade)"/>
        <defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#060914" stopOpacity=".2"/><stop offset=".7" stopColor="#060914" stopOpacity="0"/><stop offset="1" stopColor="#060914" stopOpacity=".55"/></linearGradient></defs>
      </svg>
      <CharacterStage art={data.art} frame={frame}/>
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
