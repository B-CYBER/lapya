import io

from PIL import Image

from scripts.process_recipe_images import MAX_WIDTH, QUALITY, downscale


def test_downscale_caps_width_and_keeps_aspect():
    big = Image.new("RGB", (2400, 1600), (200, 120, 60))
    out = downscale(big)
    assert out.width == MAX_WIDTH
    assert out.height == round(MAX_WIDTH * 1600 / 2400)
    assert out.mode == "RGB"


def test_downscale_leaves_small_images_alone():
    small = Image.new("RGB", (640, 480), (10, 20, 30))
    out = downscale(small)
    assert out.size == (640, 480)


def test_downscale_converts_mode_to_rgb():
    rgba = Image.new("RGBA", (100, 100), (1, 2, 3, 255))
    assert downscale(rgba).mode == "RGB"


def test_recompressed_jpeg_is_smaller_than_raw():
    big = Image.new("RGB", (2400, 1600), (123, 200, 50))
    out = downscale(big)
    buf = io.BytesIO()
    out.save(buf, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    # A flat 800px JPEG should be comfortably small.
    assert buf.tell() < 200_000
