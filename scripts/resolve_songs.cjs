const CryptoJS = require("crypto-js");
const fs = require("fs");

function decryptSaavnUrl(enc) {
  if (!enc) return null;
  try {
    const key = CryptoJS.enc.Utf8.parse("38346591");
    const decrypted = CryptoJS.DES.decrypt({
      ciphertext: CryptoJS.enc.Base64.parse(enc)
    }, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const url = decrypted.toString(CryptoJS.enc.Utf8);
    if (!url || !url.startsWith("http")) return null;
    return url.replace(/_96\.mp4|_160\.mp4/, "_160.mp4");
  } catch (e) {
    return null;
  }
}

async function searchSaavn(q) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const url = `https://www.jiosaavn.com/api.php?__call=search.getResults&q=${encodeURIComponent(q)}&_format=json&_marker=0&api_version=4&ctx=web6dot0&n=8&p=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      signal: controller.signal
    });
    clearTimeout(timeout);
    const text = await res.text();
    const clean = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const data = JSON.parse(clean);
    return data.results || [];
  } catch (e) {
    return [];
  }
}

function cleanHtml(str) {
  if (!str) return "";
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function formatDuration(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

async function resolveSong(query, preferredTitle, preferredArtist, fallbackGenre, fallbackLang, fallbackRegion, customPlays) {
  const results = await searchSaavn(query);
  for (const r of results) {
    const audioUrl = decryptSaavnUrl(r.more_info?.encrypted_media_url);
    if (audioUrl) {
      const durSec = parseInt(r.more_info?.duration || "210", 10);
      let img = r.image || "";
      if (img.includes("150x150")) {
        img = img.replace("150x150", "500x500");
      }
      if (img.includes(".webp")) {
        img = img.replace(".webp", ".jpg");
      }

      let artistStr = "";
      if (r.more_info?.artistMap?.primary_artists?.length > 0) {
        artistStr = r.more_info.artistMap.primary_artists.map(a => a.name).join(", ");
      } else if (r.subtitle) {
        artistStr = r.subtitle.split(" - ")[0];
      }

      return {
        title: preferredTitle || cleanHtml(r.title),
        artist: preferredArtist || cleanHtml(artistStr || "Various Artists"),
        album: cleanHtml(r.more_info?.album || r.album || ""),
        duration: durSec,
        durationFormatted: formatDuration(durSec),
        coverUrl: img,
        audioSrc: audioUrl,
        genre: fallbackGenre,
        language: fallbackLang,
        region: fallbackRegion,
        plays: customPlays || "45.2M"
      };
    }
  }
  return null;
}

const list = [
  { q: "Kesariya Brahmastra", title: "Kesariya", artist: "Pritam, Arijit Singh & Amitabh Bhattacharya", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "98.4M" },
  { q: "Chaleya Jawan", title: "Chaleya", artist: "Anirudh Ravichander, Arijit Singh & Shilpa Rao", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "84.2M" },
  { q: "Tum Hi Ho Aashiqui 2", title: "Tum Hi Ho", artist: "Mithoon & Arijit Singh", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "92.1M" },
  { q: "Apna Bana Le Bhediya", title: "Apna Bana Le", artist: "Arijit Singh & Sachin-Jigar", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "78.6M" },
  { q: "Raataan Lambiyan Shershaah", title: "Raataan Lambiyan", artist: "Tanishk Bagchi, Jubin Nautiyal & Asees Kaur", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "88.3M" },
  { q: "Kabira Yeh Jawaani Hai Deewani", title: "Kabira", artist: "Pritam, Tochi Raina & Rekha Bhardwaj", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "74.5M" },
  { q: "Chaiyya Chaiyya Dil Se", title: "Chaiyya Chaiyya", artist: "A.R. Rahman, Sukhwinder Singh & Sapna Awasthi", genre: "Bollywood", lang: "Hindi / Classic", reg: "India", plays: "61.2M" },
  { q: "Lover Diljit Dosanjh", title: "Lover", artist: "Diljit Dosanjh", genre: "Worldwide", lang: "Punjabi", reg: "India", plays: "81.9M" },
  { q: "Brown Munde AP Dhillon", title: "Brown Munde", artist: "AP Dhillon, Gurinder Gill & Shinda Kahlon", genre: "Hip-Hop/Rap", lang: "Punjabi", reg: "India", plays: "89.5M" },
  { q: "Softly Karan Aujla", title: "Softly", artist: "Karan Aujla & Ikky", genre: "Worldwide", lang: "Punjabi", reg: "India", plays: "65.4M" },
  { q: "Pasoori Ali Sethi", title: "Pasoori", artist: "Shae Gill & Ali Sethi", genre: "Worldwide", lang: "Punjabi / Coke Studio", reg: "South Asia", plays: "91.8M" },
  { q: "Cruel Summer Taylor Swift", title: "Cruel Summer", artist: "Taylor Swift", genre: "Pop", lang: "English / Pop", reg: "USA", plays: "95.2M" },
  { q: "Blinding Lights The Weeknd", title: "Blinding Lights", artist: "The Weeknd", genre: "R&B/Soul", lang: "English / Pop", reg: "Global", plays: "99.8M" },
  { q: "Shape of You Ed Sheeran", title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", lang: "English / Pop", reg: "UK", plays: "97.6M" },
  { q: "Levitating Dua Lipa", title: "Levitating", artist: "Dua Lipa", genre: "Pop", lang: "English / Pop", reg: "UK", plays: "85.4M" },
  { q: "STAY The Kid LAROI Justin Bieber", title: "STAY", artist: "The Kid LAROI & Justin Bieber", genre: "Pop", lang: "English / Pop", reg: "Global", plays: "83.1M" },
  { q: "Believer Imagine Dragons", title: "Believer", artist: "Imagine Dragons", genre: "Alternative", lang: "English / Rock", reg: "USA", plays: "92.7M" },
  { q: "Dynamite BTS", title: "Dynamite", artist: "BTS", genre: "K-Pop", lang: "Korean / K-Pop", reg: "South Korea", plays: "89.0M" },
  { q: "Seven Jung Kook", title: "Seven", artist: "Jung Kook & Latto", genre: "K-Pop", lang: "Korean / Pop", reg: "South Korea", plays: "86.3M" },
  { q: "Pink Venom BLACKPINK", title: "Pink Venom", artist: "BLACKPINK", genre: "K-Pop", lang: "Korean / K-Pop", reg: "South Korea", plays: "82.5M" },
  { q: "Super Shy NewJeans", title: "Super Shy", artist: "NewJeans", genre: "K-Pop", lang: "Korean / K-Pop", reg: "South Korea", plays: "71.4M" },
  { q: "Despacito Luis Fonsi", title: "Despacito", artist: "Luis Fonsi & Daddy Yankee", genre: "Latin", lang: "Spanish / Latin", reg: "Latin America", plays: "96.5M" },
  { q: "Calm Down Rema", title: "Calm Down", artist: "Rema & Selena Gomez", genre: "Afrobeats", lang: "African / Afrobeats", reg: "Africa", plays: "88.7M" },
  { q: "Naatu Naatu RRR", title: "Naatu Naatu", artist: "Rahul Sipligunj, Kaala Bhairava & M.M. Keeravaani", genre: "Soundtrack", lang: "Telugu / South Indian", reg: "India", plays: "87.4M" },
  { q: "Srivalli Pushpa", title: "Srivalli", artist: "Sid Sriram & Devi Sri Prasad", genre: "Soundtrack", lang: "Telugu / South Indian", reg: "India", plays: "79.2M" },
  { q: "Tera Ban Jaunga Kabir Singh", title: "Tera Ban Jaunga", artist: "Akhil Sachdeva & Tulsi Kumar", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "82.1M" },
  { q: "Dilbar Satyameva Jayate", title: "Dilbar", artist: "Neha Kakkar, Dhvani Bhanushali & Ikka", genre: "Bollywood", lang: "Hindi / Bollywood", reg: "India", plays: "95.6M" },
  { q: "Jugnu Badshah", title: "Jugnu", artist: "Badshah & Nikhita Gandhi", genre: "Pop", lang: "Hindi / Pop", reg: "India", plays: "73.2M" },
  { q: "Guli Mata Shreya Ghoshal", title: "Guli Mata", artist: "Saad Lamjarred & Shreya Ghoshal", genre: "Arabic/Pop", lang: "Arabic / Hindi", reg: "Global", plays: "86.8M" },
  { q: "Idol Yoasobi", title: "Idol", artist: "YOASOBI", genre: "J-Pop", lang: "Japanese / J-Pop", reg: "Japan", plays: "94.3M" },
  { q: "Derniere Danse Indila", title: "Dernière danse", artist: "Indila", genre: "Pop", lang: "French", reg: "France", plays: "76.4M" }
];

async function main() {
  const songs = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const resolved = await resolveSong(item.q, item.title, item.artist, item.genre, item.lang, item.reg, item.plays);
    if (resolved) {
      resolved.id = `song-${i + 1}`;
      resolved.accentColor = "#f97316";
      songs.push(resolved);
      console.log(`[${i + 1}/${list.length}] Resolved: ${resolved.title} by ${resolved.artist} | ${resolved.durationFormatted} (${resolved.duration}s)`);
    } else {
      console.log(`[${i + 1}/${list.length}] FAILED: ${item.q}`);
    }
  }
  fs.writeFileSync("./resolved_songs.json", JSON.stringify(songs, null, 2));
  console.log("Successfully wrote", songs.length, "songs to resolved_songs.json");
}

main();
