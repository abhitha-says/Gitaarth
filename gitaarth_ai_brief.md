# Gitaarth AI — Project Brief
### *Ancient Wisdom for Modern Problems*

---

## What is Gitaarth AI?

Gitaarth AI is a **divine chatbot and spiritual platform** where people struggling with modern-day problems can seek guidance from the timeless wisdom of **Lord Krishna** (Bhagavad Gita & Mahabharata) and **Lord Ram** (Ramayana).

The chatbot doesn't just throw quotes — it **acts like a real divine counselor**, engaging in a warm, back-and-forth conversation, weaving authentic scripture naturally into its guidance. The goal is to make the user feel like they are truly speaking with the Almighty.

---

## The Core Experience

1. **User lands on the website** → selects their preferred language
2. **Types their problem** directly into the chat — no menus, no barriers
3. **The chatbot responds** as a divine counselor:
   - If **Krishna's** wisdom is relevant → responds with the Sanskrit shloka (Devanagari), its translation in the user's language, the exact chapter & verse reference, and then continues the counseling
   - If **Ram's** wisdom is relevant → responds naturally with Ram's teachings, no shloka formatting needed
4. **The persona visually switches** — the user sees Krishna's or Ram's avatar, name, and distinct styling so they always know who is guiding them
5. **One response at a time** — the chatbot waits for the user to reply, creating a real dialogue

---

## Key Design Decisions

| What | Decision |
|---|---|
| **Visual Theme** | Cosmic & celestial — deep space, divine light rays, Vishwaroop grandeur |
| **Chat Entry** | No friction — user types immediately |
| **Persona** | Dynamic switching between Krishna & Ram based on context |
| **Quotes** | Only **real, verified** quotes from scriptures — never AI-generated/hallucinated |
| **Krishna Format** | Sanskrit shloka → Translation → Chapter/Verse ref → Counseling |
| **Ram Format** | Wisdom in user's language, narrative style, no shlokas |
| **Conversation** | Back-and-forth like a real counselor, not a lecture |
| **Guest Mode** | Anyone can chat; sign in with Google to save & bookmark |

---

## Platform Features

- 🗣️ **Divine Chatbot** — the core counseling experience
- 📖 **Daily Shloka** — a new shloka every day on the homepage
- 📜 **Scripture Library** — browse all Gita chapters & Ramayana stories
- 🔖 **Bookmarks** — save powerful responses and shlokas
- 📝 **Conversation History** — revisit past divine conversations
- 👤 **User Accounts** — Google OAuth (one-click sign in)
- 📱 **Social Sharing** — share quotes on WhatsApp, Twitter, etc.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | MongoDB |
| AI | xAI Grok API |
| Auth | Google OAuth 2.0 |

---

## How the AI Works

The chatbot uses a **hybrid approach** for authenticity:
- **xAI Grok API** handles the conversational counseling intelligence
- **A curated scripture database** (~700 Gita shlokas + ~200 Ram quotes) ensures every quote is real and verified
- The AI retrieves relevant scriptures from the database and weaves them into its responses — it never makes up quotes

---

## The Vision

People today face anxiety, confusion, career dilemmas, relationship struggles, and existential crises. **Krishna didn't solve Arjuna's problems — he gave him the courage to face them.** That's exactly what Gitaarth AI does: it doesn't promise solutions, it gives users the **wisdom and courage** to face their battles, grounded in scriptures that have guided humanity for thousands of years.

> *"You have the right to perform your duty, but you are not entitled to the fruits of your actions."*  
> — Bhagavad Gita, Chapter 2, Verse 47
