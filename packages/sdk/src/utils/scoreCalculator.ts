export interface RiskFactors {
  monetaryValue?: number;
  sensitivity?: "low" | "medium" | "high" | "critical";
  reversibility?: boolean;
  userImpact?: number;
  dataAccess?: "none" | "public" | "private" | "sensitive";
}

export function calculateRequiredScore(factors: RiskFactors): number {
  let baseScore = 700;

  if (factors.monetaryValue !== undefined) {
    if (factors.monetaryValue > 100000) baseScore += 1100;
    else if (factors.monetaryValue > 50000) baseScore += 900;
    else if (factors.monetaryValue > 10000) baseScore += 700;
    else if (factors.monetaryValue > 5000) baseScore += 500;
    else if (factors.monetaryValue > 1000) baseScore += 300;
    else if (factors.monetaryValue > 100) baseScore += 200;
  }

  switch (factors.sensitivity) {
    case "critical":
      baseScore += 800;
      break;
    case "high":
      baseScore += 500;
      break;
    case "medium":
      baseScore += 300;
      break;
    case "low":
      baseScore += 100;
      break;
  }

  if (factors.reversibility === false) {
    baseScore += 400;
  } else if (factors.reversibility === true) {
    baseScore -= 100;
  }

  if (factors.userImpact !== undefined) {
    baseScore += Math.min(factors.userImpact * 8, 800);
  }

  switch (factors.dataAccess) {
    case "sensitive":
      baseScore += 600;
      break;
    case "private":
      baseScore += 400;
      break;
    case "public":
      baseScore += 100;
      break;
    case "none":
      baseScore += 0;
      break;
  }

  return Math.max(700, Math.min(baseScore, 2000));
}

export function getRecommendedRequirements(useCase: string): {
  minScore: number;
  minVouches?: number;
  minReviews?: number;
  reasoning: string;
} {
  const useCaseMap: Record<
    string,
    {
      minScore: number;
      minVouches?: number;
      minReviews?: number;
      reasoning: string;
    }
  > = {
    chat: {
      minScore: 700,
      reasoning: "Basic spam prevention for public chat"
    },
    post_content: {
      minScore: 1000,
      reasoning: "Reduce spam and low-quality content"
    },
    financial_transaction: {
      minScore: 1400,
      minReviews: 3,
      reasoning: "Financial actions require proven trustworthiness"
    },
    governance: {
      minScore: 1600,
      minVouches: 3,
      reasoning: "Protocol decisions need experienced participants"
    },
    moderation: {
      minScore: 1800,
      minReviews: 10,
      minVouches: 5,
      reasoning: "High-trust role with significant responsibility"
    },
    ecommerce: {
      minScore: 1200,
      minReviews: 2,
      reasoning: "E-commerce requires some transaction history"
    },
    social: {
      minScore: 800,
      reasoning: "Social features need basic verification"
    }
  };

  return useCaseMap[useCase.toLowerCase()] ?? {
    minScore: 1000,
    reasoning: "Standard verification for unknown use case"
  };
}

export function suggestTier(score: number): {
  tier: string;
  suitable: string[];
  notSuitable: string[];
} {
  if (score >= 1800) {
    return {
      tier: "ELITE",
      suitable: [
        "Submit governance proposals",
        "Admin or moderator roles",
        "High-value transactions (>$50k)",
        "Create NFT collections",
        "Host community events"
      ],
      notSuitable: []
    };
  }

  if (score >= 1600) {
    return {
      tier: "PREMIUM",
      suitable: [
        "Post job listings",
        "Moderate communities",
        "Medium-value transactions ($10k-$50k)",
        "Priority NFT mints"
      ],
      notSuitable: ["Submit governance proposals (need 1800+)", "Admin roles (need 1800+)"]
    };
  }

  if (score >= 1200) {
    return {
      tier: "STANDARD",
      suitable: [
        "Vote in governance",
        "Apply for jobs",
        "Standard transactions ($1k-$10k)",
        "Direct messaging"
      ],
      notSuitable: ["Post job listings (need 1600+)", "Moderator roles (need 1600+)"]
    };
  }

  if (score >= 700) {
    return {
      tier: "BASIC",
      suitable: ["Post content", "Comment", "Small transactions (<$1k)", "Attend events"],
      notSuitable: [
        "Voting (need 1200+)",
        "Job applications (need 1200+)",
        "Financial transactions (need 1400+)"
      ]
    };
  }

  return {
    tier: "NEW",
    suitable: ["View content", "Browse marketplace", "Build reputation"],
    notSuitable: ["Most gated features (need 700+ minimum)"]
  };
}
