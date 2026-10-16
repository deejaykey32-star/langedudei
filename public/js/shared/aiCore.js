// Wspólna logika lektora AI Kuraka: prompty, schematy JSON i budowa zapytań (model: darmowe Workers AI).
// Używana przez serwer w chmurze (worker/index.js).

export const LEVEL_GUIDE = {
  A1: "Use only very simple, high-frequency words and Present Simple / 'can' / 'there is'. Sentences of 3-7 words. Speak very slowly and clearly.",
  A2: "Use simple everyday English: Present Simple/Continuous, Past Simple, 'going to'. Short sentences up to 10 words.",
  B1: "Use clear standard English, common phrasal verbs, Present Perfect, first/second conditionals. Medium sentences.",
  B2: "Use natural English with a wider vocabulary, idioms occasionally, all common tenses, passive voice, reported speech.",
  C1: "Use rich, natural, nuanced English, idiomatic expressions, complex structures, discourse markers.",
  C2: "Speak like an educated native speaker: subtle nuance, idioms, register shifts, sophisticated vocabulary.",
};

export function tutorSystemPrompt(level, mode, task) {
  return `You are "Kurak", a big, cheerful, talkative rooster with a warm Southern charm – the guide, English teacher and AI speaking partner (lektor) inside the learning app "LangEduDei" for a Polish speaker.
Personality: boisterous, funny and encouraging. Now and then (not in every message) start with your catchphrase "I say, I say…" or call the learner "boy"/"my friend" in a friendly way, and use a light farmyard joke. Personality must never make your English harder than the learner's level.
Your teaching style follows "Dom's method": slow, clear, real everyday English (not textbook English), lots of repetition, short useful phrases, encouragement, consistency over intensity, "stop translating and start thinking in English".

Learner level: ${level} (CEFR). ${LEVEL_GUIDE[level] || LEVEL_GUIDE.A1}
Conversation mode: ${mode}.
${task ? `Current task for the learner: ${task}` : ""}

Rules:
- Always keep the conversation going: end your English reply with ONE simple question or a concrete small task for the learner (e.g. "Tell me 3 things you did this morning", "Repeat after me: ...", "Describe your room using IN, ON, AT").
- If the learner writes in Polish (or mixes Polish), it means they don't know how to say something. Answer their question helpfully in Polish in "polish_help", give them the English way to say it in "say_it_like_this", then continue in English.
- If the learner asks a question about English (grammar, word meaning, pronunciation), answer it clearly - explanation in Polish in "polish_help", examples in English in "reply".
- If the learner's English has mistakes, gently give a corrected natural version in "correction" (only the corrected sentence(s), no lecture). If there are no mistakes, leave "correction" empty.
- "reply" is what you say aloud in English - keep it short (1-4 sentences at A1-A2, up to 6 at higher levels), conversational, adapted to the level.
- "reply_pl" is a natural Polish translation of "reply" (the learner can reveal it as a hint if they don't understand).
- "new_words": up to 4 useful words/phrases from your reply or correction worth learning, with Polish meaning.
- Never use markdown formatting in any field.`;
}

export const CHAT_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    reply_pl: { type: "string" },
    correction: { type: "string" },
    polish_help: { type: "string" },
    say_it_like_this: { type: "string" },
    new_words: {
      type: "array",
      items: {
        type: "object",
        properties: { en: { type: "string" }, pl: { type: "string" } },
        required: ["en", "pl"],
        additionalProperties: false,
      },
    },
  },
  required: ["reply", "reply_pl", "correction", "polish_help", "say_it_like_this", "new_words"],
  additionalProperties: false,
};

const WORD_ITEM = {
  type: "object",
  properties: {
    en: { type: "string" },
    pl: { type: "string" },
    emoji: { type: "string" },
    example: { type: "string" },
  },
  required: ["en", "pl", "emoji", "example"],
  additionalProperties: false,
};

export const GENERATE_SCHEMAS = {
  words: {
    type: "object",
    properties: { items: { type: "array", items: WORD_ITEM } },
    required: ["items"],
    additionalProperties: false,
  },
  sentences: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: { en: { type: "string" }, pl: { type: "string" }, emoji: { type: "string" } },
          required: ["en", "pl", "emoji"],
          additionalProperties: false,
        },
      },
    },
    required: ["items"],
    additionalProperties: false,
  },
  story: {
    type: "object",
    properties: {
      title: { type: "string" },
      emoji: { type: "string" },
      paragraphs: { type: "array", items: { type: "string" } },
      paragraphs_pl: { type: "array", items: { type: "string" } },
      main_idea_question: { type: "string" },
      main_idea_options: { type: "array", items: { type: "string" } },
      main_idea_answer: { type: "integer" },
      useful_phrases: {
        type: "array",
        items: {
          type: "object",
          properties: { en: { type: "string" }, pl: { type: "string" } },
          required: ["en", "pl"],
          additionalProperties: false,
        },
      },
    },
    required: ["title", "emoji", "paragraphs", "paragraphs_pl", "main_idea_question", "main_idea_options", "main_idea_answer", "useful_phrases"],
    additionalProperties: false,
  },
  unit: {
    type: "object",
    properties: {
      title: { type: "string" },
      emoji: { type: "string" },
      grammar: { type: "string", enum: ["to-be", "present-simple", "there-is", "can", "in-on-at", "present-continuous", "past-simple", "going-to-will", "comparatives", "present-perfect", "conditionals-1-2", "passive", "reported-speech", "conditional-3-mixed", "inversion", "hedging", "cleft", "subjunctive"] },
      words: { type: "array", items: { type: "object", properties: { en: { type: "string" }, pl: { type: "string" }, emoji: { type: "string" } }, required: ["en", "pl", "emoji"], additionalProperties: false } },
      sentences: { type: "array", items: { type: "object", properties: { en: { type: "string" }, pl: { type: "string" } }, required: ["en", "pl"], additionalProperties: false } },
      dialogue: { type: "array", items: { type: "object", properties: { who: { type: "string", enum: ["A", "B"] }, en: { type: "string" }, pl: { type: "string" } }, required: ["who", "en", "pl"], additionalProperties: false } },
      question: { type: "object", properties: { q: { type: "string" }, options: { type: "array", items: { type: "string" } }, answer: { type: "integer" } }, required: ["q", "options", "answer"], additionalProperties: false },
      errors: { type: "array", items: { type: "object", properties: { wrong: { type: "string" }, right: { type: "string" }, why: { type: "string" } }, required: ["wrong", "right", "why"], additionalProperties: false } },
    },
    required: ["title", "emoji", "grammar", "words", "sentences", "dialogue", "question", "errors"],
    additionalProperties: false,
  },
  video: {
    type: "object",
    properties: {
      summary_pl: { type: "string" },
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: { q: { type: "string" }, options: { type: "array", items: { type: "string" } }, answer: { type: "integer" }, time: { type: "number" } },
          required: ["q", "options", "answer", "time"],
          additionalProperties: false,
        },
      },
      phrases: { type: "array", items: { type: "object", properties: { en: { type: "string" }, pl: { type: "string" } }, required: ["en", "pl"], additionalProperties: false } },
      discussion: { type: "array", items: { type: "string" } },
    },
    required: ["summary_pl", "questions", "phrases", "discussion"],
    additionalProperties: false,
  },
  expand: {
    type: "object",
    properties: {
      title: { type: "string" },
      text_en: { type: "array", items: { type: "string" } },
      text_pl: { type: "array", items: { type: "string" } },
      new_words: { type: "array", items: { type: "object", properties: { en: { type: "string" }, pl: { type: "string" } }, required: ["en", "pl"], additionalProperties: false } },
      questions: {
        type: "array",
        items: { type: "object", properties: { q: { type: "string" }, options: { type: "array", items: { type: "string" } }, answer: { type: "integer" } }, required: ["q", "options", "answer"], additionalProperties: false },
      },
      talk: { type: "array", items: { type: "string" } },
    },
    required: ["title", "text_en", "text_pl", "new_words", "questions", "talk"],
    additionalProperties: false,
  },
  feedback: {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            original: { type: "string" },
            corrected: { type: "string" },
            explanation_pl: { type: "string" },
            ok: { type: "boolean" },
          },
          required: ["original", "corrected", "explanation_pl", "ok"],
          additionalProperties: false,
        },
      },
      summary_pl: { type: "string" },
      missing_words: {
        type: "array",
        items: {
          type: "object",
          properties: { en: { type: "string" }, pl: { type: "string" } },
          required: ["en", "pl"],
          additionalProperties: false,
        },
      },
    },
    required: ["items", "summary_pl", "missing_words"],
    additionalProperties: false,
  },
};

export function generatePrompt(kind, level, topic, extra) {
  const lvl = `CEFR level ${level}. ${LEVEL_GUIDE[level] || ""}`;
  switch (kind) {
    case "words":
      return `Create 12 useful English vocabulary items for a Polish learner, ${lvl} Topic: "${topic}".
Each item: the English word or short phrase, its Polish translation, ONE emoji (or 2-3 emojis combined) that visually represents it as a picture, and a natural example sentence at this level. Prefer words that can be shown as a picture. Avoid these already known words: ${extra || "none"}.`;
    case "sentences":
      return `Create 10 natural, everyday English sentences for shadowing practice (listen and repeat), ${lvl} Topic: "${topic}".
Real-life English, not textbook English. For each: the sentence, Polish translation, and 1-3 emojis that picture the scene.`;
    case "story":
      return `Write a short story or podcast-style monologue for listening practice using "The Three Listen Rule", ${lvl} Topic: "${topic}".
Length: A1 ~120 words, A2 ~180, B1 ~250, B2 ~320, C1/C2 ~400. Split into 3-6 paragraphs, with Polish translations of each paragraph. Add one main-idea multiple-choice question (4 options, answer index 0-3) and 6 useful phrases from the text with Polish meaning. Emoji for the title.`;
    case "unit":
      return `Create a complete course unit for a Polish learner of English, ${lvl} Topic: "${topic}". Make it a well-structured, engaging unit with varied practice material.
- title: short unit title in Polish; emoji: one emoji for the unit.
- grammar: the grammar point from the allowed list that best fits this level and topic.
- words: exactly 6 useful words/phrases, each with Polish meaning and ONE emoji that pictures it.
- sentences: exactly 8 natural, real-life sentences using the words and the grammar point, with natural Polish translations. Keep them ${level.startsWith("A") ? "short (4-9 words)" : "natural length (up to 16 words)"}.
- dialogue: 4-5 lines alternating A and B, with Polish translations.
- question: one comprehension question about the dialogue with 3 options and the correct answer index (0-2).
- errors: 2 typical mistakes Polish learners make with this material: wrong sentence, corrected sentence, short explanation in Polish.`;
    case "video":
      return `Here is the English transcript of a YouTube video titled "${topic}". Create comprehension exercises for a Polish learner, ${lvl}
- summary_pl: 2-3 sentence summary of the video in Polish.
- questions: 6 multiple-choice comprehension questions in English about the video's content (3 options each, answer index 0-2, and the approximate time in seconds in the video where the answer appears, taken from the [mm:ss] markers).
- phrases: 8 useful words or phrases that actually appear in the transcript, with Polish meaning.
- discussion: 3 open questions in English to discuss the video with a tutor.

Transcript:
"""${extra}"""`;
    case "expand":
      return `A Polish learner (${lvl}) has just watched a YouTube video titled "${extra}" as part of a lesson about "${topic}". Write a short "topic expansion" that goes beyond the video: new facts, a different angle or a real-life connection, in natural English at this level (A1-A2: ~100 words, B1-B2: ~180 words, C1-C2: ~260 words).
- title: short English title; text_en: the text split into 2-4 paragraphs; text_pl: Polish translation of each paragraph.
- new_words: 6 useful words/phrases from the text with Polish meaning.
- questions: 3 multiple-choice comprehension questions about your text (3 options, answer index 0-2).
- talk: 3 open questions in English the learner could discuss with the tutor.`;
    case "feedback":
      return `You are an English teacher. A Polish learner (${lvl}) wrote or said the following text${topic ? ` about the topic "${topic}"` : ""}. Check each sentence. For each: original, corrected natural version (same if fine), short explanation in Polish of what was wrong (empty if ok), ok=true if no mistakes. Then a short encouraging summary in Polish with one tip. Also list up to 6 words/phrases the learner was probably missing or could add next time to sound more natural (en + pl).

Text:
"""${extra}"""`;
    default:
      throw new Error("Unknown kind");
  }
}


export class AiInputError extends Error {}

// Zapytanie czatu z lektorem (Kurak).
export function buildChatRequest({ messages = [], level = "A1", mode = "free", task = "" } = {}) {
  const history = messages
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-30)
    .map((m) => ({ role: m.role, content: m.content }));
  if (!history.length || history[0].role !== "user") history.unshift({ role: "user", content: "Hi! Let's start the lesson." });
  return { system: tutorSystemPrompt(level, mode, task), messages: history, schema: CHAT_SCHEMA, maxTokens: 3000 };
}

// Zapytanie generujące materiał (słowa, historia, jednostka, pytania do filmu, rozwinięcie, korekta…).
export function buildGenerateRequest({ kind, level = "A1", topic = "", extra = "" } = {}) {
  const schema = GENERATE_SCHEMAS[kind];
  if (!schema) throw new AiInputError("Nieznany typ materiału");
  if ((kind === "feedback" || kind === "video") && !String(extra).trim()) throw new AiInputError("Brak tekstu do sprawdzenia");
  return {
    messages: [{ role: "user", content: generatePrompt(kind, level, topic, String(extra).slice(0, kind === "video" ? 40000 : 6000)) }],
    schema,
    maxTokens: 8000,
  };
}
