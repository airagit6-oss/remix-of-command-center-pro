
-- ============ ROLE INFRA (idempotent) ============
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','boss','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  CREATE POLICY ur_self_read ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','boss'))
$$;

-- ============ AMS CATALOGS ============

CREATE TABLE public.ams_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'general',
  xp integer NOT NULL DEFAULT 0,
  role text NOT NULL DEFAULT 'all',
  icon text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ams_achievements TO authenticated;
GRANT ALL ON public.ams_achievements TO service_role;
ALTER TABLE public.ams_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY ach_read ON public.ams_achievements FOR SELECT TO authenticated USING (true);
CREATE POLICY ach_admin_write ON public.ams_achievements FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.ams_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  rarity text NOT NULL DEFAULT 'common',
  icon text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ams_badges TO authenticated;
GRANT ALL ON public.ams_badges TO service_role;
ALTER TABLE public.ams_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY bg_read ON public.ams_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY bg_admin_write ON public.ams_badges FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.ams_trophies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  tier text NOT NULL DEFAULT 'bronze',
  icon text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ams_trophies TO authenticated;
GRANT ALL ON public.ams_trophies TO service_role;
ALTER TABLE public.ams_trophies ENABLE ROW LEVEL SECURITY;
CREATE POLICY tr_read ON public.ams_trophies FOR SELECT TO authenticated USING (true);
CREATE POLICY tr_admin_write ON public.ams_trophies FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.ams_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  type text NOT NULL DEFAULT 'points',
  cost_xp integer NOT NULL DEFAULT 0,
  value numeric NOT NULL DEFAULT 0,
  stock integer NOT NULL DEFAULT -1,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ams_rewards TO authenticated;
GRANT ALL ON public.ams_rewards TO service_role;
ALTER TABLE public.ams_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY rw_read ON public.ams_rewards FOR SELECT TO authenticated USING (true);
CREATE POLICY rw_admin_write ON public.ams_rewards FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.ams_levels (
  level integer PRIMARY KEY,
  xp_required integer NOT NULL,
  title text NOT NULL,
  reward text
);
GRANT SELECT ON public.ams_levels TO authenticated;
GRANT ALL ON public.ams_levels TO service_role;
ALTER TABLE public.ams_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY lv_read ON public.ams_levels FOR SELECT TO authenticated USING (true);
CREATE POLICY lv_admin_write ON public.ams_levels FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.ams_ranks (
  id text PRIMARY KEY,
  name text NOT NULL,
  min_level integer NOT NULL,
  color text NOT NULL DEFAULT '#94a3b8',
  perks text
);
GRANT SELECT ON public.ams_ranks TO authenticated;
GRANT ALL ON public.ams_ranks TO service_role;
ALTER TABLE public.ams_ranks ENABLE ROW LEVEL SECURITY;
CREATE POLICY rk_read ON public.ams_ranks FOR SELECT TO authenticated USING (true);
CREATE POLICY rk_admin_write ON public.ams_ranks FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.ams_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  target_value numeric NOT NULL DEFAULT 0,
  metric text NOT NULL DEFAULT 'xp',
  xp_reward integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ams_milestones TO authenticated;
GRANT ALL ON public.ams_milestones TO service_role;
ALTER TABLE public.ams_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY ms_read ON public.ams_milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY ms_admin_write ON public.ams_milestones FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- ============ USER STATE ============

CREATE TABLE public.ams_user_progress (
  user_id uuid PRIMARY KEY,
  display_name text,
  role text NOT NULL DEFAULT 'user',
  territory text,
  total_xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  rank text NOT NULL DEFAULT 'Starter',
  achievements_unlocked integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_activity_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ams_user_progress TO authenticated;
GRANT ALL ON public.ams_user_progress TO service_role;
ALTER TABLE public.ams_user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY up_self ON public.ams_user_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY up_self_write ON public.ams_user_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY up_self_update ON public.ams_user_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY up_admin_del ON public.ams_user_progress FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE TABLE public.ams_xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL DEFAULT 'general',
  amount integer NOT NULL,
  reason text NOT NULL,
  achievement_id uuid REFERENCES public.ams_achievements(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ams_xp_user_idx ON public.ams_xp_transactions(user_id, created_at DESC);
GRANT SELECT, INSERT ON public.ams_xp_transactions TO authenticated;
GRANT ALL ON public.ams_xp_transactions TO service_role;
ALTER TABLE public.ams_xp_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY xp_self_read ON public.ams_xp_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY xp_self_write ON public.ams_xp_transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TABLE public.ams_user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES public.ams_achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);
GRANT SELECT, INSERT, DELETE ON public.ams_user_achievements TO authenticated;
GRANT ALL ON public.ams_user_achievements TO service_role;
ALTER TABLE public.ams_user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY ua_self ON public.ams_user_achievements FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TABLE public.ams_user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES public.ams_badges(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
GRANT SELECT, INSERT, DELETE ON public.ams_user_badges TO authenticated;
GRANT ALL ON public.ams_user_badges TO service_role;
ALTER TABLE public.ams_user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY ub_self ON public.ams_user_badges FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TABLE public.ams_user_trophies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trophy_id uuid NOT NULL REFERENCES public.ams_trophies(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, trophy_id)
);
GRANT SELECT, INSERT, DELETE ON public.ams_user_trophies TO authenticated;
GRANT ALL ON public.ams_user_trophies TO service_role;
ALTER TABLE public.ams_user_trophies ENABLE ROW LEVEL SECURITY;
CREATE POLICY ut_self ON public.ams_user_trophies FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TABLE public.ams_user_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  milestone_id uuid NOT NULL REFERENCES public.ams_milestones(id) ON DELETE CASCADE,
  progress numeric NOT NULL DEFAULT 0,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, milestone_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ams_user_milestones TO authenticated;
GRANT ALL ON public.ams_user_milestones TO service_role;
ALTER TABLE public.ams_user_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY um_self ON public.ams_user_milestones FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TABLE public.ams_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  reward_id uuid NOT NULL REFERENCES public.ams_rewards(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.ams_claims TO authenticated;
GRANT ALL ON public.ams_claims TO service_role;
ALTER TABLE public.ams_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY cl_self_read ON public.ams_claims FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));
CREATE POLICY cl_self_insert ON public.ams_claims FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY cl_admin_update ON public.ams_claims FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.ams_streaks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  date date NOT NULL,
  activity_count integer NOT NULL DEFAULT 1,
  UNIQUE(user_id, date)
);
GRANT SELECT, INSERT, UPDATE ON public.ams_streaks TO authenticated;
GRANT ALL ON public.ams_streaks TO service_role;
ALTER TABLE public.ams_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY st_self ON public.ams_streaks FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.ams_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  body text,
  type text NOT NULL DEFAULT 'achievement',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ams_notif_user_idx ON public.ams_notifications(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ams_notifications TO authenticated;
GRANT ALL ON public.ams_notifications TO service_role;
ALTER TABLE public.ams_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY nt_self ON public.ams_notifications FOR ALL TO authenticated
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE TABLE public.ams_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ams_audit_idx ON public.ams_audit_logs(created_at DESC);
GRANT SELECT, INSERT ON public.ams_audit_logs TO authenticated;
GRANT ALL ON public.ams_audit_logs TO service_role;
ALTER TABLE public.ams_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY al_admin_read ON public.ams_audit_logs FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
CREATE POLICY al_insert ON public.ams_audit_logs FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_id OR public.is_admin(auth.uid()));

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER ams_ach_updated BEFORE UPDATE ON public.ams_achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER ams_up_updated BEFORE UPDATE ON public.ams_user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER ams_cl_updated BEFORE UPDATE ON public.ams_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AWARD XP RPC ============
CREATE OR REPLACE FUNCTION public.ams_award_xp(
  _user_id uuid, _amount integer, _category text, _reason text, _achievement_id uuid DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _txid uuid;
  _new_total integer;
  _new_level integer;
  _new_rank text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'unauthorized'; END IF;
  IF auth.uid() <> _user_id AND NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO public.ams_xp_transactions(user_id, amount, category, reason, achievement_id)
  VALUES (_user_id, _amount, _category, _reason, _achievement_id)
  RETURNING id INTO _txid;

  INSERT INTO public.ams_user_progress(user_id, total_xp, last_activity_at)
  VALUES (_user_id, GREATEST(_amount,0), now())
  ON CONFLICT (user_id) DO UPDATE
    SET total_xp = public.ams_user_progress.total_xp + _amount,
        last_activity_at = now()
  RETURNING total_xp INTO _new_total;

  SELECT level INTO _new_level FROM public.ams_levels
    WHERE xp_required <= _new_total ORDER BY level DESC LIMIT 1;
  SELECT name INTO _new_rank FROM public.ams_ranks
    WHERE min_level <= COALESCE(_new_level,1) ORDER BY min_level DESC LIMIT 1;

  UPDATE public.ams_user_progress
    SET level = COALESCE(_new_level, level),
        rank  = COALESCE(_new_rank,  rank)
    WHERE user_id = _user_id;

  INSERT INTO public.ams_streaks(user_id, date, activity_count)
  VALUES (_user_id, current_date, 1)
  ON CONFLICT (user_id, date) DO UPDATE SET activity_count = public.ams_streaks.activity_count + 1;

  RETURN _txid;
END $$;
GRANT EXECUTE ON FUNCTION public.ams_award_xp(uuid,integer,text,text,uuid) TO authenticated;

-- ============ SEED LEVELS + RANKS + CATALOGS ============
INSERT INTO public.ams_levels(level, xp_required, title, reward)
SELECT g,
       ROUND(500 * POWER(g, 1.45))::int,
       CASE WHEN g<5 THEN 'Recruit' WHEN g<15 THEN 'Builder' WHEN g<30 THEN 'Operator'
            WHEN g<50 THEN 'Strategist' WHEN g<80 THEN 'Commander' ELSE 'Sovereign' END,
       CASE WHEN g % 10 = 0 THEN '+'||(g*100)::text||' pts wallet credit'
            WHEN g % 5 = 0 THEN 'Badge unlock' ELSE '—' END
FROM generate_series(1,100) g
ON CONFLICT (level) DO NOTHING;

INSERT INTO public.ams_ranks(id,name,min_level,color,perks) VALUES
  ('starter','Starter',1,'#94a3b8','Welcome onboard'),
  ('bronze','Bronze',5,'#b45309','5% bonus XP'),
  ('silver','Silver',15,'#94a3b8','10% bonus XP, priority leads'),
  ('gold','Gold',30,'#eab308','15% commission boost'),
  ('platinum','Platinum',50,'#06b6d4','VIP support, premium frames'),
  ('diamond','Diamond',80,'#3b82f6','Quarterly bonus pool'),
  ('titan','Titan',120,'#8b5cf6','Exclusive trophy room'),
  ('legend','Legend',200,'#ec4899','Hall of Fame entry'),
  ('champion','Champion',350,'#f97316','Equity points eligibility'),
  ('global','Global Champion',500,'#ef4444','Annual world summit invite')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ams_achievements(code,title,description,category,xp,role,active) VALUES
  ('FIRST_SALE','First Sale','Close your very first deal','sales',500,'all',true),
  ('REVENUE_10K','Revenue ₹10K','Cross ₹10,000 in revenue','revenue',1000,'all',true),
  ('REVENUE_1L','Revenue ₹1 Lakh','Cross ₹1,00,000 in revenue','revenue',5000,'all',true),
  ('TOP_DEV_MONTH','Top Developer','Be the #1 dev this month','development',4000,'developer',true),
  ('RENEWAL_KING','Renewal King','20 renewals in a month','renewal',3000,'reseller',true),
  ('SUPPORT_HERO','Support Hero','95%+ CSAT for 30 days','support',2500,'support',true),
  ('TRAINING_COMPLETE','Certified Pro','Finish training program','training',1500,'all',true),
  ('CUSTOMER_LOVE','Customer Love','50 five-star reviews','customer',2000,'vendor',true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.ams_badges(code,title,description,rarity,icon) VALUES
  ('STARTER','Starter','Joined the platform','common','Sparkles'),
  ('CLOSER','Closer','10 deals closed','rare','Target'),
  ('MARATHONER','Marathoner','30-day streak','epic','Flame'),
  ('LEGEND','Legend','Reached Legend rank','legendary','Crown')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.ams_trophies(code,title,description,tier,icon) VALUES
  ('TROPHY_BRONZE','Bronze Trophy','Tier 1 achievement','bronze','Trophy'),
  ('TROPHY_SILVER','Silver Trophy','Tier 2 achievement','silver','Trophy'),
  ('TROPHY_GOLD','Gold Trophy','Tier 3 achievement','gold','Trophy'),
  ('TROPHY_PLATINUM','Platinum Trophy','Tier 4 achievement','platinum','Trophy')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.ams_rewards(code,title,description,type,cost_xp,value,stock) VALUES
  ('AMAZON_500','Amazon Voucher ₹500','Redeem against wallet XP','voucher',5000,500,100),
  ('CASH_1000','Cash Reward ₹1000','Direct payout','cash',10000,1000,50),
  ('SWAG_TSHIRT','Branded T-Shirt','Premium merch','merch',3000,0,200),
  ('PREMIUM_MONTH','Premium Month','1 month premium upgrade','subscription',2000,0,-1)
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.ams_milestones(code,title,description,target_value,metric,xp_reward) VALUES
  ('XP_10K','XP 10,000','Earn 10K XP',10000,'xp',1000),
  ('XP_50K','XP 50,000','Earn 50K XP',50000,'xp',5000),
  ('STREAK_30','30-Day Streak','Stay active 30 days in a row',30,'streak',3000),
  ('ACHIEVE_25','25 Achievements','Unlock 25 achievements',25,'achievements',2500)
ON CONFLICT (code) DO NOTHING;
