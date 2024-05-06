---add stripe customer id to profiles
ALTER TABLE profiles ADD Column stripe_customer_id TEXT CHECK (char_length(stripe_customer_id) <= 1000)