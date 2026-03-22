-- Onboarding RPC: atomically creates a company, links user, creates theme + default sections
CREATE OR REPLACE FUNCTION public.onboard_company(
  p_company_name text,
  p_company_slug text,
  p_company_description text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_company_id uuid;
  v_result json;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF EXISTS (SELECT 1 FROM company_users WHERE user_id = v_user_id) THEN
    RAISE EXCEPTION 'User already belongs to a company';
  END IF;

  IF EXISTS (SELECT 1 FROM companies WHERE slug = p_company_slug) THEN
    RAISE EXCEPTION 'Company slug already taken';
  END IF;

  INSERT INTO companies (name, slug, description, is_published)
  VALUES (p_company_name, p_company_slug, p_company_description, false)
  RETURNING id INTO v_company_id;

  INSERT INTO company_users (company_id, user_id, role)
  VALUES (v_company_id, v_user_id, 'admin');

  INSERT INTO company_themes (company_id, primary_color, secondary_color, font_family)
  VALUES (v_company_id, '#2563eb', '#64748b', 'Inter');

  INSERT INTO company_sections (company_id, type, title, content, sort_order, is_visible) VALUES
    (v_company_id, 'about', 'About Us', '{"text": "Tell your company story here...", "image_url": ""}', 0, true),
    (v_company_id, 'life', 'Life at ' || p_company_name, '{"description": "Show what it''s like to work here", "images": []}', 1, true),
    (v_company_id, 'values', 'Our Values', '{"values": [{"title": "Innovation", "description": "We push boundaries"}, {"title": "Collaboration", "description": "Better together"}, {"title": "Growth", "description": "Always learning"}]}', 2, true),
    (v_company_id, 'benefits', 'Benefits & Perks', '{"benefits": [{"title": "Health Insurance", "description": "Comprehensive coverage"}, {"title": "Flexible Hours", "description": "Work when you are most productive"}, {"title": "Learning Budget", "description": "Grow your skills"}]}', 3, true);

  v_result := json_build_object('company_id', v_company_id, 'slug', p_company_slug, 'user_id', v_user_id);
  RETURN v_result;
END;
$$;
