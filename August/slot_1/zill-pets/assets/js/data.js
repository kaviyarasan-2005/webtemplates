/**
 * ZILL — data.js
 * Mock data: species, products, guides
 * Used by page-specific JS to populate cards and detail views
 */

/* ============================================================
   SPECIES DATA
   ============================================================ */
const ZILL_SPECIES = [
  {
    id: 'bearded-dragon',
    name: 'Bearded Dragon',
    latin: 'Pogona vitticeps',
    category: 'reptile',
    image: 'https://images.unsplash.com/photo-1619816128374-a6b4766ca92c?w=600&q=80',
    price: 149,
    temperament: 'Docile',
    size: 'Medium (18–24")',
    diet: 'Omnivore',
    difficulty: 'Beginner',
    difficultyLevel: 1,
    lifespan: '10–15 years',
    origin: 'Australia',
    humidity: '30–40%',
    temperature: '80–110°F',
    tankSize: '120 gallon+',
    description: 'One of the most popular reptile companions. Bearded dragons are social, curious, and enjoy gentle handling. They thrive in arid environments and are an excellent choice for first-time keepers.',
    badge: 'BEST SELLER',
    careLevel: 1,
    careGuideId: 'bearded-dragon-care',
    inStock: true,
    captiveBred: true,
  },
  {
    id: 'ball-python',
    name: 'Ball Python',
    latin: 'Python regius',
    category: 'reptile',
    image: 'https://images.unsplash.com/photo-1546992772-3318f1f3a1be?w=600&q=80',
    price: 199,
    temperament: 'Calm',
    size: 'Medium (3–5ft)',
    diet: 'Carnivore (mice/rats)',
    difficulty: 'Beginner',
    difficultyLevel: 1,
    lifespan: '20–30 years',
    origin: 'West & Central Africa',
    humidity: '55–65%',
    temperature: '76–88°F',
    tankSize: '40 gallon+',
    description: 'Ball pythons are celebrated for their docile temperament and stunning morph variety. They are relatively small for pythons and adapt well to captive life. A long-term companion.',
    badge: 'NEW ARRIVAL',
    careLevel: 1,
    careGuideId: 'ball-python-care',
    inStock: true,
    captiveBred: true,
  },
  {
    id: 'crested-gecko',
    name: 'Crested Gecko',
    latin: 'Correlophus ciliatus',
    category: 'reptile',
    image: 'https://images.unsplash.com/photo-1769986289575-d402e93d5885?w=600&q=80',
    price: 89,
    temperament: 'Curious',
    size: 'Small (8–10")',
    diet: 'Fruit & insects',
    difficulty: 'Beginner',
    difficultyLevel: 1,
    lifespan: '15–20 years',
    origin: 'New Caledonia',
    humidity: '60–80%',
    temperature: '72–78°F',
    tankSize: '20 gallon vertical+',
    description: 'Crested geckos are arboreal, nocturnal, and incredibly easy to care for. They do not require UV lighting and thrive at room temperature. Perfect for apartment keepers.',
    badge: 'EASY CARE',
    careLevel: 1,
    careGuideId: 'crested-gecko-care',
    inStock: true,
    captiveBred: true,
  },
  {
    id: 'blue-tongued-skink',
    name: 'Blue-Tongued Skink',
    latin: 'Tiliqua scincoides',
    category: 'reptile',
    image: 'assets/images/blue-tongued-skink.jpg',
    price: 249,
    temperament: 'Friendly',
    size: 'Medium (18–24")',
    diet: 'Omnivore',
    difficulty: 'Intermediate',
    difficultyLevel: 2,
    lifespan: '15–20 years',
    origin: 'Australia/Indonesia',
    humidity: '40–60%',
    temperature: '80–95°F',
    tankSize: '120 gallon+',
    description: 'Named for their striking blue tongue, these skinks are robust, inquisitive, and grow remarkably tame with regular handling. Their personality rivals that of cats and dogs.',
    badge: 'FEATURED',
    careLevel: 2,
    careGuideId: 'blue-tongued-skink-care',
    inStock: true,
    captiveBred: true,
  },
  {
    id: 'leopard-gecko',
    name: 'Leopard Gecko',
    latin: 'Eublepharis macularius',
    category: 'reptile',
    image: 'assets/images/leopard-gecko.jpg',
    price: 79,
    temperament: 'Gentle',
    size: 'Small (7–10")',
    diet: 'Insectivore',
    difficulty: 'Beginner',
    difficultyLevel: 1,
    lifespan: '10–20 years',
    origin: 'Middle East & South Asia',
    humidity: '30–40%',
    temperature: '75–90°F',
    tankSize: '20 gallon+',
    description: 'Leopard geckos are terrestrial, tame, and endlessly rewarding. With a wide variety of morphs available and straightforward care requirements, they are ideal for new reptile enthusiasts.',
    badge: null,
    careLevel: 1,
    careGuideId: 'leopard-gecko-care',
    inStock: true,
    captiveBred: true,
  },
  {
    id: 'chameleon-veiled',
    name: 'Veiled Chameleon',
    latin: 'Chamaeleo calyptratus',
    category: 'reptile',
    image: 'https://images.unsplash.com/photo-1621150538602-2351d4f7dc2f?w=600&q=80',
    price: 189,
    temperament: 'Independent',
    size: 'Medium (12–24")',
    diet: 'Insects & greens',
    difficulty: 'Advanced',
    difficultyLevel: 3,
    lifespan: '5–8 years',
    origin: 'Yemen & Saudi Arabia',
    humidity: '50–70%',
    temperature: '72–95°F',
    tankSize: 'Screen 24"x24"x48"',
    description: 'The veiled chameleon is a visually stunning species that requires precise environmental management. Rewarding for the experienced keeper who can maintain accurate humidity and temperature gradients.',
    badge: 'EXPERT CARE',
    careLevel: 3,
    careGuideId: 'veiled-chameleon-care',
    inStock: false,
    captiveBred: true,
  },
];

/* ============================================================
   PRODUCTS DATA
   ============================================================ */
const ZILL_PRODUCTS = [
  // ── Reptiles ──
  ...ZILL_SPECIES.filter(s => s.inStock).map(s => ({
    id: s.id,
    name: s.name,
    category: 'reptile',
    image: s.image,
    price: s.price,
    badge: s.badge,
    careLevel: s.difficulty,
    description: (s.description || '').substring(0, 100) + '…',
    inStock: s.inStock,
  })),

  // ── Habitats ──
  {
    id: 'desert-terrarium-40',
    name: 'Arid Desert Terrarium 40G',
    category: 'habitat',
    image: 'https://images.unsplash.com/photo-1779634683474-7f78c08e4f03?w=600&q=80',
    price: 189,
    badge: 'BEST SELLER',
    size: '36"×18"×18"',
    careLevel: 'Beginner',
    description: 'Full front-opening glass terrarium with fine mesh top for optimal airflow. Ideal for bearded dragons and leopard geckos.',
    inStock: true,
  },
  {
    id: 'tropical-bio-60',
    name: 'Bioactive Tropical Kit 60G',
    category: 'habitat',
    image: 'https://images.unsplash.com/photo-1560177490-6796cd8cd3a1?w=600&q=80',
    price: 289,
    badge: 'NEW ARRIVAL',
    size: '36"×18"×24"',
    careLevel: 'Intermediate',
    description: 'Complete bioactive setup with drainage layer, substrate, and live plant starter pack for tropical species.',
    inStock: true,
  },
  {
    id: 'arboreal-vertical-20',
    name: 'Arboreal Screen Enclosure',
    category: 'habitat',
    image: 'https://images.unsplash.com/photo-1774267451222-83b7f6c5613f?w=600&q=80',
    price: 129,
    badge: null,
    size: '18"×18"×36"',
    careLevel: 'Beginner',
    description: 'Tall vertical screen enclosure designed for tree-dwelling species like crested geckos and chameleons.',
    inStock: true,
  },

  // ── Feeders ──
  {
    id: 'crickets-medium-250',
    name: 'Medium Crickets (250ct)',
    category: 'feeder',
    image: 'https://images.unsplash.com/photo-1683634809203-fe2c5056d389?w=600&q=80',
    price: 18,
    badge: null,
    size: 'Medium (1/2")',
    careLevel: null,
    description: 'Live gut-loaded crickets, pre-dusted with calcium supplement. Ship same-day, Mon–Thu.',
    inStock: true,
  },
  {
    id: 'dubia-roaches-100',
    name: 'Dubia Roaches (100ct)',
    category: 'feeder',
    image: 'https://images.unsplash.com/photo-1689126086601-6717701d05ef?w=600&q=80',
    price: 22,
    badge: 'HIGH PROTEIN',
    size: 'Small–Medium',
    careLevel: null,
    description: 'Dubia roaches are slow-moving, high-protein, and odorless — the preferred feeder insect for bearded dragons and other insectivores.',
    inStock: true,
  },

  // ── Supplies ──
  {
    id: 'uvb-linear-t5',
    name: 'T5 HO UVB 10.0 Linear Lamp',
    category: 'supply',
    image: 'https://images.unsplash.com/photo-1512551980832-13df02babc9e?w=600&q=80',
    price: 49,
    badge: 'ESSENTIAL',
    size: '24" / 36" / 48"',
    careLevel: null,
    description: 'Professional-grade T5 HO UVB 10.0 linear lamp for desert-dwelling reptiles. Rated for 12-month output.',
    inStock: true,
  },
  {
    id: 'reptile-supplement-duo',
    name: 'Calcium + D3 Supplement Duo',
    category: 'supply',
    image: 'https://images.unsplash.com/photo-1633171031508-a8f26271e8aa?w=600&q=80',
    price: 29,
    badge: null,
    size: '2×85g tubs',
    careLevel: null,
    description: 'Veterinarian-recommended calcium and D3 supplement powder for dusting feeders. Prevents metabolic bone disease.',
    inStock: true,
  },
];

/* ============================================================
   CARE GUIDES DATA
   ============================================================ */
const ZILL_GUIDES = [
  {
    id: 'ball-python-care',
    title: 'Ball Python Care Guide',
    species: 'Ball Python',
    image: 'https://images.unsplash.com/photo-1546992772-3318f1f3a1be?w=600&q=80',
    difficulty: 'Beginner',
    readingTime: '8 min read',
    badge: 'BEGINNER',
    excerpt: 'Everything you need to know about housing, feeding, and socialising your ball python for a long, healthy life.',
    topics: ['Housing', 'Temperature', 'Feeding', 'Handling', 'Health'],
    tempRange: '76–88°F',
    humidityRange: '55–65%',
    content: {
      intro: `Ball pythons (Python regius) are one of the world's most popular pet snakes — and for good reason. Their manageable size, remarkable calmness, and stunning morph diversity make them a favourite from beginners to advanced collectors alike.`,
      sections: [
        {
          id: 'housing',
          title: 'Housing Requirements',
          body: `Adult ball pythons need a minimum 40-gallon enclosure, though bigger is always better. Front-opening terrariums allow easier access and reduce the stress of approaching from above — a direction that, in the wild, signals a predator. Secure all latches; these snakes are escape artists.`,
        },
        {
          id: 'temperature',
          title: 'Temperature & Lighting',
          body: `Maintain a thermal gradient with a warm side of 88–92°F (31–33°C) and a cool side of 76–80°F (24–27°C). Belly heat via an under-tank heater is critical for digestion. Ball pythons are crepuscular; UV lighting is optional but increasingly recommended for welfare.`,
        },
        {
          id: 'feeding',
          title: 'Feeding Schedule',
          body: `Hatchlings eat a prey item roughly the same size as the thickest part of their body, every 5–7 days. Adults (3+ years) eat every 10–14 days. Pre-killed or frozen/thawed prey is strongly recommended to prevent injury. Never handle within 48 hours of a meal.`,
        },
        {
          id: 'handling',
          title: 'Handling & Socialisation',
          body: `Begin handling sessions at 5–10 minutes, 2–3 times per week, after the snake has settled (typically 2 weeks post-arrival). Support the body fully and avoid sudden movements. If the snake ball-poses (curling defensively), return it calmly and try again later.`,
        },
        {
          id: 'health',
          title: 'Health & Common Issues',
          body: `Watch for respiratory infections (audible wheezing, mucus), retained shed (especially eye caps), mites (tiny moving dots), and refusal to eat beyond 6 weeks. All issues warrant a reptile-specialist vet visit. Annual wellness checks are strongly recommended.`,
        },
      ],
    },
  },
  {
    id: 'bearded-dragon-care',
    title: 'Bearded Dragon Care Guide',
    species: 'Bearded Dragon',
    image: 'https://images.unsplash.com/photo-1619816128374-a6b4766ca92c?w=600&q=80',
    difficulty: 'Beginner',
    readingTime: '10 min read',
    badge: 'POPULAR',
    excerpt: 'Bearded dragons are hardy, social, and endlessly entertaining. Learn to set up the perfect arid habitat and feeding schedule.',
    topics: ['Housing', 'UVB Lighting', 'Diet', 'Handling', 'Brumation'],
    tempRange: '80–110°F',
    humidityRange: '30–40%',
    content: {
      intro: `Bearded dragons (Pogona vitticeps) are deservedly one of the world's most popular reptile pets. Originating from arid regions of Australia, they are diurnal, social lizards that thrive with human interaction and proper care.`,
      sections: [
        {
          id: 'housing-bd',
          title: 'Housing & Enclosure Setup',
          body: `Adults require a minimum 120-gallon enclosure (4'×2'×2'). Use a solid substrate such as compressed coconut coir, topsoil/play sand mix, or reptile carpet. Avoid loose sand for juveniles — ingestion risk is high. Provide climbing structures and hides on both warm and cool sides.`,
        },
        {
          id: 'uvb-bd',
          title: 'UVB Lighting (Critical)',
          body: `UVB is non-negotiable for bearded dragons. A T5 HO 10.0 linear lamp spanning 2/3 of the enclosure is the gold standard. Replace bulbs every 12 months even if still illuminated — UV output degrades invisibly. Run lights on a 12–14 hour cycle in summer, 10–12 hours in winter.`,
        },
        {
          id: 'diet-bd',
          title: 'Diet & Nutrition',
          body: `Juveniles eat 70% live insects (crickets, dubia roaches) and 30% leafy greens daily. Adults reverse this: 70% vegetables and 30% insects 3–4 times per week. Dust all insects with calcium at every feeding and use a multivitamin every other week. Always offer fresh greens daily.`,
        },
        {
          id: 'handling-bd',
          title: 'Taming & Handling',
          body: `Most bearded dragons tame quickly. Start with short sessions of 10–15 minutes and build from there. They enjoy shoulder-sitting and basking on warm laps. Watch for a darkened beard or gaping mouth — signs of stress that warrant backing off. Many individuals actively seek attention once settled.`,
        },
        {
          id: 'brumation-bd',
          title: 'Brumation (Winter Slowdown)',
          body: `Bearded dragons may enter brumation (reptile hibernation) in autumn/winter, characterised by decreased appetite and activity. This is normal. Maintain enclosure temperatures and photoperiod, offer water and the occasional food item, and do not disturb unnecessarily. Brumation typically lasts 1–3 months.`,
        },
      ],
    },
  },
  {
    id: 'leopard-gecko-care',
    title: 'Leopard Gecko Care Guide',
    species: 'Leopard Gecko',
    image: 'assets/images/leopard-gecko.jpg',
    difficulty: 'Beginner',
    readingTime: '7 min read',
    badge: 'EASY CARE',
    excerpt: 'Low maintenance, big personality. Leopard geckos are the perfect starter reptile — learn everything about their care here.',
    topics: ['Housing', 'Heating', 'Feeding', 'Shedding', 'Morphs'],
    tempRange: '75–90°F',
    humidityRange: '30–40%',
    content: {
      intro: `Leopard geckos (Eublepharis macularius) are ground-dwelling, nocturnal lizards from the rocky deserts of the Middle East and South Asia. They are one of the most beginner-friendly reptiles — hardy, compact, and available in hundreds of captive morphs.`,
      sections: [
        {
          id: 'housing-lg',
          title: 'Housing',
          body: `A 20-gallon long terrarium is the minimum for one adult. Females can be housed in pairs if introductions are gradual. Use slate tile, paper towel, or reptile carpet — avoid loose substrates entirely. Provide at minimum three hides: warm, cool, and humid (moist sphagnum moss for shedding).`,
        },
        {
          id: 'heating-lg',
          title: 'Heating & Temperature',
          body: `Under-tank heaters connected to a thermostat maintain belly warmth of 88–92°F on the warm side. Cool side stays 72–78°F. No overhead basking required (unlike bearded dragons). Leopard geckos are crepuscular and derive warmth from contact with warmed surfaces.`,
        },
        {
          id: 'feeding-lg',
          title: 'Feeding',
          body: `Feed only live prey — crickets and dubia roaches are the staple. Juveniles eat every other day; adults, 2–3 times per week. Offer prey in a clean feeding bowl to prevent substrate ingestion. Dust with calcium at every feeding, multivitamin once weekly. Remove uneaten prey after 20 minutes.`,
        },
        {
          id: 'shedding-lg',
          title: 'Shedding (Ecdysis)',
          body: `Leopard geckos shed their entire skin in one piece. Increase moist hide humidity by spraying lightly with water. Shedding issues (stuck shed, especially on toes and eyes) are usually caused by insufficient humidity. Soak in warm shallow water for 10 minutes, then gently assist removal with damp cotton buds.`,
        },
        {
          id: 'morphs-lg',
          title: 'Morphs & Genetics',
          body: `Hundreds of captive morphs exist — from the classic Wild Type to albino, eclipse, enigma, and tangerine strains. "Enigma syndrome" (balance issues, star-gazing) is a neurological condition linked to the enigma gene. Always enquire about parental genetics when purchasing morphs.`,
        },
      ],
    },
  },
  {
    id: 'crested-gecko-care',
    title: 'Crested Gecko Care Guide',
    species: 'Crested Gecko',
    image: 'https://images.unsplash.com/photo-1769986289575-d402e93d5885?w=600&q=80',
    difficulty: 'Beginner',
    readingTime: '6 min read',
    badge: 'NO UV NEEDED',
    excerpt: 'Crested geckos need no UV and thrive at room temperature. One of the most forgiving reptiles for new keepers.',
    topics: ['Enclosure', 'Temperature', 'Feeding', 'Drops & Tails', 'Breeding'],
    tempRange: '72–78°F',
    humidityRange: '60–80%',
    content: {
      intro: `The crested gecko (Correlophus ciliatus) was thought extinct until its rediscovery in 1994. Now one of the most popular lizards in captivity, "cresties" are celebrated for their ease of care, adhesive toe pads, and diverse pattern morphs.`,
      sections: [
        {
          id: 'enclosure-cg',
          title: 'Enclosure Setup',
          body: `A vertical 20-gallon terrarium (18"×18"×24") suits one adult. Crested geckos are arboreal — height is more important than floor space. Fill with live or artificial plants, cork rounds, and climbing branches. Front-opening enclosures allow stress-free access from the front rather than from above.`,
        },
        {
          id: 'temperature-cg',
          title: 'Temperature (Room Temp Friendly)',
          body: `Crested geckos thrive at 72–78°F (22–26°C) — standard room temperature in most homes. They cannot tolerate sustained temperatures above 82°F. No heating equipment is typically needed, making them uniquely low-cost to run. Watch for summer heatwaves.`,
        },
        {
          id: 'feeding-cg',
          title: 'Feeding: CGD + Insects',
          body: `Crested gecko diet (CGD) meal replacements (such as Pangea or Repashy) are nutritionally complete and form the staple. Offer a small amount in a shallow dish 3× per week, refreshing every 24 hours. Supplement with small crickets or dubia roaches 2–3 times weekly for enrichment and additional protein.`,
        },
        {
          id: 'tails-cg',
          title: 'Dropped Tails — Don\'t Panic',
          body: `Unlike many geckos, crested geckos do not regenerate dropped tails. "Frog butt" geckos — tailless individuals — are perfectly healthy and actually quite popular among collectors. Tail drops are typically caused by stress or being grasped by the tail. Avoid tail-grabbing entirely.`,
        },
        {
          id: 'breeding-cg',
          title: 'Breeding Notes',
          body: `Breeding pairs should be introduced carefully; males can be aggressive. Females lay clutches of 2 eggs every 4–6 weeks for up to 8 months once paired. Eggs incubate at room temperature (72–76°F) for 60–90 days. A cooling period of 60–65°F for 8 weeks prior to pairing stimulates reproduction.`,
        },
      ],
    },
  },
  {
    id: 'humidity-shedding',
    title: 'Humidity & Shedding Guide',
    species: 'Multi-Species',
    image: 'https://images.unsplash.com/photo-1754531394207-e1b127017c85?w=600&q=80',
    difficulty: 'Reference',
    readingTime: '5 min read',
    badge: 'REFERENCE',
    excerpt: 'Master humidity management and support healthy sheds across all the reptile species in your collection.',
    topics: ['Humidity Basics', 'Misting', 'Humid Hides', 'Stuck Shed', 'Species Table'],
    tempRange: 'Varies',
    humidityRange: 'Varies',
    content: {
      intro: `Humidity management is one of the most misunderstood aspects of reptile husbandry. Too low causes dehydration and poor sheds; too high causes bacterial and fungal respiratory infections. Understanding your specific species' needs is critical.`,
      sections: [
        {
          id: 'basics-hs',
          title: 'Humidity Basics',
          body: `Ambient enclosure humidity is measured with a digital hygrometer (place it at mid-height, away from water dishes). Most keepers need to manage both ambient humidity and localized humid microhabitats (humid hides).`,
        },
        {
          id: 'misting-hs',
          title: 'Misting Techniques',
          body: `Light misting of enclosure walls (not directly on the animal) allows animals to drink droplets while raising humidity temporarily. Automated misters set to fire at dawn and dusk replicate natural dew cycles for tropical species. Always ensure the substrate can dry between misting cycles.`,
        },
        {
          id: 'humid-hides',
          title: 'Humid Hides (Shedding Boxes)',
          body: `A humid hide is a small enclosed container filled with damp sphagnum moss. The animal enters to access elevated moisture during pre-shed. Essential for leopard geckos, ball pythons, and many other species. Clean and re-moisten every 3–5 days.`,
        },
        {
          id: 'stuck-shed',
          title: 'Treating Stuck Shed',
          body: `Never forcefully pull stuck shed — always lubricate first. Soak the animal in shallow, lukewarm water for 15–20 minutes, then gently rub with a damp cloth. Toe caps and eye caps are most critical — retained caps restrict blood flow to toes and can cause blindness if not addressed promptly.`,
        },
      ],
    },
  },
  {
    id: 'feeding-schedules',
    title: 'Feeding Schedules by Species',
    species: 'Multi-Species',
    image: 'https://images.unsplash.com/photo-1689126086601-6717701d05ef?w=600&q=80',
    difficulty: 'Reference',
    readingTime: '4 min read',
    badge: 'REFERENCE',
    excerpt: 'A practical, printable feeding schedule for the most common reptile species kept in captivity.',
    topics: ['Juveniles vs Adults', 'Prey Sizing', 'Dusting Schedule', 'Feeding Log'],
    tempRange: 'N/A',
    humidityRange: 'N/A',
    content: {
      intro: `Getting feeding right is the single most impactful thing a keeper can do for their animal's long-term health. Overfeeding causes obesity; underfeeding causes malnutrition. Both extremes shorten lifespans significantly.`,
      sections: [
        {
          id: 'juvenile-adult',
          title: 'Juvenile vs Adult Feeding',
          body: `Juvenile reptiles (under 12 months) generally eat more frequently than adults to support rapid growth. Most insectivores eat daily as juveniles; adults eat every 2–4 days. Snakes eat on longer cycles — juveniles weekly, adults every 10–14 days.`,
        },
        {
          id: 'prey-sizing',
          title: 'Prey Sizing Rules',
          body: `For lizards, prey should not exceed the width of the animal's head. For snakes, prey should be roughly the same diameter as the snake's mid-body. A prey item that's too large can cause regurgitation, impaction, or stress-induced refusal.`,
        },
        {
          id: 'dusting',
          title: 'Supplement Dusting Schedule',
          body: `The standard protocol: calcium without D3 at every feeding; calcium with D3 twice per month; multivitamin twice per month. Animals with access to strong T5 UVB can reduce D3 supplementation to once monthly. Never over-supplement — vitamin A toxicity from excess multivitamins is a documented concern.`,
        },
      ],
    },
  },
  {
    id: 'veiled-chameleon-care',
    title: 'Veiled Chameleon Care Guide',
    species: 'Veiled Chameleon',
    image: 'https://images.unsplash.com/photo-1621150538602-2351d4f7dc2f?w=600&q=80',
    difficulty: 'Advanced',
    readingTime: '9 min read',
    badge: 'EXPERT CARE',
    excerpt: 'High-ventilation screen housing, moving water drippers, and Ferguson Zone 3 UVB for thriving veiled chameleons.',
    topics: ['Screen Housing', 'Hydration & Drippers', 'UVB Gradient', 'Diet & Gut-Loading', 'Stress Cues'],
    tempRange: '72–95°F',
    humidityRange: '50–70%',
    content: {
      intro: `Veiled Chameleons (Chamaeleo calyptratus) are visually spectacular arboreal lizards from Yemen and Saudi Arabia. Their specialized zygodactylous feet, prehensile tail, and independently moving eyes require very specific enclosure conditions to avoid respiratory and bone disease.`,
      sections: [
        {
          id: 'housing-vc',
          title: 'Full-Screen Enclosure Setup',
          body: `Adult veiled chameleons require a minimum 24"×24"×48" vertical all-screen enclosure. High cross-ventilation is vital; glass terrariums trap stagnant humid air that quickly breeds fatal respiratory infections. Fill the interior with non-toxic live plants (Ficus benjamina, Pothos, Schefflera) and varied branches for climbing.`,
        },
        {
          id: 'hydration-vc',
          title: 'Hydration via Moving Droplets',
          body: `Chameleons do not recognize standing water dishes and will easily dehydrate around full bowls. Provide an automated dripper dripping onto broad leaves for drinking, supplemented by 2–3 daily mistings of 2 minutes each. Relative humidity should spike to 70–80% during morning mist and drop to 40–50% during the heat of the day.`,
        },
        {
          id: 'lighting-vc',
          title: 'Thermal Gradient & Ferguson Zone 3 UVB',
          body: `Maintain a basking branch at 85–95°F (lower for females to prevent excessive egg clutches) with ambient temperatures of 72–78°F. Night temperatures should drop to 65–70°F. A linear T5 HO 6.0 or 10.0 UVB bulb mounted 10–12 inches above the basking perch is mandatory to prevent Metabolic Bone Disease.`,
        },
        {
          id: 'diet-vc',
          title: 'Insect Diet & Vegetation',
          body: `Feed a wide variety of gut-loaded live insects: dubia roaches, crickets, silkworms, and hornworms. Unlike most other chameleons, adult veileds also consume plant matter: offer dandelion greens, collard ribbons, and safe flowers (hibiscus). Dust insects with pure calcium at almost every feed, and multivitamin/D3 twice monthly.`,
        },
        {
          id: 'handling-vc',
          title: 'Observation & Stress Signaling',
          body: `Chameleons are display animals rather than handling pets. Frequent handling causes chronic immunosuppression. Watch for stress signs: dark brown/black blotches, puffed-up bodies, hissing, or open-mouth gaping. Keep the cage in a low-traffic area at eye level so they feel secure.`,
        },
      ],
    },
  },
  {
    id: 'blue-tongued-skink-care',
    title: 'Blue-Tongued Skink Care Guide',
    species: 'Blue-Tongued Skink',
    image: 'assets/images/blue-tongued-skink.jpg',
    difficulty: 'Intermediate',
    readingTime: '8 min read',
    badge: 'OMNIVORE',
    excerpt: 'Deep burrowing substrate, wide thermal gradient, and a 50/40/10 omnivorous nutritional balance for Northern skinks.',
    topics: ['Substrate & Enclosure', 'Thermal Gradient', 'Omnivore Diet', 'Handling & Trust', 'Shedding Care'],
    tempRange: '75–100°F',
    humidityRange: '40–60%',
    content: {
      intro: `Blue-Tongued Skinks (Tiliqua scincoides) are heavy-bodied, terrestrial Australian lizards renowned for their intelligence, calm dispositions, and striking cobalt-blue warning tongue. With proper care, they frequently live 15–20+ years in captivity.`,
      sections: [
        {
          id: 'enclosure-bts',
          title: 'Enclosure Dimensions & Deep Substrate',
          body: `Adults need a minimum 120-gallon (4'×2'×2') floor-oriented enclosure. Skinks love to burrow: provide 4–6 inches of loose, diggable substrate such as cypress mulch or an organic topsoil/sphagnum moss blend. Avoid cedar or pine shavings, which emit toxic aromatic oils.`,
        },
        {
          id: 'heating-bts',
          title: 'Basking Surface & Ferguson Zone 2/3 UVB',
          body: `Provide a broad slate basking zone heated to 95–100°F with an overhead halogen flood lamp. The cool retreat side should sit at 75–80°F. While they can survive on D3 supplements alone, providing a linear T5 HO 10.0 or 6.0 UVB lamp dramatically improves activity, appetite, and calcium absorption.`,
        },
        {
          id: 'diet-bts',
          title: 'Complete Omnivorous Nutrition',
          body: `Feed a golden ratio: 50% dark leafy greens and chopped vegetables (collards, mustard greens, squash, green beans), 40% high-quality protein (dubia roaches, snails, lean ground turkey, grain-free high-end dog food), and 10% fruit/berries as occasional treats. Juveniles eat every 1–2 days; adults eat 2–3 times weekly.`,
        },
        {
          id: 'handling-bts',
          title: 'Handling & Taming Process',
          body: `Blue-tongued skinks are among the easiest large lizards to tame. Always scoop them from below, supporting both their front and hind feet — never grab them from above. When nervous, they flatten their ribs and display their blue tongue with a low huff; simply move slowly and offer a blueberry or hornworm to build positive associations.`,
        },
        {
          id: 'shedding-bts',
          title: 'Toe Shedding & Ecdysis Care',
          body: `Because skinks have short legs and tiny digits, retained shed around the toes can restrict circulation and cause loss of nails or toes. Maintain 40–60% ambient humidity (higher for Indonesian sub-species at 60–80%) and provide a moist sphagnum hide box during shed cycles. Inspect toes after every shed.`,
        },
      ],
    },
  },
];

/* ============================================================
   SETUP WIDGET DATA
   ============================================================ */
const ZILL_SETUP_DATA = {
  'Bearded Dragon': {
    tank: '120 Gal',
    heat: '110°F Basking',
    humidity: '30–40%',
  },
  'Ball Python': {
    tank: '40 Gal',
    heat: '88–92°F Hot Spot',
    humidity: '55–65%',
  },
  'Crested Gecko': {
    tank: '20 Gal Vertical',
    heat: 'Room Temp',
    humidity: '60–80%',
  },
  'Leopard Gecko': {
    tank: '20 Gal Long',
    heat: '90°F UTH',
    humidity: '30–40%',
  },
  'Blue-Tongued Skink': {
    tank: '120 Gal',
    heat: '95°F Basking',
    humidity: '40–60%',
  },
  'Veiled Chameleon': {
    tank: 'Screen 24"×24"×48"',
    heat: '85–95°F Basking',
    humidity: '50–70%',
  },
};

/* ============================================================
   TESTIMONIALS
   ============================================================ */
const ZILL_TESTIMONIALS = [
  {
    name: 'Riya S.',
    rating: 5,
    text: 'My bearded dragon arrived healthy, well-fed, and already curious. The care sheet included was better than anything I found online. ZILL is the real deal.',
    date: 'Aug 2026',
  },
  {
    name: 'Marcus T.',
    rating: 5,
    text: 'The bioactive kit was exactly as described and the team walked me through every step of the setup. Incredible customer support — five stars easily.',
    date: 'Jul 2026',
  },
  {
    name: 'Priya K.',
    rating: 5,
    text: 'Ordered a leopard gecko and three feeders in the same week. Both arrived on schedule, healthy, and the packaging was genuinely impressive.',
    date: 'Jun 2026',
  },
];

/* ============================================================
   WORKSHOPS
   ============================================================ */
const ZILL_WORKSHOPS = [
  { title: 'Beginner Keeper Bootcamp',      date: 'Oct 4, 2026',  seats: 12, available: 4  },
  { title: 'Bioactive Setup Masterclass',   date: 'Oct 11, 2026', seats: 8,  available: 2  },
  { title: 'Safe Handling Clinic',          date: 'Oct 18, 2026', seats: 16, available: 9  },
  { title: 'Advanced Nutrition Workshop',   date: 'Nov 1, 2026',  seats: 10, available: 0  },
];

/* ============================================================
   HEALTH GUARANTEE POLICY
   ============================================================ */
const ZILL_POLICY = [
  {
    id: 'coverage-window',
    title: '100% Live-Arrival & 7-Day Extended Health Guarantee',
    body: 'All captive-bred reptiles are backed by our dual-layer guarantee: (1) 100% Live-Arrival upon initial delivery, and (2) an extended 7-Day Health Guarantee (168 hours from delivery timestamp). If your animal shows persistent signs of distress, illness, or genetic defects within this period despite correct husbandry, we will replace the animal or issue store credit.',
  },
  {
    id: 'delivery-conditions',
    title: 'Delivery & Acceptance Requirements',
    body: 'To maintain guarantee validity, the customer (or a designated adult) must be physically present to receive and sign for the shipment on the carrier\'s first delivery attempt (typically by 10:30 AM via FedEx Priority Overnight). If held at a certified FedEx Ship Center, the package must be picked up within 4 hours of arrival. Packages left on unattended porches in ambient sun or cold void live-arrival protection.',
  },
  {
    id: 'doa-claims',
    title: 'Dead on Arrival (DOA) Procedure & 2-Hour Notice Window',
    body: 'In the extremely rare event that an animal arrives deceased or in critical condition, notice must be emailed to support@zillpets.com within strictly 2 hours of the carrier\'s recorded delivery timestamp. Submissions must include: (1) clear photographs or video of the animal resting on the shipping box with the shipping label fully legible, and (2) your order number.',
  },
  {
    id: 'husbandry-prerequisites',
    title: 'Enclosure Setup & Husbandry Verification',
    body: 'The 7-Day Health Guarantee requires that the buyer has prepared a species-appropriate habitat adhering to the environmental metrics in ZILL Care Guides (correct thermal gradient, linear UVB where applicable, and humidity). In the event of a health claim, the buyer must provide clear photos of the enclosure showing digital thermometer and hygrometer readings.',
  },
  {
    id: 'exclusions',
    title: 'Explicit Exclusions & Void Criteria',
    body: 'The guarantee does not cover: (1) physical injuries sustained after unboxing (falls, stepped-on limbs, escapes), (2) thermal burns caused by unregulated heat rocks or mats without probe thermostats, (3) intestinal impactions caused by calcium sand or crushed walnut shells in juveniles, (4) tail drops (autotomy) in geckos occurring post-unboxing, (5) housing with other reptiles, or (6) feeding wild-caught insects.',
  },
  {
    id: 'weather-shipping',
    title: 'Weather & Climate-Controlled Shipping Protocol',
    body: 'Live reptiles ship exclusively via FedEx Priority Overnight Monday through Wednesday to avoid weekend warehouse holds. Shipments are dispatched only when origin, hub, and destination temperatures are between 38°F and 92°F. Between 32°F–38°F or 92°F–98°F, shipping is restricted to FedEx Ship Center counter pickup. We hold shipments automatically during extreme weather.',
  },
  {
    id: 'feeder-guarantee',
    title: 'Feeder Insect Viability Guarantee (95%+)',
    body: 'Live feeder insects (Dubia roaches, crickets, hornworms, BSFL) are guaranteed 95%+ viable upon arrival. If transit delays cause mortality exceeding 5%, submit photos of the shipping box and count within 24 hours of delivery for a free reshipment or store credit.',
  },
  {
    id: 'refunds',
    title: 'Claim Resolution, Replacement & Store Credit',
    body: 'Approved live-animal claims are resolved via an immediate replacement specimen of equivalent or higher value, or full store credit for the animal\'s purchase price. Store credit never expires and can be used on any reptile, habitat, or supply order. Courier shipping fees are non-refundable.',
  },
];
