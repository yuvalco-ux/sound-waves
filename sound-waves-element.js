// sound-waves-element.js
// Custom Element + p5 + p5.sound + מיקרופון + Hover

class SoundWaves extends HTMLElement {
  connectedCallback() {
    // סגנון בסיסי לאלמנט
    this.style.display = "block";
    this.style.position = "relative";
    this.style.width = "100%";
    this.style.height = "100%";

    // כפתור הפעלת מיקרופון
    const micButton = document.createElement("button");
    micButton.textContent = "הפעל מיקרופון 🎤";
    Object.assign(micButton.style, {
      position: "absolute",
      top: "20px",
      right: "20px",
      padding: "10px 16px",
      background: "black",
      color: "white",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      zIndex: "10",
    });
    this.appendChild(micButton);

    // קונטיינר לקנבס של p5
    const container = document.createElement("div");
    Object.assign(container.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    });
    this.appendChild(container);

    // טוענים קודם p5, אחר כך p5.sound, ואז את הסקיצה
    this.loadScript(
      "https://cdn.jsdelivr.net/npm/p5@1.11.0/lib/p5.min.js",
      () => {
        this.loadScript(
          "https://cdn.jsdelivr.net/npm/p5@1.11.0/lib/addons/p5.sound.min.js",
          () => {
            this.initSketch(container, micButton);
          }
        );
      }
    );
  }

  loadScript(src, onload) {
    const s = document.createElement("script");
    s.src = src;
    s.onload = onload;
    s.onerror = () => console.error("Failed to load script:", src);
    document.head.appendChild(s);
  }

  initSketch(container, micButton) {
    // כל הקוד של ה־p5 שלך ב־instance mode
    const urls = [
      "https://static.wixstatic.com/media/1f4e5a_988772c6983e46e7bfbdfb857d84d239~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_b8410f0d5e1449a6a4df41f5e85fbee3~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_4f45619bb8e04f98aef272fcfba3322f~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_b73092da01cc4b60a17ec9c7d90d9b13~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_0cb35dbc03384f70938d62ec99a209bc~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_41bf4607c2c1436fa3a70b9c973e4124~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_fc1bb07498f14095ac70a992509d406a~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_9666ab8800a14665bdce1c50fd79d761~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_fc624c99ce2f42c4a4d3db655ec0f8b7~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_011bf4c6637d4bd79c2319f35c90df90~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_58eb532cf1ef4a4cafef1f845a8b32a2~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_b874e3bab7b946088e593940598eeb17~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_04a504233e274220bf3cad29ac83157f~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_21226bfbc00e467f9aed73f5798fc469~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_fb82395f271246899bf888bc1fa94b04~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_e066089d8be940b68d428262eb57c8c2~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_724af105313340bdb611d74ab1df7af7~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_cb81220072dc4b40ab4057fa57561883~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_62a1c6c286f94148a3210233ac8dc0e8~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_b4e7e26db5254de9a82e65acddc8f2a8~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_5eb2665817114aa0ba9c6f1fd81af262~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_70774f9b45654b40bca159fa3a0626ff~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_2ce3f0385f4b4ababd990a79f13e1cb5~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_a8e4603646df4d40aebec15babc7671a~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_e2554897935e4649a44b3b7c3a7823e0~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_182658908a944c3a89d6acae8b7210ef~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_5b83ba4227204954be6c485eafba49ec~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_78e6fc18088e4902869d6da4e2f885b9~mv2.png",
      "https://static.wixstatic.com/media/1f4e5a_a4dcfcbb02534280990315049dc706b5~mv2.png"
    ];

    const baseWidth = 1920;
    const baseHeight = 1080;
    let spacing = -40;

    let ellipses = [];
    let imgs = [];
    let mic = null;
    let amplitude = null;
    let audioReady = false;
    let micLevel = 0;
    let smoothedLevel = 0;

    let stretchStrength = 7.0;
    let hoverBoost = 1.6;
    let hoverDecay = 0.05;

    new p5((p) => {

      p.preload = () => {
        urls.forEach((url) => {
          imgs.push(p.loadImage(url));
        });
      };

      p.setup = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = (w / baseWidth) * baseHeight;

        const finalH = Math.min(h, container.clientHeight || window.innerHeight);
        const finalW = (finalH / baseHeight) * baseWidth;

        const cnv = p.createCanvas(finalW, finalH);
        cnv.parent(container);

        p.imageMode(p.CENTER);
        p.noSmooth();
        p.pixelDensity(2);

        setupEllipses();

        // כפתור מפעיל מיקרופון
        micButton.addEventListener("click", () => {
          if (audioReady) return;
          p.userStartAudio().then(() => {
            mic = new p5.AudioIn();
            mic.start(() => {
              amplitude = new p5.Amplitude();
              amplitude.setInput(mic);
              amplitude.smooth(0.6);
              audioReady = true;
              console.log("Mic enabled (custom element)");
            });
          }).catch(err => {
            console.warn("Mic blocked:", err);
          });
        });
      };

      p.windowResized = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = (w / baseWidth) * baseHeight;
        const finalH = Math.min(h, container.clientHeight || window.innerHeight);
        const finalW = (finalH / baseHeight) * baseWidth;
        p.resizeCanvas(finalW, finalH);
        setupEllipses();
      };

      p.draw = () => {
        p.background(255);

        if (audioReady && mic) {
          micLevel = mic.getLevel();
        }

        let level = p.max(micLevel, amplitude ? amplitude.getLevel() : 0);
        let scaled = p.map(level, 0, 0.08, 0, 1, true);
        smoothedLevel = p.lerp(smoothedLevel, scaled, 0.12);

        ellipses.forEach((e) => e.update(smoothedLevel));
        ellipses.forEach((e) => e.display());
      };

      function setupEllipses() {
        ellipses = [];
        const w = p.width;
        const h = p.height;

        const scaleFactor = Math.min(w / baseWidth, h / baseHeight);
        const cellW = 100 * scaleFactor;
        const y = h / 2;

        const totalWidth = imgs.length * (cellW + spacing * scaleFactor);
        const startX = w / 2 - totalWidth / 2 + cellW / 2;

        for (let i = 0; i < imgs.length; i++) {
          const img = imgs[i];
          const imgW = img.width * scaleFactor;
          const imgH = img.height * scaleFactor;
          const x = startX + i * (cellW + spacing * scaleFactor);

          ellipses.push(
            new HoverEllipse(p, x, y, img, imgW, imgH)
          );
        }
      }

      class HoverEllipse {
        constructor(p, x, y, img, w, h) {
          this.p = p;
          this.x = x;
          this.y = y;
          this.img = img;
          this.w = w;
          this.h = h;
          this.scaleY = 1;

          this.hoverInfluence = 0;
          this.speed = p.random(0.005, 0.012);
          this.phase = p.random(0.2, 0.4);
        }

        update(level) {
          const p = this.p;

          const hovered =
            p.mouseX > this.x - this.w / 2 &&
            p.mouseX < this.x + this.w / 2 &&
            p.mouseY > this.y - this.h / 2 &&
            p.mouseY < this.y + this.h / 2;

          if (hovered) {
            this.hoverInfluence = p.lerp(this.hoverInfluence, 1, 0.2);
          } else {
            this.hoverInfluence = p.lerp(this.hoverInfluence, 0, hoverDecay);
          }

          const wave = p.sin(p.frameCount * this.speed + this.phase);
          const baseScale = 1 + wave * level * stretchStrength;
          const hoverEffect = p.map(this.hoverInfluence, 0, 1, 1, hoverBoost);

          this.scaleY = p.lerp(this.scaleY, baseScale * hoverEffect, 0.12);
        }

        display() {
          const p = this.p;
          p.push();
          p.translate(this.x, this.y);
          p.scale(1, this.scaleY);
          p.image(this.img, 0, 0, this.w, this.h);
          p.pop();
        }
      }
    });
  }
}

customElements.define("sound-waves", SoundWaves);
