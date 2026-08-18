// Seed data for DeenQA: topics and questions covering the major areas of
// Islamic knowledge. Used by both the in-memory DB fallback and the
// `scripts/seed-lightbase.ts` bulk loader so the two paths stay in sync.

import type { Question, Topic } from "@/lib/types"

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------

export interface SeedTopic {
  name: string
  slug: string
  description: string
  color: string
}

export const SEED_TOPICS: SeedTopic[] = [
  {
    name: "Prayer",
    slug: "prayer",
    description:
      "Salah: the five daily prayers, conditions, units (rak'ah), and rulings on combining, shortening, and making up missed prayers.",
    color: "emerald",
  },
  {
    name: "Fasting",
    slug: "fasting",
    description:
      "Sawm: Ramadan fasting, voluntary fasts, what invalidates the fast, and exemptions for the sick, traveller, and expectant mother.",
    color: "blue",
  },
  {
    name: "Zakat",
    slug: "zakat",
    description:
      "Obligatory alms: the nisab threshold, calculation methods, eligible recipients (the eight categories), and the difference between zakat and sadaqah.",
    color: "amber",
  },
  {
    name: "Hajj",
    slug: "hajj",
    description:
      "The pilgrimage to Makkah: the pillars, rituals of the Days of Hajj, conditions of obligation, and the difference between Hajj and Umrah.",
    color: "purple",
  },
  {
    name: "Aqeedah",
    slug: "aqeedah",
    description:
      "Islamic creed: Tawhid and its three categories, the pillars of Iman, the Names and Attributes of Allah, and the unseen (al-ghayb).",
    color: "rose",
  },
  {
    name: "Quran",
    slug: "quran",
    description:
      "The Book of Allah: tafsir, sciences of recitation (tajwid), abrogation, reasons of revelation (asbab al-nuzul), and preserving the text.",
    color: "cyan",
  },
  {
    name: "Hadith",
    slug: "hadith",
    description:
      "Prophetic narrations: the science of narration (isnad) and text (matn), the Sahih collections, and grading of authentic, hasan, and da'if reports.",
    color: "indigo",
  },
  {
    name: "Fiqh",
    slug: "fiqh",
    description:
      "Jurisprudence: categories of rulings (fard, wajib, sunnah, makruh, haram), the major schools of law, and the principles of deriving rulings.",
    color: "pink",
  },
  {
    name: "Seerah",
    slug: "seerah",
    description:
      "The Prophetic biography: the life of the Messenger Muhammad (peace be upon him) from birth to passing, and the lessons drawn from it.",
    color: "emerald",
  },
  {
    name: "Family",
    slug: "family",
    description:
      "Marriage, parenting, kinship, the rights of spouses and children, divorce, and maintaining the ties of the womb (silat al-rahim).",
    color: "blue",
  },
  {
    name: "Business",
    slug: "business",
    description:
      "Islamic finance and trade: prohibition of riba (interest), lawful contracts, halal earning, and ethics in commerce.",
    color: "amber",
  },
  {
    name: "Manners",
    slug: "manners",
    description:
      "Akhlaq and adab: the prophetic character, etiquette of eating, sleeping, greeting, visiting, and dealing with neighbours and guests.",
    color: "purple",
  },
]

// ---------------------------------------------------------------------------
// Questions
// ---------------------------------------------------------------------------

export interface SeedQuestion {
  title: string
  answer: string
  excerpt: string
  topicSlug: string
  tags: string[]
  status: "draft" | "published" | "archived"
  source?: string
  scholar?: string
  category?: string
  viewCount?: number
  bookmarkCount?: number
}

export const SEED_QUESTIONS: SeedQuestion[] = [
  // ---- Prayer (Salah) ----------------------------------------------------
  {
    title: "What are the five daily obligatory prayers in Islam?",
    answer:
      "The five obligatory daily prayers (Salah) are Fajr (dawn, two rak'ahs before sunrise), Dhuhr (midday, four rak'ahs after the sun passes its zenith), Asr (afternoon, four rak'ahs in the late afternoon), Maghrib (sunset, three rak'ahs immediately after sunset), and Isha (night, four rak'ahs after twilight disappears). They are the Second Pillar of Islam and were made obligatory on the night of the Isra and Mi'raj. The number of rak'ahs and their windows of time are fixed by the Sunnah; performance within the time window is obligatory and delay without a valid excuse is sinful. Salah is the first deed a person will be questioned about on the Day of Judgement, so guarding it is a sign of faith.",
    excerpt:
      "Fajr, Dhuhr, Asr, Maghrib, and Isha — the five obligatory daily prayers, with their rak'ah counts and time windows.",
    topicSlug: "prayer",
    tags: ["salah", "pillars", "fajr", "dhuhr", "asr", "maghrib", "isha"],
    status: "published",
    source: "Sahih al-Bukhari 528; Sahih Muslim 11",
    scholar: "Ibn Baz",
    category: "Prayer",
    viewCount: 1245,
    bookmarkCount: 89,
  },
  {
    title: "Is it permissible to combine (jam') prayers while travelling?",
    answer:
      "Yes, the majority of scholars permit combining Dhuhr with Asr, and Maghrib with Isha while travelling. Ibn 'Abbas (may Allah be pleased with him) reported that the Messenger of Allah (peace be upon him) combined Dhuhr with Asr and Maghrib with Isha on a journey, with no fear or rain. Combining takes two forms: jam' taqdim (advancing the second to the time of the first) and jam' ta'khir (delaying the first to the time of the second). Travel is one of the legitimate excuses (along with illness and severe rain) that allow this concession. The journey must be of a distance that permits shortening (qasr), generally accepted as around 80 km. Combining is a mercy and not obligatory; a traveller who finds ease in praying each prayer in its own time should do so as that is preferred (akhra).",
    excerpt:
      "Combining prayers during travel is a Prophetic concession, with conditions on the journey and method.",
    topicSlug: "prayer",
    tags: ["salah", "travel", "jam", "qasr", "rukhsah"],
    status: "published",
    source: "Sahih Muslim 706",
    scholar: "Ibn 'Uthaymin",
    category: "Prayer",
    viewCount: 892,
    bookmarkCount: 67,
  },
  {
    title: "What is the ruling on shortening (qasr) the prayer when travelling?",
    answer:
      "Shortening the four-rak'ah prayers to two rak'ahs while travelling is a confirmed Sunnah (sunnah mu'akkadah) according to the majority, and obligatory according to some scholars. The basis is the practice of the Prophet (peace be upon him) who shortened Dhuhr, Asr, and Isha during travel and never prayed them in full while travelling. 'A'ishah said: 'The prayer was made two by two in travel and at residence, and at residence it was completed (to four)'. Shortening applies to the four-rak'ah prayers only; Maghrib remains three and Fajr remains two. The conditions are: the journey is lawful (not sinful), covers the qasr distance, and the traveller has not yet intended to settle. Once a traveller intends to stay in a place for more than four days, shortening ceases and the prayer is performed in full.",
    excerpt:
      "Qasr: shortening four-rak'ah prayers to two while travelling — its basis, conditions, and length of stay.",
    topicSlug: "prayer",
    tags: ["salah", "qasr", "travel", "sunnah"],
    status: "published",
    source: "Sahih Muslim 694",
    scholar: "Ibn Baz",
    category: "Prayer",
    viewCount: 654,
    bookmarkCount: 41,
  },
  // ---- Fasting (Sawm) ----------------------------------------------------
  {
    title: "When does the daily fast in Ramadan begin and end?",
    answer:
      "The daily fast of Ramadan begins at the true dawn (al-fajr al-sadiq), which is the time the Fajr prayer enters, and ends at sunset (maghrib), when the sun has fully disappeared below the horizon. Allah says: '...and eat and drink until the white thread of dawn becomes distinct from the black thread, then complete the fast until the night' (Surah al-Baqarah 2:187). Pre-dawn meal (suhur) is taken before Fajr and is a blessed practice; breaking the fast (iftar) should not be delayed after sunset. The Adhan of Fajr signals the start of the fast, and the Adhan of Maghrib signals its end. Time-zone determination is by the local sighting of dawn and sunset, not by clock time alone, although for practical purposes astronomical tables are used in modern times.",
    excerpt:
      "Fajr al-sadiq starts the fast; maghrib (sunset) ends it — the Qur'anic basis and the role of suhur and iftar.",
    topicSlug: "fasting",
    tags: ["sawm", "ramadan", "fajr", "maghrib", "suhur", "iftar"],
    status: "published",
    source: "Surah al-Baqarah 2:187",
    scholar: "Ibn Baz",
    category: "Fasting",
    viewCount: 1542,
    bookmarkCount: 124,
  },
  {
    title: "What invalidates the fast during Ramadan?",
    answer:
      "The invalidators of the fast (mufatirat) include: (1) deliberate eating or drinking; (2) intentional vomiting (according to the majority); (3) sexual intercourse during the fasting hours, which also entails expiation (kaffarah) of freeing a slave or fasting sixty consecutive days or feeding sixty poor people; (4) the onset of menstruation or post-natal bleeding; (5) intentional emission of semen through intercourse or masturbation; (6) apostasy, which nullifies all deeds. Inadvertent actions like eating out of forgetfulness, swallowing saliva, dust, or a fly do not break the fast. Injections that provide nourishment break the fast, while non-nutritious injections (such as intramuscular medicine) do not. The use of eye drops, ear drops, and miswak does not break the fast. If a fast is broken deliberately without a valid excuse, it must be made up and may require expiation depending on the violation.",
    excerpt:
      "Eating, drinking, intercourse, intentional vomiting, menstruation — what breaks the fast and what does not.",
    topicSlug: "fasting",
    tags: ["sawm", "ramadan", "mufatirat", "kaffarah"],
    status: "published",
    source: "Sahih al-Bukhari 6669; Surah al-Baqarah 2:187",
    scholar: "Ibn 'Uthaymin",
    category: "Fasting",
    viewCount: 1102,
    bookmarkCount: 95,
  },
  {
    title: "Who is excused from fasting in Ramadan and how do they make it up?",
    answer:
      "Those excused from fasting include: (1) the traveller (musafir) on a journey of qasr distance, who may break the fast and make it up later; (2) the sick person whose illness is worsened by fasting, who makes it up later; (3) the pregnant and nursing woman if fasting harms her or her child, who makes it up later; (4) the elderly who cannot fast and cannot make it up, who feed one poor person for each missed day (fidyah); (5) menstruating women and women in post-natal bleeding, who must make up missed days. Allah says: '...but if any of you is ill or on a journey, the same number should be made up from other days' (Surah al-Baqarah 2:184). The makeup (qada') should be done before the next Ramadan begins according to the majority. Those with a chronic illness that has no expectation of cure pay the fidyah of feeding a poor person per day.",
    excerpt:
      "Traveller, sick, pregnant, nursing, elderly, menstruating — categories excused and how they make up missed days.",
    topicSlug: "fasting",
    tags: ["sawm", "ramadan", "rukhsah", "fidyah", "qada"],
    status: "published",
    source: "Surah al-Baqarah 2:184-185",
    scholar: "Ibn Baz",
    category: "Fasting",
    viewCount: 845,
    bookmarkCount: 73,
  },
  // ---- Zakat -------------------------------------------------------------
  {
    title: "What is zakat and on what kinds of wealth is it obligatory?",
    answer:
      "Zakat is the obligatory annual alms on wealth that has reached the nisab threshold and has been held for one lunar year (hawl). It is the Third Pillar of Islam and is 2.5% of qualifying wealth. Zakat is obligatory on: gold and silver (cash and bullion), trade goods, agricultural produce (5% or 10% depending on irrigation), livestock (camels, cows, sheep) above their respective nisabs, and discovered treasures (rikaz, 20%). The nisab for monetary wealth is the value of 85 grams of gold or 595 grams of silver; scholars differ on which to apply, with the majority using gold as the standard and some using silver out of caution for the poor. Zakat is a right of the poor in the wealth of the rich; withholding it is a major sin. It purifies wealth and is paid to the eight categories of recipients listed in Surah at-Tawbah 9:60.",
    excerpt:
      "Zakat: 2.5% on wealth at the nisab threshold held for a lunar year — categories of wealth and recipients.",
    topicSlug: "zakat",
    tags: ["zakat", "nisab", "hawl", "pillars"],
    status: "published",
    source: "Surah at-Tawbah 9:60; Sahih al-Bukhari 1395",
    scholar: "Ibn Baz",
    category: "Zakat",
    viewCount: 721,
    bookmarkCount: 88,
  },
  {
    title: "Who are the eight categories eligible to receive zakat?",
    answer:
      "Allah specifies the eight recipients of zakat in Surah at-Tawbah (9:60): 'Zakat expenditures are only for the poor and for the needy and for those employed to collect it and for those whose hearts are to be reconciled and for those in bondage and for the debt-ridden and for the path of Allah and for the wayfarer — an obligation from Allah.' The eight are: (1) the poor (fuqara') who have some means but not enough; (2) the needy (masakin) who have nothing; (3) the zakat administrators (al-'amilin 'alayha); (4) those whose hearts are to be reconciled (al-mu'allafat al-qulub); (5) captives and slaves seeking to free themselves (fi al-riqab); (6) the debt-ridden who cannot pay (al-gharimin); (7) those in the path of Allah (fi sabil Allah), classically understood as the struggling defenders and seekers of religious knowledge; (8) the stranded traveller (ibn al-sabil). Zakat cannot be given to the wealthy, to one's direct ascendants or descendants, or to non-Muslim causes outside these categories.",
    excerpt:
      "Fuqara, masakin, 'amilin, mu'allafat al-qulub, fi al-riqab, al-gharimin, fi sabil Allah, ibn al-sabil — the eight categories.",
    topicSlug: "zakat",
    tags: ["zakat", "asnaf", "at-tawbah", "charity"],
    status: "published",
    source: "Surah at-Tawbah 9:60",
    scholar: "Ibn 'Uthaymin",
    category: "Zakat",
    viewCount: 612,
    bookmarkCount: 91,
  },
  {
    title: "What is the difference between zakat and sadaqah?",
    answer:
      "Zakat is the obligatory, fixed annual alms of 2.5% on qualifying wealth at the nisab threshold after a lunar year has passed; it has defined recipients and conditions and is the Third Pillar of Islam. Sadaqah is a voluntary charity without a fixed amount, time, or recipient — it can be given at any time, to anyone in need, in any amount, and even non-Muslims may receive it. Sadaqah encompasses a broad meaning in the Sunnah: even a smile to one's brother, removing harm from the road, and feeding the hungry are forms of sadaqah. Every Muslim is obliged to give sadaqah daily, even if just a small amount, as the Prophet (peace be upon him) said in Sahih al-Bukhari: 'There is no day upon which the servant rises but that two angels descend; one says: O Allah, give compensation to the one who spends; and the other says: O Allah, give ruin to the one who withholds.' Zakat is a finite obligation; sadaqah is an open-ended act of worship.",
    excerpt:
      "Zakat is obligatory, fixed, and has defined recipients; sadaqah is voluntary, open, and broad in the Sunnah.",
    topicSlug: "zakat",
    tags: ["zakat", "sadaqah", "charity", "comparison"],
    status: "published",
    source: "Sahih al-Bukhari 1442",
    scholar: "Ibn Baz",
    category: "Zakat",
    viewCount: 540,
    bookmarkCount: 67,
  },
  // ---- Hajj --------------------------------------------------------------
  {
    title: "What are the pillars (arkan) of Hajj and Umrah?",
    answer:
      "The pillars of Hajj are: (1) ihram (entering the state of consecration, with the intention), which is the first pillar; (2) standing at 'Arafah (wuquf), which is the central rite and the day of Hajj — the Prophet (peace be upon him) said 'Hajj is 'Arafah'; (3) the tawaf al-ifadah (the circumambulation of the Ka'bah seven times after leaving Mina on the Day of Sacrifice). Some scholars add the sa'y between Safa and Marwah as a pillar based on the Qur'anic verse 'Indeed, Safa and Marwah are among the symbols of Allah' (Surah al-Baqarah 2:158). The pillars of Umrah are: ihram and tawaf; the sa'y is also a pillar according to the majority. Missing a pillar invalidates the Hajj or Umrah and it cannot be compensated by offering a sacrifice. Obligatory (wajib) elements, such as throwing the jamarat, the tawaf al-wada' (farewell tawaf), and staying overnight in Muzdalifah, can be compensated by a sacrifice if missed.",
    excerpt:
      "Ihram, wuquf at 'Arafah, tawaf al-ifadah, sa'y — the pillars of Hajj and Umrah and what differentiates them from obligations.",
    topicSlug: "hajj",
    tags: ["hajj", "umrah", "ihram", "tawaf", "sa'y", "arafah"],
    status: "published",
    source: "Sahih al-Tirmidhi 889; Surah al-Baqarah 2:158",
    scholar: "Ibn Baz",
    category: "Hajj",
    viewCount: 980,
    bookmarkCount: 110,
  },
  {
    title: "What is the difference between Hajj and Umrah?",
    answer:
      "Hajj is the major pilgrimage to Makkah performed during the months of Hajj (Shawwal, Dhul-Qa'dah, and the first ten days of Dhul-Hijjah); it is the Fifth Pillar of Islam, obligatory once in a lifetime for those who are able. Umrah is the lesser pilgrimage that can be performed at any time of year; it consists of ihram, tawaf, sa'y, and shaving or trimming the hair. The rites of Hajj include all of Umrah's rites plus the wuquf at 'Arafah (the 9th of Dhul-Hijjah), overnight at Muzdalifah, the days at Mina, the stoning of the jamarat, the Day of Sacrifice, and the tawaf al-ifadah. Hajj requires more time, ritual, and stamina than Umrah. Some scholars consider Umrah obligatory once in a lifetime (based on the verse in Surah al-Baqarah 2:196), while others view it as a strongly emphasised Sunnah; all agree that it is a great act of worship that expiates sins between one Umrah and the next.",
    excerpt:
      "Hajj is the major pilgrimage in the months of Hajj; Umrah is the lesser pilgrimage performable any time.",
    topicSlug: "hajj",
    tags: ["hajj", "umrah", "comparison", "arafah", "mina"],
    status: "published",
    source: "Surah al-Baqarah 2:196; Sahih al-Bukhari 1773",
    scholar: "Ibn 'Uthaymin",
    category: "Hajj",
    viewCount: 875,
    bookmarkCount: 102,
  },
  // ---- Aqeedah (Tawhid, Iman, Pillars of Iman) ---------------------------
  {
    title: "What is Tawhid and what are its three categories?",
    answer:
      "Tawhid is the assertion of the absolute oneness of Allah in His lordship, worship, and names and attributes. It is the foundation of the religion and the meaning of the testimony 'La ilaha illa Allah'. The scholars of Ahl al-Sunnah wal-Jama'ah divide Tawhid into three categories: (1) Tawhid al-rububiyyah — affirming that Allah alone is the Creator, Sustainer, Owner, and Disposer of every affair; (2) Tawhid al-uluhiyyah (also called Tawhid al-'ibadah) — affirming that Allah alone is the one deserving of worship, so all worship (prayer, supplication, sacrifice, vows, hope, fear) must be directed to Him alone; (3) Tawhid al-asma' wa al-sifat — affirming the Names and Attributes that Allah affirmed for Himself or His Messenger affirmed for Him, without distortion (tahrif), denial (ta'til), likening to creation (tashbih), or questioning the modality (takayyuf). The first category was acknowledged by the pre-Islamic Arabs; it is the second that the Messengers primarily called to, and the third distinguishes the precise belief of the saved sect.",
    excerpt:
      "Tawhid: asserting the oneness of Allah in lordship, worship, and His names and attributes — the three categories.",
    topicSlug: "aqeedah",
    tags: ["tawhid", "aqeedah", "rububiyyah", "uluhiyyah", "asma-sifat"],
    status: "published",
    source: "Surah al-Fatihah 1:5; Surah al-Ikhlas 112",
    scholar: "Ibn Baz",
    category: "Aqeedah",
    viewCount: 1340,
    bookmarkCount: 156,
  },
  {
    title: "What are the Six Pillars of Iman?",
    answer:
      "The Pillars of Iman (faith) are six, as in the famous Hadith of Jibril: '...that you believe in Allah, His angels, His books, His messengers, the Last Day, and that you believe in the divine decree (qadar), the good of it and the bad of it.' (1) Belief in Allah — His existence, lordship, right to worship, and names and attributes; (2) Belief in the angels — created from light, they never disobey Allah and have roles such as revelation (Jibril), recording deeds, blowing the trumpet, taking souls, and guarding the Hellfire; (3) Belief in the revealed Books — the Tawrah, Zabur, Injil, and the Quran (which abrogates all prior and is protected by Allah); (4) Belief in the Messengers — the first being Adam and the final being Muhammad (peace be upon him), with twenty-five named in the Quran; (5) Belief in the Last Day — resurrection, accounting, the scales, the bridge, Paradise and Hell; (6) Belief in divine decree (qadar) — that Allah knew, wrote, willed, and created all things, and that human action is real within the foreknowledge and decree of Allah.",
    excerpt:
      "Allah, the angels, the books, the messengers, the Last Day, and divine decree — the six pillars of Iman.",
    topicSlug: "aqeedah",
    tags: ["iman", "pillars", "jibril", "qadar", "last-day"],
    status: "published",
    source: "Sahih Muslim 8",
    scholar: "Ibn 'Uthaymin",
    category: "Aqeedah",
    viewCount: 1188,
    bookmarkCount: 142,
  },
  {
    title: "What are the Five Pillars of Islam?",
    answer:
      "The Five Pillars of Islam are the foundational acts of worship upon which the religion is built, as in the hadith 'Islam is built upon five: the testimony that there is no god but Allah and that Muhammad is the Messenger of Allah, the establishment of the prayer, the giving of the zakat, the pilgrimage to the House, and fasting Ramadan.' (Sahih al-Bukhari 8; Sahih Muslim 16). (1) The two testimonies (shahadatayn) — La ilaha illa Allah, Muhammad rasul Allah — which admit one to the religion; (2) Establishing the prayer (iqamat al-salah) — the five daily prayers; (3) Giving the zakat — the obligatory annual alms on qualifying wealth; (4) Fasting Ramadan — abstaining from food, drink, and lawful pleasures from dawn to sunset; (5) Hajj to the Sacred House — once in a lifetime for those who are able (istita'ah). These pillars are the structural minimum of worship; the perfection of the religion lies in also fulfilling the pillars of Iman and the pillars of Ihsan, all of which appear in the Hadith of Jibril.",
    excerpt:
      "Shahadah, salah, zakat, sawm, Hajj — the five foundational pillars upon which Islam is built.",
    topicSlug: "aqeedah",
    tags: ["pillars", "islam", "shahadah", "salah", "zakat", "sawm", "hajj"],
    status: "published",
    source: "Sahih al-Bukhari 8; Sahih Muslim 16",
    scholar: "Ibn Baz",
    category: "Aqeedah",
    viewCount: 1612,
    bookmarkCount: 198,
  },
  {
    title: "What is the meaning of 'La ilaha illa Allah'?",
    answer:
      "The testimony 'La ilaha illa Allah' ('There is no god but Allah') is the declaration of Tawhid al-uluhiyyah — that nothing has the right to be worshipped except Allah. Linguistically it negates (la ilaha) every object of worship and affirms (illa Allah) the worship of Allah alone. Its meaning is not merely that Allah exists or that He is the Creator — the pagan Arabs acknowledged that — but that all worship (prayer, supplication, sacrifice, vows, hope, fear, reliance, love, and reverence) must be directed exclusively to Allah. To enter Islam, one must know its meaning, attest to it with the tongue, and act upon it. The testimony has seven conditions: knowledge, certainty, sincerity, truthfulness, love, submission, and acceptance; some add the condition of disbelief in taghut. Sins diminish its perfection but do not nullify it unless they fall into shirk. Coupled with 'Muhammad rasul Allah', it is the key to Paradise and the first of the Five Pillars.",
    excerpt:
      "La ilaha illa Allah: the negation of every object of worship and the affirmation of worship of Allah alone — its meaning and conditions.",
    topicSlug: "aqeedah",
    tags: ["shahadah", "tawhid", "uluhiyyah", "shirk", "taghut"],
    status: "published",
    source: "Surah Muhammad 47:19",
    scholar: "Ibn Baz",
    category: "Aqeedah",
    viewCount: 1058,
    bookmarkCount: 167,
  },
  // ---- Quran -------------------------------------------------------------
  {
    title: "What is the difference between the Quran and other revealed books?",
    answer:
      "The Quran is the final revealed Book of Allah, sent to the Prophet Muhammad (peace be upon him) via the angel Jibril over approximately twenty-three years. It differs from the prior books (the Tawrah given to Musa, the Zabur given to Dawud, the Injil given to 'Isa, and the scriptures of Ibrahim and Musa) in that Allah has taken it upon Himself to preserve the Quran from any alteration until the end of time: 'Indeed, it is We who sent down the Reminder, and indeed We are its guardian.' (Surah al-Hijr 15:9). The prior books were entrusted to their respective peoples for safekeeping and were subject to alteration and loss. The Quran abrogates the laws of the previous books, is recited as an act of worship, and is inimitable in its language and style — none can produce its like. It was transmitted in continuous mass chains (tawatur) in both recitation and writing, and is the primary source of legislation for the Muslim community.",
    excerpt:
      "The Quran is the final, preserved, inimitable revelation that abrogates the prior books — the difference is preservation and abrogation.",
    topicSlug: "quran",
    tags: ["quran", "tawrat", "injil", "zabur", "tawatur", "hifz"],
    status: "published",
    source: "Surah al-Hijr 15:9; Surah al-Ma'idah 5:48",
    scholar: "Ibn Baz",
    category: "Quran",
    viewCount: 1421,
    bookmarkCount: 188,
  },
  {
    title: "What is tafsir and what are its main methods?",
    answer:
      "Tafsir is the science of explaining the meanings of the Qur'an, deriving its rulings, wisdom, and intent. It is one of the noblest sciences because it interprets the speech of Allah. The preferred method of tafsir is to interpret the Quran by the Quran (what is brief in one place is detailed in another), then by the Sunnah, then by the statements of the Companions (sahabah), then by the statements of the Successors (tabi'un) such as Mujahid, 'Ikrimah, and al-Hasan. Tafsir bil-riwayah (tafsir bil-ma'thur) relies on transmitted reports; tafsir bil-dirayah relies on the linguistic and juristic ijtihad of the scholar within the framework of the Arabic language, the Sunnah, and the methodology of the early Muslims. Famous tafsir works include the Tafsir of Ibn Kathir, al-Tabari, al-Qurtubi, and al-Sa'di. A mufassir must master the Arabic language, the sciences of recitation (qira'at), abrogation (nasikh wa al-mansukh), reasons of revelation (asbab al-nuzul), and the methodology of Ahl al-Sunnah.",
    excerpt:
      "Tafsir: explaining the meanings of the Quran — its sources, methods, and famous works.",
    topicSlug: "quran",
    tags: ["tafsir", "quran", "ibn-kathir", "dirayah", "riwayah"],
    status: "published",
    source: "Surah 'Alaq 96:1; Tafsir Ibn Kathir",
    scholar: "al-Sa'di",
    category: "Quran",
    viewCount: 980,
    bookmarkCount: 121,
  },
  {
    title: "How was the Quran compiled into a single book (mushaf)?",
    answer:
      "The Quran was revealed piecemeal over twenty-three years; the Prophet (peace be upon him) would recite each portion, and a group of scribes (al-kuttab al-wahy), including Zayd ibn Thabit, 'Ali ibn Abi Talib, Ubayy ibn Ka'b, and Mu'awiyah, wrote it down on parchment, bone, palm-leaves, and other materials. The order of verses and chapters was fixed by the Prophet under revelation. During the caliphate of Abu Bakr (may Allah be pleased with him), following the Battle of Yamamah in which many reciters were martyred, the first compilation into a single mushaf was undertaken by Zayd ibn Thabit under the supervision of 'Umar ibn al-Khattab. During the caliphate of 'Uthman ibn 'Affan, with the expansion of the Muslim lands and the emergence of dialectal differences in recitation, 'Uthman commissioned a standardised mushaf (the 'Uthmanic codex) and distributed copies to the major cities, ordering the burning of differing versions to unify the Ummah on a single recension. The Quran of today matches the 'Uthmanic codex letter for letter and is transmitted in continuous mass chains.",
    excerpt:
      "Revelation, scribes, the compilation of Abu Bakr, and the standardisation of 'Uthman — how the mushaf was unified.",
    topicSlug: "quran",
    tags: ["quran", "compilation", "abu-bakr", "uthman", "zayd-ibn-thabit"],
    status: "published",
    source: "Sahih al-Bukhari 4987, 4988",
    scholar: "Ibn Kathir",
    category: "Quran",
    viewCount: 1093,
    bookmarkCount: 154,
  },
  // ---- Hadith ------------------------------------------------------------
  {
    title: "What is the science of hadith grading (sahih, hasan, da'if)?",
    answer:
      "Hadith are narrations reported from the Prophet (peace be upon him) of his sayings, actions, tacit approvals, and physical descriptions. The scholars of hadith developed a rigorous science to grade them. A sahih (authentic) hadith satisfies five conditions: a connected chain (ittisal al-sanad), integrity ('adalah) of narrators, precision (dabt) in memory or writing, the absence of irregularity (shudhudh), and the absence of hidden defects ('illah). A hasan (good) hadith meets the same conditions but with slightly lower precision in the narrators. A da'if (weak) hadith fails one or more of these conditions — through a break in the chain, a narrator accused of lying or weak memory, or other defects. A maudu' (fabricated) report is one that is forged and falsely attributed to the Prophet. The Sahihayn (Sahih al-Bukhari and Sahih Muslim) are the most authentic books after the Book of Allah. Grading underpins the derivation of law and creed from the Sunnah.",
    excerpt:
      "Sahih, hasan, da'if, maudu' — the five conditions of authenticity and the gradation of hadith.",
    topicSlug: "hadith",
    tags: ["hadith", "mustalah", "sahih", "hasan", "daif", "bukhari", "muslim"],
    status: "published",
    source: "Muqaddimah of Ibn al-Salah",
    scholar: "al-Nawawi",
    category: "Hadith",
    viewCount: 1012,
    bookmarkCount: 133,
  },
  {
    title: "What is the difference between the matn and the isnad of a hadith?",
    answer:
      "Every hadith consists of two parts: the isnad (the chain of narrators who transmit the report from the Prophet, peace be upon him, down to the compiler) and the matn (the text or content of the narration). The isnad is the apparatus by which the hadith is authenticated; scholars examine each narrator for integrity ('adalah) and precision (dabt), and check the chain for connectedness (ittisal) and the absence of irregularity (shudhudh) and hidden defects ('illah). The matn is examined for consistency with the Quran, with stronger chains, with historical fact, and with Arabic linguistics. The Companions were meticulous in transmitting the Sunnah; the early generations (salaf) considered the isnad part of the religion, as Imam Muslim reported in his Sahih: 'Isnad is part of the religion; were it not for the isnad, whoever wished could say whatever he wished.' The combined examination of isnad and matn underpins the entire hadith sciences.",
    excerpt:
      "The isnad is the chain of narrators; the matn is the text. Both are examined in the authentication of hadith.",
    topicSlug: "hadith",
    tags: ["hadith", "isnad", "matn", "mustalah"],
    status: "published",
    source: "Sahih Muslim 26 (Muqaddimah)",
    scholar: "al-Nawawi",
    category: "Hadith",
    viewCount: 870,
    bookmarkCount: 96,
  },
  // ---- Fiqh --------------------------------------------------------------
  {
    title: "What do the terms fard, wajib, sunnah, makruh, and haram mean in fiqh?",
    answer:
      "Islamic legal rulings (ahkam al-shar'iyyah) fall into five categories. (1) Fard (or wajib in the Hanafi school) — an act demanded by the Lawgiver, whose performance is rewarded and whose neglect is punished; e.g. the five daily prayers and zakat. (2) Mandub (mustahabb, sunnah) — an act requested but not strictly demanded, whose performance is rewarded and whose neglect is not punished; e.g. the sunnah rawatib prayers and sadaqah. (3) Mubah — a permissible act, neutral in itself, such as eating lawful foods; performance and abandonment are equal unless intention elevates them. (4) Makruh — an act the Lawgiver has discouraged; performance is not punished but abandonment is rewarded, and is of two kinds: makruh tahrimi (close to haram) and makruh tanzihi (light). (5) Haram — an act the Lawgiver has forbidden, whose commission is punished and avoidance is rewarded; e.g. consuming pork, riba (interest), and disobedience to parents. A sixth category, sah (fasid in some schools), concerns the validity of contracts and acts of worship. These categories are derived from the Quran, Sunnah, and the principles of usul al-fiqh.",
    excerpt:
      "Fard, mandub, mubah, makruh, haram — the five categories of legal rulings in fiqh.",
    topicSlug: "fiqh",
    tags: ["fiqh", "ahkam", "fard", "wajib", "sunnah", "makruh", "haram"],
    status: "published",
    source: "Al-Mawsu'ah al-Fiqhiyyah, al-Waraqat",
    scholar: "Ibn 'Uthaymin",
    category: "Fiqh",
    viewCount: 1322,
    bookmarkCount: 178,
  },
  {
    title: "What are the differences between the major schools of Islamic law (madhahib)?",
    answer:
      "The four major Sunni schools of law (madhahib) are the Hanafi (founded by Abu Hanifah al-Nu'man, d. 150 AH), Maliki (founded by Malik ibn Anas, d. 179 AH), Shafi'i (founded by Muhammad ibn Idris al-Shafi'i, d. 204 AH), and Hanbali (founded by Ahmad ibn Hanbal, d. 241 AH). They differ in their reliance on specific legal sources and methodologies. The Hanafis rely heavily on rational analogy (qiyas) and juristic preference (istihsan); the Malikis give significant weight to the practice of the people of Madinah ('amal ahl al-madinah) and considerations of public welfare (maslahah mursalah); the Shafi'is place a strong emphasis on the evidentiary hierarchy of the Quran, Sunnah, ijma' (consensus), and qiyas, and formalised the science of usul al-fiqh; the Hanbalis rely primarily on narrations (athar) and are the most cautious in employing independent reasoning. Despite their differences, all four schools share the same fundamental sources — the Quran, the Sunnah, ijma', and qiyas — and are considered valid paths to the truth. A Muslim may follow any of them; taqlid (following a qualified school) is permitted for the layperson, while scholars are encouraged to seek the strongest evidence.",
    excerpt:
      "Hanafi, Maliki, Shafi'i, Hanbali — their methodologies, source weightings, and the shared basis of usul al-fiqh.",
    topicSlug: "fiqh",
    tags: ["fiqh", "madhhab", "hanafi", "maliki", "shafii", "hanbali", "usul"],
    status: "published",
    source: "Al-Majmu' Sharh al-Muhadhdhab",
    scholar: "al-Nawawi",
    category: "Fiqh",
    viewCount: 1456,
    bookmarkCount: 187,
  },
  {
    title: "What is halal and haram in food and drink?",
    answer:
      "Halal (lawful) and haram (forbidden) categories govern Muslim consumption. Among animals, cattle, sheep, goats, camels, and certain wild game are halal if slaughtered in the name of Allah with a sharp blade severing the throat, oesophagus, and jugular veins. Pigs, dogs, carnivores with fangs, birds of prey with talons, predatory insects, reptiles, donkeys, and mules are haram. Carrion, blood, and animals not slaughtered in the prescribed manner are haram. Aquatic animals are halal without ritual slaughter according to the majority. All intoxicants are haram — including wine, beer, and any substance that clouds the intellect in large or small amounts — as the Prophet (peace be upon him) said: 'Every intoxicant is khamr and every khamr is haram' (Sahih Muslim 2003). Food containing haram ingredients, or that which has been in contact with haram substances in a way that contaminates it, is to be avoided. Halal food must also be obtained through lawful earnings; wealth acquired through haram means renders the food bought with it haram in consumption.",
    excerpt:
      "Halal and haram in food: ritual slaughter, the prohibited animals, the prohibition of intoxicants, and the role of lawful earning.",
    topicSlug: "fiqh",
    tags: ["fiqh", "halal", "haram", "dhabihah", "khamr", "food"],
    status: "published",
    source: "Surah al-Ma'idah 5:3; Sahih Muslim 2003",
    scholar: "Ibn Baz",
    category: "Fiqh",
    viewCount: 1690,
    bookmarkCount: 215,
  },
  // ---- Seerah ------------------------------------------------------------
  {
    title: "What are the major phases of the Prophetic biography (Seerah)?",
    answer:
      "The Seerah of the Prophet Muhammad (peace be upon him) is studied in five major phases. (1) The pre-prophetic phase: his birth in the Year of the Elephant (around 570 CE), lineage to the noble house of Quraysh, early loss of his parents, upbringing under his grandfather 'Abd al-Muttalib and uncle Abu Talib, and his reputation as al-Amin (the trustworthy). (2) The Makkan prophethood (610-622 CE): the first revelation in the Cave of Hira at age forty, the secret and open calls to Islam, the early Companions, the persecution by Quraysh, the migration to Abyssinia, the Year of Sorrow, and the Night Journey (Isra and Mi'raj). (3) The Hijrah to Madinah (622 CE): the turning point marking the start of the Islamic calendar, the building of the first mosque, the brotherhood (mu'akhah) between the Migrants (muhajirun) and Helpers (ansar), and the Constitution of Madinah. (4) The Madinan phase: the major battles (Badr, Uhud, Khandaq), the Treaty of Hudaybiyyah, the letters to kings, and the Conquest of Makkah (8 AH). (5) The Farewell Pilgrimage and passing (10-11 AH / 632 CE): the Farewell Sermon on the Day of 'Arafah, the completion of the religion, and his passing in Madinah. Each phase carries lessons in patience, leadership, da'wah, and reliance on Allah.",
    excerpt:
      "Birth, Makkan prophethood, Hijrah, Madinan phase, and Farewell Pilgrimage — the five phases of the Prophetic biography.",
    topicSlug: "seerah",
    tags: ["seerah", "makkah", "madinah", "hijrah", "hudaybiyyah", "fath-makkah"],
    status: "published",
    source: "Sahih al-Bukhari; Ar-Raheeq Al-Makhtum",
    scholar: "Ibn Hisham",
    category: "Seerah",
    viewCount: 1387,
    bookmarkCount: 169,
  },
  {
    title: "What is the significance of the Treaty of Hudaybiyyah?",
    answer:
      "The Treaty of Hudaybiyyah, concluded in the year 6 AH (628 CE) between the Prophet (peace be upon him) and the Quraysh, is one of the most consequential events in the Seerah. The Prophet set out with his Companions intending to perform 'Umrah; Quraysh blocked them at a place called Hudaybiyyah, and after negotiations a ten-year truce was concluded. From the apparent terms, the Muslims conceded several points (the 'Umrah was deferred a year, and the truce appeared favourable to Quraysh). Yet the Quran called it 'a clear victory' (fath mubin, Surah al-Fath 48:1). The treaty opened a period of peace in which da'wah flourished; many tribes entered Islam, including Khalid ibn al-Walid and 'Amr ibn al-'As, who would later be among the greatest commanders. The freedom to preach without the threat of Quraysh allowed the message to spread throughout the Arabian Peninsula and beyond. Two years later, after Quraysh violated the truce by attacking an ally, the Conquest of Makkah (8 AH) took place, and the Peninsula entered Islam in large numbers. The treaty is a lesson in patience, strategic vision, and trusting Allah's wisdom even when apparent terms are difficult.",
    excerpt:
      "The Treaty of Hudaybiyyah — a 'clear victory' that opened the way for the spread of Islam in the Peninsula.",
    topicSlug: "seerah",
    tags: ["seerah", "hudaybiyyah", "fath", "quraysh", "dawah"],
    status: "published",
    source: "Surah al-Fath 48:1-27; Sahih al-Bukhari 2731",
    scholar: "Ibn Hisham",
    category: "Seerah",
    viewCount: 954,
    bookmarkCount: 112,
  },
  // ---- Pillars of Islam, Pillars of Iman (already above in Aqeedah) -----
  // ---- Marriage / Family / Business / Ethics / Manners -------------------
  {
    title: "What is the Islamic ruling and purpose of marriage (nikah)?",
    answer:
      "Marriage (nikah) is a solemn contract (mithaq ghaliz) in Islam, recommended (mustahabb) for those with desire and ability, obligatory for those who fear falling into the haram. The Prophet (peace be upon him) said: 'O young men, whoever among you can support a wife should marry, for it restrains the gaze and guards the private parts; and whoever cannot, let him fast, for it is a shield.' (Sahih al-Bukhari 5066; Sahih Muslim 1400). The purposes of marriage include: (1) preserving the lineage (hifz al-nasl) and forming a stable family; (2) protecting chastity and lowering the gaze; (3) finding tranquillity (sukun) through companionship, as in Surah al-Rum 30:21; (4) raising righteous offspring; (5) cooperation in righteousness and mutual support in faith. The pillars of nikah are the offer (ijab) and acceptance (qabul) from the wali (guardian) of the bride and the groom, the presence of two upright witnesses, and the mahr (dowry) given by the groom. Conditions for validity include the consent of both spouses, the eligibility to marry, and absence of the prohibitions of kinship, fosterage, and sister-in-law rules.",
    excerpt:
      "Nikah: a solemn contract whose purpose is chastity, lineage, tranquillity, and righteous offspring — pillars and conditions.",
    topicSlug: "family",
    tags: ["nikah", "marriage", "mahr", "wali", "family"],
    status: "published",
    source: "Surah al-Rum 30:21; Sahih al-Bukhari 5066",
    scholar: "Ibn Baz",
    category: "Family",
    viewCount: 1289,
    bookmarkCount: 165,
  },
  {
    title: "What are the rights of parents in Islam and how should they be honoured?",
    answer:
      "Honouring parents (birr al-walidayn) is among the greatest acts in Islam; Allah joined His right to worship with the duty of kindness to parents: 'And your Lord has decreed that you worship none but Him, and that you be dutiful to your parents.' (Surah al-Isra 17:23). The rights of parents include: (1) kindness and good treatment in speech, tone, and action, even to non-Muslim parents so long as they do not call to disobedience; (2) obedience in matters that are lawful and not sinful; (3) financial maintenance when in need, especially in old age; (4) gentleness and patience with their temperaments; (5) making du'a for them, especially after death; (6) maintaining ties with their friends and relatives after their passing; (7) serving them in illness. The mother has three times the right of the father in companionship, as in the famous hadith of Abu Hurayrah (Sahih al-Bukhari 5975). Disobedience to parents ('uquq al-walidayn) is a major sin. The only limit to obedience is in sin: 'No obedience to a creature in disobedience to the Creator.' (Sahih al-Bukhari, Ahmad).",
    excerpt:
      "Birr al-walidayn: kindness, maintenance, du'a, and obedience within the limits of tawhid — the rights of parents.",
    topicSlug: "family",
    tags: ["birr", "parents", "family", "filial-piety", "dua"],
    status: "published",
    source: "Surah al-Isra 17:23-24; Sahih al-Bukhari 5975",
    scholar: "Ibn Baz",
    category: "Family",
    viewCount: 1456,
    bookmarkCount: 198,
  },
  {
    title: "What is the prohibition of riba (interest) and its scope in Islamic finance?",
    answer:
      "Riba (interest, usury) is strictly prohibited in Islam by the Quran, the Sunnah, and the consensus of the Ummah. Allah says: 'Allah has permitted trade and forbidden riba.' (Surah al-Baqarah 2:275) and 'O you who believe, fear Allah and give up what remains of your demand for riba, if you are indeed believers. If you do not, take notice of war from Allah and His Messenger.' (Surah al-Baqarah 2:278-279). Riba is of two kinds: riba al-nasi'ah (interest on deferred payment, the time-value of money on loans) and riba al-fadl (the disparity in exchange of specified goods such as gold for gold or wheat for wheat in unequal quantities). The prohibition extends to loans that accrue interest, deposits at interest, mortgages with interest, and bonds. Islamic finance replaces interest with profit-and-loss sharing (mudarabah, musharakah), sale-based contracts (murabahah, salam, istisna'), and lease-based contracts (ijarah). The wisdom in the prohibition is the protection of the weak from exploitation, the circulation of wealth among the rich and poor alike, and the linkage of return to risk and real economic activity.",
    excerpt:
      "Riba: interest in all its forms — Quranic prohibition, the two kinds, and the halal alternatives in Islamic finance.",
    topicSlug: "business",
    tags: ["riba", "business", "finance", "haram", "trade", "murabahah"],
    status: "published",
    source: "Surah al-Baqarah 2:275-279; Sahih Muslim 1598",
    scholar: "Ibn Baz",
    category: "Business",
    viewCount: 1789,
    bookmarkCount: 245,
  },
  {
    title: "What is halal earning and what business practices are prohibited?",
    answer:
      "Halal earning is a form of worship in Islam; the Prophet (peace be upon him) said: 'The truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs.' (Sunan al-Tirmidhi 1209, hasan). Lawful earnings come from lawful trade, manufacturing, agriculture, services, and lawful employment. Prohibited business practices include: (1) riba (interest) in any loan or financing; (2) gharar (excessive uncertainty or risk in contracts, such as selling what one does not own); (3) maysir and qimar (gambling and games of chance); (4) dealing in haram goods such as pork, alcohol, idols, and forbidden services; (5) fraud, concealment of defects, false oaths to sell, and adulteration of goods; (6) hoarding (ihtikar) of essential goods to raise prices; (7) bribery; (8) theft, embezzlement, and breach of trust; (9) selling before the call of the next market (al-najsh, driving up the price artificially). The seller must disclose defects, weigh and measure justly, give the buyer the option to cancel (khiyar) in cases of defects or misrepresentation, and be honest in negotiation. The earnings of a Muslim are an amanah (trust) and are scrutinised on the Day of Judgement.",
    excerpt:
      "Halal earning is worship; prohibited practices include riba, gharar, maysir, fraud, hoarding, and bribery.",
    topicSlug: "business",
    tags: ["halal", "business", "riba", "gharar", "maysir", "trade", "ethics"],
    status: "published",
    source: "Sunan al-Tirmidhi 1209; Surah al-Mutaffifin 83:1-3",
    scholar: "Ibn 'Uthaymin",
    category: "Business",
    viewCount: 1567,
    bookmarkCount: 178,
  },
  {
    title: "What is the prophetic character (akhlaq) and how was it described?",
    answer:
      "The character (akhlaq) of the Prophet Muhammad (peace be upon him) is described by his wife 'A'ishah in the famous narration: 'His character was the Quran' (Sahih Muslim 746) — meaning he embodied every noble trait that the Quran commands. Allah describes him in the Quran: 'And indeed, you are of a great moral character.' (Surah al-Qalam 68:4). His character was marked by perfect mercy, gentleness, humility, patience, courage, generosity, honesty, loyalty to covenants, and forgiveness of those who wronged him. He was the most patient in adversity, the most grateful in prosperity, the most just in judgement, and the foremost in service to his family at home. He smiled often, spoke gently, greeted first, never turned away a needy asker, and forgave the people of Makkah on the day of its Conquest with the words 'Go, you are free.' His Companions loved him more than their own selves, and even his enemies before his message called him al-Amin (the trustworthy). His character is the living example for every Muslim to follow.",
    excerpt:
      "'His character was the Quran' — mercy, humility, patience, courage, honesty, and forgiveness in the prophetic example.",
    topicSlug: "manners",
    tags: ["akhlaq", "prophet", "character", "mercy", "forgiveness"],
    status: "published",
    source: "Sahih Muslim 746; Surah al-Qalam 68:4",
    scholar: "al-Nawawi",
    category: "Manners",
    viewCount: 1342,
    bookmarkCount: 187,
  },
  {
    title: "What is the adab of greeting (salam), eating, and visiting in Islam?",
    answer:
      "Islamic etiquette (adab) encompasses the prophetic manners in everyday life. (1) The greeting of salam: 'As-salamu 'alaykum wa rahmatullahi wa barakatuhu' is the right of a Muslim upon his brother, said by the rider to the walker, the few to the many, and completed (with 'wa rahmatullahi wa barakatuhu') for the full reward. The reply 'wa 'alaykum as-salam wa rahmatullahi wa barakatuhu' is obligatory. (2) Eating: begin with 'Bismillah', eat with the right hand, eat from what is in front of you, do not criticise food, do not blow on hot food, chew thoroughly, and end with 'Alhamdulillah'; the Sunnah is to sit, to lick one's fingers, and to share food. (3) Visiting: announce at the door, do not enter without permission (the Quran commands 'asking permission' three times), keep the visit brief unless invited to stay, do not stare, and make du'a for the host: 'Allahumma barik lahum fi ma razaqtahum' (O Allah, bless them in what You have provided them). The Prophet (peace be upon him) said: 'I was sent to perfect noble character' (Sunan al-Bayhaqi), and adab is the outward form of that character.",
    excerpt:
      "Adab of salam, eating, and visiting — prophetic etiquette that perfects the everyday life of the Muslim.",
    topicSlug: "manners",
    tags: ["adab", "salam", "etiquette", "eating", "visiting", "sunnah"],
    status: "published",
    source: "Sunan al-Bayhaqi; Sahih al-Bukhari 5885; Surah an-Nur 24:27",
    scholar: "Ibn 'Uthaymin",
    category: "Manners",
    viewCount: 1211,
    bookmarkCount: 156,
  },
  {
    title: "How should a Muslim treat neighbours, guests, and the elderly?",
    answer:
      "The Prophet (peace be upon him) said: 'Jibril continued to advise me about the neighbour, until I thought he would make him an heir.' (Sahih al-Bukhari 6014; Sahih Muslim 2624). The rights of a neighbour include: protection from harm, kindness in word and deed, sharing of food and gifts, assistance in need, concealing their faults, and condoning their annoyance. The neighbour's right extends to forty houses in each direction according to a narration. As for guests, the Prophet said: 'Whoever believes in Allah and the Last Day, let him honour his guest.' (Sahih al-Bukhari 6018). A guest is honoured for one day and night, and may be hosted for up to three days; beyond that is charity. The guest's right is hospitality, food, drink, and a kind reception. The elderly are honoured by deference, mercy, lowering the gaze of disrespect, speaking gently, assisting them physically, and giving them the foremost place in sitting. The Prophet said: 'He is not one of us who does not show mercy to our young ones and respect to our elders.' (Sunan al-Tirmidhi 1919, hasan). All these manners are branches of faith and the living character of the Muslim community.",
    excerpt:
      "Neighbours, guests, and the elderly — the rights, the wisdom of Jibril's advice, and the Prophetic command of mercy.",
    topicSlug: "manners",
    tags: ["adab", "neighbours", "guests", "elderly", "mercy", "rights"],
    status: "published",
    source: "Sahih al-Bukhari 6014, 6018; Sunan al-Tirmidhi 1919",
    scholar: "Ibn Baz",
    category: "Manners",
    viewCount: 1156,
    bookmarkCount: 145,
  },
]

// ---------------------------------------------------------------------------
// Helpers used by the in-memory DB and the Lightbase seed script
// ---------------------------------------------------------------------------

export function buildTopicsForSeed(): Omit<Topic, "id" | "createdAt" | "updatedAt">[] {
  return SEED_TOPICS.map((t) => ({
    name: t.name,
    slug: t.slug,
    description: t.description,
    color: t.color,
    questionCount: 0,
  }))
}

export function buildQuestionsForSeed(
  topicIdBySlug: Record<string, string>,
): Omit<Question, "id" | "createdAt" | "updatedAt">[] {
  return SEED_QUESTIONS.map((q) => {
    const topicId = topicIdBySlug[q.topicSlug]
    return {
      title: q.title,
      answer: q.answer,
      excerpt: q.excerpt,
      topicIds: topicId ? [topicId] : [],
      tags: q.tags,
      status: q.status,
      source: q.source,
      scholar: q.scholar,
      category: q.category,
      viewCount: q.viewCount ?? 0,
      bookmarkCount: q.bookmarkCount ?? 0,
      createdBy: "admin",
      imageUrl: "",
    }
  })
}

// ---------------------------------------------------------------------------
// Glossary (Islamic terms) — used by the glossary page and the seed script
// ---------------------------------------------------------------------------

export interface SeedGlossaryTerm {
  term: string
  arabic?: string
  transliteration?: string
  definition: string
  category: string
}

export const SEED_GLOSSARY: SeedGlossaryTerm[] = [
  {
    term: "Tawhid",
    arabic: "التوحيد",
    transliteration: "Tawhid",
    definition:
      "The assertion of the absolute oneness of Allah in His lordship, worship, and names and attributes. It is the meaning of the testimony 'La ilaha illa Allah' and the foundation of the religion of Islam. Tawhid is of three categories: rububiyyah (lordship), uluhiyyah (worship), and asma' wa al-sifat (names and attributes).",
    category: "Aqeedah",
  },
  {
    term: "Tawakkul",
    arabic: "التوكّل",
    transliteration: "Tawakkul",
    definition:
      "Reliance upon Allah in all affairs, taking the permitted means while trusting that the outcome is in the hands of Allah alone. It is a high station of faith; the Prophet (peace be upon him) said: 'Were you to rely upon Allah with the reliance He deserves, He would provide for you as He provides for the birds: they go out hungry in the morning and return full in the evening.' (Sunan al-Tirmidhi)",
    category: "Spirituality",
  },
  {
    term: "Salah",
    arabic: "الصلاة",
    transliteration: "Salah",
    definition:
      "The obligatory ritual prayer performed five times a day by Muslims, the Second Pillar of Islam. Salah consists of prescribed units (rak'ahs) of standing, bowing, prostrating, and sitting, performed in a state of ritual purity (wudu), facing the qiblah (the Ka'bah in Makkah).",
    category: "Worship",
  },
  {
    term: "Sawm",
    arabic: "الصوم",
    transliteration: "Sawm",
    definition:
      "Fasting, particularly the obligatory fast of the month of Ramadan, the Fourth Pillar of Islam. Sawm is the abstention from food, drink, marital relations, and other invalidators from true dawn (fajr) until sunset (maghrib), undertaken with the intention of drawing near to Allah.",
    category: "Worship",
  },
  {
    term: "Zakat",
    arabic: "الزكاة",
    transliteration: "Zakat",
    definition:
      "The obligatory annual alms on qualifying wealth at the nisab threshold held for a lunar year, the Third Pillar of Islam. It is 2.5% of qualifying wealth and is distributed to the eight categories of recipients specified in Surah at-Tawbah 9:60. Zakat purifies wealth and is the right of the poor in the wealth of the rich.",
    category: "Worship",
  },
  {
    term: "Hajj",
    arabic: "الحج",
    transliteration: "Hajj",
    definition:
      "The major pilgrimage to Makkah, the Fifth Pillar of Islam, obligatory once in a lifetime for those who are able (istita'ah). Hajj is performed during the months of Hajj, with its central rites of ihram, wuquf at 'Arafah, and tawaf al-ifadah. The day of 'Arafah is the climax, on which the Prophet (peace be upon him) gave his Farewell Sermon.",
    category: "Worship",
  },
  {
    term: "Iman",
    arabic: "الإيمان",
    transliteration: "Iman",
    definition:
      "Faith in Allah, His angels, His books, His messengers, the Last Day, and divine decree (qadar), the good and the bad of it. Iman is the assertion of the heart, the testimony of the tongue, and the action of the limbs. It increases with obedience and decreases with sin. The pillars of Iman appear in the Hadith of Jibril (Sahih Muslim 8).",
    category: "Aqeedah",
  },
  {
    term: "Ihsan",
    arabic: "الإحسان",
    transliteration: "Ihsan",
    definition:
      "Excellence in worship and conduct; the highest of the three levels of religion (Islam, Iman, Ihsan). In the Hadith of Jibril, the Prophet (peace be upon him) defined it: 'To worship Allah as though you see Him; and if you do not see Him, then know that He sees you.' (Sahih Muslim 8). Ihsan is also excellence in dealing with parents, kin, and creation.",
    category: "Spirituality",
  },
  {
    term: "Fitrah",
    arabic: "الفطرة",
    transliteration: "Fitrah",
    definition:
      "The natural, primordial disposition upon which Allah created humanity, inclining to truth and to the recognition of Allah's oneness. The Prophet (peace be upon him) said: 'No child is born except on the fitrah; then his parents make him Jewish, Christian, or Magian.' (Sahih al-Bukhari, Muslim). Returning to the fitrah is the purpose of the Prophets' call.",
    category: "Aqeedah",
  },
  {
    term: "Wudu",
    arabic: "الوضوء",
    transliteration: "Wudu",
    definition:
      "The minor ritual ablution performed before salah, consisting of washing the hands, mouth, nose, face, arms to the elbows, wiping the head and ears, and washing the feet. Its obligation is established by the verse in Surah al-Ma'idah 5:6. Wudu is a means of purification and a cause for the forgiveness of minor sins.",
    category: "Purification",
  },
  {
    term: "Ghusl",
    arabic: "الغسل",
    transliteration: "Ghusl",
    definition:
      "The major ritual bath performed after major ritual impurity (janabah), menstruation, post-natal bleeding, or before the Friday prayer. It consists of an intention, washing the private parts, performing ablution, and pouring water over the entire body including the roots of the hair.",
    category: "Purification",
  },
  {
    term: "Tayammum",
    arabic: "التيمم",
    transliteration: "Tayammum",
    definition:
      "The dry ablution using clean earth or stone in place of wudu or ghusl, permissible when water is unavailable, or when its use would cause harm (illness, severe cold). Its legislation is in Surah al-Ma'idah 5:6. Tayammum is a mercy and ease granted by Allah.",
    category: "Purification",
  },
  {
    term: "Niyyah",
    arabic: "النية",
    transliteration: "Niyyah",
    definition:
      "The intention by which actions are distinguished; the resolve of the heart to perform an act of worship for the sake of Allah. The Prophet (peace be upon him) said: 'Actions are but by intentions, and every man will have only what he intended.' (Sahih al-Bukhari 1, Muslim 1907). The place of niyyah is the heart, not the tongue.",
    category: "Worship",
  },
  {
    term: "Sunnah",
    arabic: "السنة",
    transliteration: "Sunnah",
    definition:
      "The way, practice, and guidance of the Prophet Muhammad (peace be upon him), encompassing his sayings, actions, tacit approvals, and physical and moral attributes. It is the second source of Islamic legislation after the Quran. Sunnah also refers to acts that are recommended (as opposed to obligatory) in fiqh.",
    category: "Hadith",
  },
  {
    term: "Fard",
    arabic: "الفرض",
    transliteration: "Fard",
    definition:
      "An act obligatory upon the Muslim, demanded by the Lawgiver in a definitive manner, whose performance is rewarded and whose neglect is punished. Examples include the five daily prayers, zakat, and fasting Ramadan. Fard is also categorised as fard 'ayn (individual obligation) and fard kifayah (communal obligation).",
    category: "Fiqh",
  },
  {
    term: "Wajib",
    arabic: "الواجب",
    transliteration: "Wajib",
    definition:
      "An obligatory act; in the Hanafi school, a degree below fard, derived from a non-decisive (zanni) evidence. Examples include witr prayer and the slaughter of an animal that was not sacrificed in the Hajj tamattu' or qiran. The Wajib is rewarded upon performance and punished upon neglect.",
    category: "Fiqh",
  },
  {
    term: "Makruh",
    arabic: "المكروه",
    transliteration: "Makruh",
    definition:
      "An act that is discouraged by the Lawgiver; its abandonment is rewarded and its performance is disliked. It is of two kinds: makruh tahrimi (close to haram) and makruh tanzihi (light). Examples include leaving the sunnah acts of salah or wasting food.",
    category: "Fiqh",
  },
  {
    term: "Haram",
    arabic: "الحرام",
    transliteration: "Haram",
    definition:
      "An act forbidden by the Lawgiver in a definitive manner, whose commission is punished and whose avoidance is rewarded. Examples include consuming pork, riba (interest), theft, and disobedience to parents. Committing haram is a major sin that requires repentance (tawbah).",
    category: "Fiqh",
  },
  {
    term: "Halal",
    arabic: "الحلال",
    transliteration: "Halal",
    definition:
      "An act or thing permitted by the Lawgiver, such as lawful food, lawful earning, and marriage. The general rule in things is permissibility (ibahah) unless there is an evidence of prohibition. The Muslim seeks the halal and is rewarded for doing so with the intention of obedience.",
    category: "Fiqh",
  },
  {
    term: "Mashhur",
    arabic: "المشهور",
    transliteration: "Mashhur",
    definition:
      "A hadith whose chain has three or more narrators at every level, but does not reach the level of mutawatir (mass-narrated). Mashhur narrations are widely known among the scholars of hadith and constitute one of the categories between the mutawatir and the ahad hadith.",
    category: "Hadith",
  },
  {
    term: "Sahih",
    arabic: "الصحيح",
    transliteration: "Sahih",
    definition:
      "An authentic hadith that satisfies the conditions of a connected chain, integrity of narrators, precision in transmission, absence of irregularity, and absence of hidden defects. The most authentic hadith collections are Sahih al-Bukhari and Sahih Muslim, known together as the Sahihayn.",
    category: "Hadith",
  },
  {
    term: "Hasan",
    arabic: "الحسن",
    transliteration: "Hasan",
    definition:
      "A hadith whose chain is connected and whose narrators are of integrity, but whose precision is slightly lower than that required for sahih. Hasan hadith are accepted as evidence in legislation and are often used to support weak narrations; a hasan hadith may be elevated to sahih through multiple chains.",
    category: "Hadith",
  },
  {
    term: "Da'if",
    arabic: "الضعيف",
    transliteration: "Daif",
    definition:
      "A weak hadith that fails to meet the conditions of sahih or hasan, due to a break in the chain, a narrator accused of lying, weak memory, or other defects. Da'if hadith are not used in matters of creed or halal and haram, but may be used in matters of virtue (fada'il) with conditions, according to some scholars.",
    category: "Hadith",
  },
  {
    term: "Maudu",
    arabic: "الموضوع",
    transliteration: "Maudu",
    definition:
      "A fabricated hadith, falsely attributed to the Prophet (peace be upon him). It is the weakest of all categories and is forbidden to transmit except when accompanied by an explanation of its fabrication. The scholars of hadith developed the science of 'ilm al-jarh wa al-ta'dil to expose fabricated reports.",
    category: "Hadith",
  },
  {
    term: "Tafsir",
    arabic: "التفسير",
    transliteration: "Tafsir",
    definition:
      "The science of explaining the meanings of the Quran. The preferred method is to interpret the Quran by the Quran, then by the Sunnah, then by the statements of the Companions, and then the Successors. Tafsir is divided into tafsir bil-riwayah (transmitted) and tafsir bil-dirayah (based on the scholar's ijtihad within the framework of the language and Sunnah).",
    category: "Quran",
  },
  {
    term: "Ilm",
    arabic: "العلم",
    transliteration: "Ilm",
    definition:
      "Knowledge; in the religious sense, the knowledge of the Quran and the Sunnah, and the sciences derived from them. The seeking of beneficial knowledge ('ilm nafi') is a duty upon every Muslim, and the scholars are the inheritors of the Prophets. The Quran begins with the command 'Read in the name of your Lord who created.'",
    category: "General",
  },
  {
    term: "Faqih",
    arabic: "الفقيه",
    transliteration: "Faqih",
    definition:
      "A jurist, a scholar of fiqh (Islamic jurisprudence). The faqih is one who has mastered the rulings of the shari'ah, their evidences, and the methods of deriving them. The term is used for the muftis and judges of the community, and is distinguished from the muhaddith (the scholar of hadith) and the mufassir (the exegete).",
    category: "Fiqh",
  },
  {
    term: "Mufti",
    arabic: "المفتي",
    transliteration: "Mufti",
    definition:
      "A qualified scholar who issues formal legal rulings (fatawa, plural of fatwa) in response to questions. The mufti is required to have mastery of the Quran, the Sunnah, the Arabic language, the principles of usul al-fiqh, and the conditions of issuing a fatwa. The fatwa of a mufti is non-binding unless issued by a qadi (judge) in a court of law.",
    category: "Fiqh",
  },
  {
    term: "Qadi",
    arabic: "القاضي",
    transliteration: "Qadi",
    definition:
      "A judge in an Islamic court, qualified to adjudicate disputes and to issue binding rulings. The qadi must be a Muslim, of age, upright, learned in the law, of sound hearing and sight, and a male according to the majority (with the Hanafi school permitting female judges in matters other than the prescribed penalties). The qadi's ruling is binding upon the litigants.",
    category: "Fiqh",
  },
  {
    term: "Imam",
    arabic: "الإمام",
    transliteration: "Imam",
    definition:
      "A leader; in the religious sense, one who leads the prayer, or a scholar of high rank whose works are followed in the religion (such as the four imams of the schools of law). The imam of the salah must be the most learned in the rules of the prayer and the most upright in character; the imam of the Friday prayer delivers the khutbah (sermon) and leads the congregational prayer.",
    category: "Worship",
  },
  {
    term: "Khutbah",
    arabic: "الخطبة",
    transliteration: "Khutbah",
    definition:
      "A sermon; in particular, the two sermons delivered before the Friday (Jumu'ah) prayer and the two sermons of the Eid prayers. The Friday khutbah has conditions including a specified time, the praise of Allah, the salawat upon the Prophet, the recitation of a verse, and a counsel to taqwa. The khutbah is a communal obligation.",
    category: "Worship",
  },
  {
    term: "Adhan",
    arabic: "الأذان",
    transliteration: "Adhan",
    definition:
      "The call to prayer, comprising specific phrases glorifying Allah, testifying to tawhid and the messengership of Muhammad (peace be upon him), calling to prayer, and calling to success. The adhan is called at the entry of each prayer's time by a mu'adhdhin (muezzin) from an elevated place or a loudspeaker. It is a sunnah mu'akkadah upon the community (fard kifayah).",
    category: "Worship",
  },
  {
    term: "Iqamah",
    arabic: "الإقامة",
    transliteration: "Iqamah",
    definition:
      "The second call to prayer, made immediately before the commencement of the prayer itself, comprising the same phrases as the adhan with the addition of 'Qad qamat al-salah' ('The prayer has been established'), said twice. The iqamah signals the start of the actual salah.",
    category: "Worship",
  },
  {
    term: "Tahajjud",
    arabic: "التهجد",
    transliteration: "Tahajjud",
    definition:
      "The voluntary night prayer performed after some sleep in the latter part of the night; the most meritorious of the voluntary prayers after the witr. It was a sunnah upon the Prophet (peace be upon him) and is highly recommended for his Ummah. Its time begins after Isha and continues until the entry of Fajr, with the best portion being the last third of the night.",
    category: "Worship",
  },
  {
    term: "Tarawih",
    arabic: "التراويح",
    transliteration: "Tarawih",
    definition:
      "The special sunnah prayer performed in congregation during the nights of Ramadan, named after the rest (rawhah) taken between every four rak'ahs. The Prophet (peace be upon him) led his Companions in it for three nights, then stopped out of fear it would be made obligatory. 'Umar ibn al-Khattab later gathered the people behind Ubayy ibn Ka'b in a single congregation of twenty rak'ahs.",
    category: "Worship",
  },
]

export const GLOSSARY_FALLBACK = SEED_GLOSSARY.map((t, i) => ({
  id: `static-${i + 1}`,
  ...t,
}))
