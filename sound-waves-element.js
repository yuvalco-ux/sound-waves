class SoundWaves extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.canvas = document.createElement("div");
    this.shadowRoot.appendChild(this.canvas);

    this.micEnabled = false;

    // Load p5 normally into shadow DOM
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/p5@1.11.0/lib/p5.min.js";
    this.shadowRoot.appendChild(script);

    const script2 = document.createElement("script");
    script2.src = "https://cdn.jsdelivr.net/npm/p5@1.11.0/lib/addons/p5.sound.min.js";
    this.shadowRoot.appendChild(script2);

    script2.onload = () => {
      this.startP5();
    };
  }

  static get observedAttributes() {
    return ["start"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "start" && newValue === "true") {
      this.enableMic();
    }
  }

  enableMic() {
    if (!this.micEnabled && this.p5Instance) {
      this.p5Instance.enableMic();
      this.micEnabled = true;
    }
  }

  startP5() {
    const that = this;

    this.p5Instance = new p5((p) => {
      let imgs = [];
      let ellipses = [];

      const urls = [
        "https://static.wixstatic.com/media/1f4e5a_988772c6983e46e7bfbdfb857d84d239~mv2.png",
        "https://static.wixstatic.com/media/1f4e5a_b8410f0d5e1449a6a4df41f5e85fbee3~mv2.png",
        "https://static.wixstatic.com/media/1f4e5a_4f45619bb8e04f98aef272fcfba3322f~mv2.png",
        "https://static.wixstatic.com/media/1f4e5a_b73092da01cc4b60a17ec9c7d90d9b13~mv2.png",
        "https://static.wixstatic.com/media/1f4e5a_0cb35dbc03384f70938d62ec99a209bc~mv2.png",
        "https://static.wixstatic.com/media/1f4e5a_41bf4607c2c1436fa3a70b9c973e4124~mv2.png"
      ];

      let mic, amplitude;
      let audioReady = false;
      let smoothedLevel = 0;

      const baseWidth = 1920;
      const baseHeight = 1080;

      p.preload = () => {
        urls.forEach((u) => imgs.push(p.loadImage(u)));
      };

      p.setup = () => {
        let w = that.clientWidth;
        let h = (w / baseWidth) * baseHeight;

        let canvas = p.createCanvas(w, h);
        canvas.parent(that.canvas);

        p.imageMode(p.CENTER);
        p.noSmooth();
        setupEllipses();
      };

      p.enableMic = () => {
        userStartAudio().then(() => {
          mic = new p5.AudioIn();
          mic.start(() => {
            amplitude = new p5.Amplitude();
            amplitude.setInput(mic);
            amplitude.smooth(0.6);
            audioReady = true;
          });
        });
      };

      p.draw = () => {
        p.background(255);
        let micLevel = 0;

        if (audioReady && mic) {
          micLevel = mic.getLevel();
        }

        let scaled = p.map(micLevel, 0, 0.08, 0, 1, true);
        smoothedLevel = p.lerp(smoothedLevel, scaled, 0.12);

        ellipses.forEach((e) => e.update(smoothedLevel));
        ellipses.forEach((e) => e.display());
      };

      function setupEllipses() {
        ellipses = [];
        let scaleFactor = Math.min(p.width / baseWidth, p.height / baseHeight);

        let cellW = 100 * scaleFactor;
        let y = p.height / 2;
        let spacing = -40 * scaleFactor;

        let totalWidth = imgs.length * (cellW + spacing);
        let startX = p.width / 2 - totalWidth / 2 + cellW / 2;

        for (let i = 0; i < imgs.length; i++) {
          let img = imgs[i];
          let imgW = img.width * scaleFactor;
          let imgH = img.height * scaleFactor;
          let x = startX + i * (cellW + spacing);

          ellipses.push(new HoverEllipse(x, y, img, imgW, imgH));
        }
      }

      class HoverEllipse {
        constructor(x, y, img, w, h) {
          this.x = x;
          this.y = y;
          this.img = img;
          this.w = w;
          this.h = h;
          this.scaleY = 1;
          this.speed = p.random(0.005, 0.012);
          this.phase = p.random(0.2, 0.4);
          this.hoverInfluence = 0;
        }

        update(level) {
          let hovered =
            p.mouseX > this.x - this.w / 2 &&
            p.mouseX < this.x + this.w / 2 &&
            p.mouseY > this.y - this.h / 2 &&
            p.mouseY < this.y + this.h / 2;

          if (hovered) {
            this.hoverInfluence = p.lerp(this.hoverInfluence, 1, 0.2);
          } else {
            this.hoverInfluence = p.lerp(this.hoverInfluence, 0, 0.05);
          }

          let wave = p.sin(p.frameCount * this.speed + this.phase);
          let baseScale = 1 + wave * level * 7.0;
          let hoverEffect = p.map(this.hoverInfluence, 0, 1, 1, 1.6);

          this.scaleY = p.lerp(this.scaleY, baseScale * hoverEffect, 0.12);
        }

        display() {
          p.push();
          p.translate(this.x, this.y);
          p.scale(1, this.scaleY);
          p.image(this.img, 0, 0, this.w, this.h);
          p.pop();
        }
      }

      p.windowResized = () => {
        let w = that.clientWidth;
        let h = (w / baseWidth) * baseHeight;
        p.resizeCanvas(w, h);
      };
    });
  }
}

customElements.define("sound-waves", SoundWaves);

