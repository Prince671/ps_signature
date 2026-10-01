import os
from PIL import Image, ImageDraw, ImageFont

def generate_logo(output_path="logo.png", size=2048, text="PS"):
    """
    Generates a high-resolution Neo-Brutalist logo.
    """
    # Colors (Neo-Brutalist Palette)
    bg_color = (10, 10, 10)  # Rich Black
    border_color = (255, 255, 255)  # Pure White
    accent_color = (255, 51, 51)  # Nothing Red
    text_color = (255, 255, 255)

    # Create base image
    img = Image.new("RGB", (size, size), bg_color)
    draw = ImageDraw.Draw(img)

    # Calculate dimensions
    padding = size * 0.1
    border_width = size * 0.04
    
    # Draw Inner Box
    rect_start = (padding, padding)
    rect_end = (size - padding, size - padding)
    
    # Draw thick border
    for i in range(int(border_width)):
        draw.rectangle(
            [rect_start[0] + i, rect_start[1] + i, rect_end[0] - i, rect_end[1] - i],
            outline=border_color
        )

    # Try to load a monospaced font
    font_size = int(size * 0.4)
    font = None
    
    # common locations for monospaced fonts
    font_paths = [
        "C:\\Windows\\Fonts\\consola.ttf",  # Consolas
        "C:\\Windows\\Fonts\\lucon.ttf",    # Lucida Console
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", # Linux
        "/System/Library/Fonts/Menlo.ttc"   # macOS
    ]
    
    for path in font_paths:
        if os.path.exists(path):
            try:
                font = ImageFont.truetype(path, font_size)
                break
            except:
                continue
    
    if not font:
        print("Warning: Monospaced font not found. Using default font.")
        font = ImageFont.load_default()
        # Note: default font doesn't support custom sizes well in older PIL versions

    # Center text
    if hasattr(font, "getbbox"):
        bbox = font.getbbox(text)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    else:
        # Fallback for older PIL
        text_width, text_height = draw.textsize(text, font=font)

    text_x = (size - text_width) / 2
    text_y = (size - text_height) / 2 - (size * 0.02) # Slight adjustment for visual centering

    draw.text((text_x, text_y), text, font=font, fill=text_color)

    # Add a "Nothing Red" accent dot in the bottom right corner of the box
    dot_radius = size * 0.02
    dot_center = (size - padding - border_width * 2, size - padding - border_width * 2)
    draw.ellipse(
        [dot_center[0] - dot_radius, dot_center[1] - dot_radius, 
         dot_center[0] + dot_radius, dot_center[1] + dot_radius],
        fill=accent_color
    )

    # Save image
    img.save(output_path, quality=100)
    print(f"Logo successfully generated at: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    generate_logo("portfolio_logo_highres.png")
