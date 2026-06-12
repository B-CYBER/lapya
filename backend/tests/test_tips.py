from datetime import date

from app.services.tips import TIPS, tip_for_today


def test_tips_are_present_and_nonempty():
    assert len(TIPS) >= 10
    assert all(isinstance(t, str) and t.strip() for t in TIPS)


def test_tip_for_today_is_deterministic():
    assert tip_for_today() == tip_for_today()
    assert tip_for_today() == TIPS[date.today().toordinal() % len(TIPS)]


def test_tips_rotate_across_the_cycle():
    seen = {TIPS[d % len(TIPS)] for d in range(len(TIPS))}
    assert len(seen) == len(TIPS)
