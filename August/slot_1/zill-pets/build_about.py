with open('contact.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Fix Title
content = re.sub(r'<title>.*?</title>', '<title>ZILL - About</title>', content)
content = content.replace('Get in touch with the ZILL team for support, questions, and consultations.', 'Learn about ZILL: Our mission, our history, and our core principles in reptile keeping.')

# Replace S1 and S2 blocks
start_s1 = content.find('<!-- S1 ')
start_s4 = content.find('<!-- S4 ')

new_body = '''<!-- S1 &mdash; HERO -->
    <section class="hero" style="background: var(--clr-bg); padding-top: 6rem; padding-bottom: 4rem; text-align: center; border-bottom: 1px solid rgba(22,22,22,0.1);">
      <div class="container">
        <span class="stamp sticker" style="display:inline-block; margin-bottom: 1rem; transform: rotate(-2deg); background: var(--clr-yellow); color: var(--clr-ink); font-weight: bold; border: 2px solid var(--clr-ink);">ABOUT US</span>
        <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: clamp(3rem, 6vw, 4.5rem); line-height: 1.1; margin-bottom: 1.5rem; color: var(--clr-ink);">
          Redefining Reptile Care.
        </h1>
        <p style="font-size: 1.25rem; max-width: 600px; margin: 0 auto; color: var(--clr-text-sub);">
          We started ZILL with a simple mission: to provide healthy, captive-bred animals and educate keepers on providing world-class habitats.
        </p>
      </div>
    </section>

    <!-- S2 &mdash; OUR STORY -->
    <section class="section">
      <div class="container">
        <div class="split-row" style="align-items: center; gap: 4rem;">
          <div class="split-row__col" style="flex: 1 1 50%;">
            <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80" alt="ZILL founders handling a bearded dragon" style="width: 100%; border: 2px solid var(--clr-border); box-shadow: 8px 8px 0 var(--clr-yellow); border-radius: 8px; object-fit: cover; aspect-ratio: 4/3;">
          </div>
          <div class="split-row__col" style="flex: 1 1 50%;">
            <h2 style="font-size: 2.25rem; margin-bottom: 1.25rem; color: var(--clr-text);">Born from Passion</h2>
            <p style="font-size: 1.1rem; line-height: 1.7; color: var(--clr-text-sub); margin-bottom: 1rem;">
              ZILL was founded by a small group of exotic pet enthusiasts who were tired of seeing unhealthy, wild-caught animals sold in poor conditions. We knew there was a better way. 
            </p>
            <p style="font-size: 1.1rem; line-height: 1.7; color: var(--clr-text-sub);">
              Today, we are a leading provider of premium, 100% captive-bred reptiles, high-quality bioactive habitats, and nutritious live feeders. We pride ourselves on education, ensuring every pet goes to a prepared and knowledgeable home.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- S3 &mdash; CORE PRINCIPLES -->
    <section class="section section--alt">
      <div class="container">
        <div style="text-align: center; margin-bottom: 3rem;">
          <h2 style="font-size: 2.5rem; color: var(--clr-text);">Our Core Principles</h2>
          <p style="font-size: 1.1rem; color: var(--clr-text-sub); max-width: 600px; margin: 0 auto;">We don't compromise when it comes to animal welfare.</p>
        </div>
        
        <div class="grid grid--3">
          <div class="card" style="padding: 2rem; border-top: 4px solid var(--clr-green);">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--clr-text);">100% Captive-Bred</h3>
            <p style="color: var(--clr-text-sub); line-height: 1.6;">We never sell wild-caught animals. Every reptile we offer is captive-bred, ensuring better health, docile temperaments, and the protection of wild populations.</p>
          </div>
          <div class="card" style="padding: 2rem; border-top: 4px solid var(--clr-yellow);">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--clr-text);">Education First</h3>
            <p style="color: var(--clr-text-sub); line-height: 1.6;">We provide comprehensive care guides and expert support because an informed keeper is the key to a thriving pet.</p>
          </div>
          <div class="card" style="padding: 2rem; border-top: 4px solid var(--clr-ink);">
            <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--clr-text);">Bioactive Focus</h3>
            <p style="color: var(--clr-text-sub); line-height: 1.6;">We advocate for naturalistic, bioactive enclosures that stimulate natural behaviors and improve the quality of life for your scaly companions.</p>
          </div>
        </div>
      </div>
    </section>

    '''

if start_s1 != -1 and start_s4 != -1:
    content = content[:start_s1] + new_body + content[start_s4:]

with open('about.html', 'w', encoding='utf-8') as f:
    f.write(content)
