import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

// Load a local .env file without adding a runtime dependency. Existing CI secrets win.
try {
  const envText = await readFile(path.join(root, ".env"), "utf8");
  for (const line of envText.split(/\\r?\\n/)) {
    const match = line.match(/^\\s*([A-Za-z_][A-Za-z0-9_]*)\\s*=\\s*(.*?)\\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\\1$/, "$2");
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
const audioDir = path.join(root, "public", "assets", "audio");
const sceneDir = path.join(root, "public", "assets", "scenes");

const narration = [
  "В тот день я пришёл в школу раньше обычного. В классе ещё почти никого не было, и утренний свет медленно полз по пустым партам. Я открыл скетчбук и снова начал рисовать одно и то же окно. Не знаю почему, но этот рисунок всегда казался мне знакомым. Будто я уже видел его во сне. Я не показывал его никому. По крайней мере, так я думал.",
  "Кирилл появился, когда я уже собирался закрыть тетрадь. Он остановился рядом, посмотрел на рисунок и привычно усмехнулся. Ему нравилось комментировать всё, что я делал, особенно если можно было заставить меня замолчать. Я не ответил. Иногда проще сделать вид, что не услышал. Но в тот день его слова почему-то задели сильнее обычного.",
  "На следующем уроке в класс вошла Лера. Я видел её раньше, но мы никогда не разговаривали. Свободных мест было достаточно, однако она подошла именно к моей парте. Спросила, занято ли место, и дождалась ответа, хотя уже поставила рюкзак на стул. Я попытался придумать что-нибудь нормальное, но смог только кивнуть. Она улыбнулась так, словно мы продолжали разговор, начатый давным-давно.",
  "После уроков мы случайно встретились в библиотеке. Я думал, что там никого не будет, поэтому достал скетчбук и положил его на стол. Лера подошла тихо. Она долго смотрела на страницу, а потом спросила, рисую ли я такие окна до сих пор. Я не понял, что значит «до сих пор». Для меня это был просто рисунок, который я почему-то не мог закончить.",
  "Позже Кирилл перехватил меня в коридоре. Он сказал, что Лера просто жалеет меня и что не стоит придумывать лишнего. Я хотел спросить, откуда он вообще знает, о чём мы говорили, но промолчал. Его слова крутились в голове весь оставшийся день. И всё же сильнее всего меня беспокоил не Кирилл, а вопрос Леры. Откуда она могла знать мой рисунок?",
  "Когда прозвенел последний звонок, на парте лежал сложенный листок. На нём было написано, чтобы я пришёл в библиотеку. Почерк был аккуратный, а внизу стояло имя Леры. Я несколько минут смотрел на записку, пытаясь решить, шутка это или нет. Потом всё-таки убрал её в скетчбук. Впервые за долгое время мне захотелось узнать, что будет дальше.",
  "В библиотеке Лера уже ждала меня. Она попросила показать рисунок ещё раз и осторожно провела пальцем рядом с линиями, не касаясь бумаги. Потом сказала, что помнит это окно. Я спросил, откуда. Она ответила, что видела его раньше, когда мы были намного младше. Но я не помнил ни её, ни той встречи.",
  "Лера рассказала, что однажды мы сидели у большого окна и рисовали его вместе. Она помнила дождь, старую библиотеку и обещание закончить рисунок, когда снова увидимся. Я слушал и пытался найти хоть одну знакомую деталь. Ничего не приходило в голову. Перед уходом она сказала, что не хотела пугать меня и что, возможно, я сам однажды всё вспомню.",
  "Дома я долго не мог сосредоточиться на уроках. В скетчбуке между страницами обнаружился ещё один листок. Бумага пожелтела по краям, а сгибы выглядели старыми. Я решил, что кто-то подложил его сегодня, но дата в углу была написана три года назад. И почерк был подозрительно похож на мой.",
  "Я перечитал записку несколько раз. Там было всего одно предложение: если я это читаю, значит, Лера всё-таки вернулась. Я не помнил, чтобы писал эти слова. Не помнил и обещания, о котором она говорила. Но теперь у меня было доказательство, что кто-то знал о её возвращении задолго до сегодняшнего дня. И этим кем-то, похоже, был я сам."
];

const scenePrompts = [
  "Cinematic empty high-school classroom in the morning, cool blue-violet daylight through tall windows, rows of wooden desks, one desk in foreground with a closed grey sketchbook, quiet atmosphere, premium 2D/2.5D animated series background, painterly detailed environment, realistic perspective, soft dust in sunbeams, no people, no text, no letters, no watermark, 16:9 wide composition, leave lower third visually calm for subtitles.",
  "Long quiet school corridor, blue-grey walls, classroom doors and tall windows, cool morning light, perspective leading lines, a few lockers and benches, cinematic premium 2D/2.5D animated series background, no people, no crowd, no text, no watermark, 16:9 wide composition.",
  "High-school classroom from a side angle, two adjacent wooden desks near a tall window, soft daylight, notebooks and school supplies, cool blue-violet palette with gentle lilac accents, premium cinematic 2D/2.5D animated series background, no people, no readable text, no watermark, 16:9.",
  "Warm school library interior, tall wooden bookshelves, large reading table, amber desk lamps and sunbeams with floating dust, deep blue shadows, premium cinematic 2D/2.5D animated series background, no people, no readable text, no watermark, 16:9.",
  "Quiet school corridor near classroom doors, cool blue-grey palette, long perspective, soft late-afternoon window light, cinematic framing with empty foreground for two characters to be composited later, premium 2D/2.5D animated background, no people, no text, no watermark, 16:9.",
  "Empty classroom after the last bell, one wooden desk in foreground with a small folded blank cream note on it, late afternoon light through windows, calm blue-violet palette, premium cinematic 2D/2.5D animated series background, no people, no writing on paper, no text, no watermark, 16:9.",
  "School library table in warm amber light, open sketchbook showing a simple old window drawing with a central vertical frame and horizontal crossbar, bookshelves softly blurred behind, cinematic close composition, premium 2D/2.5D animated background, no people, no readable text, no watermark, 16:9.",
  "A quieter corner of the same school library, tall shelves, warm pool of lamp light, two empty chairs facing each other across a wooden table, nostalgic atmosphere, premium cinematic 2D/2.5D animated series background, no people, no text, no watermark, 16:9.",
  "Transition view of the same classroom at dusk, empty desks, deep blue-violet evening light, a single sketchbook on a desk, cinematic mystery mood, premium 2D/2.5D animated background, no people, no text, no watermark, 16:9.",
  "Teenage boy's modest bedroom at night, desk in foreground with an old folded blank paper note and grey sketchbook, warm desk lamp, cool blue-violet window light, a small plant and shelves, cinematic premium 2D/2.5D animated series background, no people, no writing, no text, no watermark, 16:9."
];

async function saveFishAudio(index, text) {
  const headers = {
    Authorization: `Bearer ${process.env.FISH_API_KEY}`,
    "Content-Type": "application/json",
    model: process.env.FISH_MODEL || "s2.1-pro-free"
  };
  const body = {text, format: "mp3"};
  if (process.env.FISH_REFERENCE_ID) body.reference_id = process.env.FISH_REFERENCE_ID;
  const response = await fetch("https://api.fish.audio/v1/tts", {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`Fish Audio failed for segment ${index}: HTTP ${response.status} ${await response.text()}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(audioDir, `scene-${String(index).padStart(2, "0")}.mp3`), bytes);
}

async function saveFalImage(index, prompt) {
  const response = await fetch(process.env.FAL_ENDPOINT || "https://fal.run/fal-ai/flux-2", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      image_size: "landscape_16_9",
      num_images: 1,
      output_format: "png"
    })
  });
  if (!response.ok) {
    throw new Error(`fal image generation failed for scene ${index}: HTTP ${response.status} ${await response.text()}`);
  }
  const result = await response.json();
  const url = result.images?.[0]?.url;
  if (!url) throw new Error(`fal returned no image URL for scene ${index}: ${JSON.stringify(result)}`);
  const imageResponse = await fetch(url);
  if (!imageResponse.ok) throw new Error(`Could not download generated image for scene ${index}`);
  await writeFile(path.join(sceneDir, `scene-${String(index).padStart(2, "0")}.png`), Buffer.from(await imageResponse.arrayBuffer()));
}

if (!process.env.FISH_API_KEY || !process.env.FAL_KEY) {
  console.error("Set both FISH_API_KEY and FAL_KEY. See .env.example.");
  process.exit(1);
}

await mkdir(audioDir, {recursive: true});
await mkdir(sceneDir, {recursive: true});

for (let i = 0; i < 10; i++) {
  console.log(`[${i + 1}/10] Generating Russian narration with Fish Audio...`);
  await saveFishAudio(i + 1, narration[i]);
  console.log(`[${i + 1}/10] Generating cinematic background with fal.ai...`);
  await saveFalImage(i + 1, scenePrompts[i]);
}

console.log("All 10 voice segments and 10 AI scene backgrounds are ready.");
