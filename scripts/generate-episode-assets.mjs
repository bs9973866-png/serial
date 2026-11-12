import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {spawnSync} from "node:child_process";

const root = process.cwd();

// Load a local .env file without adding a runtime dependency. Existing CI secrets win.
try {
  const envText = await readFile(path.join(root, ".env"), "utf8");
  for (const line of envText.split("\n")) {
    const clean = line.trim();
    if (!clean || clean.startsWith("#")) continue;
    const separator = clean.indexOf("=");
    if (separator < 1) continue;
    const key = clean.slice(0, separator).trim();
    const value = clean.slice(separator + 1).trim().replace(/^([\'"])(.*)\\1$/, "$2");
    if (!process.env[key]) process.env[key] = value;
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}
const audioDir = path.join(root, "public", "assets", "audio");
const sceneDir = path.join(root, "public", "assets", "scenes");

const narration = [
  "Я пришёл в школу раньше обычного. В коридорах ещё было тихо, а в классах горел только свет у окон. Я сел за свою парту, открыл скетчбук и нарисовал окно, которое повторял уже несколько месяцев. Я не знал, почему возвращаюсь к нему снова и снова. В рисунке не было ничего особенного: рама, две перекладины и тонкая трещина в левом углу. Но каждый раз, когда я пытался нарисовать что-то другое, рука сама возвращалась к этим линиям.",
  "Кирилл появился за несколько минут до звонка. Он заглянул через плечо, увидел рисунок и усмехнулся. Обычно я пропускал его замечания мимо ушей, но сегодня он задержал взгляд на странице дольше, чем обычно. Потом спросил, почему я опять рисую именно это окно. Я ответил, что просто нравится форма. Кирилл хотел что-то добавить, но передумал и быстро сменил тему. Мне показалось, что он узнал рисунок. Только вот откуда?",
  "Когда начался первый урок, классная руководительница представила новую ученицу. Это была Лера. Я видел её в школе раньше, но никогда не разговаривал с ней. Она оглядела свободные места и почему-то направилась прямо ко мне. Спросила, можно ли сесть рядом, и улыбнулась ещё до того, как я успел ответить. Я растерялся и просто подвинул рюкзак. Лера назвала меня по имени, хотя я не помнил, чтобы мы знакомились. От этого обычное утро вдруг стало совсем другим.",
  "После уроков я зашёл в библиотеку. Там было спокойно, и я надеялся закончить рисунок. Лера появилась почти бесшумно и остановилась у стола. Она не стала спрашивать, что я рисую, а сразу посмотрела на страницу и сказала, что помнит это окно. Потом спросила, не осталось ли у меня старого скетчбука с синей обложкой. Я никогда не рассказывал ей о нём. Я спросил, откуда она знает. Лера посмотрела на меня, но ответить не успела: в библиотеке прозвенел сигнал закрытия.",
  "На следующий день Кирилл встретил меня возле кабинета. Он снова начал шутить, но на этот раз быстро перешёл к Лере. Сказал, что мне лучше не расспрашивать её о прошлом. Я спросил, что он вообще знает. Кирилл пожал плечами и ответил, что ничего важного. Но когда я произнёс имя Леры, его лицо изменилось. Он будто хотел предупредить меня, но в итоге только попросил не торопиться с выводами. Я впервые понял, что Кирилл скрывает нечто конкретное.",
  "После последнего урока я вернулся за забытым скетчбуком. На парте лежал сложенный листок. Внутри было короткое сообщение: прийти в библиотеку и никому ничего не рассказывать. Почерк был аккуратным, а внизу стояла маленькая звёздочка — такая же, как заколка Леры. Я мог просто выбросить записку, но вместо этого положил её между страницами. Весь путь до библиотеки я придумывал вопросы. Больше всего хотелось узнать, почему незнакомая мне девушка помнит то, чего не помню я.",
  "Лера ждала меня у дальнего стола. Я положил скетчбук перед ней, и она сразу нашла нужную страницу. Сказала, что на рисунке всё ещё не хватает маленькой детали в углу. Я посмотрел внимательнее и увидел тонкую трещину, которую почти стёр ластиком. Лера помнила её точно. Она объяснила, что мы нарисовали это окно вместе три года назад. Тогда я не поверил, но она назвала цвет старого стола и даже вспомнила, чем я испачкал рукав. Эти детали было трудно придумать случайно.",
  "Лера рассказала, что раньше училась в этой школе. Мы часто сидели в библиотеке после занятий и рисовали то, что видели из окна. Потом её семье пришлось переехать, и она ушла, не успев попрощаться. В последний день мы договорились закончить рисунок, когда она вернётся. Я слушал и пытался вспомнить хотя бы один момент. Но память оставалась пустой. Лера не требовала, чтобы я ей поверил. Она сказала, что просто хотела проверить, сохранился ли у меня рисунок. И он сохранился.",
  "Когда библиотеку закрыли, мы вышли в коридор. Лера шла рядом и объяснила, что долго не решалась вернуться. Она боялась, что я давно забыл её и что наш старый договор ничего для меня не значит. Я сказал, что не помню обещания, но хочу узнать, что произошло. Лера ответила, что это не вся история. Перед тем как уехать, она оставила кое-что ещё, и Кирилл об этом знал. Я спросил, почему он не рассказал. Она только посмотрела на дверь кабинета, за которой ещё горел свет.",
  "На следующий день Лера показала мне фотографию на телефоне. Снимок был немного выцветшим: библиотечный стол, большое окно и два ребёнка, склонившихся над листом бумаги. Одного из них я узнал по знакомой куртке, хотя фотография была старой. Лера сказала, что это мы. На заднем плане виднелась та самая трещина в оконной раме. Я спросил, почему снимок оказался у неё. Она ответила, что сохранила его, потому что обещала однажды показать мне. Но я не мог понять, почему на обороте была дата, которую я никогда не видел.",
  "После уроков я остановил Кирилла в коридоре и показал фотографию. Он долго молчал, а потом признался, что тоже помнит тот день. Он сказал, что тогда часто видел нас в библиотеке, но не хотел вмешиваться. Когда Лера уехала, я несколько недель спрашивал, вернётся ли она. Потом перестал. Кирилл утверждал, что со временем я сам попросил его не напоминать мне об этой истории. Я не понимал, зачем мог такое сказать. Он не стал спорить и лишь пообещал поискать старую вещь, которую я ему когда-то отдавал.",
  "На последнем уроке я почти не слушал учителя. В голове крутились слова Кирилла и фотография. После звонка я снова спросил его, что именно хранится у него. Кирилл ответил, что не может найти эту вещь уже давно. Но он помнил, что это был скетчбук с синей обложкой. Я сразу вспомнил, что когда-то у меня действительно был такой. Дома я решил проверить старые коробки. Лера написала, что не станет торопить меня и подождёт, пока я сам разберусь. Это почему-то помогло больше любых объяснений.",
  "Вечером я открыл нижнюю полку стола, куда давно не заглядывал. За стопкой тетрадей стояла плоская коробка. В ней лежали старые школьные листы, несколько карандашей и скетчбук с синей обложкой. На первой странице было моё имя, написанное детским почерком. Я перелистал рисунки и нашёл знакомое окно. Оно было почти таким же, как нынешнее, только рядом стоял маленький стол, которого в библиотеке уже давно не было. Между страницами что-то шуршало.",
  "Из скетчбука выпала фотография и сложенный вчетверо листок. На фотографии были Лера и я, а на обороте стояла дата трёхлетней давности. Я развернул бумагу и увидел несколько строк, написанных моей рукой. Почерк был детским, но буквы я узнал сразу. Первые слова говорили о том, что однажды я могу забыть этот день. Ниже стояла дата, а в самом конце — короткое предложение, адресованное мне самому. Я перечитал его несколько раз, не понимая, почему написал это заранее.",
  "На листке было написано: «Если ты это читаешь — значит, Лера всё-таки вернулась». Я долго сидел за столом и смотрел на собственный почерк. Получалось, что три года назад я не просто знал Леру. Я почему-то был уверен, что однажды забуду её возвращение и мне понадобится напоминание. За окном уже стемнело, а телефон тихо завибрировал. Сообщение было от Леры: «Ты нашёл? Тогда завтра нам нужно поговорить о том, что было после фотографии». И я понял, что записка была только началом."
];

const scenePrompts = [
  "Cinematic empty high-school classroom before sunrise, cool blue-violet dawn light through tall windows, one wooden desk in foreground with an open sketchbook showing a simple window drawing, premium detailed 2D/2.5D animated series environment, painterly light, no people, no text, no watermark, 16:9 wide composition.",
  "Long quiet school corridor, blue-grey walls, classroom doors and high windows, one bench and soft morning light, perspective leading lines, cinematic premium 2D/2.5D animated series background, no people, no crowd, no text, no watermark, 16:9.",
  "High-school classroom with two adjacent wooden desks near a tall window, a lilac pencil case on one desk and a sketchbook on the other, soft daylight, premium cinematic 2D/2.5D animated background, no people, no readable text, no watermark, 16:9.",
  "Warm school library, tall wooden shelves, large reading table, amber desk lamps and sunbeams with floating dust, deep blue shadows, premium cinematic 2D/2.5D animated series background, no people, no readable text, no watermark, 16:9.",
  "Quiet school corridor near classroom doors, cool blue-grey palette, long perspective, late-morning window light and empty foreground, premium cinematic 2D/2.5D animated background, no people, no text, no watermark, 16:9.",
  "Empty classroom after the last bell, one wooden desk in foreground with a small folded blank cream note on it, late afternoon light through windows, calm blue-violet palette, premium cinematic 2D/2.5D animated background, no people, no writing on paper, no text, no watermark, 16:9.",
  "Close view of a library table in warm amber light, open sketchbook showing a simple old window drawing with a tiny crack in one corner, bookshelves softly blurred behind, premium cinematic 2D/2.5D animated background, no people, no readable text, no watermark, 16:9.",
  "A quieter corner of the same school library, tall shelves, warm pool of lamp light, two empty chairs facing each other across a wooden table, nostalgic atmosphere, premium cinematic 2D/2.5D animated series background, no people, no text, no watermark, 16:9.",
  "Long school corridor at the end of the day, warm sunlight fading through tall windows, empty floor and classroom doors, nostalgic cinematic 2D/2.5D animated background, no people, no text, no watermark, 16:9.",
  "Old printed photograph resting on a wooden library table, blurred shelves and the silhouette of a tall window in the background, warm nostalgic light, premium cinematic 2D/2.5D animated background, no people, no readable text, no watermark, 16:9.",
  "School corridor at dusk, cool blue shadows and a single warm light spilling from a classroom door, cinematic mystery mood, premium 2D/2.5D animated background, no people, no text, no watermark, 16:9.",
  "Empty classroom after school, rows of desks, one chair pulled back as if someone has just left, blue-violet evening light, cinematic premium 2D/2.5D animated background, no people, no text, no watermark, 16:9.",
  "Teenage boy's modest bedroom at night, desk in foreground, warm desk lamp, cool blue-violet window light, shelves and stacked notebooks, cinematic premium 2D/2.5D animated background, no people, no text, no watermark, 16:9.",
  "Close cinematic view of an old blue sketchbook, a faded photograph and a folded blank paper note on a teenager's desk, warm desk lamp, cool night shadows, premium 2D/2.5D animated background, no people, no writing, no text, no watermark, 16:9.",
  "Teenage boy's bedroom at night, desk with an old sketchbook opened to a folded note, warm lamp glow against deep blue-violet shadows, emotional mystery finale, premium cinematic 2D/2.5D animated background, no people, no writing, no text, no watermark, 16:9."
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

function saveEdgeTTS(index, text) {
  const output = path.join(audioDir, `scene-${String(index).padStart(2, "0")}.mp3`);
  const candidates = process.platform === "win32" ? ["py", "python"] : ["python3", "python"];
  const voice = process.env.EDGE_TTS_VOICE || "ru-RU-DmitryNeural";
  let lastError = "";
  // Retry the neural endpoint once: it can occasionally return an empty stream.
  for (let attempt = 0; attempt < 2; attempt++) {
    for (const executable of candidates) {
      const args = ["-m", "edge_tts", "--voice", voice, "--rate", process.env.EDGE_TTS_RATE || "+0%", "--text", text, "--write-media", output];
      const result = spawnSync(executable, args, {encoding: "utf8"});
      if (!result.error && result.status === 0) return;
      lastError = result.error?.message || result.stderr || result.stdout || `exit code ${result.status}`;
    }
  }
  // gTTS is a separate online service and is only used when Edge TTS is unavailable.
  const gtts = spawnSync("gtts-cli", [text, "--lang", "ru", "--output", output], {encoding: "utf8"});
  if (!gtts.error && gtts.status === 0) {
    console.warn(`Scene ${index}: Edge TTS unavailable; used gTTS fallback.`);
    return;
  }
  lastError += ` | gTTS: ${gtts.error?.message || gtts.stderr || gtts.stdout || gtts.status}`;
  // Local Russian speech is the final fallback, so an external outage does not cancel the video.
  const wav = output.replace(/\.mp3$/i, ".wav");
  const espeak = spawnSync("espeak-ng", ["-v", "ru+m1", "-s", "145", "-w", wav, text], {encoding: "utf8"});
  if (!espeak.error && espeak.status === 0) {
    const convert = spawnSync("ffmpeg", ["-y", "-i", wav, "-codec:a", "libmp3lame", "-qscale:a", "4", output], {encoding: "utf8"});
    if (!convert.error && convert.status === 0) {
      console.warn(`Scene ${index}: online TTS unavailable; used local Russian voice fallback.`);
      return;
    }
  }
  throw new Error(`Could not generate narration for scene ${index}. Edge TTS and gTTS failed; espeak-ng fallback also unavailable. Details: ${lastError}`);
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

await mkdir(audioDir, {recursive: true});
await mkdir(sceneDir, {recursive: true});

for (let i = 0; i < narration.length; i++) {
  if (process.env.FISH_API_KEY) {
    console.log(`[${i + 1}/10] Generating Russian narration with Fish Audio...`);
    await saveFishAudio(i + 1, narration[i]);
  } else {
    console.log(`[${i + 1}/10] Generating Russian narration with Edge TTS (${process.env.EDGE_TTS_VOICE || "ru-RU-DmitryNeural"})...`);
    saveEdgeTTS(i + 1, narration[i]);
  }

  if (process.env.FAL_KEY) {
    console.log(`[${i + 1}/10] Generating cinematic background with fal.ai...`);
    await saveFalImage(i + 1, scenePrompts[i]);
  } else {
    console.log(`[${i + 1}/10] No FAL_KEY: keeping the built-in animated SVG background.`);
  }
}

console.log("Narration generation complete. AI backgrounds are generated only when FAL_KEY is configured.");
