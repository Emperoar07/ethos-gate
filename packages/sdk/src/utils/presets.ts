export interface ScoreRequirement {
  minScore?: number;
  minVouches?: number;
  minReviews?: number;
  description: string;
}

const BASE_PRESETS = {
  PUBLIC: {
    minScore: 0,
    description: "Open to everyone - no restrictions"
  },
  BASIC: {
    minScore: 700,
    description: "Basic reputation check - filters most bots and spam"
  },
  STANDARD: {
    minScore: 1200,
    description: "Standard access - established community members"
  },
  PREMIUM: {
    minScore: 1600,
    description: "Premium access - high-trust users only"
  },
  ELITE: {
    minScore: 1800,
    description: "Elite access - proven track record required"
  }
} as const;

const USE_CASE_PRESETS = {
  USE_CASES: {
    CHECKOUT: {
      minScore: 1000,
      minReviews: 2,
      description: "Complete purchase - reduces fraud risk"
    },
    SELLER: {
      minScore: 1400,
      minVouches: 3,
      description: "Sell products - must be proven trustworthy"
    },
    HIGH_VALUE_PURCHASE: {
      minScore: 1600,
      minVouches: 5,
      description: "Purchase over $1000 - high-trust required"
    },
    POST_CONTENT: {
      minScore: 700,
      description: "Post content - basic spam filter"
    },
    COMMENT: {
      minScore: 500,
      description: "Leave comments - minimal filtering"
    },
    DIRECT_MESSAGE: {
      minScore: 1000,
      description: "Send direct messages - reduce spam"
    },
    MODERATOR: {
      minScore: 1600,
      minReviews: 10,
      minVouches: 5,
      description: "Community moderator - high responsibility"
    },
    ADMIN: {
      minScore: 1800,
      minReviews: 15,
      minVouches: 10,
      description: "Administrator access - critical role"
    },
    BORROW: {
      minScore: 1500,
      minVouches: 5,
      description: "Borrow funds - undercollateralized lending"
    },
    BORROW_LARGE: {
      minScore: 1800,
      minVouches: 10,
      minReviews: 5,
      description: "Borrow over $10k - maximum trust required"
    },
    LEND: {
      minScore: 1000,
      description: "Provide liquidity - basic verification"
    },
    TRADE: {
      minScore: 1200,
      description: "P2P trading - prevent scams"
    },
    STAKE: {
      minScore: 800,
      description: "Stake tokens - minimal risk"
    },
    VOTE: {
      minScore: 1200,
      description: "Vote on proposals - active participation"
    },
    PROPOSE: {
      minScore: 1800,
      minReviews: 5,
      minVouches: 5,
      description: "Submit governance proposals - high bar"
    },
    DELEGATE: {
      minScore: 1400,
      description: "Receive voting delegation"
    },
    APPLY_JOB: {
      minScore: 1200,
      minReviews: 3,
      description: "Apply for freelance work - proven track record"
    },
    POST_JOB: {
      minScore: 1600,
      description: "Post job listings - must be trustworthy client"
    },
    HIRE: {
      minScore: 1400,
      description: "Hire freelancers - pay for work"
    },
    MINT_NFT: {
      minScore: 1000,
      description: "Participate in NFT mints - anti-bot"
    },
    MINT_ALLOWLIST: {
      minScore: 1400,
      description: "Priority NFT allowlist - premium access"
    },
    CREATE_COLLECTION: {
      minScore: 1600,
      minVouches: 5,
      description: "Create NFT collection - must be trusted creator"
    },
    LIST_NFT: {
      minScore: 1200,
      description: "List NFT for sale - prevent scams"
    },
    ATTEND_EVENT: {
      minScore: 1200,
      description: "Attend in-person events - verified attendees"
    },
    SPEAK_EVENT: {
      minScore: 1800,
      description: "Speaker at events - thought leaders only"
    },
    HOST_EVENT: {
      minScore: 1600,
      minVouches: 5,
      description: "Host community events - trusted organizers"
    },
    PUBLISH_ARTICLE: {
      minScore: 1400,
      description: "Publish articles - quality content"
    },
    UPLOAD_VIDEO: {
      minScore: 1000,
      description: "Upload videos - reduce spam"
    },
    LIVESTREAM: {
      minScore: 1200,
      description: "Start livestream - verified streamers"
    },
    CREATE_LISTING: {
      minScore: 1400,
      minReviews: 3,
      description: "Create marketplace listing - trusted sellers"
    },
    MAKE_OFFER: {
      minScore: 1200,
      description: "Make purchase offers - serious buyers"
    },
    ESCROW_RELEASE: {
      minScore: 1600,
      description: "Release escrowed funds - high trust"
    }
  }
} as const;

export const SCORE_PRESETS = {
  ...BASE_PRESETS,
  ...USE_CASE_PRESETS
} as const;

export type PresetName = keyof typeof BASE_PRESETS;
export type UseCaseName = keyof typeof SCORE_PRESETS.USE_CASES;

export function getPreset(name: PresetName | UseCaseName): ScoreRequirement {
  if (name in BASE_PRESETS) {
    return BASE_PRESETS[name as PresetName];
  }

  if (name in SCORE_PRESETS.USE_CASES) {
    return SCORE_PRESETS.USE_CASES[name as UseCaseName];
  }

  return BASE_PRESETS.BASIC;
}

export function listPresets(): { name: string; requirement: ScoreRequirement }[] {
  const presets: { name: string; requirement: ScoreRequirement }[] = [];

  Object.keys(BASE_PRESETS).forEach((key) => {
    presets.push({
      name: key,
      requirement: BASE_PRESETS[key as PresetName]
    });
  });

  Object.keys(SCORE_PRESETS.USE_CASES).forEach((key) => {
    presets.push({
      name: key,
      requirement: SCORE_PRESETS.USE_CASES[key as UseCaseName]
    });
  });

  return presets;
}
