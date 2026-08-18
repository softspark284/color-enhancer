CREATE TABLE public.hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kicker text NOT NULL DEFAULT '',
  title text NOT NULL,
  subtitle text NOT NULL DEFAULT '',
  cta_primary text NOT NULL DEFAULT '',
  cta_secondary text NOT NULL DEFAULT '',
  cta_link text NOT NULL DEFAULT '/',
  gradient text NOT NULL DEFAULT '',
  icon_name text NOT NULL DEFAULT 'Sparkles',
  accent text NOT NULL DEFAULT 'text-cyan-300',
  position integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  published_at timestamptz,
  unpublish_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hero_slides TO anon;
GRANT SELECT ON public.hero_slides TO authenticated;
GRANT ALL ON public.hero_slides TO service_role;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hero slides are publicly readable" ON public.hero_slides FOR SELECT TO anon, authenticated USING (visible = true);
INSERT INTO public.hero_slides (slug,kicker,title,subtitle,cta_primary,cta_secondary,cta_link,gradient,icon_name,accent,position,visible) VALUES
('12-000-software-solutions','Marketplace','12,000+ Software Solutions','One Marketplace. Every Business Need.','Browse Products','Watch Live Demo','/demos/public','from-[#0b1a30] via-[#12325c] to-[#0a1526]','Boxes','text-cyan-300',0,true),
('business-enterprise-solutions','Enterprise Ready','Business & Enterprise Solutions','ERP • CRM • HRM • Accounting','Explore Suites','Watch Live Demo','/#Enterprise','from-[#1a1030] via-[#3b1f6b] to-[#0e0a1e]','Crown','text-violet-300',1,true),
('education-training-solutions','Education','Education & Training Solutions','School • College • E-Learning • Coaching','Explore Education','Watch Live Demo','/#Education','from-[#071b33] via-[#1d4ed8] to-[#0a1526]','GraduationCap','text-sky-300',2,true),
('healthcare-medical-solutions','Healthcare','Healthcare & Medical Solutions','Hospital • Clinic • Pharmacy • Laboratory','Explore Healthcare','Watch Live Demo','/#Healthcare','from-[#2a0a1c] via-[#9d174d] to-[#1a0512]','Stethoscope','text-rose-300',3,true),
('retail-sales-solutions','Retail & POS','Retail & Sales Solutions','POS • Retail • Inventory • Billing','Explore Retail','Watch Live Demo','/#Retail%20%26%20POS','from-[#2a1405] via-[#b45309] to-[#170b02]','Store','text-amber-300',4,true),
('hospitality-food-solutions','Hospitality','Hospitality & Food Solutions','Hotel • Restaurant • Cafe • Food Delivery','Explore Hospitality','Watch Live Demo','/#Hospitality','from-[#2b0f16] via-[#be3455] to-[#180810]','Utensils','text-orange-300',5,true),
('manufacturing-industry-solutions','Manufacturing','Manufacturing & Industry Solutions','Factory • Warehouse • Supply Chain • Production','Explore Manufacturing','Watch Live Demo','/#Manufacturing','from-[#131720] via-[#3f4c63] to-[#0b0e14]','Boxes','text-slate-200',6,true),
('transport-logistics-solutions','Logistics','Transport & Logistics Solutions','Logistics • Cargo • Fleet • Transportation','Explore Logistics','Watch Live Demo','/#Logistics','from-[#04211f] via-[#0f766e] to-[#03130f]','Rocket','text-teal-300',7,true),
('finance-professional-solutions','Finance','Finance & Professional Solutions','Finance • Loan • Insurance • Tax','Explore Finance','Watch Live Demo','/#Finance','from-[#0a2019] via-[#12523c] to-[#07130f]','BadgeCheck','text-emerald-300',8,true),
('property-service-solutions','Real Estate','Property & Service Solutions','Real Estate • Society • Facility • Service Management','Explore Property','Watch Live Demo','/#Real%20Estate','from-[#241a04] via-[#a16207] to-[#140d02]','Users','text-yellow-300',9,true),
('lifetime-software-only-249','Lifetime Deal','Lifetime Software — Only $249','One Payment. Lifetime Ownership.','Buy Lifetime','Watch Live Demo','/demos/public','from-[#231603] via-[#c2760a] to-[#130c02]','Crown','text-amber-300',10,true),
('no-hidden-charges','Transparent Pricing','No Hidden Charges','100% Transparent Pricing.','See Pricing','Watch Live Demo','/#pricing','from-[#052018] via-[#0f766e] to-[#04120e]','BadgeCheck','text-emerald-300',11,true),
('no-advance-payment','Trust First','No Advance Payment','Business Built on Trust.','Start Risk-Free','Watch Live Demo','/demos/public','from-[#04202b] via-[#0e7490] to-[#03131a]','ShieldCheck','text-cyan-300',12,true),
('24-7-technical-support','Global Support','24/7 Technical Support','Always Ready to Help.','Contact Support','Watch Live Demo','/#Support','from-[#08182e] via-[#1e40af] to-[#050d1a]','Globe2','text-sky-300',13,true),
('buy-sell-resell-franchise','Opportunities','Buy • Sell • Resell • Franchise','Multiple Business Opportunities.','Explore Options','Watch Live Demo','/apply','from-[#22052a] via-[#a21caf] to-[#130317]','Rocket','text-fuchsia-300',14,true),
('reseller-distributor-franchise-influence','Partner Program','Reseller • Distributor • Franchise • Influencer','Grow with Software Vala.','Become a Partner','Watch Live Demo','/apply','from-[#160a2c] via-[#6d28d9] to-[#0c0619]','Users','text-violet-300',15,true),
('demo-videos-tutorials','Live Demos','Demo Videos & Tutorials','Show. Explain. Sell.','Watch Demos','Browse Products','/demos/public','from-[#2a0713] via-[#be123c] to-[#16040a]','Play','text-rose-300',16,true),
('don-t-build-software-from-scratch','Ready to Deploy','Don’t Build Software From Scratch','Start with Ready-Made Solutions.','Get Started','Watch Live Demo','/demos/public','from-[#1f1a03] via-[#ca8a04] to-[#120f02]','Zap','text-yellow-300',17,true),
('80-business-categories','Categories','80+ Business Categories','Everything Your Business Needs.','Browse Categories','Watch Live Demo','/#all','from-[#04211d] via-[#0d9488] to-[#031311]','Boxes','text-teal-300',18,true),
('software-vala-the-name-of-trust','The Name of Trust','Software Vala — The Name of Trust','One Marketplace. Endless Business Opportunities.','Browse Products','Watch Live Demo','/demos/public','from-[#0b1a30] via-[#12325c] to-[#0a1526]','Sparkles','text-cyan-300',19,true);