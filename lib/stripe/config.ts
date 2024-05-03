export const STRIPE_TRIAL_PERIOD_DAYS = process.env
  .NEXT_PUBLIC_STRIPE_TRIAL_DAYS
  ? parseInt(process.env.NEXT_PUBLIC_STRIPE_TRIAL_DAYS)
  : 3
export const PLAN_FREE = "free"

export const PLAN_PRO_MONTHLY = "pro_monthly"
export const PLAN_PRO_YEARLY = "pro_yearly"
export const PLAN_PREMIUM_MONTHLY = "premium_monthly"

export const PLAN_PREMIUM_YEARLY = "premium_yearly"

export const PLAN_BYOK_MONTHLY = "byok_monthly"

export const PLAN_BYOK_YEARLY = "byok_yearly"

export const PLANS = [
  PLAN_FREE,
  PLAN_PRO_MONTHLY,
  PLAN_PRO_YEARLY,
  PLAN_PREMIUM_MONTHLY,
  PLAN_PREMIUM_YEARLY,
  PLAN_BYOK_MONTHLY,
  PLAN_BYOK_YEARLY
]

export const ACTIVE_PLAN_STATUSES = ["active", "trialing"]