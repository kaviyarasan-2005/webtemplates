from PIL import Image, ImageEnhance, ImageOps

def create_before_after():
    try:
        base_img = Image.open('assets/images/before-after-1.jpg')
    except Exception as e:
        print(f"Error opening image: {e}")
        return
        
    # Create Before Image (Rusty/Dirty)
    # 1. Desaturate slightly
    enhancer = ImageEnhance.Color(base_img)
    before_img = enhancer.enhance(0.5)
    
    # 2. Add sepia/brownish tint to simulate rust/dirt
    # Convert to RGB if not already
    before_img = before_img.convert("RGB")
    sepia_img = ImageOps.colorize(ImageOps.grayscale(before_img), "#402010", "#d0c0a0")
    # Blend with original
    before_img = Image.blend(before_img, sepia_img, 0.6)
    
    # 3. Decrease brightness
    enhancer = ImageEnhance.Brightness(before_img)
    before_img = enhancer.enhance(0.7)
    
    # Save Before
    before_img.save('assets/images/before-1.jpg')
    print("Created before-1.jpg")
    
    # Create After Image (Shiny/Clean)
    # 1. Increase Saturation
    enhancer = ImageEnhance.Color(base_img)
    after_img = enhancer.enhance(1.4)
    
    # 2. Increase Contrast
    enhancer = ImageEnhance.Contrast(after_img)
    after_img = enhancer.enhance(1.2)
    
    # 3. Increase Brightness slightly
    enhancer = ImageEnhance.Brightness(after_img)
    after_img = enhancer.enhance(1.1)
    
    # Save After
    after_img.save('assets/images/after-1.jpg')
    print("Created after-1.jpg")

if __name__ == "__main__":
    create_before_after()
