(function () {
  const content = window.portfolioContent;

  if (!content) {
    console.error("[portfolio] Missing window.portfolioContent. Load portfolio-content.js before portfolio-runtime.js.");
    return;
  }

  if (!window.portfolioRenderers || !window.portfolioInteractions) {
    console.error("[portfolio] Missing runtime modules. Load portfolio-renderers.js and portfolio-interactions.js before portfolio-runtime.js.");
    return;
  }

  function buildIntroOverlay() {
    const columnCount = 13;
    const rowCount = 32;
    const centerColumn = Math.floor(columnCount / 2);
    const chineseWords = [
      "护肤视觉", "产品修图", "瓶身微距", "精华液", "水光肌", "黑金光影", "广告分镜", "电商主图",
      "肌理细节", "封面节奏", "视觉系统", "提示词库", "生成筛选", "前后对比", "交付规范", "品牌语气",
      "光影测试", "色彩校准", "质感强化", "成分可视化", "场景重构", "剪辑节奏", "画面定调", "肤感细节",
      "产品叙事", "美妆主图", "包装延展", "广告脚本", "镜头调度", "材质观察", "反光控制", "水珠质感",
      "膏体纹理", "乳霜质地", "高光层次", "暗部控制", "氛围参考", "版式节奏", "社媒封面", "详情长图",
      "视觉提案", "素材归档", "样片筛选", "批量延展", "局部精修", "人物肤色", "妆面氛围", "海报构图",
      "电商摄影", "光位判断", "道具搭配", "色彩情绪", "温润水感", "奢华克制", "面试作品", "流程复盘",
      "简历叙事", "岗位匹配", "创意策略", "审美判断", "脚本拆解", "画面统一", "投放封面", "内容资产"
    ];
    const englishWords = [
      "Photoshop", "Lightroom", "Premiere", "After Effects", "DaVinci", "Capture One", "Figma", "Midjourney",
      "Runway", "Firefly", "ComfyUI", "Stable Diffusion", "ChatGPT", "Sora", "Flux", "Krea",
      "Topaz", "Blender", "Cinema 4D", "KeyShot", "Canon", "Sony", "Nikon", "Fujifilm",
      "Leica", "Hasselblad", "Sigma", "Zeiss", "Profoto", "Aputure", "Godox", "Nanlite",
      "Skincare", "Serum", "Cream", "Essence", "Toner", "Lotion", "Mask", "Ampoule",
      "Packshot", "Retouch", "Texture", "Prompt", "Storyboard", "Key Visual", "Moodboard", "Color Grade",
      "Macro Lens", "Soft Light", "Rim Light", "Hero Shot", "Beauty Reel", "Product Film", "Social Cover", "Visual Flow",
      "Shot List", "Edit Rhythm", "Skin Tone", "Water Glow", "Gold Detail", "Glass Bottle", "Clean Layout", "Luxury Mood"
    ];
    const wallWords = Array.from({ length: columnCount * rowCount }, (_, index) => {
      const source = index % 2 === 0 ? chineseWords : englishWords;
      const sourceIndex = (Math.floor(index / 2) * 17 + index * 5) % source.length;
      return source[sourceIndex];
    });

    return `
      <div class="portfolio-intro" aria-hidden="true">
        <div class="portfolio-intro__wall">
          ${Array.from({ length: columnCount }, (_, columnIndex) => {
            const distance = Math.abs(columnIndex - centerColumn);
            const direction = distance % 2 === 0 ? "is-up" : "is-down";
            const strength = distance === 0 ? "is-center" : distance > 4 ? "is-far" : "";
            return `
              <div class="portfolio-intro__column ${direction} ${strength}" style="--column-delay: ${distance * 90}ms">
                ${Array.from({ length: rowCount }, (_, rowIndex) => {
                  const wordIndex = columnIndex * rowCount + rowIndex;
                  const isFocus = distance === 0 && rowIndex === Math.floor(rowCount / 2);
                  const word = isFocus ? "AI VISUAL" : wallWords[wordIndex];
                  const randomTone = Math.abs(Math.sin((columnIndex + 1) * 12.9898 + (rowIndex + 1) * 78.233));
                  const tone = isFocus
                    ? "is-strong is-focus"
                    : distance === 0
                      ? "is-strong"
                      : randomTone > 0.78
                        ? "is-bright"
                        : randomTone < 0.34
                          ? "is-dim"
                          : "";
                  return `<span class="${tone}">${word}</span>`;
                }).join("")}
              </div>
            `;
          }).join("")}
        </div>
        <div class="portfolio-intro__mattes">
          <span></span>
          <span></span>
        </div>
        <div class="portfolio-intro__frame">
          <span></span>
          <span></span>
        </div>
        <div class="portfolio-intro__black"></div>
        <div class="portfolio-intro__mark" aria-hidden="true"><span>AI VISUAL</span></div>
      </div>
    `;
  }

  function initIntroOverlay() {
    const intro = document.querySelector(".portfolio-intro");
    if (!intro) {
      window.dispatchEvent(new CustomEvent("portfolio:intro-complete"));
      return;
    }

    let introActive = true;
    const root = document.documentElement;
    const scrollKeys = new Set(["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "]);
    const lockClass = "is-intro-running";
    const completeClass = "is-intro-complete";

    const holdAtTop = (force = false) => {
      if (!force && !introActive) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    const blockScroll = (event) => {
      if (!introActive) return;
      event.preventDefault();
      holdAtTop();
    };

    const blockScrollKeys = (event) => {
      if (!introActive || !scrollKeys.has(event.key)) return;
      event.preventDefault();
      holdAtTop();
    };

    const scrollToInitialHash = () => {
      const initialHash = window.location.hash;
      if (!initialHash || initialHash === "#visual-files") {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }

      let targetId = initialHash.slice(1);
      try {
        targetId = decodeURIComponent(targetId);
      } catch (error) {
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) return;
      const top = Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY));
      window.scrollTo({ top, left: 0, behavior: "auto" });
    };

    const settleInitialHash = () => {
      if (!window.location.hash || window.location.hash === "#visual-files") return;

      // Immediate attempt in case layout is already stable
      window.requestAnimationFrame(scrollToInitialHash);

      if (!("ResizeObserver" in window)) {
        // Fallback for browsers without ResizeObserver
        window.setTimeout(scrollToInitialHash, 900);
        return;
      }

      // Debounced ResizeObserver: fires once after body height stops changing,
      // replacing the previous 5-call polling pattern. 120ms silence = stable layout.
      let debounceTimer = 0;
      const observer = new ResizeObserver(() => {
        window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(() => {
          observer.disconnect();
          scrollToInitialHash();
        }, 120);
      });
      observer.observe(document.body);

      // Safety: always disconnect and attempt within 1200ms
      window.setTimeout(() => {
        observer.disconnect();
        window.clearTimeout(debounceTimer);
        scrollToInitialHash();
      }, 1200);
    };

    root.classList.add(lockClass);
    document.body.classList.add(lockClass);
    holdAtTop();

    window.addEventListener("wheel", blockScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", blockScroll, { passive: false, capture: true });
    window.addEventListener("keydown", blockScrollKeys, { passive: false, capture: true });
    window.addEventListener("scroll", holdAtTop, { passive: true, capture: true });

    const releaseIntroLock = () => {
      window.removeEventListener("wheel", blockScroll, { capture: true });
      window.removeEventListener("touchmove", blockScroll, { capture: true });
      window.removeEventListener("keydown", blockScrollKeys, { capture: true });
      window.removeEventListener("scroll", holdAtTop, { capture: true });
      root.classList.remove(lockClass);
      document.body.classList.remove(lockClass);
      root.classList.add(completeClass);
      document.body.classList.add(completeClass);
    };

    const hideIntro = () => {
      if (!introActive) return;
      holdAtTop(true);
      introActive = false;
      intro.classList.add("is-hidden");
      releaseIntroLock();
      window.requestAnimationFrame(() => {
        scrollToInitialHash();
        window.dispatchEvent(new CustomEvent("portfolio:intro-complete"));
        settleInitialHash();
      });
    };
    intro.addEventListener("animationend", (event) => {
      if (event.animationName === "portfolioIntroExit") hideIntro();
    });
    // Fallback: read timing from CSS variables (--intro-exit-delay, --intro-exit-duration, --intro-exit-buffer)
    // so this stays in sync with the animation automatically. animationend normally fires first; the timeout is a no-op.
    const introStyle = getComputedStyle(root);
    const parseCssMs = (val, fallback) => { const n = parseFloat(val); return isNaN(n) ? fallback : n; };
    const introTimeout =
      parseCssMs(introStyle.getPropertyValue("--intro-exit-delay"),    7820) +
      parseCssMs(introStyle.getPropertyValue("--intro-exit-duration"), 760)  +
      parseCssMs(introStyle.getPropertyValue("--intro-exit-buffer"),   140);
    window.setTimeout(hideIntro, introTimeout);
  }

  function scheduleDeferredGalaxyHomeLoad() {
    const scriptSrc = "portfolio-galaxy-home.js?v=20260701-load-priority-t312";
    let requested = false;

    const loadGalaxyHome = () => {
      if (requested || window.PortfolioGalaxyHome) return;
      requested = true;
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.dataset.deferredGalaxyHome = "";
      if ("fetchPriority" in script) script.fetchPriority = "low";
      document.body.appendChild(script);
    };

    const requestWhenIdle = () => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(loadGalaxyHome, { timeout: 1800 });
        return;
      }
      window.setTimeout(loadGalaxyHome, 600);
    };

    window.setTimeout(requestWhenIdle, 900);
    window.addEventListener("portfolio:intro-complete", requestWhenIdle, { once: true });
    window.addEventListener("load", () => {
      window.setTimeout(() => {
        if (document.documentElement.classList.contains("is-intro-complete")) requestWhenIdle();
      }, 9600);
    }, { once: true });
  }

  // Bootstrap
  function boot() {
    const renderers = window.portfolioRenderers.create(content);
    const interactions = window.portfolioInteractions.create(content);

    document.body.insertAdjacentHTML("afterbegin", renderers.buildPortfolioPage(buildIntroOverlay()));
    document.body.classList.add("portfolio-shell-ready");
    interactions.createQuickNav();
    scheduleDeferredGalaxyHomeLoad();
    initIntroOverlay();
    interactions.initAll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
