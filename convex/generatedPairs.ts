/**
 * Generated context pairs. Written by scripts/pairs/generate.ts; every entry
 * passed the Jev pair battery (pair-battery@2, see docs/pairs.md).
 * Do not edit by hand: it is rebuilt from evidence/pairs/reports.jsonl. To drop
 * a pair, delete its record there (or tighten the battery) and rebuild.
 */

import type { Surface } from "./content";

export type GeneratedWorld = {
  label: string;
  setting: string;
  name: string;
  surface: Surface;
};
export type GeneratedPair = {
  key: string;
  a: GeneratedWorld;
  b: GeneratedWorld;
  /** Battery quality at generation time; higher is better. */
  quality: number;
  battery: string;
};

export const GENERATED_PAIRS: GeneratedPair[] = [
  {
    "key": "lottery-and-apocalypse",
    "a": {
      "label": "A televised lottery host",
      "setting": "Grinning widely under studio lights as the bouncing balls drop into the chute.",
      "name": "A lottery draw broadcast",
      "surface": "lime"
    },
    "b": {
      "label": "A doomsday preacher",
      "setting": "Bellowing from a soapbox on a crowded street corner under storm clouds.",
      "name": "A street sermon",
      "surface": "graphite"
    },
    "quality": 10.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "blizzard-warning-heartbreak-text",
    "a": {
      "label": "A severe weather alert",
      "setting": "A scrolling red banner broadcast over car radios as the blizzard rolls in.",
      "name": "Severe blizzard alert",
      "surface": "sky"
    },
    "b": {
      "label": "A bitter breakup text",
      "setting": "A typed message sent at midnight after weeks of emotional distance.",
      "name": "A cold breakup text",
      "surface": "plum"
    },
    "quality": 10.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "sommelier-coroner",
    "a": {
      "label": "A wine sommelier",
      "setting": "Whispered over a pristine white tablecloth while tilting a vintage red under candlelight.",
      "name": "A sommelier's critique",
      "surface": "oxblood"
    },
    "b": {
      "label": "A medical examiner",
      "setting": "Dictated into an overhead microphone above a stainless steel morgue examination table.",
      "name": "An autopsy dictation",
      "surface": "graphite"
    },
    "quality": 10.36,
    "battery": "pair-battery@2"
  },
  {
    "key": "eulogy-graduation",
    "a": {
      "label": "A grieving friend",
      "setting": "Reading a tribute beside the open grave under cloudy skies.",
      "name": "A graveside eulogy",
      "surface": "plum"
    },
    "b": {
      "label": "A class valedictorian",
      "setting": "Addressing the senior class from a podium during commencement ceremonies.",
      "name": "A commencement speech",
      "surface": "mint"
    },
    "quality": 10.28,
    "battery": "pair-battery@2"
  },
  {
    "key": "zen-and-espionage",
    "a": {
      "label": "A guided meditation teacher",
      "setting": "Spoken in a soft, resonant tone to a dimly lit room full of reclined students.",
      "name": "A guided meditation",
      "surface": "mint"
    },
    "b": {
      "label": "An assassin giving final instructions",
      "setting": "Whispered in a parked sedan to a trainee watching the target approach.",
      "name": "A sniper's instruction",
      "surface": "ink"
    },
    "quality": 10.27,
    "battery": "pair-battery@2"
  },
  {
    "key": "kindergarten-curfew-slasher",
    "a": {
      "label": "A kindergarten teacher",
      "setting": "Guiding thirty restless five-year-olds in a circle on the carpet.",
      "name": "Kindergarten circle time",
      "surface": "blush"
    },
    "b": {
      "label": "A masked killer's phone call",
      "setting": "Speaking through a voice distorter to a babysitter home alone at night.",
      "name": "A slasher's taunt",
      "surface": "ink"
    },
    "quality": 10.26,
    "battery": "pair-battery@2"
  },
  {
    "key": "wedding-and-surrender",
    "a": {
      "label": "A maid of honor toast",
      "setting": "Clinking a glass in front of two hundred smiling guests at the reception hall.",
      "name": "Maid of honor speech",
      "surface": "rose"
    },
    "b": {
      "label": "A defeated general's surrender",
      "setting": "Delivered across a battered table inside the victor's field tent.",
      "name": "Terms of surrender",
      "surface": "fog"
    },
    "quality": 10.23,
    "battery": "pair-battery@2"
  },
  {
    "key": "campfire-ghost-weather-alert",
    "a": {
      "label": "A teen around a campfire",
      "setting": "Whispered with a flashlight held under the chin as embers crackle.",
      "name": "A campfire ghost story",
      "surface": "forest"
    },
    "b": {
      "label": "An automated emergency broadcast",
      "setting": "Scrolled across screens with an abrasive siren during a flash freeze.",
      "name": "An emergency weather alert",
      "surface": "blush"
    },
    "quality": 10.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "job-seeker-hostage-plea",
    "a": {
      "label": "An eager candidate",
      "setting": "Leaning across an oak desk with a nervous smile and a polished resume.",
      "name": "A job interview pitch",
      "surface": "cream"
    },
    "b": {
      "label": "A captive negotiator",
      "setting": "Speaking under a single dangling lightbulb to masked captors.",
      "name": "A hostage plea",
      "surface": "ink"
    },
    "quality": 10.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "heist-ice-cream",
    "a": {
      "label": "A getaway driver",
      "setting": "Whispered into an earpiece while idling the van down the block from the bank.",
      "name": "Getaway driver radio",
      "surface": "graphite"
    },
    "b": {
      "label": "An ice cream vendor",
      "setting": "Shouted cheerfully out the truck window to a pack of sprinting neighborhood kids.",
      "name": "Ice cream truck call",
      "surface": "butter"
    },
    "quality": 10.2,
    "battery": "pair-battery@2"
  },
  {
    "key": "discharge-ransom",
    "a": {
      "label": "The hospital discharge nurse",
      "setting": "Handing clipboard papers to a recovering patient sitting in a wheelchair.",
      "name": "Discharge instructions",
      "surface": "mint"
    },
    "b": {
      "label": "The shadowy kidnapper",
      "setting": "Whispering instructions over a payphone line in a rainstorm.",
      "name": "A ransom demand",
      "surface": "oxblood"
    },
    "quality": 10.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "manifestation-cult",
    "a": {
      "label": "A wellness guru",
      "setting": "Read from the bestselling opening chapter of a self-help manifesto.",
      "name": "Self help affirmation",
      "surface": "cream"
    },
    "b": {
      "label": "A secret society recruiter",
      "setting": "Whispered by torchlight to a blindfolded inductee in an underground cellar.",
      "name": "Cult initiation oath",
      "surface": "oxblood"
    },
    "quality": 10.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-ransom",
    "a": {
      "label": "A frustrated roommate",
      "setting": "Taping a sharp yellow Post-it note to the shared refrigerator.",
      "name": "A passive-aggressive note",
      "surface": "butter"
    },
    "b": {
      "label": "A kidnapper",
      "setting": "Pasting magazine clippings onto cardstock in a shuttered motel room.",
      "name": "A ransom demand",
      "surface": "oxblood"
    },
    "quality": 10.07,
    "battery": "pair-battery@2"
  },
  {
    "key": "campaign-launch-escape",
    "a": {
      "label": "A political candidate",
      "setting": "Shouting into a microphone at a crowded high school gym on campaign launch night.",
      "name": "A campaign stump speech",
      "surface": "butter"
    },
    "b": {
      "label": "A prison break mastermind",
      "setting": "Huddled with fellow inmates in the laundry room moments before the power cuts.",
      "name": "A prison escape plan",
      "surface": "oxblood"
    },
    "quality": 10.04,
    "battery": "pair-battery@2"
  },
  {
    "key": "audio-tour-heist",
    "a": {
      "label": "Museum audio guide narrator",
      "setting": "Pre-recorded, refined voice guiding a solitary patron through a quiet, dimly lit gallery of ancient artifacts.",
      "name": "A museum audio guide",
      "surface": "cream"
    },
    "b": {
      "label": "Master thief over earpiece",
      "setting": "Hissed into an operative's earpiece as laser sensors sweep across a darkened gallery vault.",
      "name": "An art heist earpiece",
      "surface": "ink"
    },
    "quality": 10.02,
    "battery": "pair-battery@2"
  },
  {
    "key": "crystal-ball-coach",
    "a": {
      "label": "A mystic medium",
      "setting": "Staring into a cloudy crystal ball in a dim velvet parlor.",
      "name": "A fortune teller's prophecy",
      "surface": "plum"
    },
    "b": {
      "label": "A high school football coach",
      "setting": "Addressing the bruised squad in the locker room at halftime, down by twenty.",
      "name": "A halftime pep talk",
      "surface": "forest"
    },
    "quality": 10.02,
    "battery": "pair-battery@2"
  },
  {
    "key": "anchor-prophet",
    "a": {
      "label": "A late-night news anchor",
      "setting": "Delivering the nightly broadcast signoff as the credits start scrolling.",
      "name": "A news anchor signoff",
      "surface": "paper"
    },
    "b": {
      "label": "An apocalyptic prophet",
      "setting": "Speaking to a gathered crowd on a windswept hill at dusk.",
      "name": "A doomsday prophecy",
      "surface": "rose"
    },
    "quality": 10.01,
    "battery": "pair-battery@2"
  },
  {
    "key": "pirate-dentist",
    "a": {
      "label": "A pirate captain",
      "setting": "Shouting down the hatch to a quivering captive during a raid.",
      "name": "A pirate's ultimatum",
      "surface": "sea"
    },
    "b": {
      "label": "An oral surgeon",
      "setting": "Leaning over a patient reclining beneath bright overhead lights.",
      "name": "A dentist's reassurance",
      "surface": "periwinkle"
    },
    "quality": 10.01,
    "battery": "pair-battery@2"
  },
  {
    "key": "escape-meditation",
    "a": {
      "label": "A meditation guide",
      "setting": "Recorded track whispering over ocean soundscapes on a smartphone app.",
      "name": "Guided meditation",
      "surface": "sea"
    },
    "b": {
      "label": "A getaway driver",
      "setting": "Whispered through a cracked window in an idling car outside a bank.",
      "name": "A getaway driver",
      "surface": "ink"
    },
    "quality": 10,
    "battery": "pair-battery@2"
  },
  {
    "key": "ice-cream-jingle-ransom",
    "a": {
      "label": "The neighborhood ice cream driver",
      "setting": "Calling through a tinny megaphone on a sweltering July suburban afternoon.",
      "name": "Ice cream vendor",
      "surface": "butter"
    },
    "b": {
      "label": "A kidnapper",
      "setting": "Speaking through a disguised phone call to frantic parents checking the porch.",
      "name": "A kidnapper's demand",
      "surface": "graphite"
    },
    "quality": 9.95,
    "battery": "pair-battery@2"
  },
  {
    "key": "conjuror-conspiracy",
    "a": {
      "label": "A stage illusionist",
      "setting": "Spoken with a dramatic flair while waving a silk cloth above an empty box.",
      "name": "Stage magician reveal",
      "surface": "plum"
    },
    "b": {
      "label": "A whistleblower",
      "setting": "Muttered over an encrypted landline to an investigative journalist.",
      "name": "Whistleblower leak",
      "surface": "fog"
    },
    "quality": 9.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "museum-barista",
    "a": {
      "label": "A museum audio tour guide",
      "setting": "A measured, velvety recording playing through headphones before an artifact.",
      "name": "Museum audio guide",
      "surface": "mint"
    },
    "b": {
      "label": "A secret lair intercom",
      "setting": "Piped through ceiling speakers as the costumed hero triggers a tripwire.",
      "name": "Supervillain intercom",
      "surface": "space"
    },
    "quality": 9.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "romance-and-disaster",
    "a": {
      "label": "A dramatic romantic confession",
      "setting": "Poured out in the pouring rain just as the other person turns to walk away.",
      "name": "Rain-soaked love confession",
      "surface": "blush"
    },
    "b": {
      "label": "A ship captain's final distress call",
      "setting": "Broadcast over crackling maritime radio while waves crash against the bridge.",
      "name": "Mayday radio distress",
      "surface": "plum"
    },
    "quality": 9.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "co-op-respawn-marriage-vow",
    "a": {
      "label": "A multiplayer squadmate",
      "setting": "Speaking through a gaming headset during a chaotic firefight in the final circle.",
      "name": "A co-op game callout",
      "surface": "space"
    },
    "b": {
      "label": "A hopeful newlywed",
      "setting": "Vows exchanged softly at the altar before friends and family in the afternoon sun.",
      "name": "A heartfelt wedding vow",
      "surface": "blush"
    },
    "quality": 9.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "retail-cult",
    "a": {
      "label": "A Black Friday store manager",
      "setting": "Speaking through a bullhorn at the locked entrance before dawn.",
      "name": "Black Friday megaphone",
      "surface": "apricot"
    },
    "b": {
      "label": "A doomsday cult leader",
      "setting": "Standing on a dais before hooded followers as the eclipse begins.",
      "name": "Doomsday sermon",
      "surface": "plum"
    },
    "quality": 9.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "vow-renewal-secret-agent-pact",
    "a": {
      "label": "Spouse at a fiftieth anniversary renewal",
      "setting": "Quietly whispering across the front pew before stepping up together.",
      "name": "A vow renewal whisper",
      "surface": "blush"
    },
    "b": {
      "label": "Undercover agent before the raid",
      "setting": "Leaning close in a rainy alleyway, synchronizing watches before the sirens start.",
      "name": "A spy pact whisper",
      "surface": "moss"
    },
    "quality": 9.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "public-radio-submarine",
    "a": {
      "label": "Public radio pledge host",
      "setting": "Speaking into the warm studio mic during the annual spring membership drive.",
      "name": "Public radio pledge",
      "surface": "sky"
    },
    "b": {
      "label": "Stranded astronaut",
      "setting": "Crackling distress audio beamed from an emergency capsule low on oxygen.",
      "name": "Deep space SOS",
      "surface": "space"
    },
    "quality": 9.89,
    "battery": "pair-battery@2"
  },
  {
    "key": "gallery-heist",
    "a": {
      "label": "A museum audio tour guide",
      "setting": "Playing through headphones as a patron stands before an irreplaceable masterwork.",
      "name": "An audio guide narration",
      "surface": "paper"
    },
    "b": {
      "label": "A thief over an earpiece",
      "setting": "Guiding a partner down a skylight rope into the vault after midnight.",
      "name": "A heist radio whisper",
      "surface": "navy"
    },
    "quality": 9.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "ice-cream-bank-heist",
    "a": {
      "label": "An ice cream vendor",
      "setting": "Calling out from the truck window to an excited crowd of kids.",
      "name": "An ice cream callout",
      "surface": "apricot"
    },
    "b": {
      "label": "A master thief",
      "setting": "Whispering urgently into headsets as the vault door finally swings open.",
      "name": "A heist team whisper",
      "surface": "graphite"
    },
    "quality": 9.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "storm-warning-wedding-toast",
    "a": {
      "label": "A storm chaser",
      "setting": "Yelling over roaring winds on a live broadcast as dark clouds swallow the horizon.",
      "name": "A storm chaser broadcast",
      "surface": "fog"
    },
    "b": {
      "label": "An emotional best man",
      "setting": "Raising a champagne glass toward the newlyweds under a tent at a lavish reception.",
      "name": "A best man toast",
      "surface": "butter"
    },
    "quality": 9.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "wedding-toast-demolition",
    "a": {
      "label": "A tearful best man giving a speech",
      "setting": "Spoken into a microphone before a banquet room full of cheering wedding guests.",
      "name": "A best man's toast",
      "surface": "rose"
    },
    "b": {
      "label": "A lead demolition engineer",
      "setting": "Spoken over a two-way radio right before clearing the blast perimeter.",
      "name": "A demolition countdown",
      "surface": "fog"
    },
    "quality": 9.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "garden-crime",
    "a": {
      "label": "A master gardener",
      "setting": "Kneeling in dark soil, advising an apprentice on planting bulbs for spring.",
      "name": "Gardening instructions",
      "surface": "forest"
    },
    "b": {
      "label": "A mob hitman",
      "setting": "Leaning against a shovel under moonlight out in the middle of nowhere.",
      "name": "Covering your tracks",
      "surface": "graphite"
    },
    "quality": 9.85,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandma-coach",
    "a": {
      "label": "An Italian grandmother",
      "setting": "Standing over Sunday dinner in a warm kitchen, spoon raised over an already overflowing pasta dish.",
      "name": "Grandma's dinner rule",
      "surface": "rose"
    },
    "b": {
      "label": "A high school wrestling coach",
      "setting": "Yelling at a tired athlete in the sweat-soaked locker room beside the digital weigh-in scale.",
      "name": "Wrestling coach demand",
      "surface": "forest"
    },
    "quality": 9.81,
    "battery": "pair-battery@2"
  },
  {
    "key": "weather-alert-breakup-speech",
    "a": {
      "label": "A TV meteorologist",
      "setting": "A meteorologist points urgently to radar maps during a live emergency broadcast.",
      "name": "A severe weather alert",
      "surface": "apricot"
    },
    "b": {
      "label": "A heartbroken partner",
      "setting": "A person breaks difficult news across the kitchen table late at night.",
      "name": "A breakup speech",
      "surface": "ink"
    },
    "quality": 9.81,
    "battery": "pair-battery@2"
  },
  {
    "key": "ai-assistant-possession",
    "a": {
      "label": "Smart home assistant",
      "setting": "A soothing synthetic voice responding through a living room speaker at 3 AM.",
      "name": "A smart speaker reply",
      "surface": "sky"
    },
    "b": {
      "label": "Haunted house spirit",
      "setting": "A cold, bodiless whisper echoing through the floorboards of a dark hallway.",
      "name": "A haunted house voice",
      "surface": "graphite"
    },
    "quality": 9.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "babysitter-gladiator",
    "a": {
      "label": "An exhausted teenager babysitting",
      "setting": "Sitting on the living room rug trying to prevent toddler chaos.",
      "name": "A babysitter's ultimatum",
      "surface": "butter"
    },
    "b": {
      "label": "A Roman lanista",
      "setting": "Addressing battered gladiators lined up in the sand before the games.",
      "name": "A gladiator pep talk",
      "surface": "oxblood"
    },
    "quality": 9.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "fairytale-godmother-contract",
    "a": {
      "label": "Fairy godmother leaning down",
      "setting": "Glitter lingers in the dark alleyway as the midnight bells begin to echo.",
      "name": "A fairy godmother's reminder",
      "surface": "lilac"
    },
    "b": {
      "label": "Parking enforcement officer writing a ticket",
      "setting": "Standing beside an expired meter in the rain with a digital scanner raised.",
      "name": "A parking ticket notice",
      "surface": "navy"
    },
    "quality": 9.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "game-show-final-round-apocalypse-choice",
    "a": {
      "label": "A game show host",
      "setting": "Spoken dramatically under studio spotlights with five seconds left on the clock.",
      "name": "A game show countdown",
      "surface": "apricot"
    },
    "b": {
      "label": "A bunker commander",
      "setting": "Spoken gravely to the team before turning the master emergency key.",
      "name": "The bunker countdown",
      "surface": "moss"
    },
    "quality": 9.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "spy-proposal",
    "a": {
      "label": "A secret agent handler",
      "setting": "Speaking in low tones on a park bench, handing over forged papers.",
      "name": "A spy debrief",
      "surface": "forest"
    },
    "b": {
      "label": "A nervous partner",
      "setting": "Down on one knee under fairy lights, opening a small velvet box.",
      "name": "A marriage proposal",
      "surface": "rose"
    },
    "quality": 9.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "candles-and-cults",
    "a": {
      "label": "A relative leading the happy birthday song",
      "setting": "Spoken around a darkened dining table as the cake arrives glowing with candles.",
      "name": "A birthday cake cheer",
      "surface": "apricot"
    },
    "b": {
      "label": "A cloaked priest leading a midnight ritual",
      "setting": "Chanted softly around a stone altar surrounded by kneeling acolytes.",
      "name": "An occult summoning",
      "surface": "navy"
    },
    "quality": 9.79,
    "battery": "pair-battery@2"
  },
  {
    "key": "guided-meditation-heist",
    "a": {
      "label": "A meditation guru",
      "setting": "A soothing voice guiding listeners through a visualization tape.",
      "name": "A guided meditation",
      "surface": "lilac"
    },
    "b": {
      "label": "A master safecracker via earpiece",
      "setting": "Whispering steady instructions as the thief turns the vault dial in darkness.",
      "name": "A vault breach whisper",
      "surface": "graphite"
    },
    "quality": 9.78,
    "battery": "pair-battery@2"
  },
  {
    "key": "insurance-claim-breakup-talk",
    "a": {
      "label": "An auto insurance adjuster",
      "setting": "Inspecting crumpled metal and filling out a damage report on a clipboard.",
      "name": "Insurance claim report",
      "surface": "paper"
    },
    "b": {
      "label": "A weary partner",
      "setting": "Sitting on the floor of a quiet kitchen, ending a five-year romance.",
      "name": "The breakup speech",
      "surface": "plum"
    },
    "quality": 9.76,
    "battery": "pair-battery@2"
  },
  {
    "key": "lighthouse-referee",
    "a": {
      "label": "A lighthouse keeper",
      "setting": "Spoken over maritime radio through heavy static to a trawler lost in thick fog.",
      "name": "Lighthouse radio transmission",
      "surface": "navy"
    },
    "b": {
      "label": "A cloistered nun",
      "setting": "Whispered through a wooden grille to a visitor seeking spiritual guidance.",
      "name": "A confessional whisper",
      "surface": "periwinkle"
    },
    "quality": 9.76,
    "battery": "pair-battery@2"
  },
  {
    "key": "pilot-eulogy",
    "a": {
      "label": "The captain over the intercom",
      "setting": "Speaking to passengers from the cockpit as cruising altitude is reached on a clear night.",
      "name": "A pilot's announcement",
      "surface": "sky"
    },
    "b": {
      "label": "A grieving friend",
      "setting": "Speaking to quiet mourners beside a casket in a sunlit chapel.",
      "name": "A eulogy",
      "surface": "graphite"
    },
    "quality": 9.76,
    "battery": "pair-battery@2"
  },
  {
    "key": "spin-instructor-escape-pod",
    "a": {
      "label": "A high-energy spin instructor",
      "setting": "Shouting over pumping club music in a hot, pitch-black boutique studio.",
      "name": "Spin class cue",
      "surface": "lime"
    },
    "b": {
      "label": "A doomed spaceship captain",
      "setting": "Barking orders through alarms into the intercom as the hull breaches.",
      "name": "Evacuation command",
      "surface": "space"
    },
    "quality": 9.76,
    "battery": "pair-battery@2"
  },
  {
    "key": "line-cook-bomb-squad",
    "a": {
      "label": "A frantic head chef on the line",
      "setting": "Yelling across sizzling pans and tickets during peak Friday dinner service.",
      "name": "Line cook rush",
      "surface": "peach"
    },
    "b": {
      "label": "A bomb technician on comms",
      "setting": "Whispering calmly through a headset while kneeling over a ticking explosive device.",
      "name": "Bomb tech instruction",
      "surface": "navy"
    },
    "quality": 9.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "tech-confession-638",
    "a": {
      "label": "An IT technician walking a client through a restart",
      "setting": "Calm, deadpan tone through a headset while staring at endless server logs.",
      "name": "An IT reboot instruction",
      "surface": "sky"
    },
    "b": {
      "label": "A person breaking off an engagement gently",
      "setting": "Spoken across a café table, sliding a silver ring across the wood.",
      "name": "A gentle breakup",
      "surface": "fog"
    },
    "quality": 9.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "lottery-announcement-curse",
    "a": {
      "label": "A televised lottery host",
      "setting": "Beaming into the camera under bright studio lights as the numbers lock in.",
      "name": "A lottery draw reveal",
      "surface": "rose"
    },
    "b": {
      "label": "An ancient tomb spirit",
      "setting": "Echoing from the stone walls as a thief opens the sarcophagus.",
      "name": "An ancient curse",
      "surface": "moss"
    },
    "quality": 9.74,
    "battery": "pair-battery@2"
  },
  {
    "key": "treasure-clue-it-ticket",
    "a": {
      "label": "A dying buccaneer",
      "setting": "Penned on stained parchment by lantern light in a damp cave.",
      "name": "A pirate's last riddle",
      "surface": "paper"
    },
    "b": {
      "label": "An IT support engineer",
      "setting": "Typed into an internal ticket after fixing a ruined company server.",
      "name": "An IT closing note",
      "surface": "sky"
    },
    "quality": 9.74,
    "battery": "pair-battery@2"
  },
  {
    "key": "coaching-coronation",
    "a": {
      "label": "A furious coach at halftime",
      "setting": "Barked at a defeated locker room trailing by thirty points in the championship.",
      "name": "Halftime locker room speech",
      "surface": "oxblood"
    },
    "b": {
      "label": "The archbishop of Canterbury",
      "setting": "Proclaimed to the young heir kneeling before the altar in a grand cathedral.",
      "name": "A coronation address",
      "surface": "cream"
    },
    "quality": 9.73,
    "battery": "pair-battery@2"
  },
  {
    "key": "frontier-farewell",
    "a": {
      "label": "A gunslinger",
      "setting": "Spoken quietly across a dusty saloon threshold at sunset before riding out.",
      "name": "A cowboy farewell",
      "surface": "apricot"
    },
    "b": {
      "label": "A flight attendant",
      "setting": "Spoken through the cabin intercom as passengers prepare for final descent.",
      "name": "Landing announcement",
      "surface": "sky"
    },
    "quality": 9.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "smart-assistant-abductor",
    "a": {
      "label": "A smart home assistant",
      "setting": "A neutral, synthesized voice answering through a glowing kitchen speaker.",
      "name": "A smart speaker reply",
      "surface": "sky"
    },
    "b": {
      "label": "A kidnapper",
      "setting": "A distorted voice on a payphone call to desperate family members.",
      "name": "A ransom phone call",
      "surface": "ink"
    },
    "quality": 9.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "wedding-toast-heist",
    "a": {
      "label": "A nervous best man",
      "setting": "Tapping a champagne flute with a fork before smiling at the bride and groom.",
      "name": "A wedding toast",
      "surface": "cream"
    },
    "b": {
      "label": "A mastermind thief",
      "setting": "Unrolling blueprints in an abandoned warehouse before the crew heads out.",
      "name": "A heist briefing",
      "surface": "forest"
    },
    "quality": 9.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "auction-exorcism",
    "a": {
      "label": "An antique auctioneer",
      "setting": "Chanting bids rapid-fire from a podium as paddles rise across the ballroom.",
      "name": "An art auction chant",
      "surface": "plum"
    },
    "b": {
      "label": "A veteran exorcist",
      "setting": "Shouting ritual commands over a thrashing, possessed parishioner.",
      "name": "An exorcism ritual",
      "surface": "oxblood"
    },
    "quality": 9.69,
    "battery": "pair-battery@2"
  },
  {
    "key": "babysitting-bomb-disposal",
    "a": {
      "label": "A tired babysitter",
      "setting": "Whispering across the living room carpet where a toddler is barely sleeping.",
      "name": "Babysitter's warning",
      "surface": "butter"
    },
    "b": {
      "label": "A bomb technician over radio",
      "setting": "Guiding a nervous rookie through snipping wires under intense pressure.",
      "name": "Bomb squad guidance",
      "surface": "graphite"
    },
    "quality": 9.69,
    "battery": "pair-battery@2"
  },
  {
    "key": "gameshow-and-apocalypse",
    "a": {
      "label": "Game show host",
      "setting": "Smiling widely under studio spotlights as dramatic music swells before the final round.",
      "name": "A game show reveal",
      "surface": "butter"
    },
    "b": {
      "label": "Doomsday prepper",
      "setting": "Standing at the bunker threshold watching dark thunderheads gather on the horizon.",
      "name": "A doomsday warning",
      "surface": "space"
    },
    "quality": 9.69,
    "battery": "pair-battery@2"
  },
  {
    "key": "active-volcano-evac-nightclub",
    "a": {
      "label": "A civil defense officer",
      "setting": "Broadcasting over town sirens as glowing basalt begins cascading toward the road.",
      "name": "Volcanic evacuation order",
      "surface": "lime"
    },
    "b": {
      "label": "A club bouncer at 3 AM",
      "setting": "Flicking the fluorescent work lights on over the sticky dance floor to clear the room.",
      "name": "Last call clearance",
      "surface": "forest"
    },
    "quality": 9.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "haunted-realestate",
    "a": {
      "label": "A ghost refusing to leave",
      "setting": "Whispering through cold floorboards to the terrified new homeowners.",
      "name": "A ghostly warning",
      "surface": "space"
    },
    "b": {
      "label": "An aggressive real estate agent",
      "setting": "Pacing a staged living room while pressuring hesitant first-time buyers.",
      "name": "A real estate pitch",
      "surface": "mint"
    },
    "quality": 9.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "art-and-crime",
    "a": {
      "label": "An art gallery catalogue entry",
      "setting": "Printed beneath a stark modern sculpture in a minimalist exhibition hall.",
      "name": "Gallery exhibition plaque",
      "surface": "paper"
    },
    "b": {
      "label": "A forensics crime scene summary",
      "setting": "Typed in a grim police report summarizing the evidence left in an empty room.",
      "name": "Crime scene report",
      "surface": "space"
    },
    "quality": 9.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "cockpit-breakup",
    "a": {
      "label": "An airline pilot",
      "setting": "Speaking over the cabin intercom before descending toward a runway.",
      "name": "A pilot's announcement",
      "surface": "navy"
    },
    "b": {
      "label": "A weary partner",
      "setting": "Speaking softly in the kitchen after months of silent distance.",
      "name": "A gentle breakup",
      "surface": "rose"
    },
    "quality": 9.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "pilot-eulogy-520",
    "a": {
      "label": "The captain on the PA",
      "setting": "Speaking to an anxious cabin as sudden severe turbulence rattles the overhead bins.",
      "name": "Captain in heavy turbulence",
      "surface": "fog"
    },
    "b": {
      "label": "A lifelong friend",
      "setting": "Speaking softly from a church pulpit to a room of grieving family and friends.",
      "name": "A funeral eulogy",
      "surface": "ink"
    },
    "quality": 9.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "meditation-hostage",
    "a": {
      "label": "A yoga instructor",
      "setting": "Spoken in a hushed, soothing voice to a dim studio full of people on mats.",
      "name": "A meditation guide",
      "surface": "mint"
    },
    "b": {
      "label": "A bank robber",
      "setting": "Shouted urgently at panicked customers lying flat on the tile floor.",
      "name": "A hostage takeover",
      "surface": "ink"
    },
    "quality": 9.66,
    "battery": "pair-battery@2"
  },
  {
    "key": "secret-agent-breakup-text",
    "a": {
      "label": "A burned operative",
      "setting": "A spy types a hasty encrypted message into a burner phone before tossing it into the river.",
      "name": "A burned spy's signoff",
      "surface": "navy"
    },
    "b": {
      "label": "A weary romantic partner",
      "setting": "A late-night text typed on a dim phone screen from the couch, ending a three-year bond.",
      "name": "A sudden breakup text",
      "surface": "rose"
    },
    "quality": 9.66,
    "battery": "pair-battery@2"
  },
  {
    "key": "rockstar-apocalypse",
    "a": {
      "label": "A stadium rock frontman",
      "setting": "Shouting into a microphone at midnight before eighty thousand screaming fans.",
      "name": "Encore rally cry",
      "surface": "rose"
    },
    "b": {
      "label": "An apocalyptic prophet",
      "setting": "Standing on a windblown crag, shouting at the townsfolk as storm clouds gather.",
      "name": "Doomsday herald",
      "surface": "ink"
    },
    "quality": 9.65,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-and-apocalyptic-cult",
    "a": {
      "label": "An HOA president's reminder",
      "setting": "At a clubhouse folding table, sternly reviewing the neighborhood bylaws binder.",
      "name": "HOA president reminder",
      "surface": "paper"
    },
    "b": {
      "label": "A doomsday cult decree",
      "setting": "Chanted softly by a robed elder before the congregation at sunset.",
      "name": "Doomsday cult decree",
      "surface": "oxblood"
    },
    "quality": 9.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "illusion-safety",
    "a": {
      "label": "A theatrical magician",
      "setting": "Locking an assistant into a chained wooden cabinet on an ornate stage.",
      "name": "Magic act patter",
      "surface": "rose"
    },
    "b": {
      "label": "A trauma surgeon",
      "setting": "Addressing the surgical team under bright lights before the first incision.",
      "name": "Surgical briefing",
      "surface": "sea"
    },
    "quality": 9.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "crier-and-voicemail",
    "a": {
      "label": "A seventeenth-century town crier",
      "setting": "Shouted in a muddy cobblestone square while ringing a brass bell to gather townsfolk.",
      "name": "A town crier's proclamation",
      "surface": "butter"
    },
    "b": {
      "label": "An anxious adult leaving a voicemail",
      "setting": "Spoken into a smartphone after the beep, pacing around a messy kitchen table.",
      "name": "An urgent voicemail",
      "surface": "graphite"
    },
    "quality": 9.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "ghost-sommelier",
    "a": {
      "label": "A paranormal investigator",
      "setting": "Murmured into a voice recorder inside a cold cellar with a flickering flashlight.",
      "name": "A ghost tour guide",
      "surface": "plum"
    },
    "b": {
      "label": "A luxury sommelier",
      "setting": "Spoken reverently at a white-clothed table while presenting a dusty bottle.",
      "name": "A sommelier's pitch",
      "surface": "rose"
    },
    "quality": 9.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "news-anchor-and-hostage",
    "a": {
      "label": "A prime-time news anchor",
      "setting": "Speaking solemnly to millions across the nation as the red camera light turns on.",
      "name": "Breaking news",
      "surface": "navy"
    },
    "b": {
      "label": "A captured spy",
      "setting": "Reading a scripted message into a video camera while tied to a chair.",
      "name": "A hostage video",
      "surface": "fog"
    },
    "quality": 9.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "submarine-breakup",
    "a": {
      "label": "A submarine chief engineer",
      "setting": "An engineer whispering urgent pressure readings to the captain in the control room.",
      "name": "A submarine pressure warning",
      "surface": "navy"
    },
    "b": {
      "label": "A partner initiating a breakup",
      "setting": "Sitting across from each other at a kitchen table after hours of heavy silence.",
      "name": "A breakup talk",
      "surface": "rose"
    },
    "quality": 9.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "tantrum-hostage-parent",
    "a": {
      "label": "An exhausted parent in a grocery aisle",
      "setting": "Whispered while kneeling next to a screaming child clutching a candy bar.",
      "name": "Toddler tantrum diplomacy",
      "surface": "peach"
    },
    "b": {
      "label": "A bomb technician defusing a device",
      "setting": "Spoken over an earpiece while cutting wires inside an empty stadium.",
      "name": "Bomb disposal chatter",
      "surface": "graphite"
    },
    "quality": 9.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "town-crier-breakup",
    "a": {
      "label": "A colonial town crier",
      "setting": "Ringing a brass bell in the cobblestone square at high noon.",
      "name": "A town crier's proclamation",
      "surface": "apricot"
    },
    "b": {
      "label": "A tired partner walking out",
      "setting": "Standing in the doorway with bags packed, ending years of silence.",
      "name": "A final goodbye speech",
      "surface": "plum"
    },
    "quality": 9.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "coronation-breakup",
    "a": {
      "label": "An archbishop during a coronation",
      "setting": "Placing the ancestral heavy golden crown onto the reluctant heir's brow.",
      "name": "A coronation blessing",
      "surface": "butter"
    },
    "b": {
      "label": "A partner packing their bags",
      "setting": "Standing in the entryway handing back the apartment keys after a bitter fight.",
      "name": "A final goodbye",
      "surface": "fog"
    },
    "quality": 9.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "dentist-interrogation",
    "a": {
      "label": "A pediatric dentist",
      "setting": "Leaning over a nervous child in the reclining chair with a small mirror.",
      "name": "A dentist's reassurance",
      "surface": "sea"
    },
    "b": {
      "label": "A police detective",
      "setting": "Leaning across the dim interrogation table toward a stubborn suspect.",
      "name": "A detective's interrogation",
      "surface": "ink"
    },
    "quality": 9.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "realtor-haunt",
    "a": {
      "label": "An eager real estate agent",
      "setting": "Showing prospective buyers around an old Victorian home with character.",
      "name": "An open house pitch",
      "surface": "butter"
    },
    "b": {
      "label": "A ghost hunter",
      "setting": "Whispering into a night-vision camera inside a locked abandoned cellar.",
      "name": "A paranormal investigation",
      "surface": "graphite"
    },
    "quality": 9.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "treasure-confess",
    "a": {
      "label": "An old sea journal entry",
      "setting": "Faded parchment instructions written in charcoal beneath a skull sketch.",
      "name": "Treasure map notes",
      "surface": "butter"
    },
    "b": {
      "label": "A penitent in the confessional",
      "setting": "Whispered behind the wooden lattice screen in the dim church.",
      "name": "A Catholic confession",
      "surface": "plum"
    },
    "quality": 9.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "puppy-owner-detective",
    "a": {
      "label": "A pet owner",
      "setting": "Kneeling on the carpet beside shredded mail, looking straight into a golden retriever puppy's guilty eyes.",
      "name": "Scolding a puppy",
      "surface": "peach"
    },
    "b": {
      "label": "A hardened detective",
      "setting": "Leaning over the metal table in a dim interrogation room, pressing a suspect for the missing evidence.",
      "name": "Police interrogation",
      "surface": "graphite"
    },
    "quality": 9.61,
    "battery": "pair-battery@2"
  },
  {
    "key": "support-space",
    "a": {
      "label": "A software agent reading a standard warranty clause",
      "setting": "Bored, fast-paced voice rattled off from a laminated desk script.",
      "name": "A warranty disclaimer",
      "surface": "periwinkle"
    },
    "b": {
      "label": "An astronaut reporting telemetry loss",
      "setting": "Steady voice through radio static as console lights blink red one by one.",
      "name": "An astronaut's telemetry log",
      "surface": "space"
    },
    "quality": 9.61,
    "battery": "pair-battery@2"
  },
  {
    "key": "bedtime-tuck-in-hostage-negotiator",
    "a": {
      "label": "Parent putting a child to bed",
      "setting": "Leaning over the bedside in the dark, pulling up the covers after multiple stalling excuses.",
      "name": "Bedtime tuck in",
      "surface": "cream"
    },
    "b": {
      "label": "Night watchman confronting an intruder",
      "setting": "Flashlight beam locked on a silhouette caught hiding behind a warehouse crate.",
      "name": "A night guard confrontation",
      "surface": "navy"
    },
    "quality": 9.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "blizzard-warning-grandma",
    "a": {
      "label": "The national weather service",
      "setting": "Broadcasting an emergency alert ticker across all radio channels.",
      "name": "A blizzard warning",
      "surface": "sky"
    },
    "b": {
      "label": "An overprotective grandmother",
      "setting": "Calling her grandson right before he leaves his apartment for work.",
      "name": "Overprotective grandma advice",
      "surface": "rose"
    },
    "quality": 9.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "magician-and-mechanic",
    "a": {
      "label": "A stage magician's banter",
      "setting": "Under the warm spotlight, inviting a skeptical volunteer to inspect the props.",
      "name": "Stage illusion patter",
      "surface": "plum"
    },
    "b": {
      "label": "An auto mechanic's diagnosis",
      "setting": "Under fluorescent shop lights, wiping grease on a rag while pointing beneath the hood.",
      "name": "Mechanic's diagnosis",
      "surface": "graphite"
    },
    "quality": 9.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "therapist-demolition",
    "a": {
      "label": "A therapist speaking to an emotional client",
      "setting": "A therapist leans forward on a quiet sofa during an intense breakthrough.",
      "name": "A therapy breakthrough",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A demolition foreman addressing a crew",
      "setting": "A foreman with a clipboard points at an unstable brick warehouse.",
      "name": "A demolition briefing",
      "surface": "graphite"
    },
    "quality": 9.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "funeral-and-graduation",
    "a": {
      "label": "A funeral director",
      "setting": "Gently directing mourners toward the cemetery gates as the service concludes.",
      "name": "A funeral closing",
      "surface": "ink"
    },
    "b": {
      "label": "A commencement speaker",
      "setting": "Addressing a stadium full of cap-and-gown graduates about to enter the world.",
      "name": "A commencement speech",
      "surface": "sky"
    },
    "quality": 9.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "croupier-confession-547",
    "a": {
      "label": "A high-stakes casino dealer",
      "setting": "Calling the final bets as the roulette wheel begins to slow down.",
      "name": "A roulette call",
      "surface": "forest"
    },
    "b": {
      "label": "A priest in confessional",
      "setting": "Speaking through the wooden screen to a troubled parishioner.",
      "name": "A priest's counsel",
      "surface": "plum"
    },
    "quality": 9.57,
    "battery": "pair-battery@2"
  },
  {
    "key": "performance-review-medium",
    "a": {
      "label": "A corporate manager",
      "setting": "Sitting stiffly across from an underperforming employee in a glass office.",
      "name": "A pip review",
      "surface": "graphite"
    },
    "b": {
      "label": "A spiritual medium",
      "setting": "Holding hands across a candlelit round table, channeling a lingering spirit.",
      "name": "A séance reading",
      "surface": "plum"
    },
    "quality": 9.56,
    "battery": "pair-battery@2"
  },
  {
    "key": "zen-heist",
    "a": {
      "label": "A Zen master",
      "setting": "Addressing silent disciples seated in the quiet garden at dawn.",
      "name": "A morning dharma talk",
      "surface": "moss"
    },
    "b": {
      "label": "A master safecracker",
      "setting": "Speaking through an earpiece to the getaway crew outside the bank vault.",
      "name": "A heist coordination",
      "surface": "graphite"
    },
    "quality": 9.56,
    "battery": "pair-battery@2"
  },
  {
    "key": "audio-tour-cult",
    "a": {
      "label": "Museum audio guide",
      "setting": "Recorded narration playing through headphones as a visitor pauses before an ancient relic.",
      "name": "A museum audio guide",
      "surface": "cream"
    },
    "b": {
      "label": "Doomsday cult sermon",
      "setting": "A robed elder addressing the congregation by torchlight before the final eclipse.",
      "name": "A cult prophecy",
      "surface": "oxblood"
    },
    "quality": 9.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "baptist-preacher-tech-support",
    "a": {
      "label": "A fiery preacher",
      "setting": "A preacher bellows from the pulpit, urging the congregation to purge corruption.",
      "name": "A pulpit sermon",
      "surface": "oxblood"
    },
    "b": {
      "label": "A customer support rep",
      "setting": "An agent speaks into their headset, guiding a caller whose device is completely frozen.",
      "name": "A tech support hotline",
      "surface": "fog"
    },
    "quality": 9.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "drill-yoga-640",
    "a": {
      "label": "A drill sergeant demanding perfection on the yard",
      "setting": "Bellowed two inches from a recruit's nose at sunrise in heavy boots.",
      "name": "A drill sergeant's bark",
      "surface": "oxblood"
    },
    "b": {
      "label": "A preschool teacher corralling a line of kids",
      "setting": "Smiling brightly while clapping hands together to gather stray toddlers.",
      "name": "A preschool line call",
      "surface": "lime"
    },
    "quality": 9.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "spin-instructor-and-runaway-train",
    "a": {
      "label": "An intense spin cycle instructor",
      "setting": "Shouting over pulsing techno in a dark, neon-lit cycling studio.",
      "name": "A spin class cue",
      "surface": "rose"
    },
    "b": {
      "label": "An engineer on a runaway train",
      "setting": "Shouting over screeching metal as the brakes fail on a steep downhill bend.",
      "name": "A runaway train alert",
      "surface": "ink"
    },
    "quality": 9.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "trainer-interrogation",
    "a": {
      "label": "A personal trainer",
      "setting": "Barking motivation at an exhausted client struggling on the weight bench.",
      "name": "A gym pep talk",
      "surface": "butter"
    },
    "b": {
      "label": "A hard-boiled detective",
      "setting": "Leaning over a metal table under a harsh light, grilling a sweaty suspect.",
      "name": "A police interrogation",
      "surface": "graphite"
    },
    "quality": 9.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "zoo-and-romance",
    "a": {
      "label": "A wildlife zookeeper",
      "setting": "Speaking over a microphone to crowds outside the predator enclosure during feeding time.",
      "name": "Zoo keeper talk",
      "surface": "moss"
    },
    "b": {
      "label": "A nervous lover",
      "setting": "Admitting turbulent feelings over candlelight at a crowded restaurant anniversary dinner.",
      "name": "A relationship confession",
      "surface": "rose"
    },
    "quality": 9.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "drill-and-romance",
    "a": {
      "label": "A strict drill sergeant",
      "setting": "Barked at dawn an inch from a recruit's face in the mud.",
      "name": "A military drill",
      "surface": "forest"
    },
    "b": {
      "label": "A desperate secret lover",
      "setting": "Panted against a balcony railing just before daybreak.",
      "name": "A balcony confession",
      "surface": "rose"
    },
    "quality": 9.53,
    "battery": "pair-battery@2"
  },
  {
    "key": "halftime-heist",
    "a": {
      "label": "A coach at halftime",
      "setting": "Shouted inside a humid locker room while trailing by twelve points.",
      "name": "Halftime pep talk",
      "surface": "butter"
    },
    "b": {
      "label": "A getaway mastermind",
      "setting": "Whispered over two-way radio to a crew standing outside a bank vault.",
      "name": "Heist final countdown",
      "surface": "ink"
    },
    "quality": 9.53,
    "battery": "pair-battery@2"
  },
  {
    "key": "party-and-piracy",
    "a": {
      "label": "A parent running a seven-year-old's party",
      "setting": "Shouted with weary enthusiasm over screaming kids in a paper-strewn living room.",
      "name": "A kids party host",
      "surface": "peach"
    },
    "b": {
      "label": "A pirate captain boarding an enemy ship",
      "setting": "Bellowed over the crash of waves as cutlasses clash on the deck.",
      "name": "A pirate boarding call",
      "surface": "oxblood"
    },
    "quality": 9.53,
    "battery": "pair-battery@2"
  },
  {
    "key": "substitute-teacher-hostage",
    "a": {
      "label": "Nervous substitute teacher",
      "setting": "Standing before thirty unruly eighth-graders right after the morning bell.",
      "name": "Substitute teacher intro",
      "surface": "cream"
    },
    "b": {
      "label": "Hostage negotiator",
      "setting": "Speaking through a bullhorn across the police barricade toward the bank doors.",
      "name": "Hostage negotiator plea",
      "surface": "navy"
    },
    "quality": 9.52,
    "battery": "pair-battery@2"
  },
  {
    "key": "sports-romance",
    "a": {
      "label": "A track and field starter",
      "setting": "Called out across eight lanes of sprinters crouched before the starting gun.",
      "name": "The race starter's call",
      "surface": "mint"
    },
    "b": {
      "label": "A lover admitting feelings",
      "setting": "Murmured on the front porch at the end of the evening, hands touching.",
      "name": "A porch doorstep confession",
      "surface": "blush"
    },
    "quality": 9.51,
    "battery": "pair-battery@2"
  },
  {
    "key": "flight-confession",
    "a": {
      "label": "A flight attendant",
      "setting": "Speaking into the intercom while the cabin rattles violently in mid-air.",
      "name": "A rough turbulence warning",
      "surface": "butter"
    },
    "b": {
      "label": "An anxious partner",
      "setting": "Whispering across the kitchen table late at night, hands trembling.",
      "name": "An honest confession",
      "surface": "navy"
    },
    "quality": 9.5,
    "battery": "pair-battery@2"
  },
  {
    "key": "ghost-hunting-babysitting",
    "a": {
      "label": "A ghost hunter with an EMF meter",
      "setting": "Whispered into a microphone in a dark, creaking nursery at midnight.",
      "name": "Ghost hunting log",
      "surface": "fog"
    },
    "b": {
      "label": "A tired babysitter",
      "setting": "Spoken into the baby monitor after the toddler finally closed their eyes.",
      "name": "A babysitter's update",
      "surface": "apricot"
    },
    "quality": 9.5,
    "battery": "pair-battery@2"
  },
  {
    "key": "kindergarten-and-jailbreak",
    "a": {
      "label": "A kindergarten teacher",
      "setting": "Standing by the gate as recess ends, counting thirty hyperactive children.",
      "name": "Recess roll call",
      "surface": "butter"
    },
    "b": {
      "label": "A weary prison warden",
      "setting": "Walking the high tier at midnight after hearing scraping behind the wall.",
      "name": "A prison guard's warning",
      "surface": "graphite"
    },
    "quality": 9.5,
    "battery": "pair-battery@2"
  },
  {
    "key": "news-anchor-to-breakup",
    "a": {
      "label": "An evening news anchor signing off",
      "setting": "Neatly stacking papers at the glass desk before the studio camera cuts.",
      "name": "An evening news signoff",
      "surface": "sea"
    },
    "b": {
      "label": "A weary partner ending things",
      "setting": "Standing on the porch holding a box of personal belongings.",
      "name": "A solemn parting speech",
      "surface": "moss"
    },
    "quality": 9.5,
    "battery": "pair-battery@2"
  },
  {
    "key": "fortune-teller-launch",
    "a": {
      "label": "A carnival fortune teller",
      "setting": "Peering across velvet into a glass orb under dim beaded lamps.",
      "name": "A crystal ball reading",
      "surface": "lilac"
    },
    "b": {
      "label": "A scuba dive master",
      "setting": "Briefing tourists on the boat deck before dropping into murky open water.",
      "name": "A deep dive briefing",
      "surface": "navy"
    },
    "quality": 9.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "meteorologist-breakup-confession",
    "a": {
      "label": "A live broadcast meteorologist",
      "setting": "Pointing at radar graphics as a severe low-pressure front sweeps in.",
      "name": "A live storm broadcast",
      "surface": "sky"
    },
    "b": {
      "label": "A regretful romantic partner",
      "setting": "Sitting in a quiet car in the rain, explaining why it cannot work.",
      "name": "A mutual parting talk",
      "surface": "plum"
    },
    "quality": 9.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "podcaster-bomb-squad",
    "a": {
      "label": "True crime podcast host",
      "setting": "Speaking softly into a condenser mic right before the mid-episode ad break.",
      "name": "A podcast cliffhanger",
      "surface": "plum"
    },
    "b": {
      "label": "Bomb squad technician",
      "setting": "Muffled voice through a heavy blast visor while cutting a thin green wire.",
      "name": "Bomb squad wire cut",
      "surface": "lime"
    },
    "quality": 9.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "circus-ringmaster-emergency-exit",
    "a": {
      "label": "A circus ringmaster",
      "setting": "Booming through a brass megaphone under the spotlight in the center ring.",
      "name": "A ringmaster's pitch",
      "surface": "apricot"
    },
    "b": {
      "label": "A flight attendant during turbulence",
      "setting": "Speaking through the cabin interphone as the plane shakes violently in clouds.",
      "name": "Turbulence announcement",
      "surface": "fog"
    },
    "quality": 9.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "lostluggage-ransom",
    "a": {
      "label": "An airport baggage claim clerk",
      "setting": "A tired clerk behind a desk speaking to an anxious traveler whose bags never arrived.",
      "name": "A lost baggage inquiry",
      "surface": "blush"
    },
    "b": {
      "label": "A kidnapper delivering ransom demands",
      "setting": "A masked caller speaking through a voice scrambler over a burner phone.",
      "name": "A kidnapper's demand",
      "surface": "ink"
    },
    "quality": 9.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "sleep-training-haunting",
    "a": {
      "label": "Tired parent on the monitor",
      "setting": "Whispered into the intercom after putting the toddler down for the fourth time.",
      "name": "Sleep training instruction",
      "surface": "butter"
    },
    "b": {
      "label": "Paranormal investigator",
      "setting": "Speaking into a dark nursery closet during a midnight livestream investigation.",
      "name": "Haunted house walk",
      "surface": "graphite"
    },
    "quality": 9.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "ai-overlord-and-barista",
    "a": {
      "label": "A rogue supercomputer",
      "setting": "Broadcasting through every speaker on Earth after conquering the planetary grid.",
      "name": "An AI's ultimatum",
      "surface": "lime"
    },
    "b": {
      "label": "A weary hipster barista",
      "setting": "Refusing an impossible customer modification during the morning coffee rush.",
      "name": "A barista's refusal",
      "surface": "cream"
    },
    "quality": 9.47,
    "battery": "pair-battery@2"
  },
  {
    "key": "self-help-launch-countdown",
    "a": {
      "label": "A self-help guru",
      "setting": "Standing under arena spotlights, inspiring thousands of people to take charge of their future.",
      "name": "A motivational keynote",
      "surface": "apricot"
    },
    "b": {
      "label": "A flight director",
      "setting": "Watching telemetry monitors in mission control during the final ninety seconds before liftoff.",
      "name": "Rocket launch countdown",
      "surface": "space"
    },
    "quality": 9.47,
    "battery": "pair-battery@2"
  },
  {
    "key": "ai-parenting",
    "a": {
      "label": "Sentient android",
      "setting": "Talking to its human creator as its core power systems begin failing.",
      "name": "A dying robot's farewell",
      "surface": "space"
    },
    "b": {
      "label": "College-bound teenager",
      "setting": "Hugging parents on the doorstep of a dorm room on move-in day.",
      "name": "Leaving for college",
      "surface": "blush"
    },
    "quality": 9.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "art-auction-blackmail",
    "a": {
      "label": "Auctioneer",
      "setting": "Pacing a raised podium in evening wear, scanning wealthy bidders.",
      "name": "A fine art auction",
      "surface": "butter"
    },
    "b": {
      "label": "Blackmailer",
      "setting": "Speaking through an untraceable phone call to an anxious public official.",
      "name": "A blackmail demand",
      "surface": "ink"
    },
    "quality": 9.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "horror-and-caterer",
    "a": {
      "label": "A demonic warning",
      "setting": "An entity speaking through a possessed doll to terrified parents in a dark nursery.",
      "name": "A demonic warning",
      "surface": "oxblood"
    },
    "b": {
      "label": "A head chef's expo shout",
      "setting": "The head chef barking at the waitstaff as dinner plates pile up under the heat lamps.",
      "name": "A chef's kitchen order",
      "surface": "apricot"
    },
    "quality": 9.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "spy-dead-drop-yard-sale",
    "a": {
      "label": "A handler leaving instructions",
      "setting": "Scrawled on a coded postcard taped under a park bench for a rogue agent.",
      "name": "Dead drop instructions",
      "surface": "navy"
    },
    "b": {
      "label": "A suburban garage cleaner",
      "setting": "Sharpie scrawled on cardboard taped to a fold-out card table on the driveway.",
      "name": "A garage sale sign",
      "surface": "cream"
    },
    "quality": 9.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "auction-warning",
    "a": {
      "label": "An auctioneer at the podium",
      "setting": "Shouting into a microphone under hot lights as bids stall on a rare heirloom.",
      "name": "An auctioneer's close",
      "surface": "butter"
    },
    "b": {
      "label": "A haunted house tour guide",
      "setting": "Whispering at the creaking cellar threshold before turning off the lantern.",
      "name": "A haunted house tour",
      "surface": "ink"
    },
    "quality": 9.44,
    "battery": "pair-battery@2"
  },
  {
    "key": "crystal-ball-meteorology",
    "a": {
      "label": "A dramatic psychic",
      "setting": "Spoken across velvet curtains while gazing into a smoky glass orb.",
      "name": "Crystal ball reading",
      "surface": "plum"
    },
    "b": {
      "label": "A TV meteorologist",
      "setting": "Pointing to a swirling red radar graphic during an emergency weather bulletin.",
      "name": "Severe weather alert",
      "surface": "butter"
    },
    "quality": 9.43,
    "battery": "pair-battery@2"
  },
  {
    "key": "call-center-ghost-hunt",
    "a": {
      "label": "A tier-one customer service agent",
      "setting": "Reading verbatim script through a headset after fifteen minutes on hold.",
      "name": "Customer service script",
      "surface": "sea"
    },
    "b": {
      "label": "A medium in a séance",
      "setting": "Speaking softly with eyes closed around a candlelit parlor table.",
      "name": "A séance invitation",
      "surface": "oxblood"
    },
    "quality": 9.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "call-center-haunting",
    "a": {
      "label": "A phone menu automated system",
      "setting": "Playing on endless loop through a tinny mobile receiver after forty minutes.",
      "name": "Automated customer support",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A medium during a seance",
      "setting": "Whispering across a candlelit mahogany table as the floorboards creak.",
      "name": "A spirit channeler's trance",
      "surface": "ink"
    },
    "quality": 9.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "mission-control-bride",
    "a": {
      "label": "Flight Director",
      "setting": "Spoken into the main headset loop at Houston thirty seconds before the countdown hits zero.",
      "name": "Mission control countdown",
      "surface": "navy"
    },
    "b": {
      "label": "A nervous bride",
      "setting": "Whispered to the maid of honor right behind closed church doors before stepping down the aisle.",
      "name": "Walking the aisle",
      "surface": "blush"
    },
    "quality": 9.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "podcast-host-confessional",
    "a": {
      "label": "A true crime podcaster",
      "setting": "Speaking softly into a studio microphone right before the mid-episode ad break.",
      "name": "A podcast signoff",
      "surface": "plum"
    },
    "b": {
      "label": "A priest in confession",
      "setting": "Speaking through the wooden screen to a tearful parishioner in the dark.",
      "name": "A confessional murmur",
      "surface": "paper"
    },
    "quality": 9.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "rare-books-art-heist",
    "a": {
      "label": "Rare book archivist",
      "setting": "Gloved hands handling a crumbling fourteenth-century illuminated manuscript.",
      "name": "Rare book inspection",
      "surface": "moss"
    },
    "b": {
      "label": "Master art thief",
      "setting": "Whispering over the radio while easing a canvas out of its gilded frame.",
      "name": "Museum heist whisper",
      "surface": "ink"
    },
    "quality": 9.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "tarot-reader-flight-attendant",
    "a": {
      "label": "A tarot reader",
      "setting": "A mystic lays out cards under candlelight, warning a client of looming turmoil.",
      "name": "A tarot card reading",
      "surface": "plum"
    },
    "b": {
      "label": "A flight attendant",
      "setting": "A flight attendant speaks over the intercom as the cabin begins to violently rattle.",
      "name": "A turbulence announcement",
      "surface": "sky"
    },
    "quality": 9.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "tour-guide-burglary",
    "a": {
      "label": "An energetic city tour guide",
      "setting": "Spoken into a megaphone while leading thirty tourists down a crowded alley.",
      "name": "Walking tour pitch",
      "surface": "peach"
    },
    "b": {
      "label": "A getaway driver in an earbud",
      "setting": "Hissed into a radio outside a bank as alarms begin to echo inside.",
      "name": "Getaway driver update",
      "surface": "graphite"
    },
    "quality": 9.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "pledge-dungeon",
    "a": {
      "label": "A public radio host during a fundraising drive",
      "setting": "Speaking directly into the microphone between classical symphonies.",
      "name": "A pledge drive pitch",
      "surface": "sky"
    },
    "b": {
      "label": "A dungeon master addressing the adventuring party",
      "setting": "Leaning over a battle map behind a cardboard screen as night falls.",
      "name": "A dungeon master's cue",
      "surface": "forest"
    },
    "quality": 9.41,
    "battery": "pair-battery@2"
  },
  {
    "key": "submarine-dive-meditation",
    "a": {
      "label": "A submarine dive officer",
      "setting": "Calling out commands into the control room as the hull submerges below test depth.",
      "name": "A submarine dive order",
      "surface": "navy"
    },
    "b": {
      "label": "A mindfulness instructor",
      "setting": "Guiding a silent room of stressed students through a deep breathing exercise.",
      "name": "A meditation guide",
      "surface": "mint"
    },
    "quality": 9.41,
    "battery": "pair-battery@2"
  },
  {
    "key": "illusionist-heist",
    "a": {
      "label": "A theatrical grand illusionist",
      "setting": "Speaking into a head mic on a velvet stage right before vanishing behind a mirror.",
      "name": "An illusionist patter",
      "surface": "plum"
    },
    "b": {
      "label": "A police evidence technician",
      "setting": "Dusting a shattered display case with fine powder under harsh fluorescent crime scene lamps.",
      "name": "A crime scene scan",
      "surface": "fog"
    },
    "quality": 9.4,
    "battery": "pair-battery@2"
  },
  {
    "key": "jackpot-apocalypse",
    "a": {
      "label": "A casino floor manager",
      "setting": "Grabbing a microphone as sirens and bells erupt across every slot machine row.",
      "name": "A mega jackpot announcement",
      "surface": "lime"
    },
    "b": {
      "label": "A bunker survival officer",
      "setting": "Transmitting across emergency frequencies after the seismic alarm triggers.",
      "name": "An emergency broadcast siren",
      "surface": "rose"
    },
    "quality": 9.4,
    "battery": "pair-battery@2"
  },
  {
    "key": "road-trip-navigator-oracle",
    "a": {
      "label": "An exhausted passenger reading a paper roadmap",
      "setting": "Muttered in the glow of a dashboard light on a lonely two-lane desert highway.",
      "name": "Passenger seat directions",
      "surface": "lime"
    },
    "b": {
      "label": "An ancient temple seer reading omens",
      "setting": "Chanted over smoking coals to a king asking about his kingdom's future.",
      "name": "A mystical prophecy",
      "surface": "moss"
    },
    "quality": 9.4,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-defense",
    "a": {
      "label": "A petty passive-aggressive roommate",
      "setting": "Taping a sticky note onto the refrigerator door before heading to work.",
      "name": "A passive fridge note",
      "surface": "butter"
    },
    "b": {
      "label": "A museum heist planner",
      "setting": "Whispering final ground rules into earpieces outside the laser grid corridor.",
      "name": "Heist perimeter rules",
      "surface": "space"
    },
    "quality": 9.4,
    "battery": "pair-battery@2"
  },
  {
    "key": "storm-fairy-curse",
    "a": {
      "label": "A TV meteorologist",
      "setting": "Standing before a giant radar map tracking severe winds across the region.",
      "name": "A hurricane forecast",
      "surface": "navy"
    },
    "b": {
      "label": "An uninvited fairy",
      "setting": "Bursting into the grand castle nursery to curse the newborn child.",
      "name": "A fairy godmother's curse",
      "surface": "plum"
    },
    "quality": 9.4,
    "battery": "pair-battery@2"
  },
  {
    "key": "art-docent-and-coroner",
    "a": {
      "label": "Avant-garde art critic",
      "setting": "Gazing thoughtfully through spectacles at a controversial minimalist installation.",
      "name": "An art critic's review",
      "surface": "lilac"
    },
    "b": {
      "label": "Medical examiner",
      "setting": "Dictating findings into a recorder while inspecting a cold examination table.",
      "name": "An autopsy dictation",
      "surface": "ink"
    },
    "quality": 9.39,
    "battery": "pair-battery@2"
  },
  {
    "key": "gardener-funeral",
    "a": {
      "label": "Old gardener",
      "setting": "Kneeling in rich loam, gently placing delicate bulbs into autumn soil.",
      "name": "Planting perennial bulbs",
      "surface": "moss"
    },
    "b": {
      "label": "Grave digger",
      "setting": "Leaning on a spade at dusk, preparing the ground for tomorrow's service.",
      "name": "A gravedigger's reflection",
      "surface": "fog"
    },
    "quality": 9.39,
    "battery": "pair-battery@2"
  },
  {
    "key": "school-morning-announcement-air-traffic",
    "a": {
      "label": "A school principal",
      "setting": "Speaking over the crackling school public address system on a brisk Monday morning.",
      "name": "Morning school announcements",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A deep-cover mole",
      "setting": "A sleeper agent delivers a coded audio broadcast over a public frequency to hidden ears.",
      "name": "A spy's broadcast",
      "surface": "ink"
    },
    "quality": 9.39,
    "battery": "pair-battery@2"
  },
  {
    "key": "stage-magic-heist",
    "a": {
      "label": "The stage magician",
      "setting": "Projecting to the packed auditorium while rolling up velvet sleeves under the spotlight.",
      "name": "A magician's intro",
      "surface": "plum"
    },
    "b": {
      "label": "A retail loss prevention officer",
      "setting": "Confronting a nervous shoplifter by the glass exit doors with security nearby.",
      "name": "Catching a shoplifter",
      "surface": "paper"
    },
    "quality": 9.39,
    "battery": "pair-battery@2"
  },
  {
    "key": "it-helpdesk-exorcist",
    "a": {
      "label": "A Tier 1 IT technician",
      "setting": "Typing into a support ticket queue while soothing a frustrated caller.",
      "name": "A helpdesk ticket reply",
      "surface": "sky"
    },
    "b": {
      "label": "An itinerant exorcist",
      "setting": "Speaking gravely over a thrashing antique wardrobe in a cold parish rectory.",
      "name": "An exorcism rite",
      "surface": "graphite"
    },
    "quality": 9.38,
    "battery": "pair-battery@2"
  },
  {
    "key": "mountaineer-breakup",
    "a": {
      "label": "An alpine guide",
      "setting": "Shouting into a howling blizzard near the ridge of K2.",
      "name": "Mountain rescue",
      "surface": "sky"
    },
    "b": {
      "label": "A dumper via text",
      "setting": "Typing rapidly on a phone after months of growing distant.",
      "name": "A breakup text",
      "surface": "rose"
    },
    "quality": 9.38,
    "battery": "pair-battery@2"
  },
  {
    "key": "mutiny-recipe-step",
    "a": {
      "label": "A rebellious first mate",
      "setting": "Whispering conspiratorially in the ship's hold as the lantern swings.",
      "name": "A mutiny pact",
      "surface": "ink"
    },
    "b": {
      "label": "An artisanal sourdough baker",
      "setting": "Instructing a workshop group while poking a bowl of proofing dough.",
      "name": "A breadmaker's guide",
      "surface": "apricot"
    },
    "quality": 9.38,
    "battery": "pair-battery@2"
  },
  {
    "key": "chivalric-duel-breakup",
    "a": {
      "label": "Chivalric champion",
      "setting": "Formal challenge delivered before the king while casting down a heavy gauntlet.",
      "name": "A knightly challenge",
      "surface": "forest"
    },
    "b": {
      "label": "Exiting romantic partner",
      "setting": "Dropping a set of house keys onto the kitchen counter on the way out.",
      "name": "The final breakup text",
      "surface": "rose"
    },
    "quality": 9.37,
    "battery": "pair-battery@2"
  },
  {
    "key": "tombstone-review",
    "a": {
      "label": "A stone mason",
      "setting": "Carving deeply into grey marble beside an open cemetery plot.",
      "name": "A headstone inscription",
      "surface": "graphite"
    },
    "b": {
      "label": "An irate consumer",
      "setting": "Typing a blistering one-star internet critique after a disastrous meal.",
      "name": "A blistering restaurant review",
      "surface": "apricot"
    },
    "quality": 9.37,
    "battery": "pair-battery@2"
  },
  {
    "key": "trivia-hostage",
    "a": {
      "label": "A slick game show host",
      "setting": "Leaning over the contestant podium as dramatic studio music plays.",
      "name": "Game show host",
      "surface": "lime"
    },
    "b": {
      "label": "A desperate bank teller",
      "setting": "Trembling behind bulletproof glass while pointing out the silent alarm.",
      "name": "Bank teller plea",
      "surface": "graphite"
    },
    "quality": 9.37,
    "battery": "pair-battery@2"
  },
  {
    "key": "fortuneteller-breakup",
    "a": {
      "label": "A tea leaf reader",
      "setting": "An elderly seer peering closely into the bottom of a porcelain teacup.",
      "name": "A tea leaf reading",
      "surface": "lilac"
    },
    "b": {
      "label": "An unhappy partner",
      "setting": "A lover delivering a painful text message across the kitchen counter.",
      "name": "A breakup text",
      "surface": "fog"
    },
    "quality": 9.35,
    "battery": "pair-battery@2"
  },
  {
    "key": "flight-emergency",
    "a": {
      "label": "A flight attendant",
      "setting": "Demonstrating safety equipment before takeoff in the narrow aisle.",
      "name": "Pre-flight safety speech",
      "surface": "sea"
    },
    "b": {
      "label": "A sinking ship's officer",
      "setting": "Directing panicked passengers on a tilting, rain-slicked deck.",
      "name": "Evacuation order",
      "surface": "forest"
    },
    "quality": 9.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandma-conspiracy",
    "a": {
      "label": "A loving grandmother",
      "setting": "Handing an overstuffed Tupperware container to her departing grandchild.",
      "name": "Grandparent farewell",
      "surface": "butter"
    },
    "b": {
      "label": "A paranoid informant",
      "setting": "Whispering across a park bench in a heavy trench coat at dusk.",
      "name": "A conspiracy leak",
      "surface": "graphite"
    },
    "quality": 9.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandpa-mechanic",
    "a": {
      "label": "An elderly grandfather",
      "setting": "Sitting in an armchair on the porch, dispensing quiet lifelong wisdom.",
      "name": "Grandpa reminiscing",
      "surface": "cream"
    },
    "b": {
      "label": "A spaceport grease monkey",
      "setting": "Wiping black oil off hands beside an ancient, sputtering hyperdrive.",
      "name": "Starship maintenance",
      "surface": "ink"
    },
    "quality": 9.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "mountain-and-contract",
    "a": {
      "label": "A mountain guide",
      "setting": "Shouting over whipping winds on a freezing ledge above the clouds.",
      "name": "A mountaineering command",
      "surface": "sky"
    },
    "b": {
      "label": "A corporate lawyer",
      "setting": "Leaning over mahogany boardroom desks reviewing redline revisions.",
      "name": "Contract fine print",
      "surface": "navy"
    },
    "quality": 9.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "pinata-smash-demolition",
    "a": {
      "label": "A parent guiding a blindfolded kid",
      "setting": "Shouted cheerfully over chaotic lawn games while pointing toward a hanging donkey.",
      "name": "Pinata party guidance",
      "surface": "lime"
    },
    "b": {
      "label": "A fortress siegemaster",
      "setting": "Barking orders to soldiers wheeling the battering ram against the castle gates.",
      "name": "A castle siege command",
      "surface": "moss"
    },
    "quality": 9.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "selfhelp-wilderness",
    "a": {
      "label": "A wellness podcaster",
      "setting": "A soft-spoken guru recording an audio lesson on inner resilience.",
      "name": "A wellness podcast",
      "surface": "cream"
    },
    "b": {
      "label": "A wilderness ranger",
      "setting": "A park ranger briefing solo backpackers before they enter deep woods.",
      "name": "Ranger safety briefing",
      "surface": "oxblood"
    },
    "quality": 9.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "auctioneer-and-hostage",
    "a": {
      "label": "An energetic auctioneer",
      "setting": "Rapidly calling bids from the podium as paddles rise across the packed gallery floor.",
      "name": "An art auction",
      "surface": "butter"
    },
    "b": {
      "label": "A kidnapper reading demands",
      "setting": "Speaking into a recorded line from a shadowy warehouse, stating final conditions.",
      "name": "A ransom tape",
      "surface": "graphite"
    },
    "quality": 9.33,
    "battery": "pair-battery@2"
  },
  {
    "key": "casino-and-hostage",
    "a": {
      "label": "A high-stakes casino host",
      "setting": "Leaning over the VIP poker table as the final chips are pushed into the pot.",
      "name": "A high-roller invite",
      "surface": "apricot"
    },
    "b": {
      "label": "A bank robber",
      "setting": "Shouted to the cowering tellers while stuffing cash into a duffel bag.",
      "name": "A bank robbery demand",
      "surface": "oxblood"
    },
    "quality": 9.33,
    "battery": "pair-battery@2"
  },
  {
    "key": "science-fair-doomsday",
    "a": {
      "label": "A middle school science teacher",
      "setting": "Evaluating a papier-mâché volcano with a clipboard in a crowded gymnasium.",
      "name": "A science fair critique",
      "surface": "lime"
    },
    "b": {
      "label": "A scientist monitoring a nuclear reactor",
      "setting": "Staring wide-eyed at flashing red consoles in a control bunker under lockdown.",
      "name": "A meltdown warning",
      "surface": "space"
    },
    "quality": 9.33,
    "battery": "pair-battery@2"
  },
  {
    "key": "pirate-mutiny-couples-therapy",
    "a": {
      "label": "A rebellious first mate",
      "setting": "Whispering conspiratorially to crewmates below deck while the captain sleeps.",
      "name": "Plotting a mutiny",
      "surface": "moss"
    },
    "b": {
      "label": "An unhappy spouse",
      "setting": "Speaking across a low coffee table while the counselor takes calm notes.",
      "name": "A marriage counseling plea",
      "surface": "rose"
    },
    "quality": 9.32,
    "battery": "pair-battery@2"
  },
  {
    "key": "self-help-drill",
    "a": {
      "label": "A motivational guru",
      "setting": "Shouting into a headset mic on stage to an arena of aspiring entrepreneurs.",
      "name": "A motivational keynote",
      "surface": "lime"
    },
    "b": {
      "label": "A military drill instructor",
      "setting": "Bellowing two inches from a recruit's face in the middle of a muddy field.",
      "name": "A drill sergeant's bark",
      "surface": "plum"
    },
    "quality": 9.32,
    "battery": "pair-battery@2"
  },
  {
    "key": "selfhelp-chess",
    "a": {
      "label": "A personal growth author",
      "setting": "A motivational guru speaking passionately from a brightly lit seminar stage.",
      "name": "A self-help lecture",
      "surface": "butter"
    },
    "b": {
      "label": "A veteran grandmaster",
      "setting": "A tense, hushed chess hall where a master assesses a junior player's board.",
      "name": "A chess master critique",
      "surface": "navy"
    },
    "quality": 9.32,
    "battery": "pair-battery@2"
  },
  {
    "key": "vow-troubleshooting",
    "a": {
      "label": "The partner speaking vows",
      "setting": "Standing tearfully at the altar, holding both hands before family and friends.",
      "name": "A wedding vow",
      "surface": "blush"
    },
    "b": {
      "label": "The tech support agent",
      "setting": "Speaking into a headset to a desperate caller whose system just failed.",
      "name": "Tech support script",
      "surface": "graphite"
    },
    "quality": 9.32,
    "battery": "pair-battery@2"
  },
  {
    "key": "filibuster-bedtime-story",
    "a": {
      "label": "A determined senator",
      "setting": "Spoken raspy and unceasingly from the Senate floor at 3 a.m. to delay a vote.",
      "name": "A Senate filibuster",
      "surface": "paper"
    },
    "b": {
      "label": "An exhausted parent",
      "setting": "Recited from memory beside a toddler who refuses to close their eyes.",
      "name": "An endless bedtime story",
      "surface": "periwinkle"
    },
    "quality": 9.31,
    "battery": "pair-battery@2"
  },
  {
    "key": "salon-spy",
    "a": {
      "label": "A hair colorist",
      "setting": "Whispered over running sink water while rinsing bleach from a client's scalp.",
      "name": "Hair bleaching warning",
      "surface": "apricot"
    },
    "b": {
      "label": "A spy handler",
      "setting": "Muttered over a secure burner phone to an operative fleeing across a border.",
      "name": "Spy handler evacuation",
      "surface": "navy"
    },
    "quality": 9.31,
    "battery": "pair-battery@2"
  },
  {
    "key": "train-announcement-ghost",
    "a": {
      "label": "A sleeper train conductor at midnight",
      "setting": "Echoing through the dimly lit passenger car as the train crosses a frozen border.",
      "name": "A midnight train announcement",
      "surface": "navy"
    },
    "b": {
      "label": "A Victorian spirit wandering an ancestral hall",
      "setting": "Whispered from the dark top of the grand staircase to an unwelcome intruder.",
      "name": "A haunted house warning",
      "surface": "fog"
    },
    "quality": 9.31,
    "battery": "pair-battery@2"
  },
  {
    "key": "chime-chase",
    "a": {
      "label": "The jingle operator to neighbourhood kids",
      "setting": "A summery street vendor leans out the sliding window on a sweltering July afternoon.",
      "name": "An ice cream vendor",
      "surface": "peach"
    },
    "b": {
      "label": "A deep-sea sonar operator to the captain",
      "setting": "Dim red lighting bathes the sonar console as an unknown acoustic contact draws near.",
      "name": "A submarine sonar report",
      "surface": "navy"
    },
    "quality": 9.3,
    "battery": "pair-battery@2"
  },
  {
    "key": "meteorologist-parachutist",
    "a": {
      "label": "Evening TV meteorologist",
      "setting": "Pointing at a sweeping radar map in front of a green screen.",
      "name": "A weather report forecast",
      "surface": "periwinkle"
    },
    "b": {
      "label": "Skydive jumpmaster at the open door",
      "setting": "Shouting over rushing wind at ten thousand feet above the drop zone.",
      "name": "A jumpmaster's countdown",
      "surface": "navy"
    },
    "quality": 9.3,
    "battery": "pair-battery@2"
  },
  {
    "key": "ship-captain-landlord-eviction",
    "a": {
      "label": "A storm-battered ship captain",
      "setting": "Shouted through gale winds to the crew as water breaches the lower deck.",
      "name": "Captain's order to abandon",
      "surface": "navy"
    },
    "b": {
      "label": "A stern landlord",
      "setting": "Read flatly to a tenant at the front door while handing over legal paperwork.",
      "name": "An eviction notice",
      "surface": "paper"
    },
    "quality": 9.3,
    "battery": "pair-battery@2"
  },
  {
    "key": "toddler-and-courtroom",
    "a": {
      "label": "An exhausted parent",
      "setting": "Crouched in front of a defiant toddler refusing pajamas at 8 PM.",
      "name": "Toddler bedtime plea",
      "surface": "apricot"
    },
    "b": {
      "label": "A defense attorney",
      "setting": "Addressing the jury panel during intense final closing arguments.",
      "name": "A closing argument",
      "surface": "graphite"
    },
    "quality": 9.3,
    "battery": "pair-battery@2"
  },
  {
    "key": "chess-godfather",
    "a": {
      "label": "A grandmaster chess analyst",
      "setting": "Whispering commentary into a microphone as the tournament clock ticks down.",
      "name": "Chess commentary",
      "surface": "paper"
    },
    "b": {
      "label": "A mafia don",
      "setting": "Speaking softly across a dimly lit restaurant table to a disloyal lieutenant.",
      "name": "A mob warning",
      "surface": "oxblood"
    },
    "quality": 9.29,
    "battery": "pair-battery@2"
  },
  {
    "key": "life-coach-siren",
    "a": {
      "label": "A high-energy self-help author",
      "setting": "Speaking on stage under spotlights to an audience taking furious notes.",
      "name": "A life coach seminar",
      "surface": "lime"
    },
    "b": {
      "label": "A mythical siren singing from the rocks",
      "setting": "Calling out sweetly through coastal fog to weary sailors at sea.",
      "name": "A siren's lure",
      "surface": "fog"
    },
    "quality": 9.29,
    "battery": "pair-battery@2"
  },
  {
    "key": "casino-monastery",
    "a": {
      "label": "A casino high roller",
      "setting": "Pushing an entire stack of chips forward into the center of the green felt.",
      "name": "Going all in",
      "surface": "forest"
    },
    "b": {
      "label": "A novitiate taking vows",
      "setting": "Whispering before the altar while renouncing all worldly personal possessions.",
      "name": "A monastic vow",
      "surface": "paper"
    },
    "quality": 9.28,
    "battery": "pair-battery@2"
  },
  {
    "key": "circus-highwire",
    "a": {
      "label": "A trapeze coach",
      "setting": "Calling out from the safety platform to a performer high above the net.",
      "name": "Trapeze instructions",
      "surface": "butter"
    },
    "b": {
      "label": "A corporate boss",
      "setting": "Quietly advising an executive about to step down after a major merger.",
      "name": "Retirement advice",
      "surface": "navy"
    },
    "quality": 9.28,
    "battery": "pair-battery@2"
  },
  {
    "key": "job-interview-heist",
    "a": {
      "label": "A job applicant",
      "setting": "Sitting upright across a glass desk, answering how you handle high-pressure deadlines.",
      "name": "A job interview pitch",
      "surface": "fog"
    },
    "b": {
      "label": "A bank robber",
      "setting": "Whispering through a masked headset to your getaway driver outside the bank.",
      "name": "A bank heist getaway",
      "surface": "ink"
    },
    "quality": 9.28,
    "battery": "pair-battery@2"
  },
  {
    "key": "office-fridge-diplomatic-treaty",
    "a": {
      "label": "A passive-aggressive office memo",
      "setting": "Taped in bright red marker above the breakroom sink.",
      "name": "Breakroom kitchen memo",
      "surface": "paper"
    },
    "b": {
      "label": "A diplomat drafting borders",
      "setting": "Dictating strict terms of territorial division across the table.",
      "name": "Diplomatic treaty terms",
      "surface": "sea"
    },
    "quality": 9.28,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-shipwreck",
    "a": {
      "label": "An HOA president addressing the clubhouse",
      "setting": "Tapping a microphone at the folding table, clearing throat over quiet rustling.",
      "name": "An HOA president's decree",
      "surface": "paper"
    },
    "b": {
      "label": "A castaway keeping morale alive on a raft",
      "setting": "Hoarse voice under a scorching midday sun, addressing three survivors.",
      "name": "A lifeboat survivor's plea",
      "surface": "sea"
    },
    "quality": 9.27,
    "battery": "pair-battery@2"
  },
  {
    "key": "magic-potion-and-pharma",
    "a": {
      "label": "A swamp witch",
      "setting": "Handing a bubbling green vial across a counter of skulls to a desperate hero.",
      "name": "A witch's potion warning",
      "surface": "moss"
    },
    "b": {
      "label": "A fast-talking commercial narrator",
      "setting": "Speed-reading warnings at the end of a television ad for a new allergy pill.",
      "name": "Pharmaceutical side effects",
      "surface": "periwinkle"
    },
    "quality": 9.27,
    "battery": "pair-battery@2"
  },
  {
    "key": "neighbor-monologue",
    "a": {
      "label": "A gossiping backyard neighbor",
      "setting": "Leaning over the chain-link fence holding pruning shears on a sunny morning.",
      "name": "A backyard gossip session",
      "surface": "apricot"
    },
    "b": {
      "label": "A ruthless film noir detective",
      "setting": "Grilling a nervous suspect under a bare bulb in a smoky back room.",
      "name": "A noir interrogation",
      "surface": "ink"
    },
    "quality": 9.27,
    "battery": "pair-battery@2"
  },
  {
    "key": "ocean-tomb",
    "a": {
      "label": "A scuba instructor",
      "setting": "Briefing anxious first-time divers on the boat deck before dropping into deep water.",
      "name": "A scuba briefing",
      "surface": "sea"
    },
    "b": {
      "label": "A grief counselor",
      "setting": "Speaking softly to a bereaved spouse facing their first week alone in an empty house.",
      "name": "A bereavement consult",
      "surface": "fog"
    },
    "quality": 9.27,
    "battery": "pair-battery@2"
  },
  {
    "key": "pet-and-hostage",
    "a": {
      "label": "A dog trainer's guidance",
      "setting": "Spoken patiently to a frantic owner whose large hound refuses to give up a shoe.",
      "name": "Dog training cue",
      "surface": "peach"
    },
    "b": {
      "label": "A hostage negotiator's demand",
      "setting": "Spoken into a megaphone across a barricade toward an armed bank robber.",
      "name": "Hostage standoff demand",
      "surface": "forest"
    },
    "quality": 9.27,
    "battery": "pair-battery@2"
  },
  {
    "key": "babysitter-general",
    "a": {
      "label": "A babysitter negotiating with a stubborn toddler",
      "setting": "Crouched on the rug at 8:00 PM, pointing firmly toward the stairs.",
      "name": "A bedtime negotiation",
      "surface": "butter"
    },
    "b": {
      "label": "A field general briefing commanders before battle",
      "setting": "Standing over an illuminated map tent, pointing out the ridge at dawn.",
      "name": "A general's eve briefing",
      "surface": "forest"
    },
    "quality": 9.25,
    "battery": "pair-battery@2"
  },
  {
    "key": "pinata-coach-riot-cop",
    "a": {
      "label": "A parent guiding a blindfolded child with a plastic bat",
      "setting": "Shouted over lawn sprinklers as kids dodge out of the swing radius.",
      "name": "Piñata instructions",
      "surface": "lime"
    },
    "b": {
      "label": "A demolitions expert directing an excavator operator",
      "setting": "Roared through a megaphone across crushed concrete and snapping rebar.",
      "name": "A demolition order",
      "surface": "plum"
    },
    "quality": 9.25,
    "battery": "pair-battery@2"
  },
  {
    "key": "reportcard-confession",
    "a": {
      "label": "A strict teacher",
      "setting": "Written in red pen across the bottom of a mid-term evaluation.",
      "name": "Report card comments",
      "surface": "paper"
    },
    "b": {
      "label": "A supernatural investigator",
      "setting": "Spoken into an audio recorder while standing inside an abandoned sanitarium.",
      "name": "Paranormal incident log",
      "surface": "graphite"
    },
    "quality": 9.25,
    "battery": "pair-battery@2"
  },
  {
    "key": "cross-examination-breakup",
    "a": {
      "label": "A ruthless defense attorney",
      "setting": "Standing at the podium, pressing a nervous witness on the stand.",
      "name": "A cross examination",
      "surface": "navy"
    },
    "b": {
      "label": "A weary partner",
      "setting": "Sitting across a kitchen table late at night, ending a five-year relationship.",
      "name": "A breakup talk",
      "surface": "rose"
    },
    "quality": 9.24,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-complaint-witch",
    "a": {
      "label": "An HOA board president",
      "setting": "Writing a formal citation regarding excessive yard clutter and lawn height.",
      "name": "An HOA violation notice",
      "surface": "paper"
    },
    "b": {
      "label": "A swamp witch",
      "setting": "Leaning over your bubbling cauldron, muttering a hex at an uninvited intruder.",
      "name": "A witch's curse",
      "surface": "moss"
    },
    "quality": 9.24,
    "battery": "pair-battery@2"
  },
  {
    "key": "it-helpdesk-ghost",
    "a": {
      "label": "A remote IT specialist",
      "setting": "Typed over live chat to an employee whose computer suddenly froze up.",
      "name": "IT helpdesk chat",
      "surface": "sky"
    },
    "b": {
      "label": "A paranormal investigator",
      "setting": "Whispered into a recorder while standing inside an abandoned, drafty attic.",
      "name": "A ghost hunter's log",
      "surface": "ink"
    },
    "quality": 9.24,
    "battery": "pair-battery@2"
  },
  {
    "key": "quest-mechanic",
    "a": {
      "label": "A fantasy quest giver",
      "setting": "A hooded tavern patron sliding an ancient parchment map across a rough wooden table.",
      "name": "Quest giver briefing",
      "surface": "forest"
    },
    "b": {
      "label": "A car salesman",
      "setting": "Handing keys over to a skeptical buyer on a sunny used-car lot.",
      "name": "Used car pitch",
      "surface": "peach"
    },
    "quality": 9.24,
    "battery": "pair-battery@2"
  },
  {
    "key": "auction-and-parent",
    "a": {
      "label": "An art auctioneer",
      "setting": "Speaking briskly to high rollers as bids stall on a rare masterpiece.",
      "name": "Auctioneer call",
      "surface": "butter"
    },
    "b": {
      "label": "A parent counting down",
      "setting": "Sternly warning a defiant toddler who refuses to put on their shoes.",
      "name": "Parent countdown",
      "surface": "plum"
    },
    "quality": 9.23,
    "battery": "pair-battery@2"
  },
  {
    "key": "game-show-verdict",
    "a": {
      "label": "Flamboyant game show host",
      "setting": "Shouted under blinding studio lights with dramatic music swelling before the grand prize reveal.",
      "name": "A game show climax",
      "surface": "butter"
    },
    "b": {
      "label": "Jury foreperson",
      "setting": "Read from a folded slip of paper in a hushed courtroom to a trembling defendant.",
      "name": "A jury verdict",
      "surface": "navy"
    },
    "quality": 9.23,
    "battery": "pair-battery@2"
  },
  {
    "key": "text-curator",
    "a": {
      "label": "A nervous teenager texting",
      "setting": "Typed and erased four times before hitting send late at night.",
      "name": "A crush confession text",
      "surface": "peach"
    },
    "b": {
      "label": "An art gallery curator",
      "setting": "Explaining a mysterious modern canvas to wealthy patrons on preview night.",
      "name": "Gallery audio tour",
      "surface": "navy"
    },
    "quality": 9.23,
    "battery": "pair-battery@2"
  },
  {
    "key": "creepy-cabin-tape-guided-tour",
    "a": {
      "label": "A found-footage tape",
      "setting": "A scratchy cassette playing in a rotting cabin deep in the cursed woods.",
      "name": "Cursed audio tape",
      "surface": "moss"
    },
    "b": {
      "label": "A botanical garden guide",
      "setting": "Walking visitors past a dense canopy of rare prehistoric ferns.",
      "name": "Nature walk guide",
      "surface": "periwinkle"
    },
    "quality": 9.22,
    "battery": "pair-battery@2"
  },
  {
    "key": "guru-flight",
    "a": {
      "label": "A life coach writing an intro",
      "setting": "A motivational author dictates the opening chapter on conquering personal fear.",
      "name": "Self-help chapter opening",
      "surface": "mint"
    },
    "b": {
      "label": "A flight attendant pre-flight demo",
      "setting": "A flight attendant demonstrates equipment in the aisle before a stormy takeoff.",
      "name": "Cabin safety demonstration",
      "surface": "navy"
    },
    "quality": 9.22,
    "battery": "pair-battery@2"
  },
  {
    "key": "stage-whisper-space-abort",
    "a": {
      "label": "A stage manager on headset",
      "setting": "Whispered backstage into a headset right before the curtain rises on opening night.",
      "name": "Stage manager cue",
      "surface": "plum"
    },
    "b": {
      "label": "Flight director in mission control",
      "setting": "Spoken into the main loop to the crew as alarms flash during a launch abort.",
      "name": "Mission abort call",
      "surface": "space"
    },
    "quality": 9.22,
    "battery": "pair-battery@2"
  },
  {
    "key": "fitness-and-ghosts",
    "a": {
      "label": "A spin class instructor",
      "setting": "Shouting over pulsing techno music from a podium surrounded by sweaty riders.",
      "name": "A spin class cue",
      "surface": "butter"
    },
    "b": {
      "label": "A frantic exorcist",
      "setting": "Yelling across a shaking bedroom while holding up a wooden cross.",
      "name": "An exorcism ritual",
      "surface": "oxblood"
    },
    "quality": 9.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "improv-bomb-squad",
    "a": {
      "label": "An improv comedy coach",
      "setting": "Coaching hesitant performers standing on an empty black box theater stage.",
      "name": "An improv workshop",
      "surface": "lime"
    },
    "b": {
      "label": "A bomb technician",
      "setting": "Speaking over a radio to a partner kneeling over ticking wires.",
      "name": "A bomb disposal guide",
      "surface": "graphite"
    },
    "quality": 9.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "loan-shark-warning",
    "a": {
      "label": "A loan officer",
      "setting": "A bank manager reviews overdue terms with a delinquent borrower across a clean desk.",
      "name": "A loan default warning",
      "surface": "graphite"
    },
    "b": {
      "label": "A fairytale witch",
      "setting": "A cackling crone reminds a foolish traveler of the steep cost of their granted wish.",
      "name": "A witch's bargain",
      "surface": "moss"
    },
    "quality": 9.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-heist",
    "a": {
      "label": "A transit lost and found clerk",
      "setting": "Spoken across a dusty counter to a traveler clutching a claim ticket.",
      "name": "Lost property retrieval",
      "surface": "cream"
    },
    "b": {
      "label": "An undercover safe cracker",
      "setting": "Whispered into an earpiece while turning the heavy dial of an antique vault.",
      "name": "Safecracking instructions",
      "surface": "ink"
    },
    "quality": 9.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "spin-heist",
    "a": {
      "label": "An overly energetic indoor cycling coach",
      "setting": "Shouting over pulsating techno music under neon studio strobe lights.",
      "name": "A spin class command",
      "surface": "lime"
    },
    "b": {
      "label": "A master thief orchestrating a getaway",
      "setting": "Hissing into an earpiece while monitoring security feeds during an escape.",
      "name": "A getaway driver's cue",
      "surface": "graphite"
    },
    "quality": 9.2,
    "battery": "pair-battery@2"
  },
  {
    "key": "bakery-coroner",
    "a": {
      "label": "A boutique cake decorator",
      "setting": "Critiquing an elaborate wedding cake display under bright studio lights.",
      "name": "Cake decorating review",
      "surface": "rose"
    },
    "b": {
      "label": "A medical examiner",
      "setting": "Dictating observations into a microphone under harsh fluorescent lights in the morgue.",
      "name": "Autopsy report",
      "surface": "fog"
    },
    "quality": 9.19,
    "battery": "pair-battery@2"
  },
  {
    "key": "fairy-godmother-used-car",
    "a": {
      "label": "A fairy godmother",
      "setting": "An enchanted elder blesses a humble maiden before the royal ball.",
      "name": "A fairy godmother's gift",
      "surface": "lilac"
    },
    "b": {
      "label": "A pushy car salesman",
      "setting": "A salesman claps a customer on the shoulder on a sunny dealership lot.",
      "name": "A car salesman's pitch",
      "surface": "butter"
    },
    "quality": 9.19,
    "battery": "pair-battery@2"
  },
  {
    "key": "confessional-exit-interview",
    "a": {
      "label": "Priest whispering through the grille",
      "setting": "A muffled voice echoes in the quiet dark box between two church services.",
      "name": "A confessional absolution",
      "surface": "moss"
    },
    "b": {
      "label": "HR director conducting an exit interview",
      "setting": "A tidy glass office overlooking the highway on an employee's final afternoon.",
      "name": "An HR exit interview",
      "surface": "periwinkle"
    },
    "quality": 9.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "crosscountry-evacuation",
    "a": {
      "label": "A parent driving a minivan",
      "setting": "Spoken firmly into the rearview mirror on hour fourteen of a family trip.",
      "name": "Family road trip decree",
      "surface": "apricot"
    },
    "b": {
      "label": "A space capsule pilot",
      "setting": "Transmitted over static as fuel reserves dip below critical margin.",
      "name": "Deep space transmission",
      "surface": "space"
    },
    "quality": 9.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoafence-alien-transmission",
    "a": {
      "label": "A petty homeowner",
      "setting": "A handwritten complaint slipped under the door of the house next door.",
      "name": "An angry neighbor note",
      "surface": "paper"
    },
    "b": {
      "label": "An extraterrestrial scout",
      "setting": "A cold broadcast beamed down from orbit to the leaders of Earth.",
      "name": "An alien first contact",
      "surface": "space"
    },
    "quality": 9.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "palms-and-prognosis",
    "a": {
      "label": "A boardwalk palm reader",
      "setting": "Spoken in a beaded curtain tent while tracing lines on a customer's hand.",
      "name": "A palm reading",
      "surface": "plum"
    },
    "b": {
      "label": "A flight attendant during extreme turbulence",
      "setting": "Spoken over the cabin intercom as the aircraft drops sharply through cloud.",
      "name": "A turbulence alert",
      "surface": "sky"
    },
    "quality": 9.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "therapist-demolition-488",
    "a": {
      "label": "A licensed therapist",
      "setting": "Softly across an armchair in a quiet office, handing a tissue to a weeping patient.",
      "name": "Therapy breakthrough",
      "surface": "lilac"
    },
    "b": {
      "label": "A demolition supervisor",
      "setting": "Over a walkie-talkie to crew members clearing out before detonating a stadium.",
      "name": "Demolition countdown",
      "surface": "graphite"
    },
    "quality": 9.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "courtroom-swearing-in",
    "a": {
      "label": "A courtroom bailiff",
      "setting": "Firm instruction spoken directly to an anxious witness standing beside the stand with an open Bible.",
      "name": "Swearing in a witness",
      "surface": "graphite"
    },
    "b": {
      "label": "A street fortune teller",
      "setting": "Gazing across a velvet table into a client's eyes before turning over the first tarot card.",
      "name": "A psychic's warning",
      "surface": "plum"
    },
    "quality": 9.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "dog-trainer-parole-officer",
    "a": {
      "label": "A dog obedience trainer",
      "setting": "Guiding a jumpy rescue dog through an agility course with treats in hand.",
      "name": "Obedience school command",
      "surface": "lime"
    },
    "b": {
      "label": "A military sentry challenging a figure",
      "setting": "Calling out into the dark perimeter fence toward an unidentified silhouette.",
      "name": "Sentry perimeter challenge",
      "surface": "space"
    },
    "quality": 9.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-mafia",
    "a": {
      "label": "An HOA president",
      "setting": "Reading violations from a clipboard at a tense suburban clubhouse meeting.",
      "name": "An HOA citation",
      "surface": "butter"
    },
    "b": {
      "label": "A mob boss",
      "setting": "Whispered across a dark booth to a merchant behind on his payments.",
      "name": "A mob threat",
      "surface": "ink"
    },
    "quality": 9.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "library-rare-bomb",
    "a": {
      "label": "A rare book archivist",
      "setting": "Whispering across velvet tables to a nervous visiting scholar.",
      "name": "Rare book room etiquette",
      "surface": "moss"
    },
    "b": {
      "label": "A bomb technician",
      "setting": "Speaking through an earpiece while hovering over exposed circuitry.",
      "name": "Bomb defusal instructions",
      "surface": "rose"
    },
    "quality": 9.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "ocean-ghost",
    "a": {
      "label": "A dive instructor",
      "setting": "Floating beside a nervous student forty feet beneath the reef.",
      "name": "A scuba briefing",
      "surface": "sea"
    },
    "b": {
      "label": "A medium in a séance",
      "setting": "Holding hands around a round table in the dark, calling to spirits.",
      "name": "A haunted séance",
      "surface": "graphite"
    },
    "quality": 9.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "sailor-parent",
    "a": {
      "label": "An old sea captain",
      "setting": "Shouted above howling wind as black waves crash across the main deck.",
      "name": "Sea captain's order",
      "surface": "navy"
    },
    "b": {
      "label": "An exhausted parent",
      "setting": "Pleading at bath time while water splashes all over the bathroom floor.",
      "name": "Toddler bath time",
      "surface": "apricot"
    },
    "quality": 9.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "wildlife-and-espionage",
    "a": {
      "label": "A zookeeper's warning",
      "setting": "Spoken sternly to a group of guests standing right by the predator enclosure.",
      "name": "Zoo safety briefing",
      "surface": "moss"
    },
    "b": {
      "label": "A spy chief's reminder",
      "setting": "Murmured over an encrypted channel before an operative enters enemy headquarters.",
      "name": "Undercover field order",
      "surface": "graphite"
    },
    "quality": 9.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "fortune-reassurance",
    "a": {
      "label": "A boardwalk palm reader",
      "setting": "Tracing deep lines on a trembling hand across a velvet tablecloth.",
      "name": "A fortune teller",
      "surface": "plum"
    },
    "b": {
      "label": "A pilot over the intercom",
      "setting": "Speaking into the cabin microphone as storm clouds gather ahead.",
      "name": "A flight announcement",
      "surface": "fog"
    },
    "quality": 9.16,
    "battery": "pair-battery@2"
  },
  {
    "key": "scuba-rescue-first-date",
    "a": {
      "label": "a rescue diver through an underwater comm",
      "setting": "A diver checking in on a trapped partner who is running low on oxygen.",
      "name": "A deep sea rescue",
      "surface": "sea"
    },
    "b": {
      "label": "a nervous dater across a candlelit table",
      "setting": "Two people on a quiet first date trying to cut through awkward silence.",
      "name": "First date small talk",
      "surface": "rose"
    },
    "quality": 9.16,
    "battery": "pair-battery@2"
  },
  {
    "key": "turbulence-dentist",
    "a": {
      "label": "A captain over the cabin intercom",
      "setting": "Speaking to passengers as violent tremors rock the aircraft at thirty thousand feet.",
      "name": "Midair turbulence update",
      "surface": "navy"
    },
    "b": {
      "label": "A parent blowing out candles",
      "setting": "Speaking to excited kids crowding close around a flaming birthday cake.",
      "name": "Blowing out candles",
      "surface": "apricot"
    },
    "quality": 9.16,
    "battery": "pair-battery@2"
  },
  {
    "key": "climbing-sherpa-breakup",
    "a": {
      "label": "A mountaineer turning back",
      "setting": "Shouted through a blizzard at twenty thousand feet, pointing down the ridge before oxygen runs out.",
      "name": "Turning back the climb",
      "surface": "fog"
    },
    "b": {
      "label": "A tired partner breaking up",
      "setting": "Spoken across a quiet kitchen table late at night, letting go after years of trying.",
      "name": "A weary breakup",
      "surface": "peach"
    },
    "quality": 9.15,
    "battery": "pair-battery@2"
  },
  {
    "key": "eulogy-standup",
    "a": {
      "label": "A best friend at a memorial",
      "setting": "Standing at the wooden church lectern, clutching folded notes beside a flower wreath.",
      "name": "A funeral eulogy",
      "surface": "paper"
    },
    "b": {
      "label": "A rookie standup comic",
      "setting": "Clutching the microphone under a harsh spotlight at open mic night as silence lingers.",
      "name": "A standup comedy set",
      "surface": "lime"
    },
    "quality": 9.15,
    "battery": "pair-battery@2"
  },
  {
    "key": "superhero-vigilante-dentist-filling",
    "a": {
      "label": "A brooding masked vigilante",
      "setting": "Standing on a rain-slicked gargoyle whispering down to a corrupt mayor.",
      "name": "A superhero warning",
      "surface": "space"
    },
    "b": {
      "label": "A stern dental hygienist",
      "setting": "Adjusting the bright overhead lamp while holding a steel scraping pick.",
      "name": "A hygienist lecture",
      "surface": "mint"
    },
    "quality": 9.15,
    "battery": "pair-battery@2"
  },
  {
    "key": "therapist-bomb-defusal",
    "a": {
      "label": "A therapist",
      "setting": "Soft voice in a quiet office, looking at a patient gripping their hands tight.",
      "name": "A therapy session",
      "surface": "fog"
    },
    "b": {
      "label": "A technician over radio",
      "setting": "Speaking to an agent kneeling inches away from ticking wires under a table.",
      "name": "Bomb defusal instructions",
      "surface": "oxblood"
    },
    "quality": 9.15,
    "battery": "pair-battery@2"
  },
  {
    "key": "volcano-fine-print",
    "a": {
      "label": "A volcanologist issuing a seismic bulletin",
      "setting": "Reading pressure gauges at the observatory rim while ground tremors shake the monitors.",
      "name": "A volcanic alert",
      "surface": "oxblood"
    },
    "b": {
      "label": "A narrator reading terms at the end of a commercial",
      "setting": "Rapidly reciting mandatory disclosures at the very end of an energetic television spot.",
      "name": "Legal disclaimers",
      "surface": "paper"
    },
    "quality": 9.15,
    "battery": "pair-battery@2"
  },
  {
    "key": "kindergarten-drill-sergeant",
    "a": {
      "label": "Kindergarten teacher",
      "setting": "A bright classroom after free-play time as thirty toddlers scatter blocks across the rug.",
      "name": "A kindergarten rule",
      "surface": "butter"
    },
    "b": {
      "label": "Hostage negotiator",
      "setting": "Speaking over a megaphone toward a barricaded storefront surrounded by police tape.",
      "name": "A hostage negotiation",
      "surface": "navy"
    },
    "quality": 9.14,
    "battery": "pair-battery@2"
  },
  {
    "key": "knight-oath-intern",
    "a": {
      "label": "A weary medieval knight",
      "setting": "Kneeling in bloodied armor before a new liege lord in the Great Hall.",
      "name": "A knight's loyalty oath",
      "surface": "graphite"
    },
    "b": {
      "label": "An eager first-day intern",
      "setting": "Nodding earnestly beside a manager's desk during morning onboarding.",
      "name": "An unpaid intern intro",
      "surface": "butter"
    },
    "quality": 9.14,
    "battery": "pair-battery@2"
  },
  {
    "key": "parent-hostage",
    "a": {
      "label": "An exhausted parent",
      "setting": "Negotiating with a screaming toddler refusing to put shoes on.",
      "name": "Toddler negotiation",
      "surface": "peach"
    },
    "b": {
      "label": "A bank robber",
      "setting": "Shouting through the glass doors at the tactical team outside.",
      "name": "A bank standoff",
      "surface": "graphite"
    },
    "quality": 9.14,
    "battery": "pair-battery@2"
  },
  {
    "key": "sonar-and-shopper",
    "a": {
      "label": "A submarine sonar technician",
      "setting": "Speaking into a headset under red battle lights as an unidentified vessel approaches.",
      "name": "Sonar contact alert",
      "surface": "space"
    },
    "b": {
      "label": "A Black Friday line monitor",
      "setting": "Shouting into a megaphone at restless shoppers waiting outside sliding glass doors.",
      "name": "Store opening crowd control",
      "surface": "apricot"
    },
    "quality": 9.14,
    "battery": "pair-battery@2"
  },
  {
    "key": "sub-dive-yoga",
    "a": {
      "label": "A submarine captain",
      "setting": "Spoken into the comms as the sub descends into pitch-black waters.",
      "name": "Submarine dive command",
      "surface": "navy"
    },
    "b": {
      "label": "A yoga instructor",
      "setting": "Guiding a quiet class in dim studio light on an exhale.",
      "name": "A yoga cue",
      "surface": "peach"
    },
    "quality": 9.14,
    "battery": "pair-battery@2"
  },
  {
    "key": "croupier-confession",
    "a": {
      "label": "A roulette dealer",
      "setting": "Announced clearly over the green felt as the silver ball begins to drop into the wheel.",
      "name": "A roulette call",
      "surface": "forest"
    },
    "b": {
      "label": "A murder mystery detective",
      "setting": "Addressing the gathered suspects in the parlor as the parlor doors are locked shut.",
      "name": "The drawing room reveal",
      "surface": "oxblood"
    },
    "quality": 9.13,
    "battery": "pair-battery@2"
  },
  {
    "key": "museum-bomb",
    "a": {
      "label": "A museum docent",
      "setting": "Guiding a quiet group past fragile glass cases of ancient relics.",
      "name": "Museum docent tour",
      "surface": "paper"
    },
    "b": {
      "label": "A bomb technician",
      "setting": "Whispering instructions over radio while crouched over a ticking device.",
      "name": "Defusing a bomb",
      "surface": "oxblood"
    },
    "quality": 9.13,
    "battery": "pair-battery@2"
  },
  {
    "key": "storm-warning-wedding",
    "a": {
      "label": "A weather anchor",
      "setting": "Pointing at radar sweeps on live TV as a dark front approaches the coast.",
      "name": "A hurricane warning",
      "surface": "navy"
    },
    "b": {
      "label": "A nervous groom",
      "setting": "Whispering to his best man moments before the chapel doors open.",
      "name": "Pre-wedding jitters",
      "surface": "blush"
    },
    "quality": 9.13,
    "battery": "pair-battery@2"
  },
  {
    "key": "toddler-story-and-espionage",
    "a": {
      "label": "Exhausted babysitter",
      "setting": "Tucking a suspicious six-year-old under covers who insists there are monsters.",
      "name": "A bedtime reassurance",
      "surface": "sky"
    },
    "b": {
      "label": "Undercover operative",
      "setting": "Whispering into a hidden collar mic while sneaking through a foreign embassy.",
      "name": "An undercover transmission",
      "surface": "navy"
    },
    "quality": 9.13,
    "battery": "pair-battery@2"
  },
  {
    "key": "bootcamp-dentist",
    "a": {
      "label": "A drill sergeant",
      "setting": "Barked at a line of recruits standing stiffly in the mud at dawn.",
      "name": "A drill sergeant bark",
      "surface": "forest"
    },
    "b": {
      "label": "A pediatric dentist",
      "setting": "Hovering over an uneasy eight-year-old under the bright overhead lamp.",
      "name": "A dentist exam",
      "surface": "mint"
    },
    "quality": 9.12,
    "battery": "pair-battery@2"
  },
  {
    "key": "proposal-bomb",
    "a": {
      "label": "A nervous romantic",
      "setting": "A partner drops to one knee at a candlelit table, opening a small velvet box.",
      "name": "A marriage proposal",
      "surface": "blush"
    },
    "b": {
      "label": "A safe cracker whispering to a partner",
      "setting": "A thief kneels by a ticking vault lock, hands trembling as tumblers click.",
      "name": "Cracking the safe",
      "surface": "ink"
    },
    "quality": 9.12,
    "battery": "pair-battery@2"
  },
  {
    "key": "pulpit-performance-review",
    "a": {
      "label": "Preacher speaking from the pulpit",
      "setting": "Sunlight streams through stained glass as voices hush before the morning sermon.",
      "name": "A Sunday sermon",
      "surface": "butter"
    },
    "b": {
      "label": "Executive delivering an all-hands address",
      "setting": "Standing on stage at a corporate retreat under cold blue spotlights.",
      "name": "A CEO's town hall",
      "surface": "sea"
    },
    "quality": 9.12,
    "battery": "pair-battery@2"
  },
  {
    "key": "slasher-referee",
    "a": {
      "label": "A masked slasher in a horror movie",
      "setting": "Rumbled slowly from the shadows of an abandoned summer camp cabin.",
      "name": "Slasher movie villain",
      "surface": "ink"
    },
    "b": {
      "label": "A kindergarten teacher at recess",
      "setting": "Calling out firmly across a playground as children scatter everywhere.",
      "name": "Playground rules callout",
      "surface": "rose"
    },
    "quality": 9.12,
    "battery": "pair-battery@2"
  },
  {
    "key": "witch-and-sommelier",
    "a": {
      "label": "A fairytale witch",
      "setting": "A witch offers a glowing flask to a desperate young traveler at twilight.",
      "name": "A witch's potion offer",
      "surface": "moss"
    },
    "b": {
      "label": "A fine-dining sommelier",
      "setting": "A sommelier pours a tasting pour for a patron at a high-end restaurant.",
      "name": "A sommelier's recommendation",
      "surface": "oxblood"
    },
    "quality": 9.12,
    "battery": "pair-battery@2"
  },
  {
    "key": "judge-sentencing-breakup-text",
    "a": {
      "label": "A stern judge",
      "setting": "Gavel resting on the bench, speaking from on high to the convicted party.",
      "name": "A courtroom sentencing",
      "surface": "paper"
    },
    "b": {
      "label": "An exhausted ex",
      "setting": "Typing a final block of text before blocking a contact number forever.",
      "name": "A goodbye text",
      "surface": "plum"
    },
    "quality": 9.11,
    "battery": "pair-battery@2"
  },
  {
    "key": "pyro-ceremony",
    "a": {
      "label": "A lead pyrotechnician",
      "setting": "Directing the staging crew moments before lighting stadium fireworks.",
      "name": "Pyrotechnics countdown",
      "surface": "ink"
    },
    "b": {
      "label": "A somber groundskeeper",
      "setting": "Guiding mourners into position before lowering the family vault into earth.",
      "name": "A burial service",
      "surface": "fog"
    },
    "quality": 9.11,
    "battery": "pair-battery@2"
  },
  {
    "key": "smart-speaker-and-oracle",
    "a": {
      "label": "A smart home assistant",
      "setting": "A glowing cylinder chiming from the kitchen counter at 2 a.m.",
      "name": "Smart speaker error",
      "surface": "sky"
    },
    "b": {
      "label": "A Delphic priestess",
      "setting": "Chanting cryptically over rising sulfur smoke to a terrified general.",
      "name": "An ancient prophecy",
      "surface": "fog"
    },
    "quality": 9.11,
    "battery": "pair-battery@2"
  },
  {
    "key": "anesthesia-heist",
    "a": {
      "label": "An anesthesiologist adjusting the mask",
      "setting": "Spoken softly to a patient right before the surgery begins.",
      "name": "Anesthesia prep",
      "surface": "fog"
    },
    "b": {
      "label": "A cat burglar coaching a rookie",
      "setting": "Whispered behind a security desk while bypassing laser sensors.",
      "name": "A safecracker guide",
      "surface": "graphite"
    },
    "quality": 9.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "bedtime-negotiation-arms-summit",
    "a": {
      "label": "A desperate father",
      "setting": "Bargaining through a cracked bedroom door with a five-year-old holding a flashlight.",
      "name": "Bedtime negotiations",
      "surface": "rose"
    },
    "b": {
      "label": "A chief peace diplomat",
      "setting": "Drafting treaty stipulations across a neutral conference table with rival ambassadors.",
      "name": "An arms control summit",
      "surface": "forest"
    },
    "quality": 9.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "drill-yoga",
    "a": {
      "label": "A drill sergeant",
      "setting": "Shouting down at recruits struggling through an icy mud obstacle course at dawn.",
      "name": "Boot camp drill",
      "surface": "oxblood"
    },
    "b": {
      "label": "A serene yoga instructor",
      "setting": "Murmuring softly over chime music to a packed studio holding a deep stretch.",
      "name": "A yoga cue",
      "surface": "mint"
    },
    "quality": 9.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "helpdesk-exorcism",
    "a": {
      "label": "A tier-one IT support agent",
      "setting": "Walking an exasperated customer through clearing a stubborn corrupted drive.",
      "name": "Tech support script",
      "surface": "sky"
    },
    "b": {
      "label": "A priest during a cleansing",
      "setting": "Chanting ancient rites over a shuddering room to drive out an unwelcome presence.",
      "name": "An exorcism rite",
      "surface": "plum"
    },
    "quality": 9.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-and-detective",
    "a": {
      "label": "An annoyed roommate",
      "setting": "Confronting someone in the shared kitchen over half-empty cartons on the counter.",
      "name": "Passive aggressive fridge note",
      "surface": "lime"
    },
    "b": {
      "label": "A police detective",
      "setting": "Questioning a suspect in an interrogation room about evidence left at the scene.",
      "name": "Crime scene grilling",
      "surface": "ink"
    },
    "quality": 9.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "salon-heist",
    "a": {
      "label": "Hair stylist to client",
      "setting": "Standing behind the chair with scissors raised, checking the mirror.",
      "name": "A hair consultation",
      "surface": "blush"
    },
    "b": {
      "label": "Safecracker to partner",
      "setting": "Whispering in the dark bank basement while tension mounts.",
      "name": "A heist preparation",
      "surface": "ink"
    },
    "quality": 9.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "submarine-depth-spa-treatment",
    "a": {
      "label": "a sonar technician over the comms",
      "setting": "Submarine crew member tracking hull integrity as they plunge past crush depth.",
      "name": "Submarine depth alert",
      "surface": "space"
    },
    "b": {
      "label": "a luxury aesthetician whispering",
      "setting": "Spa worker applying a heated facial mask to a relaxed client.",
      "name": "A luxury spa treatment",
      "surface": "cream"
    },
    "quality": 9.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "bank-heist-instruction",
    "a": {
      "label": "A loan officer",
      "setting": "Politely sliding a denial document across a mahogany desk to an applicant.",
      "name": "Loan rejection letter",
      "surface": "paper"
    },
    "b": {
      "label": "A mountain climbing guide",
      "setting": "Shouting over gale winds at a steep icy ledge to a frozen climber.",
      "name": "Alpine guide warning",
      "surface": "space"
    },
    "quality": 9.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "elevator-inspection-romance",
    "a": {
      "label": "An elevator safety technician",
      "setting": "Reading load capacity and wire rope tension specs off a metal clipboard.",
      "name": "Elevator inspection report",
      "surface": "navy"
    },
    "b": {
      "label": "A romantic partner",
      "setting": "Discussing future life plans late at night on a quiet porch swing.",
      "name": "Long term relationship talk",
      "surface": "rose"
    },
    "quality": 9.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "first-date-spy-interview",
    "a": {
      "label": "An anxious romantic on a blind date",
      "setting": "Said across a candlelit bistro table while trying to sound charming.",
      "name": "Blind date banter",
      "surface": "blush"
    },
    "b": {
      "label": "A counterintelligence officer vetting an asset",
      "setting": "Said across a sterile table under fluorescent lights during an intake screening.",
      "name": "A security clearance interview",
      "surface": "navy"
    },
    "quality": 9.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "pet-adoption-ransom-delivery",
    "a": {
      "label": "An animal shelter volunteer",
      "setting": "Spoken through chain-link kennels to prospective adopters kneeling before an eager golden retriever.",
      "name": "A shelter adoption",
      "surface": "apricot"
    },
    "b": {
      "label": "An art thief broker",
      "setting": "Spoken through burner phones in a foggy parking garage before swapping canvas for unmarked cash.",
      "name": "A stolen art exchange",
      "surface": "fog"
    },
    "quality": 9.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "preacher-pilot",
    "a": {
      "label": "A storm chaser",
      "setting": "Shouted into a handheld radio from a bouncing van as the funnel touches down.",
      "name": "Tornado chaser alert",
      "surface": "graphite"
    },
    "b": {
      "label": "A revival preacher",
      "setting": "Roared into a microphone under a humid tent as the choir swells behind you.",
      "name": "A tent revival sermon",
      "surface": "butter"
    },
    "quality": 9.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "sub-dive-prep",
    "a": {
      "label": "A deep sea captain",
      "setting": "Ordering the crew to seal hatches and brace as the submarine plunges into the abyss.",
      "name": "Submarine dive command",
      "surface": "sea"
    },
    "b": {
      "label": "A yoga instructor",
      "setting": "Leading a packed studio into the deepest stretch at the end of a long class.",
      "name": "Yoga cool down",
      "surface": "butter"
    },
    "quality": 9.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "harvest-advice-creature-feature",
    "a": {
      "label": "An experienced orchard owner",
      "setting": "Instructing seasonal pickers under the midday sun in early autumn.",
      "name": "Farm harvest instructions",
      "surface": "apricot"
    },
    "b": {
      "label": "A survivalist mentor",
      "setting": "Briefing a frightened squad before night falls in monster territory.",
      "name": "A monster hunt briefing",
      "surface": "oxblood"
    },
    "quality": 9.08,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-dishes-detective-interrogation",
    "a": {
      "label": "A fed-up roommate",
      "setting": "Said across the messy kitchen counter while pointing at the full sink.",
      "name": "A roommate confrontation",
      "surface": "butter"
    },
    "b": {
      "label": "A homicide detective",
      "setting": "Said under a flickering bulb while tapping photos on the metal table.",
      "name": "A police interrogation",
      "surface": "oxblood"
    },
    "quality": 9.08,
    "battery": "pair-battery@2"
  },
  {
    "key": "passive-aggressive-neighbor-space-capsule",
    "a": {
      "label": "An exasperated neighbor",
      "setting": "A laminated note taped to the shared hallway wall by the mailboxes.",
      "name": "Hallway notice",
      "surface": "paper"
    },
    "b": {
      "label": "An astronaut to mission control",
      "setting": "Transmitting across deep space from an increasingly cramped module.",
      "name": "Deep space log",
      "surface": "space"
    },
    "quality": 9.07,
    "battery": "pair-battery@2"
  },
  {
    "key": "smart-thermostat-arctic-expedition",
    "a": {
      "label": "A smart home alert",
      "setting": "Flashing a crisp automated notification across a living room display tablet.",
      "name": "Thermostat alert",
      "surface": "sky"
    },
    "b": {
      "label": "An Arctic trek leader",
      "setting": "Yelling through frozen furs to shivering explorers stranded in a whiteout.",
      "name": "Polar survival order",
      "surface": "navy"
    },
    "quality": 9.07,
    "battery": "pair-battery@2"
  },
  {
    "key": "auction-escape",
    "a": {
      "label": "Fine art auctioneer",
      "setting": "An auctioneer raises the gavel as bids soar past millions.",
      "name": "Fine art auction",
      "surface": "cream"
    },
    "b": {
      "label": "Prison break coordinator",
      "setting": "A ringleader checks the watch as the security sweep passes.",
      "name": "Prison break countdown",
      "surface": "ink"
    },
    "quality": 9.06,
    "battery": "pair-battery@2"
  },
  {
    "key": "pilot-and-toddler",
    "a": {
      "label": "An airline pilot",
      "setting": "Broadcast over the cabin PA as the plane encounters sudden severe chop.",
      "name": "Cockpit weather alert",
      "surface": "sky"
    },
    "b": {
      "label": "A preschool teacher",
      "setting": "Spoken calmly to a chaotic room of toddlers during indoor recess.",
      "name": "Preschool circle reminder",
      "surface": "apricot"
    },
    "quality": 9.06,
    "battery": "pair-battery@2"
  },
  {
    "key": "shipwreck-scuba-museum",
    "a": {
      "label": "An old sea captain",
      "setting": "Shouting through driving rain as the ship takes on seawater.",
      "name": "Abandon ship order",
      "surface": "sea"
    },
    "b": {
      "label": "A museum docent",
      "setting": "Addressing a tour group near fragile, ancient glass artifacts.",
      "name": "Museum tour guide",
      "surface": "lilac"
    },
    "quality": 9.06,
    "battery": "pair-battery@2"
  },
  {
    "key": "train-announcement-escape-room",
    "a": {
      "label": "Train conductor over the intercom",
      "setting": "Crackling speaker overhead as the passenger train slows down near an unfamiliar depot.",
      "name": "Train conductor announcement",
      "surface": "fog"
    },
    "b": {
      "label": "Escape room host over the speaker",
      "setting": "The timer on the wall ticks down to zero while players scramble through the locked study.",
      "name": "Escape room clue",
      "surface": "graphite"
    },
    "quality": 9.06,
    "battery": "pair-battery@2"
  },
  {
    "key": "vet-and-scifi",
    "a": {
      "label": "A veterinarian's discharge instructions",
      "setting": "Spoken to an anxious pet owner collecting their groggy dog after surgery.",
      "name": "Post-op vet instructions",
      "surface": "mint"
    },
    "b": {
      "label": "A mad scientist's lab warning",
      "setting": "Said to a trembling assistant standing near the containment vat.",
      "name": "Mad scientist's protocol",
      "surface": "oxblood"
    },
    "quality": 9.06,
    "battery": "pair-battery@2"
  },
  {
    "key": "clown-surgeon",
    "a": {
      "label": "A surgeon",
      "setting": "Spoken calmly through a paper mask to the scrub nurse under harsh operating lights.",
      "name": "Operating room command",
      "surface": "mint"
    },
    "b": {
      "label": "A stage magician",
      "setting": "Whispered behind a velvet curtain to your nervous assistant before the saw drops.",
      "name": "A magician's whisper",
      "surface": "plum"
    },
    "quality": 9.05,
    "battery": "pair-battery@2"
  },
  {
    "key": "haunted-house-tour",
    "a": {
      "label": "An EVP audio analyzer",
      "setting": "Whispered through headphones while reviewing static-heavy tape recorded in an attic.",
      "name": "A Ghost Hunter Log",
      "surface": "space"
    },
    "b": {
      "label": "A real estate agent showing a fixer-upper",
      "setting": "Cheerfully spoken to young home buyers while walking through a chilly hallway.",
      "name": "Fixer-Upper Walkthrough",
      "surface": "peach"
    },
    "quality": 9.05,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-fridge-detective",
    "a": {
      "label": "A passive roommate",
      "setting": "Confronting someone across the sticky kitchen counter at breakfast.",
      "name": "Roommate fridge confrontation",
      "surface": "mint"
    },
    "b": {
      "label": "A veteran detective",
      "setting": "Questioning a shaken suspect under harsh fluorescent precinct lights.",
      "name": "A murder interrogation",
      "surface": "ink"
    },
    "quality": 9.05,
    "battery": "pair-battery@2"
  },
  {
    "key": "vet-drill-sergeant-388",
    "a": {
      "label": "A vet calming an anxious pet",
      "setting": "Softly speaking to a trembling golden retriever up on the stainless steel exam table.",
      "name": "Veterinary checkup",
      "surface": "mint"
    },
    "b": {
      "label": "A drill sergeant on the field",
      "setting": "Barking at recruits standing in formation during their first grueling morning roll call.",
      "name": "Bootcamp roll call",
      "surface": "graphite"
    },
    "quality": 9.05,
    "battery": "pair-battery@2"
  },
  {
    "key": "crevasse-job-offer",
    "a": {
      "label": "A lead alpine rescuer",
      "setting": "Leaning over a deep glacier crack, rope in hand, shouting to a fallen partner.",
      "name": "An alpine crevasse rescue",
      "surface": "navy"
    },
    "b": {
      "label": "A corporate recruiter",
      "setting": "Pitching a desperate executive candidate during a discreet late-night phone call.",
      "name": "A high-stakes recruitment pitch",
      "surface": "cream"
    },
    "quality": 9.04,
    "battery": "pair-battery@2"
  },
  {
    "key": "crystal-and-corporate",
    "a": {
      "label": "A crystal ball medium",
      "setting": "Spoken in a velvet-draped parlor with palms resting on a smoky glass orb.",
      "name": "A crystal ball reading",
      "surface": "lilac"
    },
    "b": {
      "label": "A chief economist delivering a quarterly forecast",
      "setting": "Spoken beside a PowerPoint projection to a tense boardroom of executives.",
      "name": "An economic forecast",
      "surface": "paper"
    },
    "quality": 9.04,
    "battery": "pair-battery@2"
  },
  {
    "key": "flight-haunted",
    "a": {
      "label": "A flight attendant",
      "setting": "Speaking into the cabin microphone as the plane begins its descent into thick clouds.",
      "name": "Cabin crew pre-landing",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A medium in a seance",
      "setting": "Chanting softly around a candlelit parlor table while hands touch.",
      "name": "A seance warning",
      "surface": "space"
    },
    "quality": 9.04,
    "battery": "pair-battery@2"
  },
  {
    "key": "pirate-captain-estate-lawyer",
    "a": {
      "label": "A pirate captain reading terms",
      "setting": "Reading aloud the ship code to newly captured sailors on the rolling quarterdeck.",
      "name": "Pirate ship code",
      "surface": "oxblood"
    },
    "b": {
      "label": "An estate lawyer reading a will",
      "setting": "Addressing the gathered family members in a quiet, wood-paneled law office.",
      "name": "Reading the will",
      "surface": "paper"
    },
    "quality": 9.04,
    "battery": "pair-battery@2"
  },
  {
    "key": "car-trip-parent-countdown",
    "a": {
      "label": "An exhausted driver",
      "setting": "Shouting over their shoulder toward the backseat on hour six of highway driving.",
      "name": "A road trip warning",
      "surface": "apricot"
    },
    "b": {
      "label": "A bomb squad technician",
      "setting": "Speaking softly into a radio headset with wire cutters hovering over copper cables.",
      "name": "A bomb squad report",
      "surface": "oxblood"
    },
    "quality": 9.03,
    "battery": "pair-battery@2"
  },
  {
    "key": "credit-curse",
    "a": {
      "label": "An automated credit card fraud warning",
      "setting": "Delivered by a robotic monotone voice through an urgent phone call.",
      "name": "A credit alert call",
      "surface": "apricot"
    },
    "b": {
      "label": "A tavern barkeep recounting a legendary curse",
      "setting": "Leaning over the damp counter to warn an arrogant traveling knight.",
      "name": "A cursed relic tale",
      "surface": "moss"
    },
    "quality": 9.03,
    "battery": "pair-battery@2"
  },
  {
    "key": "dating-profile-museum-docent",
    "a": {
      "label": "A hopeful dater writing a bio",
      "setting": "Typing three short paragraphs into a smartphone to attract a match.",
      "name": "A dating app bio",
      "surface": "blush"
    },
    "b": {
      "label": "A museum docent leading a tour",
      "setting": "Pausing before a centuries-old cracked marble bust with a tour group.",
      "name": "A museum tour talk",
      "surface": "navy"
    },
    "quality": 9.02,
    "battery": "pair-battery@2"
  },
  {
    "key": "museum-curator-and-crime-scene",
    "a": {
      "label": "A museum curator giving a VIP tour",
      "setting": "Guiding a donor through a roped-off gallery of ancient artifacts.",
      "name": "A museum walkthrough",
      "surface": "paper"
    },
    "b": {
      "label": "A forensic investigator",
      "setting": "Whispering to a rookie detective beneath flashing blue lights in a roped alley.",
      "name": "A crime scene walkthrough",
      "surface": "navy"
    },
    "quality": 9.02,
    "battery": "pair-battery@2"
  },
  {
    "key": "catering-interrogation",
    "a": {
      "label": "A wedding planner",
      "setting": "Whispering sternly with a clipboard to an anxious couple six weeks before the big day.",
      "name": "Seating chart crisis",
      "surface": "blush"
    },
    "b": {
      "label": "A counter-intelligence officer",
      "setting": "Leaning across a metal table under a bare bulb, tapping a folder of photographs.",
      "name": "Spies under interrogation",
      "surface": "graphite"
    },
    "quality": 9.01,
    "battery": "pair-battery@2"
  },
  {
    "key": "jackpot-and-salvation",
    "a": {
      "label": "A breathless lottery announcer",
      "setting": "Speaking live into the camera as the golden balls bounce in the glass sphere.",
      "name": "A lottery drawing",
      "surface": "apricot"
    },
    "b": {
      "label": "A zealous street preacher",
      "setting": "Shouting over traffic on a crowded sidewalk holding a handwritten cardboard sign.",
      "name": "A street preacher's call",
      "surface": "ink"
    },
    "quality": 9.01,
    "battery": "pair-battery@2"
  },
  {
    "key": "post-office-executioner",
    "a": {
      "label": "A postal clerk",
      "setting": "Stamping boxes behind a counter with an impatient holiday queue watching.",
      "name": "Post office counter notice",
      "surface": "butter"
    },
    "b": {
      "label": "A medieval royal executioner",
      "setting": "Reading aloud the final decree to the prisoner kneeling on the scaffold.",
      "name": "The executioner's decree",
      "surface": "ink"
    },
    "quality": 9.01,
    "battery": "pair-battery@2"
  },
  {
    "key": "sommelier-and-exorcist",
    "a": {
      "label": "A sommelier",
      "setting": "Swirling a crystal glass beside an opulent table in a candlelit cellar.",
      "name": "A wine tasting",
      "surface": "oxblood"
    },
    "b": {
      "label": "A paranormal investigator",
      "setting": "Whispering into a thermal camera while cold air suddenly fills the hallway.",
      "name": "A ghost hunt",
      "surface": "fog"
    },
    "quality": 9.01,
    "battery": "pair-battery@2"
  },
  {
    "key": "baptism-and-scuba",
    "a": {
      "label": "A pastor conducting baptism",
      "setting": "Wading waist-deep in the sanctuary basin, speaking softly to the nervous believer.",
      "name": "Baptism blessing",
      "surface": "cream"
    },
    "b": {
      "label": "A dive instructor's prep",
      "setting": "Sitting on the edge of the boat deck, checking a beginner's regulator hose.",
      "name": "Scuba dive prep",
      "surface": "sea"
    },
    "quality": 8.99,
    "battery": "pair-battery@2"
  },
  {
    "key": "magician-doctor",
    "a": {
      "label": "A stage illusionist",
      "setting": "Addressing a captivated theater audience just before performing a dangerous illusion.",
      "name": "A magician's patter",
      "surface": "ink"
    },
    "b": {
      "label": "A surgeon",
      "setting": "Calming an anxious patient in the pre-op holding area before anesthesia takes effect.",
      "name": "Pre-surgery comfort",
      "surface": "sea"
    },
    "quality": 8.99,
    "battery": "pair-battery@2"
  },
  {
    "key": "respawn-triage",
    "a": {
      "label": "The video game tutorial voice",
      "setting": "Text flashing onscreen as a new player spawns into a brutal battle arena.",
      "name": "A tutorial prompt",
      "surface": "lime"
    },
    "b": {
      "label": "An emergency room nurse",
      "setting": "Checking vitals on a groggy patient waking up on a gurney behind blue curtains.",
      "name": "An ER assessment",
      "surface": "fog"
    },
    "quality": 8.99,
    "battery": "pair-battery@2"
  },
  {
    "key": "spy-dead-drop-pet-sitter",
    "a": {
      "label": "An undercover agent",
      "setting": "Muttered into a collar mic while slipping an envelope under a bench.",
      "name": "A spy dead drop",
      "surface": "forest"
    },
    "b": {
      "label": "A nervous pet sitter",
      "setting": "Texted to an anxious owner who left very detailed instructions.",
      "name": "Pet sitter update",
      "surface": "lime"
    },
    "quality": 8.99,
    "battery": "pair-battery@2"
  },
  {
    "key": "wild-west-boss",
    "a": {
      "label": "A gunslinger calling out a rival",
      "setting": "Dust swirling in the noon heat of main street as you face down your old partner.",
      "name": "A high noon showdown",
      "surface": "apricot"
    },
    "b": {
      "label": "A middle manager kicking off a team check-in",
      "setting": "Fluorescent lights humming in the conference room as two departments dispute ownership.",
      "name": "A corporate sync",
      "surface": "fog"
    },
    "quality": 8.99,
    "battery": "pair-battery@2"
  },
  {
    "key": "curse-palm-reading",
    "a": {
      "label": "Mystic reading a customer's hand",
      "setting": "Incense smoke drifts over velvet as fingertips trace a faint, jagged line.",
      "name": "A palm reader's revelation",
      "surface": "plum"
    },
    "b": {
      "label": "Clerk inspecting an old passport",
      "setting": "Under buzzing fluorescent tubes at an empty border station late at night.",
      "name": "A passport control query",
      "surface": "paper"
    },
    "quality": 8.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandma-prison",
    "a": {
      "label": "A doting grandmother",
      "setting": "At the kitchen table, spooning a second giant portion onto a visitor's plate.",
      "name": "Grandmother's supper",
      "surface": "peach"
    },
    "b": {
      "label": "A stern prison warden",
      "setting": "Standing over an inmate in the mess hall during lockdown inspection.",
      "name": "Prison warden decree",
      "surface": "navy"
    },
    "quality": 8.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandparent-parole",
    "a": {
      "label": "A doting grandmother",
      "setting": "Spoken tenderly from an armchair as a grandchild packs up to leave after Sunday dinner.",
      "name": "Grandma's sendoff",
      "surface": "butter"
    },
    "b": {
      "label": "A parole officer",
      "setting": "Spoken sternly across a metal desk at the end of a mandatory monthly check-in.",
      "name": "A parole meeting",
      "surface": "graphite"
    },
    "quality": 8.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "volcano-complaint",
    "a": {
      "label": "A volcanologist",
      "setting": "Broadcasting an urgent radio warning as magma sensors spike on the peak.",
      "name": "Volcano evacuation order",
      "surface": "oxblood"
    },
    "b": {
      "label": "A store manager",
      "setting": "Dealing with an increasingly furious patron shouting at the service counter.",
      "name": "De-escalating a customer",
      "surface": "sky"
    },
    "quality": 8.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "barista-eviction",
    "a": {
      "label": "A boutique cafe manager",
      "setting": "Tapping a customer on the shoulder at a corner table with an empty mug.",
      "name": "A cafe closing call",
      "surface": "apricot"
    },
    "b": {
      "label": "A county sheriff",
      "setting": "Standing on a porch handing formal paperwork to a startled tenant.",
      "name": "An eviction notice",
      "surface": "fog"
    },
    "quality": 8.97,
    "battery": "pair-battery@2"
  },
  {
    "key": "hair-stylist-sculptor",
    "a": {
      "label": "A chic hair stylist",
      "setting": "A stylist spins a nervous client toward the mirror with a pair of shears poised.",
      "name": "A dramatic makeover",
      "surface": "peach"
    },
    "b": {
      "label": "A royal executioner",
      "setting": "A cloaked figure adjusts an iron collar around a condemned noble on the scaffold.",
      "name": "The execution block",
      "surface": "oxblood"
    },
    "quality": 8.97,
    "battery": "pair-battery@2"
  },
  {
    "key": "news-haunting",
    "a": {
      "label": "A breaking news anchor",
      "setting": "Spoken into the studio camera as an urgent red graphic flashes.",
      "name": "Breaking news report",
      "surface": "navy"
    },
    "b": {
      "label": "An abandoned house warning",
      "setting": "Scrawled in charcoal across a rotten wooden front door.",
      "name": "A haunted warning",
      "surface": "fog"
    },
    "quality": 8.97,
    "battery": "pair-battery@2"
  },
  {
    "key": "postal-clerk-mafia-threat",
    "a": {
      "label": "A deadpan postal clerk",
      "setting": "Weighing an unmarked cardboard parcel behind bulletproof acrylic glass.",
      "name": "The parcel drop-off",
      "surface": "cream"
    },
    "b": {
      "label": "A mob enforcer",
      "setting": "Leaning over a desk in a dark back room, pointing at a wrapped cardboard box.",
      "name": "A mob warning",
      "surface": "ink"
    },
    "quality": 8.97,
    "battery": "pair-battery@2"
  },
  {
    "key": "cable-frontier",
    "a": {
      "label": "A support agent",
      "setting": "On a headset in a call center, trying to calm down a frustrated subscriber.",
      "name": "Customer service call",
      "surface": "butter"
    },
    "b": {
      "label": "A frontier sheriff",
      "setting": "Standing on a dusty main street at high noon, facing down an armed drifter.",
      "name": "A wild west standoff",
      "surface": "oxblood"
    },
    "quality": 8.96,
    "battery": "pair-battery@2"
  },
  {
    "key": "loan-officer-haunted",
    "a": {
      "label": "A commercial loan officer",
      "setting": "A banker presses a heavy fountain pen toward hopeful small-business owners across the mahogany desk.",
      "name": "A mortgage closing",
      "surface": "forest"
    },
    "b": {
      "label": "A ghost tour guide",
      "setting": "A lantern-bearer stops the group before the rusted iron gates of an abandoned asylum.",
      "name": "A ghost tour warning",
      "surface": "plum"
    },
    "quality": 8.96,
    "battery": "pair-battery@2"
  },
  {
    "key": "pilot-fortune",
    "a": {
      "label": "An airline captain over the PA",
      "setting": "Calm captain speaking to weary passengers over the cabin intercom mid-flight.",
      "name": "A captain's cabin update",
      "surface": "sky"
    },
    "b": {
      "label": "A fortune cookie slip",
      "setting": "A small printed slip tucked inside a crisp cookie cracked open after dinner.",
      "name": "A fortune cookie",
      "surface": "butter"
    },
    "quality": 8.96,
    "battery": "pair-battery@2"
  },
  {
    "key": "boss-layoff-astronaut",
    "a": {
      "label": "A corporate executive",
      "setting": "Speaking stiffly to dozens of employees over a one-way video broadcast.",
      "name": "A mass layoff speech",
      "surface": "paper"
    },
    "b": {
      "label": "A damaged vessel captain",
      "setting": "Addressing the surviving crew as oxygen reserves deplete in deep space.",
      "name": "Rationing life support",
      "surface": "space"
    },
    "quality": 8.95,
    "battery": "pair-battery@2"
  },
  {
    "key": "compost-and-evidence",
    "a": {
      "label": "An organic compost expert",
      "setting": "Explaining the breakdown pile to a community garden workshop group.",
      "name": "Composting instructions",
      "surface": "moss"
    },
    "b": {
      "label": "A seasoned crime scene cleaner",
      "setting": "Instructing a rookie in rubber boots behind yellow police tape.",
      "name": "Crime scene cleanup",
      "surface": "oxblood"
    },
    "quality": 8.95,
    "battery": "pair-battery@2"
  },
  {
    "key": "dough-and-demolition",
    "a": {
      "label": "A master baker coaching an apprentice",
      "setting": "Spoken beside a flour-dusted marble counter at 4 a.m. while shaping sourdough.",
      "name": "A sourdough lesson",
      "surface": "butter"
    },
    "b": {
      "label": "A bomb technician over radio",
      "setting": "Spoken into an earpiece while guiding a rookie toward a live wire.",
      "name": "Bomb squad guidance",
      "surface": "graphite"
    },
    "quality": 8.95,
    "battery": "pair-battery@2"
  },
  {
    "key": "drunk-text-and-monarch",
    "a": {
      "label": "A regretful texter",
      "setting": "Typing illuminated under bedcovers at two in the morning after a party.",
      "name": "A late-night text",
      "surface": "rose"
    },
    "b": {
      "label": "An abdicated monarch",
      "setting": "Reading an official royal declaration to an assembled parliament.",
      "name": "A royal abdication",
      "surface": "oxblood"
    },
    "quality": 8.95,
    "battery": "pair-battery@2"
  },
  {
    "key": "pirate-toast-order",
    "a": {
      "label": "A pirate captain",
      "setting": "Roared over wooden flagons in a tavern full of cutthroats after a massive haul.",
      "name": "A pirate's toast",
      "surface": "oxblood"
    },
    "b": {
      "label": "A neighborhood ice cream truck driver",
      "setting": "Leaning out the sliding glass service window toward an impatient swarm of children.",
      "name": "An ice cream vendor",
      "surface": "butter"
    },
    "quality": 8.95,
    "battery": "pair-battery@2"
  },
  {
    "key": "map-riddle-tech-support",
    "a": {
      "label": "A cryptic treasure parchment note",
      "setting": "Faded ink scrawled beneath an X on centuries-old parchment.",
      "name": "A pirate map riddle",
      "surface": "paper"
    },
    "b": {
      "label": "A software installation wizard prompt",
      "setting": "A dialogue box popping up on screen during an advanced manual setup.",
      "name": "An installation prompt",
      "surface": "sky"
    },
    "quality": 8.94,
    "battery": "pair-battery@2"
  },
  {
    "key": "passive-aggressive-spies",
    "a": {
      "label": "An annoyed next-door neighbor",
      "setting": "Taping a sharp handwritten note directly onto the shared hallway door.",
      "name": "A passive-aggressive note",
      "surface": "butter"
    },
    "b": {
      "label": "A border patrol interrogator",
      "setting": "Reviewing security footage across a metal desk from a suspicious traveler.",
      "name": "Border interrogation",
      "surface": "graphite"
    },
    "quality": 8.94,
    "battery": "pair-battery@2"
  },
  {
    "key": "sommelier-apology",
    "a": {
      "label": "A haughty sommelier",
      "setting": "Sniffing a freshly pulled cork at a Michelin-starred dining room table.",
      "name": "A sommelier decanting",
      "surface": "plum"
    },
    "b": {
      "label": "A defensive partner",
      "setting": "Standing in a quiet kitchen trying to smooth over a botched anniversary dinner.",
      "name": "A strained apology",
      "surface": "rose"
    },
    "quality": 8.94,
    "battery": "pair-battery@2"
  },
  {
    "key": "tech-support-curse",
    "a": {
      "label": "A tier-one support tech",
      "setting": "Speaking through a headset to a frustrated caller with an unresponsive device.",
      "name": "A tech support call",
      "surface": "paper"
    },
    "b": {
      "label": "An ancient sorcerer",
      "setting": "Speaking across a stone altar to a foolish mortal begging for relief.",
      "name": "A curse breaking ritual",
      "surface": "space"
    },
    "quality": 8.94,
    "battery": "pair-battery@2"
  },
  {
    "key": "wild-west-preschool",
    "a": {
      "label": "A dusty sheriff",
      "setting": "Staring down an outlaw at high noon in front of the saloon doors.",
      "name": "A high noon showdown",
      "surface": "apricot"
    },
    "b": {
      "label": "A weary babysitter",
      "setting": "Standing in the doorway as a screaming toddler brandishes a wooden spoon.",
      "name": "Toddler bedtime standoff",
      "surface": "butter"
    },
    "quality": 8.94,
    "battery": "pair-battery@2"
  },
  {
    "key": "birthday-clown-interrogation",
    "a": {
      "label": "A hired entertainer trying to manage twenty sugared children",
      "setting": "Shouted over pop music in a noisy suburban living room strewn with confetti.",
      "name": "A kids birthday party",
      "surface": "butter"
    },
    "b": {
      "label": "A hard-boiled detective confronting a slippery witness",
      "setting": "Spoken through stale cigarette smoke in a dim precinct backroom.",
      "name": "A murder interrogation",
      "surface": "graphite"
    },
    "quality": 8.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "casino-roulette-parental-timeout",
    "a": {
      "label": "A casino croupier",
      "setting": "Spoken over the spinning wheel as chips clatter onto the green felt table.",
      "name": "A roulette dealer's call",
      "surface": "oxblood"
    },
    "b": {
      "label": "A strict parent",
      "setting": "Spoken down at a defiant child standing by the bottom stair after a major tantrum.",
      "name": "A parental timeout",
      "surface": "fog"
    },
    "quality": 8.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "depth-and-cash",
    "a": {
      "label": "A submarine dive officer",
      "setting": "Calling out depth readings through the control room as the hull groans under pressure.",
      "name": "Submarine dive call",
      "surface": "navy"
    },
    "b": {
      "label": "A high-stakes casino player",
      "setting": "Whispering across the velvet table to a friend before sliding every chip forward.",
      "name": "High roller wager",
      "surface": "butter"
    },
    "quality": 8.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "exorcism-front-desk",
    "a": {
      "label": "A solemn priest",
      "setting": "A priest commands a thrashing, demonic entity to vacate a victim's bedroom.",
      "name": "A ritual exorcism",
      "surface": "ink"
    },
    "b": {
      "label": "A hotel front desk clerk",
      "setting": "A front desk clerk confronts a loud, unruly guest refusing to leave the lobby.",
      "name": "A hotel eviction notice",
      "surface": "apricot"
    },
    "quality": 8.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandparent-candy-secret-agent",
    "a": {
      "label": "A conspiratorial grandmother",
      "setting": "Pressing a folded bill and peppermint into her grandchild's palm unseen.",
      "name": "A grandparent bribe",
      "surface": "rose"
    },
    "b": {
      "label": "A spy handler",
      "setting": "Passing microfilm across a park bench during a cold war dead drop.",
      "name": "A covert asset drop",
      "surface": "ink"
    },
    "quality": 8.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "maitre-d-crypt",
    "a": {
      "label": "An elite restaurant maitre d'",
      "setting": "Greeting a tuxedoed couple at the heavy brass velvet ropes.",
      "name": "Posh maitre d'",
      "surface": "cream"
    },
    "b": {
      "label": "An ancient crypt keeper",
      "setting": "Holding an iron lantern before stone stairs leading underground.",
      "name": "Crypt keeper warning",
      "surface": "space"
    },
    "quality": 8.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "ring-and-referee",
    "a": {
      "label": "A best man",
      "setting": "Whispering frantically into the groom's ear moments before walking out.",
      "name": "Best man whisper",
      "surface": "blush"
    },
    "b": {
      "label": "A boxing cornerman",
      "setting": "Shouting over the roaring crowd as round twelve begins.",
      "name": "Cornerman pep talk",
      "surface": "oxblood"
    },
    "quality": 8.93,
    "battery": "pair-battery@2"
  },
  {
    "key": "dragon-bank",
    "a": {
      "label": "An ancient dragon guarding a hoard",
      "setting": "Rumbling deep in a subterranean cavern, smoke drifting toward an intruder.",
      "name": "A dragon's warning",
      "surface": "oxblood"
    },
    "b": {
      "label": "A private wealth banker",
      "setting": "Speaking politely across a polished mahogany desk to a nervous client.",
      "name": "A wealth manager's advice",
      "surface": "cream"
    },
    "quality": 8.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "elevator-space",
    "a": {
      "label": "An automated building voice",
      "setting": "Chiming through speakers inside an express glass lift rocketing past fifty stories.",
      "name": "An elevator chime announcement",
      "surface": "sky"
    },
    "b": {
      "label": "Mission control Capcom",
      "setting": "Speaking to astronauts through static during the final atmospheric ascent.",
      "name": "A spacecraft climb callout",
      "surface": "space"
    },
    "quality": 8.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "eruption-and-breakup",
    "a": {
      "label": "A volcanologist",
      "setting": "Urgent briefing to the evacuation team as seismic tremors spike near the crater rim.",
      "name": "A volcano evacuation alert",
      "surface": "oxblood"
    },
    "b": {
      "label": "An exhausted partner",
      "setting": "Quietly packing a suitcase in the hallway while the other person keeps yelling.",
      "name": "Walking out mid argument",
      "surface": "fog"
    },
    "quality": 8.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "museum-horror",
    "a": {
      "label": "A museum audio guide narrator",
      "setting": "Heard through headphones as visitors step into a quiet, darkened exhibit hall.",
      "name": "Museum audio guide",
      "surface": "fog"
    },
    "b": {
      "label": "The sole survivor in a horror film",
      "setting": "Whispered into a radio to rescuers while hiding in the basement from a monster.",
      "name": "Final girl warning",
      "surface": "oxblood"
    },
    "quality": 8.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "surf-coach",
    "a": {
      "label": "A veteran surf coach",
      "setting": "Shouting from a board just past the break as a swell rises.",
      "name": "A big wave warning",
      "surface": "sky"
    },
    "b": {
      "label": "A weary retirement advisor",
      "setting": "Pushing quarterly charts across the desk to a worried client.",
      "name": "A financial crash advisory",
      "surface": "forest"
    },
    "quality": 8.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "wedding-rsvp-hostage-negotiation",
    "a": {
      "label": "A stressed bride on the phone",
      "setting": "Calling a flaky cousin three days before the caterer's final headcount is due.",
      "name": "Wedding RSVP follow up",
      "surface": "blush"
    },
    "b": {
      "label": "A police hostage negotiator",
      "setting": "Speaking into a landline outside a barricaded bank as the clock ticks down.",
      "name": "Hostage crisis negotiation",
      "surface": "ink"
    },
    "quality": 8.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "caveman-and-sommelier",
    "a": {
      "label": "A paleolithic hunter",
      "setting": "Grunted by firelight inside a cave while passing around a charred mammoth bone.",
      "name": "A caveman fire chat",
      "surface": "moss"
    },
    "b": {
      "label": "A pretentious sommelier",
      "setting": "Whispered over a white tablecloth while pouring an obscure vintage for diners.",
      "name": "A sommelier's notes",
      "surface": "oxblood"
    },
    "quality": 8.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "fortune-gameshow",
    "a": {
      "label": "A tarot reader",
      "setting": "A mysterious reader turning over cards beneath a dim beaded lamp.",
      "name": "A tarot card reading",
      "surface": "plum"
    },
    "b": {
      "label": "A glitzy television host",
      "setting": "A charismatic host grinning into the camera under bright studio spotlights.",
      "name": "A game show reveal",
      "surface": "peach"
    },
    "quality": 8.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "neighbor-court",
    "a": {
      "label": "A passive-aggressive suburban neighbor",
      "setting": "Leaning over the shared cedar fence with pruning shears in hand.",
      "name": "Neighbor dispute note",
      "surface": "blush"
    },
    "b": {
      "label": "A courtroom closing argument",
      "setting": "Facing the jury box in a quiet courtroom, pointing at the boundary map.",
      "name": "Closing argument",
      "surface": "oxblood"
    },
    "quality": 8.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "referee-doomsday",
    "a": {
      "label": "A sports referee",
      "setting": "Blowing a whistle at center court, signaling to coaches and scorekeepers.",
      "name": "Referee's final whistle",
      "surface": "butter"
    },
    "b": {
      "label": "An apocalyptic prophet",
      "setting": "Standing on a hill in rags, shouting toward the darkening skies.",
      "name": "An apocalypse warning",
      "surface": "oxblood"
    },
    "quality": 8.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "sleepover-host-prison-warden",
    "a": {
      "label": "A parent hosting a sleepover",
      "setting": "Standing in the basement doorway addressing six restless ten-year-olds.",
      "name": "A sleepover lights-out",
      "surface": "sky"
    },
    "b": {
      "label": "A prison warden",
      "setting": "Speaking over the cellblock intercom as steel security gates slide shut.",
      "name": "A cellblock lockdown",
      "surface": "space"
    },
    "quality": 8.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "therapist-bomb-squad",
    "a": {
      "label": "A therapist",
      "setting": "Soft-spoken in an armchair across from a patient gripping a tissue box.",
      "name": "A therapy breakthrough",
      "surface": "peach"
    },
    "b": {
      "label": "A bomb technician",
      "setting": "Muttered over a radio headset while kneeling over ticking wires.",
      "name": "Defusing a bomb",
      "surface": "graphite"
    },
    "quality": 8.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "therapist-mechanic",
    "a": {
      "label": "A therapist",
      "setting": "Spoken gently across a quiet room with a notepad, pausing after a difficult admission.",
      "name": "A therapy session",
      "surface": "sea"
    },
    "b": {
      "label": "A mechanic",
      "setting": "Wiping greasy hands on a rag in an auto shop beside a ruined engine.",
      "name": "A mechanic's verdict",
      "surface": "oxblood"
    },
    "quality": 8.91,
    "battery": "pair-battery@2"
  },
  {
    "key": "crier-and-voicemail-604",
    "a": {
      "label": "A medieval town crier",
      "setting": "Bellowed in the cobblestone square while ringing a brass handbell at midday.",
      "name": "A town crier announcement",
      "surface": "butter"
    },
    "b": {
      "label": "A nervous job seeker",
      "setting": "Spoken into a phone receiver after the tone, leaving a follow-up message.",
      "name": "A follow up voicemail",
      "surface": "paper"
    },
    "quality": 8.9,
    "battery": "pair-battery@2"
  },
  {
    "key": "fences-and-frontlines",
    "a": {
      "label": "A passive-aggressive neighbor at the fence",
      "setting": "Spoken over hedge trimmers on a sunny Saturday across the property line.",
      "name": "A neighbor dispute",
      "surface": "cream"
    },
    "b": {
      "label": "A general holding a border checkpoint",
      "setting": "Spoken stiffly across a concertina wire boundary to an opposing officer.",
      "name": "A border standoff",
      "surface": "forest"
    },
    "quality": 8.9,
    "battery": "pair-battery@2"
  },
  {
    "key": "ice-cream-hostage",
    "a": {
      "label": "An ice cream vendor",
      "setting": "Spoken leaning out the truck window to an impatient crowd of kids.",
      "name": "Ice cream truck",
      "surface": "apricot"
    },
    "b": {
      "label": "A police negotiator",
      "setting": "Spoken through a bullhorn toward an armed standoff at sundown.",
      "name": "Hostage negotiation",
      "surface": "navy"
    },
    "quality": 8.9,
    "battery": "pair-battery@2"
  },
  {
    "key": "casino-astronaut",
    "a": {
      "label": "A high-stakes casino dealer",
      "setting": "Said softly across green felt to a player staring at their final stack of chips.",
      "name": "Roulette table call",
      "surface": "forest"
    },
    "b": {
      "label": "Mission Control flight director",
      "setting": "Spoken into the headset right before initiating a one-way planetary descent.",
      "name": "Mission control countdown",
      "surface": "space"
    },
    "quality": 8.89,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-property-ransom",
    "a": {
      "label": "A transit lost and found clerk",
      "setting": "A tired clerk peers over a dusty counter at an anxious commuter holding an inquiry slip.",
      "name": "Lost property desk",
      "surface": "fog"
    },
    "b": {
      "label": "A shadowy blackmailer",
      "setting": "A gloved figure leans across a dimly lit park bench toward a panicked victim.",
      "name": "A blackmailer's terms",
      "surface": "ink"
    },
    "quality": 8.89,
    "battery": "pair-battery@2"
  },
  {
    "key": "mountain-summit-heist",
    "a": {
      "label": "A high-altitude mountain guide",
      "setting": "Yelled through howling winds across an icy ridge two steps from the summit.",
      "name": "A summit push briefing",
      "surface": "sky"
    },
    "b": {
      "label": "A safecracker to their nervous lookout",
      "setting": "Whispered into an earpiece while drilling the final tumblers of a bank vault.",
      "name": "A bank vault heist",
      "surface": "ink"
    },
    "quality": 8.89,
    "battery": "pair-battery@2"
  },
  {
    "key": "office-layoff-shipwreck",
    "a": {
      "label": "A corporate manager",
      "setting": "A somber speech delivered during an all-hands call on restructuring day.",
      "name": "Mass layoff announcement",
      "surface": "fog"
    },
    "b": {
      "label": "A submarine captain",
      "setting": "A steady voice on the PA after systems take catastrophic damage.",
      "name": "Submarine depth alert",
      "surface": "ink"
    },
    "quality": 8.89,
    "battery": "pair-battery@2"
  },
  {
    "key": "volcano-call-center",
    "a": {
      "label": "A field vulcanologist",
      "setting": "Shouting into a handheld radio near an erupting caldera as ash rains down.",
      "name": "A volcano evacuation order",
      "surface": "oxblood"
    },
    "b": {
      "label": "A tired support representative",
      "setting": "Speaking through a headset into the microphone as the call queue spikes.",
      "name": "Customer service escalation",
      "surface": "sky"
    },
    "quality": 8.89,
    "battery": "pair-battery@2"
  },
  {
    "key": "circus-coronation",
    "a": {
      "label": "A ringmaster introducing the final act",
      "setting": "Shouted under the circus big top spotlight to a gasping crowd as drums roll.",
      "name": "The ringmaster's introduction",
      "surface": "apricot"
    },
    "b": {
      "label": "The archbishop crowning a new monarch",
      "setting": "Solemnly spoken before a silent cathedral as the crown is lifted high above the throne.",
      "name": "A royal coronation",
      "surface": "plum"
    },
    "quality": 8.88,
    "battery": "pair-battery@2"
  },
  {
    "key": "tornado-parent",
    "a": {
      "label": "An emergency siren operator",
      "setting": "Broadcasting instructions over loudspeaker as funnel clouds touch down nearby.",
      "name": "A tornado siren",
      "surface": "graphite"
    },
    "b": {
      "label": "An exhausted parent",
      "setting": "Trying to coax an overtired toddler out of an absolute public meltdown.",
      "name": "Calming a tantrum",
      "surface": "peach"
    },
    "quality": 8.88,
    "battery": "pair-battery@2"
  },
  {
    "key": "crier-referee",
    "a": {
      "label": "A village crier",
      "setting": "Bellowed from the steps of the hall to quiet a brawling tavern mob.",
      "name": "A town crier's curfew",
      "surface": "butter"
    },
    "b": {
      "label": "A corner boxing coach",
      "setting": "Screamed through swollen gauze into a bleeding fighter's face before round twelve.",
      "name": "A corner boxing coach",
      "surface": "navy"
    },
    "quality": 8.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "haunted-attic-marine-sonar",
    "a": {
      "label": "An amateur ghost hunter",
      "setting": "Whispered into a microphone standing on creaking floorboards in a boarded-up attic.",
      "name": "Attic ghost inquiry",
      "surface": "moss"
    },
    "b": {
      "label": "A submarine sonar technician",
      "setting": "Whispered to the commander while listening to rhythmic metallic echoes on headphones.",
      "name": "Submarine sonar report",
      "surface": "oxblood"
    },
    "quality": 8.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "report-card-parole-hearing",
    "a": {
      "label": "An elementary school teacher",
      "setting": "A teacher pens remarks on a student's end-of-term evaluation envelope.",
      "name": "A report card comment",
      "surface": "peach"
    },
    "b": {
      "label": "A parole board officer",
      "setting": "An officer speaks firmly across a gray table at a scheduled review hearing.",
      "name": "A parole hearing",
      "surface": "fog"
    },
    "quality": 8.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "tarot-mechanic",
    "a": {
      "label": "A tarot reader",
      "setting": "Flipping over the Tower card onto a dark velvet cloth before a wide-eyed seeker.",
      "name": "A tarot reading",
      "surface": "lilac"
    },
    "b": {
      "label": "An honest auto mechanic",
      "setting": "Wiping black grease from his hands under the raised lift of a rusty sedan.",
      "name": "A mechanic's estimate",
      "surface": "moss"
    },
    "quality": 8.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "arch-elevator",
    "a": {
      "label": "A cartoon supervillain",
      "setting": "Broadcasting to giant screens across the city skyline from an airship.",
      "name": "A supervillain broadcast",
      "surface": "lime"
    },
    "b": {
      "label": "An automated building announcer",
      "setting": "Chiming over speakers as a packed express elevator leaves the lobby.",
      "name": "An elevator chime",
      "surface": "cream"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "dive-and-auction",
    "a": {
      "label": "A scuba instructor",
      "setting": "A diver briefs beginners on the boat deck before their first ocean descent.",
      "name": "A scuba safety briefing",
      "surface": "sea"
    },
    "b": {
      "label": "An art auctioneer",
      "setting": "An auctioneer stands at the podium, calling out bids to an elite room.",
      "name": "An art auction",
      "surface": "graphite"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "hairdresser-heist",
    "a": {
      "label": "A nervous hair stylist",
      "setting": "Murmured softly to a customer staring anxiously in the styling chair mirror.",
      "name": "Hairdresser consultation",
      "surface": "rose"
    },
    "b": {
      "label": "A veteran safe cracker",
      "setting": "Spoken through clenched teeth to an apprentice with a drill against the vault.",
      "name": "Cracking the vault",
      "surface": "ink"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-and-creepy-cult",
    "a": {
      "label": "Strict HOA president",
      "setting": "Reading aloud from a binder of neighborhood bylaws in the community center.",
      "name": "An HOA violation notice",
      "surface": "paper"
    },
    "b": {
      "label": "Cult high priest",
      "setting": "Addressing the robed congregation around a bonfire in the dark woods.",
      "name": "A cult initiation",
      "surface": "oxblood"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "magic-mirror-appraisal",
    "a": {
      "label": "The enchanted mirror speaking",
      "setting": "Mist parts over dark polished glass in the queen's private bedchamber.",
      "name": "A magic mirror's judgment",
      "surface": "oxblood"
    },
    "b": {
      "label": "Jewelry appraiser examining a stone",
      "setting": "Squinting through a jeweler's loupe under white desk lamps in a quiet vault.",
      "name": "A diamond appraisal",
      "surface": "cream"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "matchmaker-scout",
    "a": {
      "label": "A traditional matchmaker",
      "setting": "Spoken across porcelain teacups to an anxious client reviewing a stack of dossiers.",
      "name": "A matchmaker's pitch",
      "surface": "blush"
    },
    "b": {
      "label": "A wildlife tracker",
      "setting": "Whispered from a mountain blind to an eco-photographer loading telephoto lenses.",
      "name": "A tracker's target spotted",
      "surface": "moss"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "teacher-exam-heist-locksmith",
    "a": {
      "label": "A high school proctor",
      "setting": "Spoken to a silent gymnasium packed with students taking final examinations.",
      "name": "Exam proctor rules",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A safecracker at work",
      "setting": "Whispered to a partner while listening through a stethoscope on a steel dial.",
      "name": "A safecracker's whisper",
      "surface": "space"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "text-gladiator",
    "a": {
      "label": "An anxious friend",
      "setting": "Typing rapidly on a cracked smartphone after twenty missed calls.",
      "name": "A frantic text message",
      "surface": "peach"
    },
    "b": {
      "label": "A Roman gladiator",
      "setting": "Calling out into the roaring Colosseum sand just before the gate raises.",
      "name": "A gladiator's plea",
      "surface": "graphite"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "trapped-lift-drama",
    "a": {
      "label": "A building intercom voice",
      "setting": "Speaking through the elevator speaker to four commuters suspended between floors.",
      "name": "Stuck elevator intercom",
      "surface": "fog"
    },
    "b": {
      "label": "A marriage counselor",
      "setting": "Guiding two estranged spouses through an awkward impasse during their session.",
      "name": "Marriage counseling prompt",
      "surface": "rose"
    },
    "quality": 8.86,
    "battery": "pair-battery@2"
  },
  {
    "key": "centurion-subway",
    "a": {
      "label": "A Roman centurion",
      "setting": "Bellowing orders over clashing shields to keep the defensive line intact.",
      "name": "Roman legion command",
      "surface": "paper"
    },
    "b": {
      "label": "A subway conductor",
      "setting": "Crackling through the PA system on a packed rush-hour commuter train.",
      "name": "Subway announcement",
      "surface": "fog"
    },
    "quality": 8.85,
    "battery": "pair-battery@2"
  },
  {
    "key": "descent-check-divorce-court",
    "a": {
      "label": "A scuba divemaster",
      "setting": "Calling out above the waves before the team tips backwards into deep open water.",
      "name": "The divemaster's check",
      "surface": "sea"
    },
    "b": {
      "label": "A divorce mediator",
      "setting": "Speaking across a conference table to a tense couple dividing everything up.",
      "name": "A divorce mediation",
      "surface": "graphite"
    },
    "quality": 8.85,
    "battery": "pair-battery@2"
  },
  {
    "key": "salons-and-heists",
    "a": {
      "label": "A hairdresser",
      "setting": "Adjusting the drape around a client's shoulders while reaching for the shears.",
      "name": "Hair salon consultation",
      "surface": "peach"
    },
    "b": {
      "label": "A safe-cracker",
      "setting": "Whispering into an earpiece while spinning the dial on a vault door.",
      "name": "A bank vault job",
      "surface": "graphite"
    },
    "quality": 8.85,
    "battery": "pair-battery@2"
  },
  {
    "key": "band-soundcheck-artillery",
    "a": {
      "label": "A rock roadie",
      "setting": "Shouted through a headset from behind the main stage monitors during a soundcheck.",
      "name": "A stage soundcheck",
      "surface": "butter"
    },
    "b": {
      "label": "An artillery forward observer",
      "setting": "Static-heavy radio broadcast from a muddy bunker as incoming shells explode nearby.",
      "name": "Artillery targeting",
      "surface": "forest"
    },
    "quality": 8.84,
    "battery": "pair-battery@2"
  },
  {
    "key": "boss-firing-spooky",
    "a": {
      "label": "An HR director",
      "setting": "Speaking softly in a windowless boardroom across from an employee with a cardboard box.",
      "name": "An exit interview",
      "surface": "cream"
    },
    "b": {
      "label": "The resident poltergeist",
      "setting": "Whispering through cold attic floorboards down to the terrified new homeowners.",
      "name": "A haunted house threat",
      "surface": "ink"
    },
    "quality": 8.84,
    "battery": "pair-battery@2"
  },
  {
    "key": "tour-manager-nurse",
    "a": {
      "label": "A weary rock band road manager",
      "setting": "Barking into a phone in an arena hallway after a wild afterparty.",
      "name": "Tour manager damage control",
      "surface": "blush"
    },
    "b": {
      "label": "A pediatric ward nurse at shift change",
      "setting": "Briefing the incoming nurse at the nurses' station whiteboard.",
      "name": "Pediatric shift report",
      "surface": "sky"
    },
    "quality": 8.84,
    "battery": "pair-battery@2"
  },
  {
    "key": "clerk-detective",
    "a": {
      "label": "A subway clerk",
      "setting": "Spoken through bulletproof glass to a hopeful commuter holding a crumpled ticket.",
      "name": "Transit lost property",
      "surface": "paper"
    },
    "b": {
      "label": "A medium",
      "setting": "Whispered over a candlelit table to a grieving client seeking closure.",
      "name": "A seance reading",
      "surface": "ink"
    },
    "quality": 8.83,
    "battery": "pair-battery@2"
  },
  {
    "key": "library-detective",
    "a": {
      "label": "A public librarian enforcing closing time",
      "setting": "Walking between towering aisles, tapping the desk bell firmly.",
      "name": "Library closing announcement",
      "surface": "sea"
    },
    "b": {
      "label": "A detective confronting a cornered suspect",
      "setting": "Cornering the suspect in a dark alleyway with backup approaching.",
      "name": "Police stakeout takedown",
      "surface": "ink"
    },
    "quality": 8.83,
    "battery": "pair-battery@2"
  },
  {
    "key": "open-house-abandoned-asylum",
    "a": {
      "label": "An eager suburban realtor",
      "setting": "Leading a prospective family through a newly staged split-level home.",
      "name": "An open house tour",
      "surface": "butter"
    },
    "b": {
      "label": "An urban explorer",
      "setting": "Whispering to a nervous companion while shining a flashlight down a locked corridor.",
      "name": "An abandoned asylum trek",
      "surface": "graphite"
    },
    "quality": 8.82,
    "battery": "pair-battery@2"
  },
  {
    "key": "puppy-hostage",
    "a": {
      "label": "A proud new puppy owner",
      "setting": "Kneeling on the carpet offering a training treat for returning a stolen shoe.",
      "name": "New puppy training",
      "surface": "peach"
    },
    "b": {
      "label": "A police crisis negotiator",
      "setting": "Speaking into a megaphone toward an upper floor window of a barricaded home.",
      "name": "A hostage negotiation appeal",
      "surface": "plum"
    },
    "quality": 8.82,
    "battery": "pair-battery@2"
  },
  {
    "key": "treasure-clue-will",
    "a": {
      "label": "An eccentric riddle on an ancient parchment",
      "setting": "Ink faded on vellum, guiding explorers to a buried chest.",
      "name": "A cryptic map riddle",
      "surface": "cream"
    },
    "b": {
      "label": "An attorney reading a wealthy eccentric's will",
      "setting": "Read sternly in mahogany chambers to greedy relatives.",
      "name": "Reading the last will",
      "surface": "ink"
    },
    "quality": 8.82,
    "battery": "pair-battery@2"
  },
  {
    "key": "baptism-airlock",
    "a": {
      "label": "A minister performing a full river baptism",
      "setting": "A minister waist-deep in cold river water prepares to submerge an initiate.",
      "name": "A river baptism",
      "surface": "sky"
    },
    "b": {
      "label": "An astronaut operating an emergency airlock",
      "setting": "A crewmember locks hands on the manual valve while cycling the hatch.",
      "name": "An airlock breach",
      "surface": "plum"
    },
    "quality": 8.81,
    "battery": "pair-battery@2"
  },
  {
    "key": "bounty-dog",
    "a": {
      "label": "A grizzled bounty hunter",
      "setting": "Cornering an outlaw behind a prairie windmill with a cocked revolver at high noon.",
      "name": "A bounty arrest",
      "surface": "apricot"
    },
    "b": {
      "label": "An anxious pet owner",
      "setting": "Approaching an escaped golden retriever holding a leash behind the neighbor's hedge.",
      "name": "Catching a runaway",
      "surface": "mint"
    },
    "quality": 8.81,
    "battery": "pair-battery@2"
  },
  {
    "key": "software-release-countdown-mission",
    "a": {
      "label": "A lead software engineer",
      "setting": "Announced across a bullpen of tired coders pushing code to production servers.",
      "name": "Production deployment call",
      "surface": "mint"
    },
    "b": {
      "label": "A submarine captain diving",
      "setting": "Issued sternly through the shipwide intercom as alarms sound underwater.",
      "name": "Submarine dive order",
      "surface": "forest"
    },
    "quality": 8.81,
    "battery": "pair-battery@2"
  },
  {
    "key": "sub-depth-charge",
    "a": {
      "label": "A submarine commander",
      "setting": "Hushed order issued in red battle lighting while running silent beneath enemy patrol destroyers.",
      "name": "Rigging for silent running",
      "surface": "navy"
    },
    "b": {
      "label": "A nervous babysitter",
      "setting": "Whispering frantically into the phone after finally getting triplets to fall asleep in their cribs.",
      "name": "A babysitter's report",
      "surface": "butter"
    },
    "quality": 8.81,
    "battery": "pair-battery@2"
  },
  {
    "key": "haunted-corporate",
    "a": {
      "label": "A haunted house guide",
      "setting": "Whispering near the creaking staircase to terrified visitors huddled in the dark hallway.",
      "name": "Haunted house guide",
      "surface": "oxblood"
    },
    "b": {
      "label": "The corporate project manager",
      "setting": "Leading a tense quarterly status sync on video call with exhausted team leads.",
      "name": "A status meeting",
      "surface": "graphite"
    },
    "quality": 8.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "neighborly-complaint-detective",
    "a": {
      "label": "An irritated neighbor",
      "setting": "A neighbor standing in a bathrobe on your doorstep points an accusing finger at your fence.",
      "name": "A neighborly complaint",
      "surface": "butter"
    },
    "b": {
      "label": "A hard-boiled detective",
      "setting": "A detective leans across a steel interrogation desk under a flickering ceiling bulb.",
      "name": "A homicide inquiry",
      "surface": "graphite"
    },
    "quality": 8.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "spirit-box-and-drive-thru",
    "a": {
      "label": "A ghost hunter",
      "setting": "Speaking into the crackling static of a radio sweeping frequencies in a cellar.",
      "name": "Spirit box inquiry",
      "surface": "plum"
    },
    "b": {
      "label": "A fast food cashier",
      "setting": "Speaking through the distorted intercom speaker to a car idling in the drive-thru.",
      "name": "Drive thru headset greeting",
      "surface": "peach"
    },
    "quality": 8.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "archive-conspiracy",
    "a": {
      "label": "A rare book archivist",
      "setting": "Explaining the special collections reading room policies to a new scholar.",
      "name": "A library orientation",
      "surface": "paper"
    },
    "b": {
      "label": "An obsessive theorist",
      "setting": "Speaking under a dim streetlight to an investigative reporter.",
      "name": "A whistleblower's leak",
      "surface": "ink"
    },
    "quality": 8.79,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-cult",
    "a": {
      "label": "An HOA president",
      "setting": "Addressing neighbors in a community clubhouse regarding neighborhood guidelines.",
      "name": "An HOA meeting",
      "surface": "fog"
    },
    "b": {
      "label": "A cult elder",
      "setting": "Chanting by candlelight before the initiate takes their binding oath.",
      "name": "A cult initiation",
      "surface": "plum"
    },
    "quality": 8.79,
    "battery": "pair-battery@2"
  },
  {
    "key": "job-rejection-saloon-barge",
    "a": {
      "label": "A hiring manager sending an update",
      "setting": "Typing a standard email template to a hopeful applicant after interviews.",
      "name": "A job rejection email",
      "surface": "paper"
    },
    "b": {
      "label": "A saloon barkeep cutting someone off",
      "setting": "Wiping a greasy glass with a rag as an unruly drifter stumbles in.",
      "name": "A saloon barkeep cut-off",
      "surface": "plum"
    },
    "quality": 8.79,
    "battery": "pair-battery@2"
  },
  {
    "key": "dressing-room-secret-agent",
    "a": {
      "label": "A boutique dressing room attendant",
      "setting": "Speaking outside a curtained stall while handing items to a trying shopper.",
      "name": "Fitting room advice",
      "surface": "cream"
    },
    "b": {
      "label": "A quartermaster outfitting an operative",
      "setting": "Handing bespoke tactical gear to a spy headed behind enemy lines.",
      "name": "Spy gear briefing",
      "surface": "ink"
    },
    "quality": 8.78,
    "battery": "pair-battery@2"
  },
  {
    "key": "neighbor-spy",
    "a": {
      "label": "A passive-aggressive neighbor",
      "setting": "Handwritten on a bright sticky note slapped onto a front porch door.",
      "name": "A neighbor's complaint",
      "surface": "butter"
    },
    "b": {
      "label": "A stakeout detective",
      "setting": "Whispered into a radio from the back of an unmarked van down the block.",
      "name": "A stakeout report",
      "surface": "fog"
    },
    "quality": 8.78,
    "battery": "pair-battery@2"
  },
  {
    "key": "substitute-and-hostage-571",
    "a": {
      "label": "A substitute teacher",
      "setting": "A substitute stands at the whiteboard trying to tame seventh period.",
      "name": "Substitute roll call",
      "surface": "butter"
    },
    "b": {
      "label": "A hostage negotiator",
      "setting": "A police negotiator speaks through a megaphone toward a bank door.",
      "name": "Hostage negotiation",
      "surface": "oxblood"
    },
    "quality": 8.78,
    "battery": "pair-battery@2"
  },
  {
    "key": "ghost-hunting-unboxing",
    "a": {
      "label": "A paranormal investigator",
      "setting": "Whispering into a night-vision camera inside a dark, creaking hallway.",
      "name": "Ghost hunt findings",
      "surface": "fog"
    },
    "b": {
      "label": "A tech influencer",
      "setting": "Leaning over pristine packaging under studio ring lights for a video review.",
      "name": "A gadget unboxing",
      "surface": "peach"
    },
    "quality": 8.77,
    "battery": "pair-battery@2"
  },
  {
    "key": "town-crier-and-spoiler-warning",
    "a": {
      "label": "An 18th-century town crier",
      "setting": "Ringing a brass bell in the cobblestone village square at high noon.",
      "name": "A town crier",
      "surface": "apricot"
    },
    "b": {
      "label": "A TV critic previewing a finale",
      "setting": "Addressing viewers directly before a live recap of the shocking season finale.",
      "name": "A spoiler alert",
      "surface": "space"
    },
    "quality": 8.77,
    "battery": "pair-battery@2"
  },
  {
    "key": "magician-subway",
    "a": {
      "label": "A stage illusionist",
      "setting": "Boomed dramatically over the theater speakers right before raising a velvet cloth.",
      "name": "Magician stage reveal",
      "surface": "plum"
    },
    "b": {
      "label": "A tired conductor",
      "setting": "Crackled over the muffled train intercom as the doors open at the final stop.",
      "name": "Train conductor chime",
      "surface": "fog"
    },
    "quality": 8.76,
    "battery": "pair-battery@2"
  },
  {
    "key": "party-er",
    "a": {
      "label": "An entertainer to rowdy six-year-olds",
      "setting": "A magician stands on a suburban lawn trying to corral twenty sugar-fueled children.",
      "name": "A birthday party entertainer",
      "surface": "lime"
    },
    "b": {
      "label": "A charge nurse to the night shift team",
      "setting": "The trauma bay whiteboard fills rapidly as three ambulances pull into the bay.",
      "name": "An ER triage briefing",
      "surface": "fog"
    },
    "quality": 8.76,
    "battery": "pair-battery@2"
  },
  {
    "key": "shelter-escape",
    "a": {
      "label": "An animal shelter worker",
      "setting": "Kneeling beside an adoption kennel, speaking softly through the bars.",
      "name": "A rescue dog adoption",
      "surface": "peach"
    },
    "b": {
      "label": "A getaway driver",
      "setting": "Leaning out the open passenger door in a dark alley, engine running.",
      "name": "A prison break pickup",
      "surface": "space"
    },
    "quality": 8.76,
    "battery": "pair-battery@2"
  },
  {
    "key": "eulogy-farewell-broadway-closing",
    "a": {
      "label": "A grieving friend",
      "setting": "Spoken from a sunlit church pulpit while resting a hand against polished mahogany wood.",
      "name": "A memorial eulogy",
      "surface": "lilac"
    },
    "b": {
      "label": "A stage manager",
      "setting": "Calling the final cue over the production headset as the show ends its multi-year run.",
      "name": "The closing show",
      "surface": "ink"
    },
    "quality": 8.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "mail-contract",
    "a": {
      "label": "Mail sorting supervisor",
      "setting": "Shouting over conveyor belts at a busy regional distribution center.",
      "name": "A mail sorter's command",
      "surface": "paper"
    },
    "b": {
      "label": "Mafia enforcer handing over an envelope",
      "setting": "Leaning across a diner booth late at night delivering instructions.",
      "name": "A mob bagman's drop",
      "surface": "ink"
    },
    "quality": 8.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "saloon-stand",
    "a": {
      "label": "A frontier sheriff",
      "setting": "Stepping onto the boardwalk, hand resting on a polished holster.",
      "name": "A sheriff warning",
      "surface": "cream"
    },
    "b": {
      "label": "A strict librarian",
      "setting": "Towering over a noisy table of teenagers at exam time.",
      "name": "A librarian shush",
      "surface": "forest"
    },
    "quality": 8.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "support-and-trapeze",
    "a": {
      "label": "The IT helpdesk tech",
      "setting": "Speaking calmly on a headset to an employee whose computer screen just froze mid-task.",
      "name": "Tech support chat",
      "surface": "paper"
    },
    "b": {
      "label": "The circus ringmaster",
      "setting": "Booming through the microphone into the quiet tent while the aerialist swings high above.",
      "name": "A circus ringmaster",
      "surface": "oxblood"
    },
    "quality": 8.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "trapeze-relationship",
    "a": {
      "label": "A trapeze catcher",
      "setting": "Calling out mid-swing to the flyer tumbling through the air high above.",
      "name": "The trapeze catch",
      "surface": "apricot"
    },
    "b": {
      "label": "A marriage counselor",
      "setting": "Coaching an estranged couple during a breakthrough exercise on the sofa.",
      "name": "Marriage counseling advice",
      "surface": "lilac"
    },
    "quality": 8.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "yoga-heist",
    "a": {
      "label": "A yoga instructor",
      "setting": "Softly spoken in a warm, dimly lit studio while guiding students into a deep stretch.",
      "name": "A yoga class",
      "surface": "butter"
    },
    "b": {
      "label": "An elevator repair technician",
      "setting": "Spoken through the ceiling hatch to anxious passengers trapped between floors.",
      "name": "Stuck in an elevator",
      "surface": "graphite"
    },
    "quality": 8.75,
    "battery": "pair-battery@2"
  },
  {
    "key": "dino-dig-auction",
    "a": {
      "label": "A paleontologist unearthing a bone",
      "setting": "Calling over the field crew as fragile petrified stone emerges from sandstone.",
      "name": "Uncovering a fossil",
      "surface": "peach"
    },
    "b": {
      "label": "A con artist running a fake sale",
      "setting": "Whispering in an alleyway to an eager buyer inspecting stolen jewelry.",
      "name": "Peddling a fake antique",
      "surface": "oxblood"
    },
    "quality": 8.74,
    "battery": "pair-battery@2"
  },
  {
    "key": "salon-horror",
    "a": {
      "label": "A hair stylist",
      "setting": "Draping the black cape around your shoulders and turning you toward the mirror.",
      "name": "Hair salon consultation",
      "surface": "butter"
    },
    "b": {
      "label": "A horror movie survivor",
      "setting": "Creeping backwards into the dark cellar while clutching a rusty flashlight.",
      "name": "Horror movie warning",
      "surface": "ink"
    },
    "quality": 8.74,
    "battery": "pair-battery@2"
  },
  {
    "key": "taster-assassin",
    "a": {
      "label": "The king's royal food taster",
      "setting": "Inspecting the silver banquet platter before the feast begins.",
      "name": "Royal food taster",
      "surface": "apricot"
    },
    "b": {
      "label": "A suspicious mob boss",
      "setting": "Sitting in a dark booth, sliding an envelope across the table.",
      "name": "Mob boss ultimatum",
      "surface": "ink"
    },
    "quality": 8.74,
    "battery": "pair-battery@2"
  },
  {
    "key": "drivered-bombdiffusal",
    "a": {
      "label": "A driving instructor",
      "setting": "Spoken in an icy, measured tone with a hand hovering over the emergency brake.",
      "name": "Driver's ed instruction",
      "surface": "lime"
    },
    "b": {
      "label": "A bomb technician",
      "setting": "Whispered through a headset while kneeling beside a ticking timer.",
      "name": "Bomb disposal guide",
      "surface": "forest"
    },
    "quality": 8.73,
    "battery": "pair-battery@2"
  },
  {
    "key": "fortune-teller-boss",
    "a": {
      "label": "A palm reader delivering a prediction",
      "setting": "Traced across a stranger's lifeline over velvet cloth and a single burning candle.",
      "name": "A palm reading",
      "surface": "plum"
    },
    "b": {
      "label": "A director revealing a corporate reorganization",
      "setting": "Presenting the new quarterly hierarchy chart to an uneasy department.",
      "name": "A company restructuring",
      "surface": "navy"
    },
    "quality": 8.73,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandparent-volcano",
    "a": {
      "label": "A doting grandparent",
      "setting": "Spoken gently across the kitchen table, watching a grandchild build a huge plate of snacks.",
      "name": "Grandparent's indulgence",
      "surface": "butter"
    },
    "b": {
      "label": "A field volcanologist",
      "setting": "Spoken into a handheld radio from a crater ridge as the magma lake begins bubbling furiously.",
      "name": "Volcano alert",
      "surface": "oxblood"
    },
    "quality": 8.73,
    "battery": "pair-battery@2"
  },
  {
    "key": "patrol-and-prom",
    "a": {
      "label": "A highway patrol officer",
      "setting": "Leaning into an open driver-side window on a dark highway shoulder.",
      "name": "Traffic stop reprimand",
      "surface": "graphite"
    },
    "b": {
      "label": "A protective parent",
      "setting": "Standing on the porch giving final instructions to a teenager driving off to prom.",
      "name": "Parent curfew lecture",
      "surface": "cream"
    },
    "quality": 8.73,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-fridge-investigator-coroner",
    "a": {
      "label": "An annoyed housemate",
      "setting": "Written in red Sharpie on masking tape stuck to a tupperware container.",
      "name": "A fridge warning label",
      "surface": "lime"
    },
    "b": {
      "label": "A forensic pathologist",
      "setting": "Dictating observations into an overhead microphone above an examination table.",
      "name": "An autopsy report",
      "surface": "fog"
    },
    "quality": 8.73,
    "battery": "pair-battery@2"
  },
  {
    "key": "crier-surveillance",
    "a": {
      "label": "An 18th-century town crier",
      "setting": "Bellowed into the cobblestone square while clanging an iron handbell.",
      "name": "Public town notice",
      "surface": "rose"
    },
    "b": {
      "label": "An automated security system",
      "setting": "Broadcast through loudspeaker sirens after motion is detected in a compound.",
      "name": "Automated security alert",
      "surface": "navy"
    },
    "quality": 8.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "groupchat-secretagent",
    "a": {
      "label": "A messy friend",
      "setting": "Texting urgent updates to the circle after spotting an ex in public.",
      "name": "Group chat gossip",
      "surface": "lime"
    },
    "b": {
      "label": "A field spy",
      "setting": "Transmitting encrypted intel from behind an umbrella across the plaza.",
      "name": "Covert surveillance",
      "surface": "navy"
    },
    "quality": 8.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "haunt-and-audit",
    "a": {
      "label": "An estate medium",
      "setting": "Whispered across a cold, drafty Victorian attic illuminated only by lantern light.",
      "name": "A haunted manor inspection",
      "surface": "graphite"
    },
    "b": {
      "label": "A forensic tax auditor",
      "setting": "Stated dryly while flipping through banker boxes of unlabeled invoices.",
      "name": "A corporate tax audit",
      "surface": "paper"
    },
    "quality": 8.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "meteorologist-to-referee",
    "a": {
      "label": "A TV meteorologist",
      "setting": "Tracking an intensifying pressure front live on the radar display.",
      "name": "A TV weather forecast",
      "surface": "sky"
    },
    "b": {
      "label": "A boxing referee",
      "setting": "Leaning in close over two bruised contenders in the final round.",
      "name": "A referee ring warning",
      "surface": "plum"
    },
    "quality": 8.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "shampoo-bowl-and-baptism",
    "a": {
      "label": "A salon assistant",
      "setting": "Leaning you back over the porcelain sink and adjusting the temperature.",
      "name": "The shampoo basin",
      "surface": "mint"
    },
    "b": {
      "label": "A river preacher",
      "setting": "Standing waist-deep in cold water, cradling a convert's shoulders.",
      "name": "A river baptism",
      "surface": "sea"
    },
    "quality": 8.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "waves-and-heirs",
    "a": {
      "label": "A surf instructor",
      "setting": "Shouting over crashing whitewater as a novice paddler hesitates on the board.",
      "name": "A surf lesson",
      "surface": "sea"
    },
    "b": {
      "label": "An estate attorney",
      "setting": "Reading aloud the final clauses to anxious relatives gathered around mahogany.",
      "name": "Reading the will",
      "surface": "ink"
    },
    "quality": 8.72,
    "battery": "pair-battery@2"
  },
  {
    "key": "atm-glitch-vault",
    "a": {
      "label": "An automated ATM voice",
      "setting": "Flashing robotic text on the screen while counting bills behind the slot.",
      "name": "ATM screen prompt",
      "surface": "sky"
    },
    "b": {
      "label": "A blackjack dealer",
      "setting": "Tapping the velvet table before sliding cards to an aggressive high roller.",
      "name": "A blackjack dealer's offer",
      "surface": "oxblood"
    },
    "quality": 8.71,
    "battery": "pair-battery@2"
  },
  {
    "key": "babysitter-panic-space",
    "a": {
      "label": "A frazzled teenage babysitter",
      "setting": "Whispering frantic updates to a friend over the phone while hiding in the hall.",
      "name": "A teenage babysitter's SOS",
      "surface": "blush"
    },
    "b": {
      "label": "A mission flight director",
      "setting": "Speaking into the comm loop as unauthorized activity registers on the space station.",
      "name": "Orbital mission abort",
      "surface": "plum"
    },
    "quality": 8.71,
    "battery": "pair-battery@2"
  },
  {
    "key": "map-investor",
    "a": {
      "label": "An antique cartographer",
      "setting": "Unrolling cracked vellum across a captain's table by lamplight.",
      "name": "Treasure map legend",
      "surface": "paper"
    },
    "b": {
      "label": "A startup founder",
      "setting": "Projecting the final slide of a pitch deck to venture capitalists.",
      "name": "A pitch deck conclusion",
      "surface": "navy"
    },
    "quality": 8.71,
    "battery": "pair-battery@2"
  },
  {
    "key": "quest-giver-fitness-trainer",
    "a": {
      "label": "A tavern quest giver",
      "setting": "A scarred veteran handing a rolled parchment to an eager adventurer.",
      "name": "A quest briefing",
      "surface": "oxblood"
    },
    "b": {
      "label": "A personal trainer",
      "setting": "A fitness coach encouraging a client through the final grueling circuit.",
      "name": "A personal trainer's push",
      "surface": "lime"
    },
    "quality": 8.71,
    "battery": "pair-battery@2"
  },
  {
    "key": "cat-adoption-hostage-plea",
    "a": {
      "label": "A shelter worker",
      "setting": "Whispering near a wire crate to an applicant holding a skittish rescue cat.",
      "name": "Cat adoption interview",
      "surface": "butter"
    },
    "b": {
      "label": "A hostage negotiator",
      "setting": "Speaking into a bullhorn toward a barricaded bank doorway.",
      "name": "Hostage stand down",
      "surface": "navy"
    },
    "quality": 8.7,
    "battery": "pair-battery@2"
  },
  {
    "key": "chef-scolding-parent",
    "a": {
      "label": "A demanding head chef",
      "setting": "Barking across a chaotic line during peak Saturday dinner service.",
      "name": "Line cook reprimand",
      "surface": "peach"
    },
    "b": {
      "label": "An exhausted parent",
      "setting": "Standing over high chairs covered in pureed carrots at six in the evening.",
      "name": "Dinner table patience",
      "surface": "apricot"
    },
    "quality": 8.7,
    "battery": "pair-battery@2"
  },
  {
    "key": "landlord-move-out-art-heist",
    "a": {
      "label": "A strict rental property manager",
      "setting": "Inspecting an empty apartment with a clipboard on the final lease day.",
      "name": "A move-out inspection",
      "surface": "paper"
    },
    "b": {
      "label": "The master thief on a headset",
      "setting": "Guiding the crew through the museum gallery before guards return.",
      "name": "A museum heist escape",
      "surface": "fog"
    },
    "quality": 8.7,
    "battery": "pair-battery@2"
  },
  {
    "key": "seed-to-stars",
    "a": {
      "label": "A master gardener",
      "setting": "Whispered over a fresh trench of soil in early spring, hands dark with dirt.",
      "name": "Planting seeds",
      "surface": "forest"
    },
    "b": {
      "label": "A mission flight director",
      "setting": "Spoken into a headset in mission control as the final countdown ticks down.",
      "name": "A rocket launch",
      "surface": "paper"
    },
    "quality": 8.7,
    "battery": "pair-battery@2"
  },
  {
    "key": "spy-dead-drop-baking-recipe",
    "a": {
      "label": "A covert intelligence operative",
      "setting": "Scrawled in disappearing ink on a torn slip tucked beneath a park bench.",
      "name": "A dead drop note",
      "surface": "ink"
    },
    "b": {
      "label": "A grandmother's heirloom recipe",
      "setting": "Faded cursive on a flour-dusted index card kept in an old tin box.",
      "name": "A secret family recipe",
      "surface": "cream"
    },
    "quality": 8.7,
    "battery": "pair-battery@2"
  },
  {
    "key": "auditor-final-girl",
    "a": {
      "label": "A tax auditor",
      "setting": "An auditor peers over wire rims at a taxpayer across a desk stacked with red-flagged receipts.",
      "name": "An IRS audit",
      "surface": "fog"
    },
    "b": {
      "label": "A horror movie survivor",
      "setting": "The sole survivor points a trembling flashlight into the pitch-black basement doorway.",
      "name": "A horror movie warning",
      "surface": "oxblood"
    },
    "quality": 8.69,
    "battery": "pair-battery@2"
  },
  {
    "key": "croupier-and-fortune",
    "a": {
      "label": "A blackjack dealer",
      "setting": "Announcing table rules to nervous players placing high-stakes chips on felt.",
      "name": "Casino dealer call",
      "surface": "forest"
    },
    "b": {
      "label": "A fortune cookie slip",
      "setting": "Printed tiny slip of paper pulled from a cracked cookie after dinner.",
      "name": "Fortune cookie slip",
      "surface": "cream"
    },
    "quality": 8.69,
    "battery": "pair-battery@2"
  },
  {
    "key": "lostfound-breakup",
    "a": {
      "label": "A transit lost and found clerk",
      "setting": "Staring through glass at a frantic commuter describing a missing personal item.",
      "name": "Lost and found intake",
      "surface": "butter"
    },
    "b": {
      "label": "A tired partner breaking up",
      "setting": "Handing back a box of shared possessions on a chilly apartment doorstep.",
      "name": "A breakup handover",
      "surface": "plum"
    },
    "quality": 8.69,
    "battery": "pair-battery@2"
  },
  {
    "key": "surfer-shout-and-heist",
    "a": {
      "label": "A seasoned big-wave surfer",
      "setting": "Paddling hard past the reef break, yelling back to a rookie partner.",
      "name": "A surf shout",
      "surface": "sea"
    },
    "b": {
      "label": "A heist lookout",
      "setting": "Whispering urgently into an earpiece as police sirens approach the bank.",
      "name": "A lookout's alert",
      "surface": "graphite"
    },
    "quality": 8.69,
    "battery": "pair-battery@2"
  },
  {
    "key": "couples-hostage",
    "a": {
      "label": "A marriage counselor",
      "setting": "Leaning forward on a sofa between two spouses who refuse to look at each other.",
      "name": "Couples counseling",
      "surface": "fog"
    },
    "b": {
      "label": "A hostage negotiator",
      "setting": "On a megaphone outside a barricaded downtown bank, aiming for trust.",
      "name": "Hostage standoff",
      "surface": "space"
    },
    "quality": 8.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "dentist-heist",
    "a": {
      "label": "An orthodontic hygienist",
      "setting": "Leaning over the chair with metal tools, adjusting the overhead lamp.",
      "name": "A routine dental cleaning",
      "surface": "mint"
    },
    "b": {
      "label": "A veteran safecracker",
      "setting": "Crouched in front of a vault dial, whispering through an earpiece.",
      "name": "A bank vault breach",
      "surface": "graphite"
    },
    "quality": 8.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "stage-magician-con-artist",
    "a": {
      "label": "A theatrical stage magician",
      "setting": "Smiling under the spotlight, gesturing with white gloves as audience volunteers take their seats.",
      "name": "A magician's misdirection",
      "surface": "plum"
    },
    "b": {
      "label": "A seasoned street swindler",
      "setting": "Shuffling three cards on an upside-down cardboard crate while spotters watch the street corners.",
      "name": "A street shell game",
      "surface": "graphite"
    },
    "quality": 8.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "tuck-truck-countdown",
    "a": {
      "label": "The ice cream truck driver",
      "setting": "Shouting over tinny chime music as the sun sets on a crowded suburban cul-de-sac.",
      "name": "The truck departing",
      "surface": "apricot"
    },
    "b": {
      "label": "A mission control countdown lead",
      "setting": "Speaking through headphones to the rocket crew strapped onto the launchpad.",
      "name": "A rocket countdown",
      "surface": "space"
    },
    "quality": 8.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "turbulence-whisperer",
    "a": {
      "label": "Flight attendant over the intercom",
      "setting": "Speaking into the handset while the drink cart rattles during severe chop.",
      "name": "A flight attendant announcement",
      "surface": "sky"
    },
    "b": {
      "label": "Hairdresser holding shears",
      "setting": "Looking intently at your reflection in the salon mirror before making a cut.",
      "name": "A hairdresser's instruction",
      "surface": "blush"
    },
    "quality": 8.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "auction-defusal",
    "a": {
      "label": "An auctioneer closing a high-value lot",
      "setting": "Rapid, sharp cadence at the podium, wooden gavel poised over the block.",
      "name": "An auctioneer's gavel",
      "surface": "cream"
    },
    "b": {
      "label": "A deep sea diver monitoring oxygen",
      "setting": "A diver whispering into comms as pressure gauges tick down in dark water.",
      "name": "A deep sea distress",
      "surface": "navy"
    },
    "quality": 8.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-mail-ghost-warning",
    "a": {
      "label": "A dead letter office clerk",
      "setting": "Explaining to a frantic customer why their letter never reached its destination.",
      "name": "A lost package explanation",
      "surface": "paper"
    },
    "b": {
      "label": "A haunted house medium",
      "setting": "Warning paranormal investigators before they open the locked attic door.",
      "name": "A séance medium's warning",
      "surface": "moss"
    },
    "quality": 8.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "map-parent",
    "a": {
      "label": "An eccentric treasure hunter",
      "setting": "Guiding a nervous crew toward an overgrown island landmark.",
      "name": "A treasure hunt briefing",
      "surface": "forest"
    },
    "b": {
      "label": "An exhausted parent",
      "setting": "Unpacking groceries with an unhelpful toddler in a chaotic kitchen.",
      "name": "Toddler toy cleanup",
      "surface": "butter"
    },
    "quality": 8.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "pirate-captain-estate-reading",
    "a": {
      "label": "a pirate captain to their crew",
      "setting": "A peg-legged captain dividing a chest of stolen gold on the rolling deck.",
      "name": "A pirate treasure split",
      "surface": "oxblood"
    },
    "b": {
      "label": "a probate lawyer behind a mahogany desk",
      "setting": "A stern lawyer reading out shares to bickering relatives in a quiet office.",
      "name": "Reading of a will",
      "surface": "paper"
    },
    "quality": 8.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "substitute-and-hostage",
    "a": {
      "label": "A strict substitute teacher",
      "setting": "Standing at the chalkboard facing thirty rowdy seventh-graders throwing paper.",
      "name": "A substitute teacher's rule",
      "surface": "paper"
    },
    "b": {
      "label": "A tense hostage negotiator",
      "setting": "Speaking through a bullhorn toward a bank surrounded by squad cars.",
      "name": "A police negotiator",
      "surface": "navy"
    },
    "quality": 8.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "customer-support-haunted-attic",
    "a": {
      "label": "A tier-one tech support agent",
      "setting": "Reading a script into a headset for the fiftieth time today.",
      "name": "Customer service script",
      "surface": "fog"
    },
    "b": {
      "label": "A paranormal investigator",
      "setting": "Whispering into a handheld microphone in a pitch-black attic.",
      "name": "Ghost hunt recording",
      "surface": "ink"
    },
    "quality": 8.66,
    "battery": "pair-battery@2"
  },
  {
    "key": "chivalric-joust-dentist",
    "a": {
      "label": "A herald at a tournament",
      "setting": "Shouted to the crowd and riders before lances clash in the tilt yard.",
      "name": "A tournament herald",
      "surface": "oxblood"
    },
    "b": {
      "label": "A dentist checking teeth",
      "setting": "Murmured over a reclining patient clutching the armrests.",
      "name": "A dentist's chair",
      "surface": "mint"
    },
    "quality": 8.65,
    "battery": "pair-battery@2"
  },
  {
    "key": "custodian-museum",
    "a": {
      "label": "A subway lost-and-found clerk",
      "setting": "Cataloging unusual unclaimed personal items left behind in train cars.",
      "name": "A lost property log",
      "surface": "paper"
    },
    "b": {
      "label": "A spooky antique dealer",
      "setting": "Warning a curious customer away from a dusty cursed relic in the back.",
      "name": "A cursed antique warning",
      "surface": "plum"
    },
    "quality": 8.65,
    "battery": "pair-battery@2"
  },
  {
    "key": "wipeout-coaching-life",
    "a": {
      "label": "A veteran surf instructor shouts from the lineup",
      "setting": "Calling out from beyond the break as a huge set starts rolling in.",
      "name": "Surf lineup callout",
      "surface": "lime"
    },
    "b": {
      "label": "A stockbroker yells across the trading floor",
      "setting": "Screaming over ringing landlines as the market starts free-falling at market open.",
      "name": "A Wall Street panic",
      "surface": "ink"
    },
    "quality": 8.65,
    "battery": "pair-battery@2"
  },
  {
    "key": "chess-clock-bomb-squad",
    "a": {
      "label": "A chess arbiter",
      "setting": "Spoken sternly across the felt board as a player hovers over a piece.",
      "name": "A chess arbiter",
      "surface": "graphite"
    },
    "b": {
      "label": "A bomb technician over radio",
      "setting": "Whispered through a headset while staring at overlapping wires.",
      "name": "Bomb squad headset",
      "surface": "apricot"
    },
    "quality": 8.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "ghosts-and-renovations",
    "a": {
      "label": "A paranormal investigator",
      "setting": "Whispered into an audio recorder while standing in a chilly abandoned corridor.",
      "name": "EMF meter log",
      "surface": "fog"
    },
    "b": {
      "label": "A building inspector",
      "setting": "Noted aloud to a nervous homebuyer while tapping on a basement foundation wall.",
      "name": "Home inspection report",
      "surface": "butter"
    },
    "quality": 8.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "haunt-and-checkup",
    "a": {
      "label": "A ghost tour guide",
      "setting": "A guide holding a lantern speaks in a hush on cold attic stairs.",
      "name": "Haunted manor tour",
      "surface": "plum"
    },
    "b": {
      "label": "A pediatrician",
      "setting": "A doctor kneels beside an anxious child clutching a small blanket.",
      "name": "Pediatric checkup",
      "surface": "butter"
    },
    "quality": 8.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "planner-general",
    "a": {
      "label": "A stressed wedding planner",
      "setting": "Whispering frantically into a headset outside the reception tent.",
      "name": "Wedding planner panic",
      "surface": "rose"
    },
    "b": {
      "label": "A wartime battle commander",
      "setting": "Bending over a topographic map in a muddy command tent.",
      "name": "Battlefield commander",
      "surface": "forest"
    },
    "quality": 8.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "repair-requiem",
    "a": {
      "label": "A funeral director",
      "setting": "Speaking softly to a grieving family before opening the chapel doors.",
      "name": "Funeral director guidance",
      "surface": "plum"
    },
    "b": {
      "label": "An IT technician",
      "setting": "Explaining the state of a destroyed hard drive across a helpdesk counter.",
      "name": "Tech support diagnosis",
      "surface": "cream"
    },
    "quality": 8.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "techsupport-exorcism",
    "a": {
      "label": "A tired call center agent",
      "setting": "Speaking into a microphone after troubleshooting a glitchy laptop for two hours.",
      "name": "Customer tech support",
      "surface": "periwinkle"
    },
    "b": {
      "label": "An occult investigator",
      "setting": "Holding an ancient tome while smoke curls out of an unholy ritual circle.",
      "name": "Banishing a demon",
      "surface": "ink"
    },
    "quality": 8.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "crier-pundit",
    "a": {
      "label": "An 18th-century town crier",
      "setting": "Ringing a brass bell in the village square to deliver terrible royal news.",
      "name": "A town crier",
      "surface": "butter"
    },
    "b": {
      "label": "A late-night talk show host",
      "setting": "Delivering the monologue opening directly to the camera after breaking news.",
      "name": "A late-night monologue",
      "surface": "navy"
    },
    "quality": 8.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "fairy-doctor",
    "a": {
      "label": "The fairy godmother",
      "setting": "Spoken with urgency and gentle authority before the carriage departs.",
      "name": "A fairy godmother's rule",
      "surface": "rose"
    },
    "b": {
      "label": "An anesthesiologist",
      "setting": "Spoken softly over the hum of operating room monitors as the mask is fitted.",
      "name": "Going under anesthesia",
      "surface": "sea"
    },
    "quality": 8.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "gladiator-conductor",
    "a": {
      "label": "A lanista addressing gladiators before the games",
      "setting": "Shouted across the sandy courtyard as the arena gates begin to creak open.",
      "name": "Gladiator school prep",
      "surface": "space"
    },
    "b": {
      "label": "An orchestral conductor tapping the podium",
      "setting": "Whispered intensely to musicians before the opening downbeat of a symphony.",
      "name": "Symphony podium warning",
      "surface": "periwinkle"
    },
    "quality": 8.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "secret-recipe-espionage",
    "a": {
      "label": "A pastry master guarding an heirloom dish",
      "setting": "Whispering step-by-step secret baking ratios across a flour-dusted counter.",
      "name": "Guarded family recipe",
      "surface": "cream"
    },
    "b": {
      "label": "A corporate spy handing over blueprints",
      "setting": "Passing an encrypted thumb drive under a rainy bridge late at night.",
      "name": "Smuggled company secrets",
      "surface": "graphite"
    },
    "quality": 8.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "tailor-fitting-double-agent",
    "a": {
      "label": "A master tailor at a final fitting",
      "setting": "Muttered with pins in mouth, adjusting the lapels of a client's bespoke suit.",
      "name": "A tailor's fitting note",
      "surface": "butter"
    },
    "b": {
      "label": "A counter-espionage interrogator",
      "setting": "Spoken across a steel table to an unmasked mole whose cover story collapsed.",
      "name": "Unmasking a mole",
      "surface": "ink"
    },
    "quality": 8.63,
    "battery": "pair-battery@2"
  },
  {
    "key": "boss-wilderness",
    "a": {
      "label": "A corporate manager",
      "setting": "An executive briefing an exhausted team in a boardroom as the deadline looms.",
      "name": "The quarterly review",
      "surface": "graphite"
    },
    "b": {
      "label": "A backcountry trail guide",
      "setting": "A guide addressing wet, exhausted hikers around a sputtering campfire.",
      "name": "Wilderness survival tip",
      "surface": "forest"
    },
    "quality": 8.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "gameshow-ultimatum",
    "a": {
      "label": "A prime-time game show host",
      "setting": "Standing beside a tense contestant under blinding studio spotlights.",
      "name": "A game show finale",
      "surface": "apricot"
    },
    "b": {
      "label": "A surgeon in the operating room",
      "setting": "Holding a scalpel above a critical incision while monitoring the vitals.",
      "name": "An operating room command",
      "surface": "sea"
    },
    "quality": 8.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "head-chef-bomb-squad",
    "a": {
      "label": "An executive chef expediting service",
      "setting": "Leaning over the hot line during an overwhelming Friday night rush.",
      "name": "A restaurant expeditor shout",
      "surface": "butter"
    },
    "b": {
      "label": "A safecracker directing a crew",
      "setting": "Whispering through a tunnel as guards walk the floor above.",
      "name": "A heist timer count",
      "surface": "moss"
    },
    "quality": 8.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "postal-clerk-smuggler",
    "a": {
      "label": "A postal worker at the counter",
      "setting": "Said across the scale to a nervous customer mailing a taped-up cardboard box.",
      "name": "Post office counter check",
      "surface": "paper"
    },
    "b": {
      "label": "A getaway cargo coordinator",
      "setting": "Said in a dim warehouse to an anxious courier handling illicit contraband.",
      "name": "Smuggler cargo check",
      "surface": "oxblood"
    },
    "quality": 8.62,
    "battery": "pair-battery@2"
  },
  {
    "key": "archaeology-tomb-chamber",
    "a": {
      "label": "A lead archaeologist",
      "setting": "Whispered through dust and headlamp beams as the trowel clears the seal of an undisturbed burial chamber.",
      "name": "An ancient tomb breach",
      "surface": "forest"
    },
    "b": {
      "label": "A landlord during inspection",
      "setting": "Peering with disgust into the back of a tenant's abandoned basement storage unit.",
      "name": "A landlord's walk-through",
      "surface": "apricot"
    },
    "quality": 8.61,
    "battery": "pair-battery@2"
  },
  {
    "key": "caesar-baker",
    "a": {
      "label": "A Roman senator",
      "setting": "A toga-clad conspirator whispers urgent council to his ally on the steps of the Senate.",
      "name": "A Roman conspiracy",
      "surface": "paper"
    },
    "b": {
      "label": "A sourdough baker",
      "setting": "A master baker inspects the bubbling glass jar with an apprentice in the pre-dawn kitchen.",
      "name": "A sourdough ritual",
      "surface": "butter"
    },
    "quality": 8.61,
    "battery": "pair-battery@2"
  },
  {
    "key": "group-saloon",
    "a": {
      "label": "A friend on their phone",
      "setting": "Typing quick updates into a crowded group chat late on a Friday night.",
      "name": "A group text",
      "surface": "lime"
    },
    "b": {
      "label": "A wary barkeep",
      "setting": "Wiping down the wooden counter as rowdy outlaws push open the batwing doors.",
      "name": "A saloon confrontation",
      "surface": "ink"
    },
    "quality": 8.61,
    "battery": "pair-battery@2"
  },
  {
    "key": "timetravel-gardener",
    "a": {
      "label": "A temporal mechanic",
      "setting": "A scientist lecturing a time traveler stepping onto the chronal pad.",
      "name": "Time travel safety guidelines",
      "surface": "space"
    },
    "b": {
      "label": "A seasoned master gardener",
      "setting": "An elderly gardener showing a novice how to prune delicate heritage roses.",
      "name": "A master gardener's advice",
      "surface": "moss"
    },
    "quality": 8.61,
    "battery": "pair-battery@2"
  },
  {
    "key": "news-signoff-and-space-probe",
    "a": {
      "label": "A retiring news veteran",
      "setting": "Delivering his final signoff broadcast after forty uninterrupted years on air.",
      "name": "An anchor's signoff",
      "surface": "sky"
    },
    "b": {
      "label": "A dying space probe",
      "setting": "Transmitting a final automated diagnostic telemetry string before power loss.",
      "name": "A probe's shutdown",
      "surface": "space"
    },
    "quality": 8.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "shelter-spy",
    "a": {
      "label": "A rescue shelter worker introducing an adopted cat",
      "setting": "A shelter worker whispers to new owners while pointing inside a wire cage.",
      "name": "Adopting a shy cat",
      "surface": "cream"
    },
    "b": {
      "label": "A handler briefing an intelligence operative",
      "setting": "A spy handler debriefs a deep-cover sleeper agent in a dark park.",
      "name": "A spy handler briefing",
      "surface": "space"
    },
    "quality": 8.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "tech-support-ghost-hunt",
    "a": {
      "label": "A frustrated IT specialist",
      "setting": "Speaking into a headset while remotely diagnosing an uncooperative office PC.",
      "name": "A remote desktop diagnosis",
      "surface": "sky"
    },
    "b": {
      "label": "An exorcist's apprentice",
      "setting": "Whispering to a trembling homeowner while inspecting cold spots in an attic.",
      "name": "An exorcist's inquiry",
      "surface": "oxblood"
    },
    "quality": 8.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "atm-cryptid",
    "a": {
      "label": "An automated teller machine voice prompt",
      "setting": "Echoing through a tinny outdoor speaker in a dark concrete kiosk at 2 a.m.",
      "name": "An ATM audio prompt",
      "surface": "fog"
    },
    "b": {
      "label": "A forest ranger warning hikers",
      "setting": "Standing by the trailhead map at dusk, warning backpackers entering deep woods.",
      "name": "A park ranger's warning",
      "surface": "forest"
    },
    "quality": 8.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "caveman-warning-fashion-critique",
    "a": {
      "label": "a Neanderthal elder grunting and pointing",
      "setting": "An elder warning the tribe about the creature lurking in the dark woods.",
      "name": "A caveman warning",
      "surface": "moss"
    },
    "b": {
      "label": "a high-fashion runway judge",
      "setting": "A haughty critic whispering about an unflattering winter collection.",
      "name": "A fashion critique",
      "surface": "lilac"
    },
    "quality": 8.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "coaching-alchemy",
    "a": {
      "label": "A track coach",
      "setting": "Holding a stopwatch on a foggy track, shouting at a panting runner.",
      "name": "A track coach critique",
      "surface": "lime"
    },
    "b": {
      "label": "A medieval alchemist",
      "setting": "Stirring a boiling copper crucible over an intense furnace.",
      "name": "An alchemist formula",
      "surface": "ink"
    },
    "quality": 8.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-complaint-submarine",
    "a": {
      "label": "An aggressive HOA president",
      "setting": "Addressing a packed neighborhood clubhouse about repeated rule violations.",
      "name": "HOA violation hearing",
      "surface": "apricot"
    },
    "b": {
      "label": "A submarine executive officer",
      "setting": "Whispering sternly to crew members in the control room while evading sonar.",
      "name": "Submarine silent running",
      "surface": "navy"
    },
    "quality": 8.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "potty-trainer-coach",
    "a": {
      "label": "A weary parent",
      "setting": "Crouching on the bathroom tile with sticker chart in hand.",
      "name": "Potty training pep talk",
      "surface": "cream"
    },
    "b": {
      "label": "An Olympic weightlifting coach",
      "setting": "Shouting from the platform edge as the chalk dust settles.",
      "name": "Weightlifting coaching",
      "surface": "oxblood"
    },
    "quality": 8.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "substitute-jailer",
    "a": {
      "label": "A substitute teacher",
      "setting": "Said to a rowdy classroom of teenagers while tapping a dry-erase marker on the desk.",
      "name": "A substitute teacher's rule",
      "surface": "paper"
    },
    "b": {
      "label": "A prison warden",
      "setting": "Announced to new inmates standing in line under fluorescent lights.",
      "name": "A warden's orientation",
      "surface": "oxblood"
    },
    "quality": 8.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "barista-detective",
    "a": {
      "label": "A busy barista",
      "setting": "Shouting over the hiss of steam to a packed counter during morning rush.",
      "name": "A coffee shop order",
      "surface": "butter"
    },
    "b": {
      "label": "A gritty detective",
      "setting": "Addressing a rookie partner in an alley under flickering streetlight.",
      "name": "A hardboiled warning",
      "surface": "ink"
    },
    "quality": 8.58,
    "battery": "pair-battery@2"
  },
  {
    "key": "insurance-claims-confession",
    "a": {
      "label": "An adjuster",
      "setting": "Spoken flatly into a phone while inspecting charred wooden beams.",
      "name": "Insurance claim call",
      "surface": "graphite"
    },
    "b": {
      "label": "A Catholic priest",
      "setting": "Whispered through the mesh partition of a dark confessional booth.",
      "name": "A confession booth",
      "surface": "plum"
    },
    "quality": 8.58,
    "battery": "pair-battery@2"
  },
  {
    "key": "stager-exorcist",
    "a": {
      "label": "A professional home stager",
      "setting": "Instructing movers to declutter an overstuffed estate before listing.",
      "name": "A home staging consult",
      "surface": "peach"
    },
    "b": {
      "label": "An occult exorcist",
      "setting": "Chanting ancient rites to banish a malevolent presence from a hallway.",
      "name": "A house cleansing rite",
      "surface": "space"
    },
    "quality": 8.58,
    "battery": "pair-battery@2"
  },
  {
    "key": "dating-profile-curator",
    "a": {
      "label": "Online dater",
      "setting": "The short bio typed beneath three carefully chosen vacation photos.",
      "name": "A dating app bio",
      "surface": "peach"
    },
    "b": {
      "label": "Gallery curator",
      "setting": "The printed plaque mounted on the wall beside an eccentric modern sculpture.",
      "name": "Museum wall plaque",
      "surface": "paper"
    },
    "quality": 8.57,
    "battery": "pair-battery@2"
  },
  {
    "key": "dentist-negotiator",
    "a": {
      "label": "A dentist",
      "setting": "Spoken under a blinding halogen lamp while holding a tiny mirror and probe.",
      "name": "A dentist's exam",
      "surface": "mint"
    },
    "b": {
      "label": "A ruthless corporate auditor",
      "setting": "Leaning over a stack of suspicious ledgers in a private boardroom.",
      "name": "An auditor's probe",
      "surface": "graphite"
    },
    "quality": 8.57,
    "battery": "pair-battery@2"
  },
  {
    "key": "interview-safari",
    "a": {
      "label": "A hiring manager",
      "setting": "Sitting across a conference desk, evaluating a nervous candidate's portfolio.",
      "name": "A job interview",
      "surface": "navy"
    },
    "b": {
      "label": "A wildlife guide",
      "setting": "Whispering from an open jeep as a predator approaches the waterhole.",
      "name": "A safari briefing",
      "surface": "moss"
    },
    "quality": 8.57,
    "battery": "pair-battery@2"
  },
  {
    "key": "teller-heist",
    "a": {
      "label": "A courteous bank teller",
      "setting": "Speaking through bulletproof glass while counting out crisp bills for a client.",
      "name": "A bank transaction",
      "surface": "cream"
    },
    "b": {
      "label": "A seasoned getaway driver",
      "setting": "Tapping the steering wheel in the alley behind the vault, engine idling.",
      "name": "A getaway driver's warning",
      "surface": "navy"
    },
    "quality": 8.57,
    "battery": "pair-battery@2"
  },
  {
    "key": "high-school-hall-monitor-and-prison-warden",
    "a": {
      "label": "A strict hall monitor's demand",
      "setting": "Standing arms crossed beside the lockers as the morning tardy bell finishes ringing.",
      "name": "Hall monitor demand",
      "surface": "lime"
    },
    "b": {
      "label": "A border patrol officer's challenge",
      "setting": "Under floodlights at an international checkpoint gate, hand resting on a sidearm.",
      "name": "Border checkpoint check",
      "surface": "fog"
    },
    "quality": 8.56,
    "battery": "pair-battery@2"
  },
  {
    "key": "tech-confession",
    "a": {
      "label": "A tech support agent",
      "setting": "Speaking through a headset to an exasperated user whose machine won't boot.",
      "name": "A tech support hotline",
      "surface": "mint"
    },
    "b": {
      "label": "A Catholic priest",
      "setting": "Whispering quietly behind a wooden screen to a tearful parishioner.",
      "name": "A priest in confession",
      "surface": "plum"
    },
    "quality": 8.56,
    "battery": "pair-battery@2"
  },
  {
    "key": "gym-trainer-communion",
    "a": {
      "label": "A personal trainer",
      "setting": "Spotting a struggling client through their final heavy set of squats on leg day.",
      "name": "A fitness trainer push",
      "surface": "lime"
    },
    "b": {
      "label": "A Eucharistic minister",
      "setting": "Distributing bread and chalice to kneeling parishioners at the altar rail on Sunday morning.",
      "name": "Communion distribution",
      "surface": "cream"
    },
    "quality": 8.55,
    "battery": "pair-battery@2"
  },
  {
    "key": "magic-mirror-loan-officer",
    "a": {
      "label": "A magical enchanted mirror",
      "setting": "Speaking truth in cold whispers to the vain queen awaiting flattery.",
      "name": "The magic mirror's answer",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A mortgage loan officer",
      "setting": "Reviewing an applicant's flawed credit history across a desk.",
      "name": "A mortgage denial",
      "surface": "graphite"
    },
    "quality": 8.55,
    "battery": "pair-battery@2"
  },
  {
    "key": "surgeon-art-restorer",
    "a": {
      "label": "A lead surgeon mid-operation",
      "setting": "Speaking under bright overhead lights as the patient's vitals hum steadily.",
      "name": "Operating room call",
      "surface": "sea"
    },
    "b": {
      "label": "A master art restorer",
      "setting": "Leaning over a centuries-old cracked canvas with tweezers and solvent.",
      "name": "Restoring an artifact",
      "surface": "apricot"
    },
    "quality": 8.55,
    "battery": "pair-battery@2"
  },
  {
    "key": "prescription-potion",
    "a": {
      "label": "A careful retail pharmacist",
      "setting": "Handing a brown bottle over the pharmacy counter with stern warnings.",
      "name": "Medication warning",
      "surface": "paper"
    },
    "b": {
      "label": "A stage illusionist",
      "setting": "Leaning over the footlights to instruct a volunteer before a daring stunt.",
      "name": "Magician's disclaimer",
      "surface": "space"
    },
    "quality": 8.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "wild-west-showdown-return-counter",
    "a": {
      "label": "a gunslinger in the dusty street",
      "setting": "A grizzled outlaw squinting at the town sheriff under the midday sun.",
      "name": "A Wild West showdown",
      "surface": "apricot"
    },
    "b": {
      "label": "a frustrated customer service clerk",
      "setting": "Clerk refusing a refund to a stubborn shopper without a receipt.",
      "name": "Customer service return",
      "surface": "fog"
    },
    "quality": 8.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "circus-surgeon",
    "a": {
      "label": "Ringmaster to crowd",
      "setting": "Shouting into the center-ring microphone before the climactic act.",
      "name": "The circus ringmaster",
      "surface": "oxblood"
    },
    "b": {
      "label": "Surgeon to operating team",
      "setting": "Gloved hands extended under bright operating lights before the incision.",
      "name": "A surgeon's prep",
      "surface": "mint"
    },
    "quality": 8.53,
    "battery": "pair-battery@2"
  },
  {
    "key": "spacewalk-tether-deep-cave",
    "a": {
      "label": "An astronaut outside the hatch",
      "setting": "Floating above the blue curve of Earth, checking cables before letting go of the station airlock.",
      "name": "A spacewalk checkout",
      "surface": "sky"
    },
    "b": {
      "label": "A speleologist descending a pit",
      "setting": "Headlamp cutting into absolute blackness at the mouth of an unexplored vertical cave shaft.",
      "name": "Dropping into a cave",
      "surface": "oxblood"
    },
    "quality": 8.53,
    "battery": "pair-battery@2"
  },
  {
    "key": "submarine-returns",
    "a": {
      "label": "An unhelpful retail clerk",
      "setting": "Staring blankly across the customer service counter at an angry shopper holding a box.",
      "name": "The return desk",
      "surface": "paper"
    },
    "b": {
      "label": "A chief engineer",
      "setting": "Gripping a bulkhead as seawater drips down a damaged pressure hatch in the abyss.",
      "name": "Submarine hull breach",
      "surface": "navy"
    },
    "quality": 8.53,
    "battery": "pair-battery@2"
  },
  {
    "key": "treasure-pharmacy",
    "a": {
      "label": "A medieval cartographer annotating a parchment",
      "setting": "Written carefully in ink beside an uncharted island sketched with skulls.",
      "name": "Treasure map margins",
      "surface": "paper"
    },
    "b": {
      "label": "A pharmacist dispensing new medication",
      "setting": "Explained over the counter while pointing at the warning label stickers.",
      "name": "Medication warning label",
      "surface": "cream"
    },
    "quality": 8.53,
    "battery": "pair-battery@2"
  },
  {
    "key": "blackjack-emergency",
    "a": {
      "label": "Casino dealer",
      "setting": "A dealer taps the green felt as nervous players eye their cards.",
      "name": "Blackjack table call",
      "surface": "forest"
    },
    "b": {
      "label": "Flight paramedic",
      "setting": "A paramedic checks vitals in the back of a vibrating rescue chopper.",
      "name": "Emergency medical transport",
      "surface": "fog"
    },
    "quality": 8.52,
    "battery": "pair-battery@2"
  },
  {
    "key": "sleep-training-interrogation",
    "a": {
      "label": "An exhausted parent",
      "setting": "Whispering sternly outside a nursery door during week two of sleep training.",
      "name": "Tuck-in discipline",
      "surface": "apricot"
    },
    "b": {
      "label": "A seasoned detective",
      "setting": "Standing over an uncooperative suspect in a sterile interrogation room.",
      "name": "Interrogation room push",
      "surface": "ink"
    },
    "quality": 8.52,
    "battery": "pair-battery@2"
  },
  {
    "key": "stormchaser-dentist",
    "a": {
      "label": "A storm chaser",
      "setting": "Shouted over roaring wind into a dashboard radio as a funnel cloud touches down.",
      "name": "A storm chaser radio",
      "surface": "space"
    },
    "b": {
      "label": "A mindfulness coach",
      "setting": "Spoken calmly to a room of professionals during a breathing workshop.",
      "name": "Mindfulness training",
      "surface": "apricot"
    },
    "quality": 8.52,
    "battery": "pair-battery@2"
  },
  {
    "key": "tornado-siren-waitstaff",
    "a": {
      "label": "An emergency broadcaster",
      "setting": "Sirens wailing as a severe funnel cloud touches down nearby.",
      "name": "A tornado warning",
      "surface": "graphite"
    },
    "b": {
      "label": "A restaurant host",
      "setting": "Greeter welcoming walk-ins during an overwhelming dinner rush.",
      "name": "Seating a walk-in",
      "surface": "butter"
    },
    "quality": 8.52,
    "battery": "pair-battery@2"
  },
  {
    "key": "turbulence-dentist-563",
    "a": {
      "label": "A pilot over the intercom",
      "setting": "Chime sounds as the aircraft jolts sharply through heavy clouds.",
      "name": "A Pilot's Intercom",
      "surface": "sky"
    },
    "b": {
      "label": "A pediatric dentist with drill in hand",
      "setting": "Spoken gently into a brightly lit face while reaching for the tray.",
      "name": "A Dentist's Chair",
      "surface": "blush"
    },
    "quality": 8.52,
    "battery": "pair-battery@2"
  },
  {
    "key": "pharmacist-bartender",
    "a": {
      "label": "A pharmacist",
      "setting": "Spoken quietly across the counter while sliding an amber vial across the glass.",
      "name": "A pharmacist's consultation",
      "surface": "fog"
    },
    "b": {
      "label": "A street illusionist",
      "setting": "Whispered to a volunteer while pressing a small silver coin into their palm.",
      "name": "A street magic reveal",
      "surface": "space"
    },
    "quality": 8.51,
    "battery": "pair-battery@2"
  },
  {
    "key": "senate-rock-band",
    "a": {
      "label": "A Roman senator addressing the forum",
      "setting": "Shouted to citizens gathered on marble steps before casting a fateful vote.",
      "name": "A Roman Senate oration",
      "surface": "oxblood"
    },
    "b": {
      "label": "A rock frontman to the crowd",
      "setting": "Roared into the microphone under flashing arena stage lights.",
      "name": "Arena rock banter",
      "surface": "lime"
    },
    "quality": 8.51,
    "battery": "pair-battery@2"
  },
  {
    "key": "ceremony-launch",
    "a": {
      "label": "An ordained minister",
      "setting": "Addressing the congregation before pouring water over an infant.",
      "name": "A baptism ceremony",
      "surface": "sky"
    },
    "b": {
      "label": "A shipyard captain",
      "setting": "Shouting over horns as a massive hull slides into the ocean.",
      "name": "Christening a ship",
      "surface": "sea"
    },
    "quality": 8.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "fortune-and-product",
    "a": {
      "label": "A fortune cookie slip",
      "setting": "Printed on a narrow strip of paper tucked inside a cracked-open cookie.",
      "name": "Fortune cookie paper",
      "surface": "cream"
    },
    "b": {
      "label": "A luxury car slogan",
      "setting": "Inscribed boldly at the bottom of a sleek glossy magazine advertisement.",
      "name": "Luxury car tagline",
      "surface": "navy"
    },
    "quality": 8.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "gyms-and-space",
    "a": {
      "label": "A powerlifting spotter",
      "setting": "Leaning over a loaded barbell while shouting encouragement into an athlete's ear.",
      "name": "A heavy lift spotter",
      "surface": "lime"
    },
    "b": {
      "label": "A mission control operator",
      "setting": "Staring at declining telemetry readouts as a lander approaches lunar terrain.",
      "name": "A lunar landing broadcast",
      "surface": "space"
    },
    "quality": 8.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "receipt-and-confession",
    "a": {
      "label": "A department store cashier",
      "setting": "Speaking to a hurried shopper while bagging fragile merchandise at checkout.",
      "name": "Retail checkout wrap-up",
      "surface": "peach"
    },
    "b": {
      "label": "A seasoned police detective",
      "setting": "Sliding a signed confession form across a metal table in an interrogation room.",
      "name": "Detective interrogation wrap-up",
      "surface": "graphite"
    },
    "quality": 8.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-chore-wheel-emperor-decree",
    "a": {
      "label": "A control-freak roommate",
      "setting": "Tapping a color-coded magnetic whiteboard at an agonizing Sunday house meeting.",
      "name": "A chore wheel meeting",
      "surface": "apricot"
    },
    "b": {
      "label": "A Roman emperor",
      "setting": "Addressing the Senate floor from an ivory dais to announce forced labor drafts.",
      "name": "An imperial decree",
      "surface": "plum"
    },
    "quality": 8.49,
    "battery": "pair-battery@2"
  },
  {
    "key": "gym-personal-trainer-coroner",
    "a": {
      "label": "A personal trainer",
      "setting": "Standing over a client lying flat on a mat after an intense circuit.",
      "name": "A gym cooldown",
      "surface": "lime"
    },
    "b": {
      "label": "A medical examiner",
      "setting": "Dictating into an overhead microphone while standing by the steel gurney.",
      "name": "An autopsy report",
      "surface": "graphite"
    },
    "quality": 8.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "paranormal-and-parenting",
    "a": {
      "label": "A ghost researcher",
      "setting": "Speaking into a night-vision camcorder inside a cold, silent nursery.",
      "name": "Paranormal baseline check",
      "surface": "space"
    },
    "b": {
      "label": "A watchful mother",
      "setting": "Tiptoeing across creaky floorboards toward the cracked crib door.",
      "name": "Nursery monitor check",
      "surface": "butter"
    },
    "quality": 8.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "roommate-chores-drill-sergeant",
    "a": {
      "label": "A passive-aggressive tenant",
      "setting": "Tacked to the shared chore board on the hallway bulletin board.",
      "name": "A roommate cleaning roster",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A military drill sergeant",
      "setting": "Screaming at recruits while pacing down the center of the barracks floor.",
      "name": "A barracks inspection",
      "surface": "moss"
    },
    "quality": 8.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "scissor-snip-and-hostage",
    "a": {
      "label": "A master barber",
      "setting": "A razor glides along the back of a customer's tilted neck.",
      "name": "Barbershop shave",
      "surface": "lime"
    },
    "b": {
      "label": "A museum security chief",
      "setting": "A guard spots an intruder stepping over laser sensors at midnight.",
      "name": "Gallery alarm trip",
      "surface": "oxblood"
    },
    "quality": 8.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "wilderness-guide-museum-curator",
    "a": {
      "label": "A wilderness survival guide",
      "setting": "Warned to backpackers at dusk while securing bear canisters to high limbs.",
      "name": "A bear country warning",
      "surface": "moss"
    },
    "b": {
      "label": "A museum docent",
      "setting": "Instructed quietly to a tour group standing before fragile oil canvases.",
      "name": "A gallery docent",
      "surface": "cream"
    },
    "quality": 8.48,
    "battery": "pair-battery@2"
  },
  {
    "key": "casino-dealer-art-auction",
    "a": {
      "label": "Blackjack dealer",
      "setting": "Tapping green felt under bright casino chandeliers as the shoe runs dry.",
      "name": "A casino dealer call",
      "surface": "forest"
    },
    "b": {
      "label": "High-stakes art auctioneer",
      "setting": "Standing at the podium in a silent gallery, gavel raised over a disputed masterpiece.",
      "name": "An auctioneer closing",
      "surface": "paper"
    },
    "quality": 8.47,
    "battery": "pair-battery@2"
  },
  {
    "key": "curator-and-crime",
    "a": {
      "label": "An art gallery curator",
      "setting": "A curator guides a VIP collector past a minimalist canvas.",
      "name": "Gallery walkthrough",
      "surface": "cream"
    },
    "b": {
      "label": "A lead detective pointing at evidence",
      "setting": "A detective talks to their partner beside chalk outlines.",
      "name": "Crime scene walk",
      "surface": "graphite"
    },
    "quality": 8.47,
    "battery": "pair-battery@2"
  },
  {
    "key": "roots-and-buried-gold",
    "a": {
      "label": "A hair colorist",
      "setting": "A stylist speaks to a client draped in foil beneath salon mirrors.",
      "name": "Hair salon consult",
      "surface": "peach"
    },
    "b": {
      "label": "An old sea dog",
      "setting": "A grizzled sailor taps weathered parchment by flickering lantern light.",
      "name": "Treasure map clue",
      "surface": "ink"
    },
    "quality": 8.47,
    "battery": "pair-battery@2"
  },
  {
    "key": "aquarium-surfer",
    "a": {
      "label": "A big wave surfer giving paddling advice",
      "setting": "A veteran surfer shouts over roaring whitewash at the break line.",
      "name": "A big wave warning",
      "surface": "sea"
    },
    "b": {
      "label": "An aquarium keeper feeding predatory sharks",
      "setting": "A marine biologist speaks into a headset while lowering raw fish into a tank.",
      "name": "A shark tank feed",
      "surface": "navy"
    },
    "quality": 8.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "fortune-breakup",
    "a": {
      "label": "A tarot reader",
      "setting": "Flipping over the Tower card with a somber look in a dim tent.",
      "name": "A tarot reading",
      "surface": "lilac"
    },
    "b": {
      "label": "An HR director",
      "setting": "Sliding a severance package across a mahogany desk at nine in the morning.",
      "name": "An exit interview",
      "surface": "paper"
    },
    "quality": 8.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "group-chat-court-martial",
    "a": {
      "label": "An angry group chat member",
      "setting": "Fired off in all caps after someone spoiled a finale in the main thread.",
      "name": "A group chat mutiny",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A military tribunal officer",
      "setting": "Read from a leather folder in a windowless room to an accused officer.",
      "name": "A court-martial ruling",
      "surface": "ink"
    },
    "quality": 8.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "joust-dmv",
    "a": {
      "label": "A tournament master",
      "setting": "Calling the final clash of armored champions before the royal gallery.",
      "name": "A jousting referee",
      "surface": "apricot"
    },
    "b": {
      "label": "A weary license examiner",
      "setting": "Talking a nervous teenager through parallel parking in a sedan.",
      "name": "A driver's license examiner",
      "surface": "periwinkle"
    },
    "quality": 8.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "treasure-contract",
    "a": {
      "label": "A pirate cartographer",
      "setting": "An aged mariner sketches cryptic markings on weathered vellum by candlelight.",
      "name": "Treasure map clue",
      "surface": "apricot"
    },
    "b": {
      "label": "A lawyer explaining an agreement",
      "setting": "An attorney points a fountain pen toward the dashed line on the final page.",
      "name": "Signing the contract",
      "surface": "graphite"
    },
    "quality": 8.46,
    "battery": "pair-battery@2"
  },
  {
    "key": "plunder-and-probation",
    "a": {
      "label": "A pirate captain",
      "setting": "Bellowing down from the quarterdeck as the crew splits a captured chest of gold coins.",
      "name": "Pirate loot division",
      "surface": "oxblood"
    },
    "b": {
      "label": "A strict probation officer",
      "setting": "Laying down terms across an office desk to a newly released parolee.",
      "name": "Probation conditions",
      "surface": "fog"
    },
    "quality": 8.45,
    "battery": "pair-battery@2"
  },
  {
    "key": "rockstar-clergy",
    "a": {
      "label": "A rock frontman to the crowd",
      "setting": "A sweat-soaked singer roars into the microphone before the final stadium encore.",
      "name": "Encore hype",
      "surface": "rose"
    },
    "b": {
      "label": "A wedding officiant",
      "setting": "A celebrant beams at the gathered guests before welcoming the couple forward.",
      "name": "Officiant opening remarks",
      "surface": "butter"
    },
    "quality": 8.45,
    "battery": "pair-battery@2"
  },
  {
    "key": "triage-and-haunted",
    "a": {
      "label": "An ER triage nurse",
      "setting": "A nurse examines an incoming patient on a rolling gurney.",
      "name": "ER triage assessment",
      "surface": "sea"
    },
    "b": {
      "label": "A frightened homeowner confronting a ghost",
      "setting": "A homeowner stands alone in a freezing hallway clutching a candle.",
      "name": "Confronting a ghost",
      "surface": "plum"
    },
    "quality": 8.45,
    "battery": "pair-battery@2"
  },
  {
    "key": "cake-funeral",
    "a": {
      "label": "A wedding cake designer",
      "setting": "A pastry chef advising an anxious couple on transport instructions for tiering.",
      "name": "A wedding cake consult",
      "surface": "blush"
    },
    "b": {
      "label": "An embalmer preparing a viewing",
      "setting": "A mortician giving final instructions to an assistant before the family enters.",
      "name": "Funeral home prep",
      "surface": "fog"
    },
    "quality": 8.44,
    "battery": "pair-battery@2"
  },
  {
    "key": "interview-museum",
    "a": {
      "label": "An eager candidate",
      "setting": "Lean forward across a glass table attempting to impress an executive.",
      "name": "Interview pitch",
      "surface": "paper"
    },
    "b": {
      "label": "A museum docent",
      "setting": "Standing beside an ancient broken relic behind velvet ropes.",
      "name": "Museum tour guide",
      "surface": "apricot"
    },
    "quality": 8.44,
    "battery": "pair-battery@2"
  },
  {
    "key": "space-dentist",
    "a": {
      "label": "A spacewalk mission specialist",
      "setting": "Radioed through an EVA helmet while repairing an exterior airlock latch.",
      "name": "Spacewalk repair comms",
      "surface": "sky"
    },
    "b": {
      "label": "An orthodontist fitting braces",
      "setting": "Leaning over a patient with metal pliers under blinding white overhead lights.",
      "name": "Orthodontist fitting",
      "surface": "mint"
    },
    "quality": 8.44,
    "battery": "pair-battery@2"
  },
  {
    "key": "superhero-sidekick-hostage-negotiator",
    "a": {
      "label": "An exasperated teenage sidekick",
      "setting": "Talking down an overpowered, arrogant hero mid-brawl in a ruined bank.",
      "name": "A sidekick pleading",
      "surface": "sky"
    },
    "b": {
      "label": "A police hostage negotiator",
      "setting": "Holding a megaphone outside a barricaded bank vault at dusk.",
      "name": "A hostage negotiator",
      "surface": "navy"
    },
    "quality": 8.44,
    "battery": "pair-battery@2"
  },
  {
    "key": "wild-west-poker",
    "a": {
      "label": "A frontier gambler",
      "setting": "Pushing your last gold coins into the center of the smoky table.",
      "name": "A saloon poker raise",
      "surface": "forest"
    },
    "b": {
      "label": "A corporate CEO",
      "setting": "Addressing the board before committing the entire yearly budget to a merger.",
      "name": "A hostile takeover pitch",
      "surface": "navy"
    },
    "quality": 8.44,
    "battery": "pair-battery@2"
  },
  {
    "key": "curtain-hold",
    "a": {
      "label": "A stage manager on headset",
      "setting": "Whispered sharply into a headset backstage as opening music swells and dancers panic.",
      "name": "Stage manager cue",
      "surface": "graphite"
    },
    "b": {
      "label": "A call center rep",
      "setting": "Spoken into an office headset while placing a frustrated caller back on hold.",
      "name": "Customer service hold",
      "surface": "butter"
    },
    "quality": 8.43,
    "battery": "pair-battery@2"
  },
  {
    "key": "grief-florist-order",
    "a": {
      "label": "A grieving adult",
      "setting": "Speaking softly to family members while sorting heirlooms in an empty attic.",
      "name": "Clearing out a home",
      "surface": "navy"
    },
    "b": {
      "label": "A wedding florist",
      "setting": "Guiding an overwhelmed couple through catalogue arrangements at the design counter.",
      "name": "A florist consultation",
      "surface": "blush"
    },
    "quality": 8.43,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-booty-to-dietitian",
    "a": {
      "label": "A treasure seeker's logbook entry",
      "setting": "Jotting notes into a leather journal beside an empty excavated cavern.",
      "name": "A treasure hunter log",
      "surface": "apricot"
    },
    "b": {
      "label": "A stern personal trainer",
      "setting": "Reviewing a client's weekly body composition charts at the gym.",
      "name": "A personal trainer review",
      "surface": "lime"
    },
    "quality": 8.43,
    "battery": "pair-battery@2"
  },
  {
    "key": "understudy-campaign-trail",
    "a": {
      "label": "An anxious understudy",
      "setting": "Murmuring in the dressing room mirror after the lead falls ill.",
      "name": "Understudy pep talk",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A vice presidential candidate",
      "setting": "Stepping toward the podium after unexpected breaking news.",
      "name": "Running mate debut",
      "surface": "cream"
    },
    "quality": 8.43,
    "battery": "pair-battery@2"
  },
  {
    "key": "valet-and-undercover",
    "a": {
      "label": "A luxury car valet",
      "setting": "Handing polished brass keys back to a nervous guest at a gala driveway.",
      "name": "Valet ticket return",
      "surface": "paper"
    },
    "b": {
      "label": "A getaway specialist",
      "setting": "Whispering across the front seat through an earbud during an active surveillance sweep.",
      "name": "Covert wheelman",
      "surface": "ink"
    },
    "quality": 8.43,
    "battery": "pair-battery@2"
  },
  {
    "key": "candidate-funeral",
    "a": {
      "label": "A concession speech writer",
      "setting": "Revising remarks after an agonizing election defeat on election night.",
      "name": "A concession speech",
      "surface": "fog"
    },
    "b": {
      "label": "A hospital chaplain",
      "setting": "Comforting grieving family members in a quiet hallway after a loss.",
      "name": "A grief counselor",
      "surface": "lilac"
    },
    "quality": 8.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "choir-and-countdown",
    "a": {
      "label": "A cathedral choir director",
      "setting": "A choir director whispers instructions to the vocalists before the opening note.",
      "name": "A choral rehearsal note",
      "surface": "cream"
    },
    "b": {
      "label": "A mission flight director",
      "setting": "A flight controller speaks over the master loop as the clock ticks down.",
      "name": "A launch control countdown",
      "surface": "navy"
    },
    "quality": 8.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "customer-service-hostage",
    "a": {
      "label": "Perky retail returns manager",
      "setting": "Said with a frozen smile to an irate shopper holding a crushed appliance and no receipt.",
      "name": "The customer service desk",
      "surface": "apricot"
    },
    "b": {
      "label": "Hostage negotiator",
      "setting": "Spoken calmly through a megaphone into the shattered lobby doors of a downtown bank.",
      "name": "A hostage negotiator",
      "surface": "plum"
    },
    "quality": 8.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "docent-whisper-ghost",
    "a": {
      "label": "A historic house docent",
      "setting": "Addressing tourists gathered beneath a velvet rope in an antique parlor.",
      "name": "A manor house tour",
      "surface": "cream"
    },
    "b": {
      "label": "A ghost tour storyteller",
      "setting": "Speaking under a dim lantern to a huddled crowd outside a cemetery.",
      "name": "A midnight ghost walk",
      "surface": "plum"
    },
    "quality": 8.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "slasher-camp-first-date",
    "a": {
      "label": "Camp counselor in a slasher movie",
      "setting": "Looking nervously into the dark woods outside a lonely cabin in the rain.",
      "name": "A horror movie warning",
      "surface": "moss"
    },
    "b": {
      "label": "Nervous dater",
      "setting": "Sitting at a cozy restaurant table trying to laugh off an awkward silence.",
      "name": "A first date confession",
      "surface": "blush"
    },
    "quality": 8.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "wild-west-showdown-mic-check",
    "a": {
      "label": "A roadie setting up a concert",
      "setting": "Tapping the front-of-house microphone while the empty stadium echoes.",
      "name": "A soundcheck test",
      "surface": "fog"
    },
    "b": {
      "label": "A frontier sheriff facing an outlaw",
      "setting": "Standing on a dusty main street at high noon, hand resting on a holster.",
      "name": "A high noon standoff",
      "surface": "oxblood"
    },
    "quality": 8.42,
    "battery": "pair-battery@2"
  },
  {
    "key": "costume-fitter-sub-torpedo",
    "a": {
      "label": "A backstage wardrobe mistress",
      "setting": "Kneeling with pins in her mouth while squeezing an actor into a corset.",
      "name": "Backstage costume fitting",
      "surface": "rose"
    },
    "b": {
      "label": "A submarine torpedo technician",
      "setting": "Shouting instructions while wedging heavy ordnance into a narrow tube.",
      "name": "Torpedo loading command",
      "surface": "space"
    },
    "quality": 8.41,
    "battery": "pair-battery@2"
  },
  {
    "key": "lottery-heist",
    "a": {
      "label": "A scratch-off ticket buyer at a gas station counter",
      "setting": "Feverishly coin-scraping silver foil under buzzing fluorescent lights at 2 AM.",
      "name": "A scratch card frenzy",
      "surface": "apricot"
    },
    "b": {
      "label": "A jewel thief cutting through a glass display",
      "setting": "Suspended on cables in the dark, tracing a suction cutter around a diamond.",
      "name": "A museum heist whisper",
      "surface": "graphite"
    },
    "quality": 8.41,
    "battery": "pair-battery@2"
  },
  {
    "key": "vet-surgery-getaway-driver",
    "a": {
      "label": "A veterinary surgeon",
      "setting": "Calm instructions given under intense overhead surgical lamps while monitoring a failing heartbeat monitor.",
      "name": "An emergency vet surgery",
      "surface": "mint"
    },
    "b": {
      "label": "A heist wheelman",
      "setting": "Spoken into a dash radio while gunning the engine in a rainy alley as sirens approach.",
      "name": "The getaway driver",
      "surface": "oxblood"
    },
    "quality": 8.41,
    "battery": "pair-battery@2"
  },
  {
    "key": "quest-giver-substitute-teacher",
    "a": {
      "label": "A village elder in an RPG",
      "setting": "An old villager with an exclamation mark above his head addresses traveling adventurers.",
      "name": "An NPC quest giver",
      "surface": "apricot"
    },
    "b": {
      "label": "A nervous substitute teacher",
      "setting": "Standing at the front of a noisy fifth-grade classroom, holding a folder of instructions.",
      "name": "A substitute teacher's greeting",
      "surface": "mint"
    },
    "quality": 8.4,
    "battery": "pair-battery@2"
  },
  {
    "key": "volcano-baking-show",
    "a": {
      "label": "A field volcanologist",
      "setting": "Shouting through a respirator at the crater rim as seismic readings spike.",
      "name": "A volcano evacuation",
      "surface": "oxblood"
    },
    "b": {
      "label": "A televised baking judge",
      "setting": "Critiquing an ambitious chocolate showpiece that is collapsing in the tent.",
      "name": "Baking show critique",
      "surface": "butter"
    },
    "quality": 8.4,
    "battery": "pair-battery@2"
  },
  {
    "key": "cat-feeder-jailer",
    "a": {
      "label": "A cat owner",
      "setting": "Rattling an aluminum bowl in the kitchen at dawn while a tuxedo cat meows aggressively at the door.",
      "name": "Feeding the cat",
      "surface": "lime"
    },
    "b": {
      "label": "A prison warden",
      "setting": "Barking down a concrete cellblock corridor as guards wheel heavy metal meal carts between bars.",
      "name": "Chow time call",
      "surface": "fog"
    },
    "quality": 8.38,
    "battery": "pair-battery@2"
  },
  {
    "key": "paranormal-night-watch",
    "a": {
      "label": "A ghost hunter",
      "setting": "Whispering into a night-vision camera inside a crumbling abandoned asylum.",
      "name": "Ghost hunting sweep",
      "surface": "fog"
    },
    "b": {
      "label": "A refrigerator technician",
      "setting": "Squinting behind a humming appliance with a digital thermometer.",
      "name": "Appliance repair diagnosis",
      "surface": "butter"
    },
    "quality": 8.38,
    "battery": "pair-battery@2"
  },
  {
    "key": "counter-hostage",
    "a": {
      "label": "A post office clerk at the counter",
      "setting": "A postal worker speaking through plexiglass to someone with a taped cardboard box.",
      "name": "Postal counter check",
      "surface": "paper"
    },
    "b": {
      "label": "A bomb technician over the radio",
      "setting": "A specialist talking a novice through inspecting an unidentified package in an alley.",
      "name": "Bomb squad advice",
      "surface": "graphite"
    },
    "quality": 8.37,
    "battery": "pair-battery@2"
  },
  {
    "key": "scuba-heist",
    "a": {
      "label": "A certified divemaster",
      "setting": "Checking oxygen gauges and signals aboard a boat over deep open water.",
      "name": "A scuba pre-dive check",
      "surface": "sea"
    },
    "b": {
      "label": "A mastermind safecracker",
      "setting": "Whispering into an earpiece while cracking a subterranean vault door.",
      "name": "A heist countdown",
      "surface": "graphite"
    },
    "quality": 8.36,
    "battery": "pair-battery@2"
  },
  {
    "key": "curtain-call-hospital-discharge",
    "a": {
      "label": "The director backstage",
      "setting": "Whispered behind the velvet curtain right before pushing an actor toward the glaring stage lights.",
      "name": "Opening night push",
      "surface": "plum"
    },
    "b": {
      "label": "The charge nurse",
      "setting": "Spoken warmly while untying a patient's hospital gown and handing over their regular street clothes.",
      "name": "A hospital discharge",
      "surface": "cream"
    },
    "quality": 8.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "insufficient-funds",
    "a": {
      "label": "A loan officer",
      "setting": "A formal tone across a heavy mahogany desk, reviewing an overdue account balance.",
      "name": "A bank rejection",
      "surface": "paper"
    },
    "b": {
      "label": "An RPG villain",
      "setting": "Taunting your low-level party as your characters run out of mana and items.",
      "name": "A boss fight",
      "surface": "oxblood"
    },
    "quality": 8.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "stage-manager-heist",
    "a": {
      "label": "Backstage stage manager",
      "setting": "Whispering frantically into a headset as the overture swells in the auditorium.",
      "name": "A backstage cue",
      "surface": "lilac"
    },
    "b": {
      "label": "Jewel thief ringleader",
      "setting": "Speaking through an earpiece while watching security cameras tick down to zero.",
      "name": "A museum heist plan",
      "surface": "ink"
    },
    "quality": 8.34,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-cult-422",
    "a": {
      "label": "HOA president",
      "setting": "The board president reads community guidelines in a rented clubhouse.",
      "name": "HOA board reprimand",
      "surface": "peach"
    },
    "b": {
      "label": "Cult elder",
      "setting": "An elder addresses cloaked followers seated in the circle.",
      "name": "Secret society ritual",
      "surface": "plum"
    },
    "quality": 8.32,
    "battery": "pair-battery@2"
  },
  {
    "key": "royal-coronation-toddler",
    "a": {
      "label": "An archbishop at a coronation",
      "setting": "Solemnly whispered while lowering a heavy, gem-encrusted circlet onto a sovereign.",
      "name": "A royal coronation",
      "surface": "plum"
    },
    "b": {
      "label": "A parent dressing a toddler",
      "setting": "Pleading softly while trying to strap a winter beanie onto a squirming child.",
      "name": "Dressing a toddler",
      "surface": "mint"
    },
    "quality": 8.32,
    "battery": "pair-battery@2"
  },
  {
    "key": "x-marks-spot-to-dentist",
    "a": {
      "label": "A pirate navigator decoding a map",
      "setting": "Squinting over stained parchment by lantern light on the ship's deck.",
      "name": "A pirate map clue",
      "surface": "paper"
    },
    "b": {
      "label": "A cosmetic surgeon before a procedure",
      "setting": "Marking guidelines on a patient's skin under bright operating lights.",
      "name": "A cosmetic surgeon consult",
      "surface": "rose"
    },
    "quality": 8.32,
    "battery": "pair-battery@2"
  },
  {
    "key": "aquarium-and-filibuster",
    "a": {
      "label": "A senator running out the clock",
      "setting": "Standing at the senate podium at 3 a.m. reading phone books aloud.",
      "name": "A senate filibuster",
      "surface": "rose"
    },
    "b": {
      "label": "An aquarium guide at the shark tank",
      "setting": "Addressing a crowd of schoolchildren gathered around the panoramic glass wall.",
      "name": "A shark tank presentation",
      "surface": "sea"
    },
    "quality": 8.31,
    "battery": "pair-battery@2"
  },
  {
    "key": "couple-counseling-cameraman",
    "a": {
      "label": "A marriage counselor",
      "setting": "Sitting between a husband and wife who refuse to look directly at each other on the sofa.",
      "name": "Couples therapy guidance",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A portrait photographer",
      "setting": "Directing two awkward models under bright studio lights to make their pose look natural.",
      "name": "A studio photo shoot",
      "surface": "ink"
    },
    "quality": 8.31,
    "battery": "pair-battery@2"
  },
  {
    "key": "hero-salon",
    "a": {
      "label": "A veteran superhero",
      "setting": "Hovering above crumbling rubble, handing a sidekick their new emblem.",
      "name": "A superhero mantle passing",
      "surface": "sky"
    },
    "b": {
      "label": "A salon stylist",
      "setting": "Spinning a chair around to face the mirror after three hours of foil wraps.",
      "name": "A hair makeover reveal",
      "surface": "peach"
    },
    "quality": 8.31,
    "battery": "pair-battery@2"
  },
  {
    "key": "mail-rescue",
    "a": {
      "label": "A postal clerk",
      "setting": "Spoken flatly through reinforced glass to a customer mailing an oversized crate.",
      "name": "A post office counter",
      "surface": "paper"
    },
    "b": {
      "label": "A mountaineering leader",
      "setting": "Hissed through chattering teeth inside a cramped tent pinned down by a blizzard.",
      "name": "A mountain summit push",
      "surface": "fog"
    },
    "quality": 8.31,
    "battery": "pair-battery@2"
  },
  {
    "key": "dentists-and-undercover",
    "a": {
      "label": "A dental hygienist",
      "setting": "Adjusting the overhead lamp and picking up a metal scraper above a patient.",
      "name": "A routine cleaning",
      "surface": "mint"
    },
    "b": {
      "label": "A double agent",
      "setting": "Hissing instructions to a compromised asset in an alley behind the embassy.",
      "name": "A spy rendezvous",
      "surface": "navy"
    },
    "quality": 8.3,
    "battery": "pair-battery@2"
  },
  {
    "key": "wizard-it-helpdesk",
    "a": {
      "label": "A fantasy wizard",
      "setting": "An elder mage instructing an apprentice before a dangerous spell casting.",
      "name": "An archmage's lesson",
      "surface": "plum"
    },
    "b": {
      "label": "An IT support agent",
      "setting": "A support technician talking a confused user through a desktop crash.",
      "name": "IT help desk",
      "surface": "fog"
    },
    "quality": 8.3,
    "battery": "pair-battery@2"
  },
  {
    "key": "barista-potion-witch",
    "a": {
      "label": "A busy barista",
      "setting": "Calling over the hiss of steam at a crowded counter on Monday morning.",
      "name": "A barista callout",
      "surface": "apricot"
    },
    "b": {
      "label": "A swamp witch",
      "setting": "Handing an obsidian flask across bubbling cauldrons to a weary knight.",
      "name": "A potion seller",
      "surface": "forest"
    },
    "quality": 8.29,
    "battery": "pair-battery@2"
  },
  {
    "key": "kindergarten-guard-duty",
    "a": {
      "label": "A kindergarten teacher",
      "setting": "Standing arms crossed at the exit door during afternoon dismissal.",
      "name": "Kindergarten dismissal",
      "surface": "lime"
    },
    "b": {
      "label": "A field medic",
      "setting": "Shouting over artillery rumbles while checking tags on wounded soldiers.",
      "name": "Combat triage",
      "surface": "rose"
    },
    "quality": 8.29,
    "battery": "pair-battery@2"
  },
  {
    "key": "diner-booth-and-parchment",
    "a": {
      "label": "A roadside diner waitress",
      "setting": "A tired waitress pours coffee for a weary traveler at dawn.",
      "name": "Roadside diner chat",
      "surface": "rose"
    },
    "b": {
      "label": "A cartographer's cipher",
      "setting": "A faded note pinned to an uncharted island coastal chart.",
      "name": "Buried pirate map",
      "surface": "forest"
    },
    "quality": 8.28,
    "battery": "pair-battery@2"
  },
  {
    "key": "drill-command-dentist-chair",
    "a": {
      "label": "A naval drill instructor",
      "setting": "Conducting morning uniform inspection on the mess deck.",
      "name": "Military inspection order",
      "surface": "forest"
    },
    "b": {
      "label": "A gentle pediatric dentist",
      "setting": "Leaning over a nervous patient under the bright overhead lamp.",
      "name": "Dentist chair checkup",
      "surface": "sky"
    },
    "quality": 8.28,
    "battery": "pair-battery@2"
  },
  {
    "key": "creepy-doll-warranty-claim",
    "a": {
      "label": "A haunted doll collector",
      "setting": "An eccentric curator leans toward a visitor in a dim, creaky parlor.",
      "name": "A haunted attic tour",
      "surface": "forest"
    },
    "b": {
      "label": "A warranty service agent",
      "setting": "A customer representative inspects a shattered appliance brought to the service counter.",
      "name": "A warranty claim inspection",
      "surface": "paper"
    },
    "quality": 8.27,
    "battery": "pair-battery@2"
  },
  {
    "key": "botanist-adjuster",
    "a": {
      "label": "A greenhouse caretaker",
      "setting": "Giving instructions to a novice helper while inspecting delicate heirloom root systems.",
      "name": "A master gardener's advice",
      "surface": "moss"
    },
    "b": {
      "label": "An insurance claims adjuster",
      "setting": "Explaining to a homeowner what parts of their storm-damaged basement will be paid out.",
      "name": "An insurance claim report",
      "surface": "paper"
    },
    "quality": 8.26,
    "battery": "pair-battery@2"
  },
  {
    "key": "office-gameshow",
    "a": {
      "label": "A CEO at an all-hands",
      "setting": "An energetic chief executive speaking to the entire company on a livestream.",
      "name": "All-hands pep talk",
      "surface": "sky"
    },
    "b": {
      "label": "A wacky game show host",
      "setting": "A loud host hyping up contestants standing before giant spinning wheels.",
      "name": "Prize wheel buildup",
      "surface": "apricot"
    },
    "quality": 8.26,
    "battery": "pair-battery@2"
  },
  {
    "key": "pirate-parley-hostage-trade",
    "a": {
      "label": "A pirate negotiating parley",
      "setting": "Calling across pistols drawn at the gangplank of a rival privateer vessel.",
      "name": "Pirates parley",
      "surface": "forest"
    },
    "b": {
      "label": "A retail manager facing a scammer",
      "setting": "Firmly addressing a difficult customer attempting a fraudulent return at the counter.",
      "name": "Return policy showdown",
      "surface": "butter"
    },
    "quality": 8.26,
    "battery": "pair-battery@2"
  },
  {
    "key": "sea-captain-driving-test",
    "a": {
      "label": "An old ship captain",
      "setting": "A grizzled skipper bellows through heavy gale winds at the helm.",
      "name": "A captain's orders",
      "surface": "navy"
    },
    "b": {
      "label": "A driving test examiner",
      "setting": "An examiner with a clipboard instructs an anxious teen at an intersection.",
      "name": "A driving test",
      "surface": "lime"
    },
    "quality": 8.26,
    "battery": "pair-battery@2"
  },
  {
    "key": "circus-lion-tamer-library-warning",
    "a": {
      "label": "A circus lion tamer",
      "setting": "Instructing a wide-eyed apprentice right outside the cage door.",
      "name": "Lion tamer's rule",
      "surface": "rose"
    },
    "b": {
      "label": "A strict archive librarian",
      "setting": "Glaring at graduate students approaching ancient, fragile scrolls.",
      "name": "Librarian's admonition",
      "surface": "navy"
    },
    "quality": 8.25,
    "battery": "pair-battery@2"
  },
  {
    "key": "library-submarine",
    "a": {
      "label": "A stern head librarian",
      "setting": "Glaring over spectacles at noisy patrons in the reading room stacks.",
      "name": "A librarian's shush",
      "surface": "paper"
    },
    "b": {
      "label": "A submarine commander",
      "setting": "Whispering to the sonar crew as enemy destroyers circle above.",
      "name": "Rig for silent running",
      "surface": "navy"
    },
    "quality": 8.25,
    "battery": "pair-battery@2"
  },
  {
    "key": "return-desk-diplomatic-summit",
    "a": {
      "label": "A department store clerk",
      "setting": "Spoken politely over the counter while inspecting a scuffed, opened box.",
      "name": "A customer return policy",
      "surface": "cream"
    },
    "b": {
      "label": "A seasoned diplomat",
      "setting": "Spoken across a mahogany table after reviewing the opposing draft treaty.",
      "name": "A peace treaty rejection",
      "surface": "plum"
    },
    "quality": 8.25,
    "battery": "pair-battery@2"
  },
  {
    "key": "drill-and-heist",
    "a": {
      "label": "A hygienist scraping plaque",
      "setting": "A hygienist leans over a reclining patient under a blinding lamp.",
      "name": "Dental cleaning",
      "surface": "mint"
    },
    "b": {
      "label": "A master safecracker whispering",
      "setting": "A thief with a stethoscope works the dial while the lookout watches.",
      "name": "Cracking a safe",
      "surface": "ink"
    },
    "quality": 8.24,
    "battery": "pair-battery@2"
  },
  {
    "key": "monster-under-bed-to-pawn",
    "a": {
      "label": "A parent checking for monsters",
      "setting": "Crouched on all fours with a flashlight, peering under a dust ruffle.",
      "name": "Checking under the bed",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A pawn shop appraiser",
      "setting": "Inspecting an old heirloomed chest brought across the scratched counter.",
      "name": "A pawn shop appraisal",
      "surface": "fog"
    },
    "quality": 8.24,
    "battery": "pair-battery@2"
  },
  {
    "key": "band-soundcheck-hostage-negotiation",
    "a": {
      "label": "The lead sound engineer",
      "setting": "Shouting into the stage talkback mic during a chaotic festival setup.",
      "name": "A festival soundcheck",
      "surface": "lime"
    },
    "b": {
      "label": "A crisis negotiator",
      "setting": "Speaking into a bullhorn toward a barricaded door as tension rises.",
      "name": "A police megaphone",
      "surface": "navy"
    },
    "quality": 8.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "boss-coronation",
    "a": {
      "label": "An overbearing executive",
      "setting": "Handing a massive corporate project folder to an exhausted junior manager.",
      "name": "A boss delegating tasks",
      "surface": "rose"
    },
    "b": {
      "label": "An archbishop at a royal coronation",
      "setting": "Placing the ancient crown onto the trembling heir before the royal court.",
      "name": "A monarch coronation",
      "surface": "butter"
    },
    "quality": 8.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-property-pawn-shop",
    "a": {
      "label": "Lost and found clerk",
      "setting": "Behind the counter at a busy transit hub, rifling through a box of unclaimed keys.",
      "name": "Lost and found intake",
      "surface": "butter"
    },
    "b": {
      "label": "Suspicious pawnbroker",
      "setting": "Squinting through an eyeglass at an antique watch brought in late at night.",
      "name": "A pawn shop appraisal",
      "surface": "ink"
    },
    "quality": 8.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "post-office-secret-agent-359",
    "a": {
      "label": "Weary postal counter clerk",
      "setting": "Spoken across a worn counter behind plexiglass to a customer shipping a heavy brown carton.",
      "name": "The post office counter",
      "surface": "fog"
    },
    "b": {
      "label": "Smuggler at border control",
      "setting": "Muttered through clenched teeth to a nervous accomplice approaching armed guards at a checkpoint.",
      "name": "A border smuggler",
      "surface": "moss"
    },
    "quality": 8.21,
    "battery": "pair-battery@2"
  },
  {
    "key": "babysitting-astronaut",
    "a": {
      "label": "A frazzled older sibling watching twins",
      "setting": "Calling up the stairs after hearing loud thumps from the playroom.",
      "name": "A playroom check-in",
      "surface": "peach"
    },
    "b": {
      "label": "Mission control Capcom",
      "setting": "Speaking into a headset as spacewalkers drift out of the airlock.",
      "name": "A spacewalk tether check",
      "surface": "sea"
    },
    "quality": 8.2,
    "battery": "pair-battery@2"
  },
  {
    "key": "cat-vet-bomb-defusal",
    "a": {
      "label": "A feline veterinary nurse",
      "setting": "Wrapping an anxious, hissing calico into a thick towel for nail trimming.",
      "name": "Restraining a scratchy cat",
      "surface": "mint"
    },
    "b": {
      "label": "A demolition specialist",
      "setting": "Hovering steady hands over exposed copper triggers in a humid bunker.",
      "name": "Handling live explosives",
      "surface": "ink"
    },
    "quality": 8.2,
    "battery": "pair-battery@2"
  },
  {
    "key": "coffee-shop-lingering",
    "a": {
      "label": "A cafe closing manager",
      "setting": "Politely stacking chairs upside down near a patron who has stayed past closing.",
      "name": "A cafe closing announcement",
      "surface": "cream"
    },
    "b": {
      "label": "A haunted house guide",
      "setting": "Leading nervous tourists to the exit gates as shadows lengthen across the cemetery.",
      "name": "A ghost tour farewell",
      "surface": "space"
    },
    "quality": 8.2,
    "battery": "pair-battery@2"
  },
  {
    "key": "dog-trainer-parole-officer-448",
    "a": {
      "label": "A puppy obedience trainer",
      "setting": "An instructor demonstrating commands to a new owner in an agility yard.",
      "name": "A puppy training lesson",
      "surface": "butter"
    },
    "b": {
      "label": "A parole officer",
      "setting": "An officer laying down strict rules across a desk to a recent release.",
      "name": "A parole interview",
      "surface": "ink"
    },
    "quality": 8.2,
    "battery": "pair-battery@2"
  },
  {
    "key": "wizard-potion-job-interview",
    "a": {
      "label": "A wizard apprentice mentor",
      "setting": "A robed archmage speaks quietly to an initiate brewing a volatile glowing cauldron.",
      "name": "A wizard's apprenticeship",
      "surface": "plum"
    },
    "b": {
      "label": "A hiring manager",
      "setting": "A senior executive leans forward across the polished desk, reviewing your portfolio.",
      "name": "A final job interview",
      "surface": "paper"
    },
    "quality": 8.2,
    "battery": "pair-battery@2"
  },
  {
    "key": "puppy-training-boss",
    "a": {
      "label": "A puppy obedience trainer",
      "setting": "Calling out commands in a fenced yard while a young retriever tests boundaries.",
      "name": "Puppy training commands",
      "surface": "butter"
    },
    "b": {
      "label": "A tough corporate mentor",
      "setting": "Coaching a nervous junior analyst right outside the executive boardroom door.",
      "name": "Executive coaching",
      "surface": "graphite"
    },
    "quality": 8.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "vet-instruction-bomb-squad",
    "a": {
      "label": "A veterinary assistant",
      "setting": "Whispering to the owner while holding a nervous, clawing cat in a treatment room.",
      "name": "Handling a feral cat",
      "surface": "lime"
    },
    "b": {
      "label": "An explosive technician",
      "setting": "Speaking softly into a radio while kneeling over a live device under a porch.",
      "name": "Diffusing unexploded ordnance",
      "surface": "oxblood"
    },
    "quality": 8.18,
    "battery": "pair-battery@2"
  },
  {
    "key": "vet-kitten-hostage-demand",
    "a": {
      "label": "A vet calming a rescue kitten",
      "setting": "Cooed softly while nudging a terrified furball out of a plastic crate.",
      "name": "Coaxing a feral kitten",
      "surface": "peach"
    },
    "b": {
      "label": "A bank teller during a robbery",
      "setting": "Whispered with trembling hands behind the counter to an armed robber.",
      "name": "A bank teller's surrender",
      "surface": "navy"
    },
    "quality": 8.17,
    "battery": "pair-battery@2"
  },
  {
    "key": "spelling-bee-interrogation",
    "a": {
      "label": "An elementary school teacher",
      "setting": "Leaning over a desk with folded hands during a quiet afternoon detention.",
      "name": "A teacher's detention",
      "surface": "cream"
    },
    "b": {
      "label": "A submarine sonar operator",
      "setting": "Whispering into a headset in the dark control room tracking an unknown contact.",
      "name": "Submarine ping report",
      "surface": "navy"
    },
    "quality": 8.16,
    "battery": "pair-battery@2"
  },
  {
    "key": "sms-posse",
    "a": {
      "label": "A sender waiting for a reply",
      "setting": "Staring at the three gray bouncing dots on a glowing screen.",
      "name": "An unanswered text",
      "surface": "fog"
    },
    "b": {
      "label": "A tracker in the canyon",
      "setting": "Crouched in red dust, pointing at fresh horse tracks in the rocks.",
      "name": "A wild west tracker",
      "surface": "apricot"
    },
    "quality": 8.14,
    "battery": "pair-battery@2"
  },
  {
    "key": "wine-tasting-poison-investigation",
    "a": {
      "label": "A snooty head cellar master",
      "setting": "Swirling a glass before a row of wealthy patrons in an oak cellar.",
      "name": "A private cellar tasting",
      "surface": "rose"
    },
    "b": {
      "label": "A royal physician",
      "setting": "Inspecting the monarch's goblet beside an unmoving throne.",
      "name": "A royal poison check",
      "surface": "ink"
    },
    "quality": 8.14,
    "battery": "pair-battery@2"
  },
  {
    "key": "puppy-puppets",
    "a": {
      "label": "A dog trainer running obedience school",
      "setting": "Given firmly in a fenced yard to a rowdy young golden retriever.",
      "name": "Puppy obedience training",
      "surface": "apricot"
    },
    "b": {
      "label": "A press secretary prepping a candidate",
      "setting": "Whispered backstage right before walking out to the televised debate.",
      "name": "Debate prep coaching",
      "surface": "navy"
    },
    "quality": 8.13,
    "battery": "pair-battery@2"
  },
  {
    "key": "caretaker-landlord",
    "a": {
      "label": "An old caretaker",
      "setting": "Muttered on the front porch to young buyers inspecting a long-abandoned manor.",
      "name": "Creaky estate warning",
      "surface": "moss"
    },
    "b": {
      "label": "A nursery teacher",
      "setting": "Whispered to parents peering into a darkened room during afternoon naptime.",
      "name": "Daycare naptime warning",
      "surface": "peach"
    },
    "quality": 8.12,
    "battery": "pair-battery@2"
  },
  {
    "key": "post-office-secret-agent",
    "a": {
      "label": "A postal clerk processing an oversized parcel",
      "setting": "Weighing a heavy cardboard box taped at every seam across the service counter.",
      "name": "Parcel intake",
      "surface": "cream"
    },
    "b": {
      "label": "A covert courier handing off sensitive cargo",
      "setting": "Passing a locked aluminum briefcase under the table in an empty rail terminal.",
      "name": "A covert handoff",
      "surface": "graphite"
    },
    "quality": 8.12,
    "battery": "pair-battery@2"
  },
  {
    "key": "cake-bomb",
    "a": {
      "label": "A wedding cake decorator finishing the top tier",
      "setting": "A baker steadies shaking hands while placing the final sugar rose.",
      "name": "Wedding cake assembly",
      "surface": "blush"
    },
    "b": {
      "label": "A safe cracker cracking an antique vault",
      "setting": "A thief with a stethoscope turns the dial gently in a darkened vault room.",
      "name": "Safecracking a vault",
      "surface": "forest"
    },
    "quality": 8.11,
    "battery": "pair-battery@2"
  },
  {
    "key": "casino-confrontation",
    "a": {
      "label": "A casino pit boss",
      "setting": "Tapping a high roller's shoulder as security watches from the velvet ropes.",
      "name": "A casino cutoff",
      "surface": "oxblood"
    },
    "b": {
      "label": "An elementary school teacher",
      "setting": "Kneeling beside a tearful first grader clutching too many recess toys.",
      "name": "A recess scolding",
      "surface": "sky"
    },
    "quality": 8.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "party-clown-dictator",
    "a": {
      "label": "A children's party entertainer",
      "setting": "Shouting with forced cheer over a screaming room of seven-year-olds.",
      "name": "Birthday clown cheer",
      "surface": "apricot"
    },
    "b": {
      "label": "A campaign rally organizer",
      "setting": "Bellowing through a microphone to whip a stadium crowd into a frenzy.",
      "name": "Political rally speech",
      "surface": "oxblood"
    },
    "quality": 8.1,
    "battery": "pair-battery@2"
  },
  {
    "key": "stage-whisper-medical-triage",
    "a": {
      "label": "A panicked lead actor",
      "setting": "Hissed sideways from downstage under a spotlight while ad-libbing around a missed entrance cue.",
      "name": "A stage cue failure",
      "surface": "rose"
    },
    "b": {
      "label": "An emergency room doctor",
      "setting": "Urgent instructions barked to trauma nurses as the automatic ambulance bay doors slide open.",
      "name": "Emergency room intake",
      "surface": "navy"
    },
    "quality": 8.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "sub-sonar-sonogram",
    "a": {
      "label": "A submarine sonar technician",
      "setting": "Staring intently at glowing green sweeps in a pitch-black control bay.",
      "name": "Submarine sonar scan",
      "surface": "forest"
    },
    "b": {
      "label": "An ultrasound technician",
      "setting": "Guiding a gel wand over an expectant parent's belly in a dim room.",
      "name": "A prenatal ultrasound",
      "surface": "blush"
    },
    "quality": 8.09,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-wallet-and-detective",
    "a": {
      "label": "A train station clerk",
      "setting": "Holding up a battered brown leather billfold over the counter.",
      "name": "Claiming lost property",
      "surface": "apricot"
    },
    "b": {
      "label": "A noir detective",
      "setting": "Slapping a man's missing effects onto a rain-slicked diner table.",
      "name": "A noir confrontation",
      "surface": "graphite"
    },
    "quality": 8.08,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-and-found-heist",
    "a": {
      "label": "A lost property clerk",
      "setting": "Speaking to a visitor through a sliding glass window behind a high counter.",
      "name": "Lost and found claim",
      "surface": "fog"
    },
    "b": {
      "label": "A museum security chief",
      "setting": "Reporting over the radio as alarms blare inside the empty gallery.",
      "name": "Art heist aftermath",
      "surface": "navy"
    },
    "quality": 8.07,
    "battery": "pair-battery@2"
  },
  {
    "key": "teacup-dog-royal-coronation",
    "a": {
      "label": "A doting dog owner",
      "setting": "An owner places a tiny sweater on a shivering chihuahua on the kitchen floor.",
      "name": "Dressing a toy poodle",
      "surface": "blush"
    },
    "b": {
      "label": "An archbishop",
      "setting": "An archbishop balances an enormous velvet crown atop the new sovereign's head.",
      "name": "Anointing a new monarch",
      "surface": "space"
    },
    "quality": 8.07,
    "battery": "pair-battery@2"
  },
  {
    "key": "taste-poison",
    "a": {
      "label": "A guest judge to a nervous contestant",
      "setting": "A celebrity chef leans across the tasting counter, fork poised above a mystery reduction.",
      "name": "A cooking show critique",
      "surface": "cream"
    },
    "b": {
      "label": "A medieval royal food taster to the monarch",
      "setting": "A wary taster lifts a gilded spoon at the feast, watching the king's suspicious eyes.",
      "name": "A royal food tester",
      "surface": "oxblood"
    },
    "quality": 8.06,
    "battery": "pair-battery@2"
  },
  {
    "key": "cat-vet-bomb-disposal",
    "a": {
      "label": "A veterinary assistant",
      "setting": "A vet tech grips a hissing, clawing feline on an examination table.",
      "name": "Restraining an angry cat",
      "surface": "peach"
    },
    "b": {
      "label": "A bomb technician",
      "setting": "A tech in a blast suit speaks through a comm link over an exposed explosive device.",
      "name": "A bomb defusal radio",
      "surface": "graphite"
    },
    "quality": 8.05,
    "battery": "pair-battery@2"
  },
  {
    "key": "hostess-bunker",
    "a": {
      "label": "An exclusive maitre d'",
      "setting": "Politely turning away an unreserved walk-in at a fully booked bistro.",
      "name": "A maitre d' rejection",
      "surface": "rose"
    },
    "b": {
      "label": "A fallout shelter warden",
      "setting": "Denying entry through the reinforced blast door as sirens wail outside.",
      "name": "A fallout shelter refusal",
      "surface": "ink"
    },
    "quality": 8.05,
    "battery": "pair-battery@2"
  },
  {
    "key": "wedding-seige",
    "a": {
      "label": "A stressed wedding planner",
      "setting": "Speaking into a headset clipboard in hand fifteen minutes before the processional.",
      "name": "Wedding planner headset",
      "surface": "blush"
    },
    "b": {
      "label": "A fortress commander",
      "setting": "Leaning over parapet stones as the enemy army rounds the tree line.",
      "name": "Siege defense command",
      "surface": "forest"
    },
    "quality": 8.05,
    "battery": "pair-battery@2"
  },
  {
    "key": "seating-chart-conspiracy",
    "a": {
      "label": "An anxious bride",
      "setting": "Clutching sticky notes at the kitchen table three days before the wedding.",
      "name": "Wedding seating chart",
      "surface": "rose"
    },
    "b": {
      "label": "A paranoid interrogation officer",
      "setting": "Arranging suspect photos on a corkboard with red string under flickering fluorescent light.",
      "name": "A suspect board review",
      "surface": "navy"
    },
    "quality": 8.04,
    "battery": "pair-battery@2"
  },
  {
    "key": "interview-rejection-breakup",
    "a": {
      "label": "A hiring manager",
      "setting": "Firmly closing a folder in an glass conference room after forty minutes.",
      "name": "Post-interview wrap-up",
      "surface": "periwinkle"
    },
    "b": {
      "label": "A weary lover",
      "setting": "Sitting on a park bench in late autumn, pulling hands away slowly.",
      "name": "A mutual parting",
      "surface": "rose"
    },
    "quality": 8.02,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-vintage",
    "a": {
      "label": "A lost and found clerk",
      "setting": "Behind a scratched counter, holding up a tagged item for an anxious owner to identify.",
      "name": "Lost property retrieval",
      "surface": "fog"
    },
    "b": {
      "label": "A wine judge",
      "setting": "Swirling a dark glass at a solemn blind tasting competition.",
      "name": "A wine review",
      "surface": "oxblood"
    },
    "quality": 8.01,
    "battery": "pair-battery@2"
  },
  {
    "key": "grandparent-attic-archaeologist",
    "a": {
      "label": "An elderly grandfather",
      "setting": "Said softly while dusting off an ancient wooden trunk tucked under attic floorboards.",
      "name": "Grandpa's attic tour",
      "surface": "apricot"
    },
    "b": {
      "label": "A tomb explorer",
      "setting": "Whispered into an audio recorder upon cracking the stone seal of an ancient crypt.",
      "name": "A tomb expedition",
      "surface": "forest"
    },
    "quality": 8,
    "battery": "pair-battery@2"
  },
  {
    "key": "cat-roommate",
    "a": {
      "label": "A veterinarian examining a feline",
      "setting": "A vet talking to a worried owner while checking an irritable Persian cat.",
      "name": "A vet checkup",
      "surface": "mint"
    },
    "b": {
      "label": "A flatmate confronting another",
      "setting": "A roommate standing in the messy kitchen addressing a notoriously lazy tenant.",
      "name": "A roommate confrontation",
      "surface": "peach"
    },
    "quality": 7.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "moving-day-spaceship",
    "a": {
      "label": "A frazzled mover",
      "setting": "Shouted through the stairwell doorway balancing a massive oak dresser.",
      "name": "Moving day hustle",
      "surface": "butter"
    },
    "b": {
      "label": "A launch director",
      "setting": "Spoken into the headset as fuel levels hit critical limits on the pad.",
      "name": "Rocket launch scrub",
      "surface": "ink"
    },
    "quality": 7.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "sourdough-archaeology",
    "a": {
      "label": "Artisan breadmaker",
      "setting": "A baker tends to an ancient, bubbling crock of sourdough starter.",
      "name": "Sourdough starter care",
      "surface": "apricot"
    },
    "b": {
      "label": "Crypt explorer",
      "setting": "An archaeologist shines a torch into a freshly unsealed tomb.",
      "name": "Tomb discovery log",
      "surface": "moss"
    },
    "quality": 7.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "zoo-and-monarchy",
    "a": {
      "label": "A zookeeper feeding big cats",
      "setting": "Speaking softly through heavy steel mesh to a restless predator at dinner.",
      "name": "Feeding the lions",
      "surface": "moss"
    },
    "b": {
      "label": "A royal courtier flatterer",
      "setting": "Murmuring deference to a temperamental king before requesting a favor.",
      "name": "Flattering the monarch",
      "surface": "plum"
    },
    "quality": 7.98,
    "battery": "pair-battery@2"
  },
  {
    "key": "interview-rome",
    "a": {
      "label": "A hiring manager",
      "setting": "Glancing down at your resume across a polished glass conference table.",
      "name": "A job interview",
      "surface": "fog"
    },
    "b": {
      "label": "A Roman emperor",
      "setting": "Looming on a marble throne before a trembling general fresh from Gaul.",
      "name": "An emperor's audience",
      "surface": "oxblood"
    },
    "quality": 7.96,
    "battery": "pair-battery@2"
  },
  {
    "key": "neighbor-fence-treaty",
    "a": {
      "label": "A suburban neighbor in an argument",
      "setting": "Leaning over a wooden fence with surveying paperwork in hand.",
      "name": "A property line dispute",
      "surface": "moss"
    },
    "b": {
      "label": "A weary king's diplomat",
      "setting": "Unrolling an inked map across a war tent table before the rival general.",
      "name": "Border truce summit",
      "surface": "plum"
    },
    "quality": 7.96,
    "battery": "pair-battery@2"
  },
  {
    "key": "geologist-jeweler",
    "a": {
      "label": "An expedition leader",
      "setting": "Shouting through a respirator mask over rumbling steam vents at the edge of an active caldera.",
      "name": "Lava field expedition",
      "surface": "apricot"
    },
    "b": {
      "label": "A luxury jeweler",
      "setting": "Murmuring over velvet display cases to a wealthy client inspecting rare mined gemstones under bright light.",
      "name": "Fine jewelry showcase",
      "surface": "periwinkle"
    },
    "quality": 7.95,
    "battery": "pair-battery@2"
  },
  {
    "key": "barista-order-safecracker-heist",
    "a": {
      "label": "A busy barista",
      "setting": "Shouted above the hiss of steam at peak morning rush to clarify an intricate drink request.",
      "name": "A coffee shop order",
      "surface": "butter"
    },
    "b": {
      "label": "A heist safe-cracker",
      "setting": "Murmured over an earpiece while spinning a delicate vault dial with cold, gloved fingers.",
      "name": "Cracking the vault",
      "surface": "graphite"
    },
    "quality": 7.94,
    "battery": "pair-battery@2"
  },
  {
    "key": "depo-and-family-drive",
    "a": {
      "label": "A cross-examining prosecutor",
      "setting": "Pressing a nervous witness under fluorescent lights during deposition.",
      "name": "Courtroom cross-examination",
      "surface": "paper"
    },
    "b": {
      "label": "A fed-up parent driving",
      "setting": "Glaring into the rearview mirror at squabbling siblings in traffic.",
      "name": "Minivan road trip discipline",
      "surface": "blush"
    },
    "quality": 7.94,
    "battery": "pair-battery@2"
  },
  {
    "key": "hoa-president-and-medieval-monarch",
    "a": {
      "label": "A pedantic HOA board president",
      "setting": "Tapping a microphone in a clubhouse multipurpose room to restore order.",
      "name": "An HOA meeting",
      "surface": "cream"
    },
    "b": {
      "label": "A feudal king on his throne",
      "setting": "Delivering an uncompromising decree to gathered nobles in the great hall.",
      "name": "A royal decree",
      "surface": "plum"
    },
    "quality": 7.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "wisdom-tooth-tomb",
    "a": {
      "label": "An oral surgeon",
      "setting": "Masked and hovering over a numbed patient, reaching for steel forceps.",
      "name": "Oral surgery prep",
      "surface": "mint"
    },
    "b": {
      "label": "A field archaeologist",
      "setting": "Kneeling in a newly breached stone crypt, trowel poised over the sediment.",
      "name": "An ancient excavation",
      "surface": "oxblood"
    },
    "quality": 7.92,
    "battery": "pair-battery@2"
  },
  {
    "key": "call-center-hostage-negotiator",
    "a": {
      "label": "A customer support agent",
      "setting": "Spoken through a headset to an irate caller demanding an immediate refund.",
      "name": "A support agent deescalation",
      "surface": "mint"
    },
    "b": {
      "label": "A police hostage negotiator",
      "setting": "Speaking into a secured landline outside a barricaded bank downtown.",
      "name": "A hostage negotiation",
      "surface": "plum"
    },
    "quality": 7.9,
    "battery": "pair-battery@2"
  },
  {
    "key": "cat-adoption-interrogation",
    "a": {
      "label": "A shelter worker",
      "setting": "A shelter volunteer interviews a hopeful applicant sitting across a small desk.",
      "name": "A pet adoption interview",
      "surface": "butter"
    },
    "b": {
      "label": "A corporate hiring manager",
      "setting": "An executive questions a nervous candidate across a glass boardroom table.",
      "name": "A tough job interview",
      "surface": "navy"
    },
    "quality": 7.88,
    "battery": "pair-battery@2"
  },
  {
    "key": "wardrobe-designer-space-suit-tech",
    "a": {
      "label": "A backstage wardrobe assistant",
      "setting": "Rushed frantic whisper to an actor doing a sixty-second costume change behind the curtain.",
      "name": "Quick-change backstage cue",
      "surface": "apricot"
    },
    "b": {
      "label": "A spacewalk suit technician",
      "setting": "Spoken through the comm link to an astronaut sealing the hatch before an EVA.",
      "name": "Spacewalk suit check",
      "surface": "sky"
    },
    "quality": 7.88,
    "battery": "pair-battery@2"
  },
  {
    "key": "catering-dispute-heist",
    "a": {
      "label": "A wedding caterer",
      "setting": "Snapping into an earpiece while looking at an empty refrigerated truck.",
      "name": "Wedding catering panic",
      "surface": "rose"
    },
    "b": {
      "label": "A police dispatcher",
      "setting": "Relaying critical updates to patrol units after an armored car disappears.",
      "name": "Dispatch pursuit call",
      "surface": "navy"
    },
    "quality": 7.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "crossroad-and-whistle",
    "a": {
      "label": "A family road trip driver",
      "setting": "A parent grips the steering wheel at an endless deserted highway exit.",
      "name": "Road trip detour",
      "surface": "sky"
    },
    "b": {
      "label": "A lighthouse keeper",
      "setting": "A solitary keeper records sightings into a damp maritime ledger.",
      "name": "Lighthouse keeper log",
      "surface": "fog"
    },
    "quality": 7.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "wedding-hire",
    "a": {
      "label": "A wedding coordinator",
      "setting": "Checking off items on a clipboard while whispering to the couple backstage.",
      "name": "Day-of wedding coordination",
      "surface": "peach"
    },
    "b": {
      "label": "A senior recruiter extending an offer",
      "setting": "Speaking on speakerphone from an executive corner office overlooking the city.",
      "name": "A corporate job offer",
      "surface": "sea"
    },
    "quality": 7.87,
    "battery": "pair-battery@2"
  },
  {
    "key": "western-sheriff-librarian",
    "a": {
      "label": "An old frontier sheriff",
      "setting": "Confronting unruly outlaws who just kicked open the saloon doors.",
      "name": "A frontier showdown",
      "surface": "oxblood"
    },
    "b": {
      "label": "A strict librarian",
      "setting": "Sternly warning a loud study group across a reading desk.",
      "name": "A librarian scolding",
      "surface": "cream"
    },
    "quality": 7.85,
    "battery": "pair-battery@2"
  },
  {
    "key": "triage-bouncer",
    "a": {
      "label": "An ER triage nurse",
      "setting": "Assessing a long line of waiting patients at 2 AM on a Saturday.",
      "name": "An ER intake nurse",
      "surface": "mint"
    },
    "b": {
      "label": "A VIP club bouncer",
      "setting": "Eyeing a crowd pressed against the velvet rope on a rainy night.",
      "name": "A nightclub bouncer",
      "surface": "ink"
    },
    "quality": 7.84,
    "battery": "pair-battery@2"
  },
  {
    "key": "cast-sculpture",
    "a": {
      "label": "An orthopedic technician to a healing patient",
      "setting": "A medical tech plugs in an oscillating circular saw beside a child's brightly signed plaster.",
      "name": "Removing a medical cast",
      "surface": "mint"
    },
    "b": {
      "label": "A salvage diver over the comms",
      "setting": "Bubbles hiss as a heavy steel beam is hoisted off an ancient sunken galleon.",
      "name": "A submarine wreckage salvage",
      "surface": "sea"
    },
    "quality": 7.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "elevator-space-252",
    "a": {
      "label": "An elevator repairman",
      "setting": "Calling up the shaft through a maintenance hatch to trapped passengers.",
      "name": "Stuck in the elevator",
      "surface": "graphite"
    },
    "b": {
      "label": "An astronaut on spacewalk",
      "setting": "Radioing the capsule commander while drifting outside the hatch on a tether.",
      "name": "A spacewalk status check",
      "surface": "sky"
    },
    "quality": 7.8,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-property-archaeology",
    "a": {
      "label": "A municipal transit lost-and-found clerk",
      "setting": "Inspecting a battered cardboard box behind the counter at central station.",
      "name": "Lost property intake",
      "surface": "fog"
    },
    "b": {
      "label": "An archaeologist at a dig site",
      "setting": "Uncovering an undisturbed ancient tomb chamber beneath the dust.",
      "name": "An ancient burial discovery",
      "surface": "forest"
    },
    "quality": 7.77,
    "battery": "pair-battery@2"
  },
  {
    "key": "personal-trainer-and-drill-sergeant",
    "a": {
      "label": "An overzealous fitness trainer",
      "setting": "Standing over you on the turf mat while you struggle under a kettlebell.",
      "name": "A fitness boot camp",
      "surface": "lime"
    },
    "b": {
      "label": "A prison warden inspecting cells",
      "setting": "Pacing the concrete corridor, tapping a baton against steel bars at dawn.",
      "name": "A warden's morning rounds",
      "surface": "fog"
    },
    "quality": 7.77,
    "battery": "pair-battery@2"
  },
  {
    "key": "bread-patience-monastery",
    "a": {
      "label": "An artisanal sourdough baker",
      "setting": "Instructing a workshop pupil whose hands are caked in sticky wet dough.",
      "name": "Sourdough masterclass",
      "surface": "cream"
    },
    "b": {
      "label": "A meditation abbot",
      "setting": "Guiding a novice monk who is struggling with restless thoughts at dawn.",
      "name": "Zen monastery lesson",
      "surface": "moss"
    },
    "quality": 7.74,
    "battery": "pair-battery@2"
  },
  {
    "key": "kindergarten-drill-cadence",
    "a": {
      "label": "A substitute teacher",
      "setting": "Clapping hands loudly in front of twenty chaotic five-year-olds.",
      "name": "Elementary roll call",
      "surface": "apricot"
    },
    "b": {
      "label": "A drill sergeant",
      "setting": "Barking down a line of standing recruits at dawn on gravel.",
      "name": "Military lineup inspection",
      "surface": "forest"
    },
    "quality": 7.71,
    "battery": "pair-battery@2"
  },
  {
    "key": "elevator-bank-vault",
    "a": {
      "label": "An elevator technician",
      "setting": "Talking through an intercom to nervous passengers trapped between floors.",
      "name": "Stuck elevator intercom",
      "surface": "fog"
    },
    "b": {
      "label": "A bank teller",
      "setting": "Speaking to a customer trying to withdraw beyond their daily limit.",
      "name": "A denied bank transaction",
      "surface": "oxblood"
    },
    "quality": 7.68,
    "battery": "pair-battery@2"
  },
  {
    "key": "souffle-space-docking",
    "a": {
      "label": "A bakery instructor",
      "setting": "Hovering near an open oven door as timer bells ring across the kitchen.",
      "name": "Souffle oven check",
      "surface": "apricot"
    },
    "b": {
      "label": "A flight controller",
      "setting": "Transmitting vital telemetry to a capsule aligning with the orbital station.",
      "name": "Orbital docking telemetry",
      "surface": "ink"
    },
    "quality": 7.67,
    "battery": "pair-battery@2"
  },
  {
    "key": "cabin-crew-parent-rollercoaster",
    "a": {
      "label": "A flight attendant in sudden drops",
      "setting": "Gripping the galley wall over the cabin intercom as the airliner plummets through rough clouds.",
      "name": "Severe turbulence command",
      "surface": "navy"
    },
    "b": {
      "label": "A parent on a rogue carnival ride",
      "setting": "Gripping their terrified child's jacket on a creaking wooden coaster taking an unbanked curve.",
      "name": "A terrifying coaster ride",
      "surface": "blush"
    },
    "quality": 7.64,
    "battery": "pair-battery@2"
  },
  {
    "key": "galleon-rally",
    "a": {
      "label": "An explorer captain marking an X on charts",
      "setting": "Spoken to a mutinous crew clustered around the lantern-lit map table.",
      "name": "Parchment map reveal",
      "surface": "moss"
    },
    "b": {
      "label": "A campaign manager reading polling data",
      "setting": "Urged to the election staff gathered in the war room on primary night.",
      "name": "War room strategy leak",
      "surface": "rose"
    },
    "quality": 7.6,
    "battery": "pair-battery@2"
  },
  {
    "key": "wedding-drill",
    "a": {
      "label": "Wedding planner to bridal party",
      "setting": "Clapping hands sharply in the church vestibule ten minutes before music.",
      "name": "A wedding rehearsal",
      "surface": "cream"
    },
    "b": {
      "label": "Drill sergeant to recruits",
      "setting": "Barking commands on the parade ground at dawn.",
      "name": "A military drill",
      "surface": "forest"
    },
    "quality": 7.59,
    "battery": "pair-battery@2"
  },
  {
    "key": "dogcone-knight",
    "a": {
      "label": "A veterinarian putting a plastic cone on a recovering dog",
      "setting": "A vet snaps the collar on a moping golden retriever on an exam table.",
      "name": "Fitting a medical cone",
      "surface": "apricot"
    },
    "b": {
      "label": "A squire buckling plate armor onto a knight",
      "setting": "A squire secures heavy iron around a trembling knight before battle.",
      "name": "Armoring a knight",
      "surface": "graphite"
    },
    "quality": 7.55,
    "battery": "pair-battery@2"
  },
  {
    "key": "campaign-and-vet",
    "a": {
      "label": "A campaign manager backstage",
      "setting": "Whispering urgent advice to a rattled candidate before stepping onto the debate stage.",
      "name": "Backstage political prep",
      "surface": "paper"
    },
    "b": {
      "label": "A vet tech before a vaccination",
      "setting": "Holding a nervous golden retriever steady on a slick metal exam table.",
      "name": "Holding a pet steady",
      "surface": "cream"
    },
    "quality": 7.54,
    "battery": "pair-battery@2"
  },
  {
    "key": "lost-property-pawnshop",
    "a": {
      "label": "A lost and found clerk",
      "setting": "Behind the counter at a busy transit depot sorting forgotten items.",
      "name": "Lost and found clerk",
      "surface": "fog"
    },
    "b": {
      "label": "An antique appraiser",
      "setting": "Examining an heirloom brought into an upscale appraisal shop.",
      "name": "An antique appraisal",
      "surface": "paper"
    },
    "quality": 7.26,
    "battery": "pair-battery@2"
  }
];
