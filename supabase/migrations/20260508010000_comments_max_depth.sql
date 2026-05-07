-- =============================================================
-- B003: Enforce max comment nesting depth = 2 at DB level
-- =============================================================

CREATE OR REPLACE FUNCTION public.enforce_comment_max_depth()
RETURNS TRIGGER AS $$
DECLARE
    v_grandparent UUID;
BEGIN
    IF NEW.parent_id IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT parent_id INTO v_grandparent
    FROM public.comments
    WHERE id = NEW.parent_id;

    IF v_grandparent IS NOT NULL THEN
        RAISE EXCEPTION 'Comments allow max 2 nesting levels'
            USING ERRCODE = '23514';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER enforce_comment_depth
    BEFORE INSERT ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.enforce_comment_max_depth();
