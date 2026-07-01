(function () {
  function createPortfolioRenderers(content) {
    if (!content) {
      throw new Error("[portfolio] Missing content for renderers.");
    }

  const sections = content.navigation;
  const beautyAssets = content.assets.beauty;
  const heroAssets = content.assets.hero;
  const videoAssets = content.assets.video;
  const pageCopy = content.sections;
  const sectionHeadings = pageCopy.headings;
  const accessibilityCopy = content.accessibility;
  const otherWorksCopy = content.otherWorks;
  const otherWorksGallery = otherWorksCopy.gallery;
  const otherWorksCampaignWall = otherWorksCopy.campaignWall;
  const designToneOptions = content.galleries.designToneOptions;
  const wheelCards = content.galleries.wheelCards;
  const quietItems = content.galleries.quietItems;
  const productComparisons = content.galleries.productComparisons;
  const photoGalleries = content.galleries.photoGalleries;
  const videoPromptPreview = content.galleries.videoPromptPreview;

  // Asset helpers
  const img = (name) => `images/${name}`;

  const imageDimensions = new Map([
    [heroAssets.home, { width: 1672, height: 941 }],
  ]);

  function imageAttrs(src, alt, options = {}) {
    const {
      className = "",
      loading = "lazy",
      decoding = "async",
      fetchPriority = "",
      hidden = false,
      data = "",
    } = options;
    const dimensions = imageDimensions.get(src);
    return [
      className ? `class="${className}"` : "",
      data,
      `src="${img(src)}"`,
      `alt="${escapeAttr(alt)}"`,
      hidden ? `aria-hidden="true"` : "",
      loading ? `loading="${loading}"` : "",
      decoding ? `decoding="${decoding}"` : "",
      fetchPriority ? `fetchpriority="${fetchPriority}"` : "",
      dimensions ? `width="${dimensions.width}" height="${dimensions.height}"` : "",
    ].filter(Boolean).join(" ");
  }

  function card(title, text, meta, icon = "") {
    return `
      <article class="portfolio-card reveal">
        <p class="portfolio-card__meta">${meta}</p>
        ${icon ? `<span class="portfolio-card__icon" data-icon="${icon}" aria-hidden="true"></span>` : ""}
        <h3>${title}</h3>
        <p>${text}</p>
      </article>
    `;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;",
    })[char]);
  }

  const escapeAttr = escapeHtml;

  function titleBlock(copy, tagName = "h2", options = {}) {
    const titleText = Array.isArray(copy.title) ? copy.title.join("") : String(copy.title || "");
    const titleFitCount = Math.max(4, Array.from(titleText.replace(/\s+/g, "")).length);
    const titleMarkup = Array.isArray(copy.title)
      ? copy.title.map((line) => `<span>${escapeHtml(line)}</span>`).join("")
      : escapeHtml(copy.title);
    const lineClass = options.main ? "portfolio-titleline portfolio-titleline--main" : "portfolio-titleline";
    const kickerMarkup = options.main ? "" : `<p class="portfolio-kicker">${escapeHtml(copy.kicker)}</p>`;
    const lineMarkup = `<p class="${lineClass}">${escapeHtml(copy.line)}</p>`;
    const titleMarkupLine = `<${tagName} class="portfolio-main-title" style="--title-fit-count:${titleFitCount}">${titleMarkup}</${tagName}>`;
    if (options.main) {
      return `
              ${lineMarkup}
              ${titleMarkupLine}
      `;
    }
    return `
              ${kickerMarkup}
              ${titleMarkupLine}
              ${lineMarkup}
    `;
  }

  function bulletList(items) {
    return `
              <ul class="portfolio-list">
                ${items.map((item) => `<li>${item}</li>`).join("")}
              </ul>
    `;
  }

  function imageCard(src, title, text, modifier = "") {
    return `
      <article class="portfolio-image-card ${modifier} reveal">
        <img src="${img(src)}" alt="${title}" loading="lazy" />
        <div>
          <h3>${title}</h3>
          <p>${text}</p>
        </div>
      </article>
    `;
  }

  function timelineFrame(src, time, title, text) {
    return `
      <article class="portfolio-timeline-card reveal">
        <img src="${img(src)}" alt="${title}" loading="lazy" />
        <div>
          <span>${time}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </div>
      </article>
    `;
  }

  function productComparisonCard(item) {
    const baseImage = item.baseImage || beautyAssets.products;
    const sceneImage = item.sceneImage || beautyAssets.scenes;
    return `
      <article class="portfolio-product-card reveal" tabindex="0" style="--split: 50%;">
        <div
          class="portfolio-product-card__media"
          style="--base-image: url('${img(baseImage)}'); --scene-image: url('${img(sceneImage)}'); --crop: ${item.crop};"
        >
          <span class="portfolio-product-card__base" aria-hidden="true"></span>
          <span class="portfolio-product-card__scene" aria-hidden="true"></span>
          <span class="portfolio-product-card__divider" aria-hidden="true"></span>
          <input class="portfolio-product-card__slider" type="range" min="0" max="100" value="50" aria-label="${accessibilityCopy.compareSlider(item.title)}" data-compare-slider>
        </div>
        <div class="portfolio-product-card__label">
          <span>${item.title}</span>
          <em>${item.meta}</em>
        </div>
        <p>${item.note}</p>
      </article>
    `;
  }

  function productFusionHoverCard(item) {
    const rawImage = item.rawImage || item.baseImage || beautyAssets.products;
    const sceneImage = item.sceneImage || beautyAssets.scenes;
    return `
      <article class="portfolio-product-card portfolio-product-card--hover-fusion reveal" tabindex="0" style="--fusion-x: 50%;">
        <div
          class="portfolio-product-card__media"
          style="--base-image: url('${img(rawImage)}'); --scene-image: url('${img(sceneImage)}'); --crop: ${item.crop};"
          data-fusion-scrub
        >
          <span class="portfolio-product-card__base" aria-hidden="true"></span>
          <span class="portfolio-product-card__scene" aria-hidden="true"></span>
          <span class="portfolio-product-card__scrub" aria-hidden="true"></span>
          <span class="portfolio-product-card__stage portfolio-product-card__stage--raw" aria-hidden="true">RAW</span>
          <span class="portfolio-product-card__stage portfolio-product-card__stage--scene" aria-hidden="true">SCENE</span>
        </div>
        <div class="portfolio-product-card__label">
          <span>${item.title}</span>
          <em>${item.meta}</em>
        </div>
        <p>${item.note}</p>
      </article>
    `;
  }

  function storyboardClipCard(item, index) {
    const clip = item.clip ? img(item.clip) : "";
    const stateLabel = clip ? "Hover Preview" : "Key Frame";
    return `
      <figure class="portfolio-storyboard-card ${clip ? "has-video" : "is-poster-only"}" data-storyboard-card>
        <div class="portfolio-storyboard-card__media">
          <img src="${img(item.poster)}" alt="${accessibilityCopy.storyboardImage(index)}" loading="lazy" />
          ${clip ? `
            <video data-storyboard-video muted loop playsinline preload="metadata" poster="${img(item.poster)}" aria-label="${accessibilityCopy.storyboardPreview(index)}">
              <source src="${clip}" type="${clip.endsWith(".mp4") ? "video/mp4" : "video/webm"}" />
            </video>
          ` : ""}
          <span class="portfolio-storyboard-card__state">${stateLabel}</span>
        </div>
        <figcaption>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <em>${escapeHtml(item.text)}</em>
        </figcaption>
      </figure>
    `;
  }

  function swatch(name, color, active = false) {
    return `
      <span class="portfolio-swatch ${active ? "is-active" : ""}">
        <i style="background:${color}"></i>
        <em>${name}</em>
      </span>
    `;
  }

  function portfolioSpecItem(title, text, active = false) {
    return `
      <article class="portfolio-spec-item ${active ? "is-active" : ""} reveal">
        <h3>${title}</h3>
        <p>${text}</p>
      </article>
    `;
  }

  function portfolioGallerySlide(src, index, title, text) {
    return `
      <article class="portfolio-reference-slide reveal">
        <img src="${img(src)}" alt="${title}" loading="lazy" />
        <div>
          <span>${String(index).padStart(2, "0")}</span>
          <h3>${title}</h3>
          <p>${text}</p>
        </div>
      </article>
    `;
  }

  function originalImage(name) {
    return img(name);
  }

  function originalImageAttrs(src, alt, options = {}) {
    return imageAttrs(src, alt, options);
  }

  // Content-derived carousel helpers
  const loopedWheelCards = [
    { ...wheelCards[wheelCards.length - 2], loopType: "clone", realIndex: wheelCards.length - 2 },
    { ...wheelCards[wheelCards.length - 1], loopType: "clone", realIndex: wheelCards.length - 1 },
    ...wheelCards.map((item, index) => ({ ...item, loopType: "real", realIndex: index })),
    { ...wheelCards[0], loopType: "clone", realIndex: 0 },
    { ...wheelCards[1], loopType: "clone", realIndex: 1 },
    { ...wheelCards[2], loopType: "clone", realIndex: 2 },
  ];

  // Chapter renderers
  function buildAigcDesignIntro() {
    return `
        <section id="aigc-design" class="portfolio-chapter portfolio-chapter--light portfolio-chapter--photo" data-chapter="02">
          <div class="portfolio-panel xiaomi-accordion-stage portfolio-chapter__screen portfolio-chapter__screen--first" data-xiaomi-accordion>
            <div class="xiaomi-accordion-stage__heading xiaomi-carousel__intro reveal" data-reversible-title>
              ${titleBlock(sectionHeadings.aigcDesign, "h2", { main: true })}
            </div>
            <div class="xiaomi-accordion-stage__image reveal">
              ${quietItems.map((item, index) => `<img class="${index === 0 ? "is-active" : ""}" data-accordion-image src="${originalImage(item.image)}" alt="${item.title}" loading="lazy" />`).join("")}
            </div>
            <div class="xiaomi-accordion-stage__copy reveal">
              <div class="xiaomi-accordion">
                ${quietItems.map((item, index) => `
                  <button class="xiaomi-accordion__item ${index === 0 ? "is-active" : ""}" type="button" data-accordion-item data-index="${index}">
                    <span>${item.title}</span>
                    <em>${item.text}</em>
                  </button>
                `).join("")}
              </div>
            </div>
          </div>
        </section>
    `;
  }

  function buildTransplantedDesign() {
    return `
        <section id="visual-tone" class="portfolio-chapter portfolio-chapter--light portfolio-chapter--design">
          <div class="portfolio-panel xiaomi-color-stage portfolio-chapter__screen portfolio-chapter__screen--first" data-xiaomi-color-stage>
            <img class="xiaomi-color-stage__image is-active" data-color-image src="${originalImage(designToneOptions[0].main)}" alt="${designToneOptions[0].title}" loading="lazy" />
            <img class="xiaomi-color-stage__image xiaomi-color-stage__image--next" data-color-image-next src="${originalImage(designToneOptions[0].main)}" alt="" aria-hidden="true" loading="lazy" />
            <div class="xiaomi-color-stage__title reveal" data-reversible-title>
              ${titleBlock(sectionHeadings.visualTone, "h2", { main: true })}
              <div class="xiaomi-color-stage__picker" id="visual-tone-active" role="tabpanel" aria-live="polite" aria-labelledby="visual-tone-tab-0">
                <h3 data-color-title>${escapeHtml(designToneOptions[0].title)}</h3>
                <p data-color-desc>${escapeHtml(designToneOptions[0].desc)}</p>
              </div>
              <div class="xiaomi-color-stage__swatches" role="tablist" aria-label="${escapeHtml(accessibilityCopy.colorTabs)}">
                ${designToneOptions.map((item, index) => `
                  <button id="visual-tone-tab-${index}" class="${index === 0 ? "is-active" : ""}" type="button" role="tab" data-color-option data-index="${index}" aria-selected="${index === 0 ? "true" : "false"}" tabindex="${index === 0 ? "0" : "-1"}" aria-controls="visual-tone-active" aria-label="${escapeAttr(item.title)}">
                    <img src="${originalImage(item.swatch)}" alt="" loading="lazy" />
                  </button>
                `).join("")}
              </div>
            </div>
          </div>
          <div id="visual-system" class="portfolio-panel xiaomi-hover-carousel portfolio-chapter__screen portfolio-chapter__screen--continue" data-xiaomi-carousel>
            <div class="xiaomi-carousel__intro reveal">
              ${titleBlock(sectionHeadings.visualSystem, "h2", { main: true })}
            </div>
            <div class="xiaomi-carousel__viewport">
              <div class="xiaomi-carousel__track" data-carousel-track>
                ${loopedWheelCards.map((item) => `
                  <article class="xiaomi-hover-card" data-slide="${item.loopType}" data-real-index="${item.realIndex}">
                    <div class="xiaomi-hover-card__media">
                      <img src="${originalImage(item.image)}" alt="${item.title}" loading="lazy" />
                      <div class="xiaomi-hover-card__caption">
                        <h3>${item.title}</h3>
                        <p>${item.text}</p>
                      </div>
                    </div>
                  </article>
                `).join("")}
              </div>
            </div>
            <div class="xiaomi-carousel__controls">
              <div class="xiaomi-carousel__progress" data-carousel-progress>
                ${wheelCards.map((_, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button" data-go="${index}" aria-label="${accessibilityCopy.carouselGoto(index)}"><span></span></button>`).join("")}
              </div>
            </div>
          </div>
        </section>
    `;
  }

  function buildPhotoGallery(panel, galleryIndex) {
    const bigImages = Array.isArray(panel.big) ? panel.big : [];
    const detailImages = panel.detailFromBig
      ? bigImages
      : (Array.isArray(panel.small) && panel.small.length ? panel.small : bigImages);
    const itemCount = Math.max(bigImages.length, detailImages.length);

    return `
          <div id="${panel.id}" class="portfolio-panel xiaomi-dual-gallery ${panel.reverse ? "is-reverse" : ""} portfolio-chapter__screen ${galleryIndex === 0 ? "portfolio-chapter__screen--first" : "portfolio-chapter__screen--continue"}" data-xiaomi-dual-gallery>
            <div class="xiaomi-dual-gallery__wrap">
              <div class="xiaomi-dual-gallery__big">
                ${bigImages.map((src, index) => `<img class="${index === 0 ? "is-active" : ""}" data-gallery-big src="${originalImage(src)}" alt="" loading="lazy" />`).join("")}
              </div>
              <div class="xiaomi-dual-gallery__side">
                <div class="xiaomi-dual-gallery__small">
                  ${detailImages.map((src, index) => {
                    const crop = Array.isArray(panel.detailCrops) ? panel.detailCrops[index] : "";
                    const style = crop ? ` style="--gallery-detail-position:${escapeAttr(crop)}"` : "";
                    return `<img class="${index === 0 ? "is-active" : ""}" data-gallery-small src="${originalImage(src)}" alt="" loading="lazy"${style} />`;
                  }).join("")}
                </div>
                <div class="xiaomi-dual-gallery__copy reveal">
                  <p class="portfolio-kicker">${panel.kicker}</p>
                  <h2 class="portfolio-main-title" style="--title-fit-count:${Math.max(4, Array.from(String(panel.title).replace(/\s+/g, "")).length)}">${panel.title}</h2>
                  <p class="portfolio-titleline">${panel.line}</p>
                </div>
                <div class="xiaomi-carousel__controls">
                  <div class="xiaomi-carousel__progress" data-gallery-progress>
                    ${Array.from({ length: itemCount }, (_, index) => `<button class="${index === 0 ? "is-active" : ""}" type="button" data-go="${index}" aria-label="${accessibilityCopy.carouselGoto(index)}"><span></span></button>`).join("")}
                  </div>
                  <div class="xiaomi-carousel__arrows">
                    <button type="button" data-prev aria-label="${accessibilityCopy.previousItem}">‹</button>
                    <button type="button" data-next aria-label="${accessibilityCopy.nextItem}">›</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
    `;
  }

  function buildTransplantedPhoto() {
    return `
        <section id="photo-scenes" class="portfolio-chapter portfolio-chapter--light portfolio-chapter--photo">
          ${photoGalleries.map(buildPhotoGallery).join("")}
        </section>
    `;
  }

  function buildCommercialPhotoIntro() {
    return `
        <section id="reality-imagination" class="portfolio-chapter portfolio-ai portfolio-chapter--dark portfolio-chapter--ai">
          <div class="portfolio-panel portfolio-ai-grid-panel portfolio-chapter__screen portfolio-chapter__screen--first">
            <div class="portfolio-section__intro reveal">
              ${titleBlock(sectionHeadings.commercialPhoto, "h2", { main: true })}
            </div>
            <div class="portfolio-product-grid">
              ${productComparisons.map(productFusionHoverCard).join("")}
            </div>
          </div>
        </section>
    `;
  }

  function buildRealityFusion() {
    const fusionClipId = "portfolio-fusion-clip";
    return `
        <section id="commercial-photo" class="portfolio-chapter portfolio-chapter--dark portfolio-reality-fusion" data-chapter="04">
          <div class="portfolio-panel portfolio-reality-fusion__panel portfolio-chapter__screen portfolio-chapter__screen--continue">
            <div class="portfolio-section__intro reveal">
              ${titleBlock(sectionHeadings.realityFusion, "h2", { main: true })}
            </div>
            <div class="portfolio-fusion-device reveal" aria-label="${accessibilityCopy.fusionDevice}">
              <span class="portfolio-fusion-float-shadow" aria-hidden="true"></span>
              <div class="portfolio-fusion-disc">
                <svg class="portfolio-fusion-symbol" viewBox="0 0 100 100" role="img" aria-label="${accessibilityCopy.fusionDevice}">
                  <defs>
                    <clipPath id="${fusionClipId}">
                      <path class="portfolio-fusion-mask-rotor" d="M50 0a50 50 0 1 1 0 100a25 25 0 1 0 0-50a25 25 0 1 1 0-50Z"></path>
                    </clipPath>
                  </defs>
                  <circle class="portfolio-fusion-svg-source-field" cx="50" cy="50" r="50"></circle>
                  <image class="portfolio-fusion-svg-image portfolio-fusion-svg-image--source" href="${img(beautyAssets.sourcePackshot)}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice"></image>
                  <image class="portfolio-fusion-svg-image portfolio-fusion-svg-image--vision" href="${img(beautyAssets.commercialScene)}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clip-path="url(#${fusionClipId})"></image>
                </svg>
                <span class="portfolio-fusion-ring" aria-hidden="true"></span>
              </div>
            </div>
          </div>
        </section>
    `;
  }

  function buildAboutProfile() {
    return `
        <section id="about-me" class="portfolio-chapter portfolio-about-profile portfolio-chapter--dark" data-chapter="08" aria-label="关于我">
          <div class="portfolio-panel portfolio-about-profile__panel portfolio-chapter__screen portfolio-chapter__screen--first">
            <div class="portfolio-about-profile__page">
              <header class="portfolio-about-profile__hero">
                <h2 class="portfolio-about-profile__name reveal">高晓霖</h2>
                <p class="portfolio-about-profile__tagline reveal reveal-d2">AI 负责生成，我负责判断。</p>
              </header>

              <div class="portfolio-about-profile__divider reveal reveal-d2"></div>

              <div class="portfolio-about-profile__grid">
                <section class="portfolio-about-profile__column portfolio-about-profile__column--left" aria-label="定位">
                  <p class="portfolio-about-profile__label reveal">01 — 定位</p>
                  <h3 class="portfolio-about-profile__role reveal reveal-d1">AIGC视觉<br>全链路创作者</h3>
                  <p class="portfolio-about-profile__minor reveal reveal-d2">设计理念</p>
                  <p class="portfolio-about-profile__philosophy reveal reveal-d2">
                    视觉是品牌说话的方式。<strong>这份工作的终点不是图像文件，是品牌在用户心里留下的那个印象。</strong>
                  </p>
                </section>

                <section class="portfolio-about-profile__column portfolio-about-profile__column--center" aria-label="核心能力">
                  <p class="portfolio-about-profile__label reveal reveal-d1">02 — 核心能力</p>

                  <article class="portfolio-about-profile__cap reveal reveal-d1">
                    <span>01</span>
                    <h3>平面与品牌设计</h3>
                    <p class="portfolio-about-profile__tools">Photoshop / Lightroom / Illustrator / CorelDRAW</p>
                  </article>

                  <article class="portfolio-about-profile__cap reveal reveal-d2">
                    <span>02</span>
                    <h3>三维视觉辅助</h3>
                    <p class="portfolio-about-profile__tools">Cinema 4D / SketchUp / 3DMAX</p>
                  </article>

                  <article class="portfolio-about-profile__cap reveal reveal-d2">
                    <span>03</span>
                    <h3>动态与视频制作</h3>
                    <p class="portfolio-about-profile__tools">Premiere Pro / After Effects / DaVinci Resolve / CapCut</p>
                  </article>

                  <article class="portfolio-about-profile__cap reveal reveal-d3">
                    <span>04</span>
                    <h3>AIGC 内容生成</h3>
                    <p class="portfolio-about-profile__tools">ComfyUI / Midjourney / Runway / Jimeng / Kling</p>
                  </article>

                  <article class="portfolio-about-profile__cap reveal reveal-d3">
                    <span>05</span>
                    <h3>轻量化工具开发</h3>
                    <p class="portfolio-about-profile__tools">Codex / Claude Code / WorkBuddy / Zcode</p>
                  </article>
                </section>

                <section class="portfolio-about-profile__column portfolio-about-profile__column--right" aria-label="范围">
                  <p class="portfolio-about-profile__label reveal reveal-d2">03 — 范围</p>

                  <ul class="portfolio-about-profile__scope">
                    <li class="reveal reveal-d2">图像</li>
                    <li class="reveal reveal-d2">分镜</li>
                    <li class="reveal reveal-d3">视频</li>
                    <li class="reveal reveal-d3">工具</li>
                  </ul>

                  <div class="portfolio-about-profile__meta reveal reveal-d3">
                    <p>工作经验</p>
                    <strong>7 年 · 设计 / 摄影 / 剪辑</strong>
                  </div>

                  <div class="portfolio-about-profile__meta reveal reveal-d3">
                    <p>城市</p>
                    <strong>深圳 / 广州</strong>
                  </div>
                </section>
              </div>

              <div class="portfolio-about-profile__divider reveal"></div>

              <footer class="portfolio-about-profile__footer">
                <p class="reveal">© 2026 高晓霖 — AIGC视觉全链路创作</p>
                <p class="reveal reveal-d1">Gao.Design.AIGC@gmail.com</p>
              </footer>
            </div>
          </div>
        </section>
    `;
  }

  function brandFilmHeroMedia() {
    const videoSource = videoAssets.brandFilmVideo ? img(videoAssets.brandFilmVideo) : "";
    const videoPoster = videoAssets.brandFilmPoster ? img(videoAssets.brandFilmPoster) : "";
    const videoType = videoSource.endsWith(".webm") ? "video/webm" : "video/mp4";
    return `
      <video
        class="portfolio-video-stage__film-video"
        data-brand-film-video
        ${videoSource ? `data-src="${videoSource}"` : ""}
        ${videoPoster ? `poster="${videoPoster}"` : ""}
        playsinline
        preload="metadata"
        aria-label="点击播放横版品牌广告片"
      >
        ${videoSource ? `<source data-video-source src="${videoSource}" type="${videoType}" />` : ""}
      </video>
    `;
  }

  function buildPortfolioThanks() {
    return `
        <section id="about-thanks" class="portfolio-panel portfolio-other-works__thanks portfolio-about-thanks portfolio-chapter portfolio-chapter--dark" data-about-scene aria-label="致谢">
          <div class="portfolio-other-works__thanks-copy">
            <p class="portfolio-titleline portfolio-titleline--main">${escapeHtml(otherWorksCopy.headings.thanks.line)}</p>
            <h3 class="portfolio-main-title">${escapeHtml(otherWorksCopy.headings.thanks.title)}</h3>
          </div>
          <div class="portfolio-other-works__thanks-signature" aria-label="作品署名">
            <span>${escapeHtml(otherWorksCopy.headings.thanks.signature)}</span>
          </div>
        </section>
    `;
  }

  function exhibitNumber(item, index = 0) {
    const match = String(item.id || "").match(/(\d+)$/);
    return match ? match[1].padStart(2, "0") : String(index + 1).padStart(2, "0");
  }

  function exhibitFormat(item) {
    const formats = {
      cinema: "宽幕画面",
      desktop: "横向画面",
      landscape: "横向画面",
      poster: "竖幅画面",
      portrait45: "竖幅画面",
      vertical916: "竖屏画面",
      square: "方形画面",
    };

    return formats[item.ratio] || item.type || "展陈画面";
  }

  function exhibitMeta(item, index = 0, prefix = "EXHIBIT") {
    return `${prefix} ${exhibitNumber(item, index)} · ${exhibitFormat(item)}`;
  }

  function otherWorkMedia(item, index) {
    if (item.image) {
      return `
        <img
          src="${originalImage(item.image)}"
          alt="${accessibilityCopy.otherWorkImage(item)}"
          loading="${index <= 12 ? "eager" : "lazy"}"
          decoding="async"
        />
      `;
    }

    return `
      <div class="portfolio-other-work__placeholder" aria-hidden="true">
      </div>
    `;
  }

  function campaignWallMedia(item, index) {
    if (item.image) {
      return `
        <img
          src="${originalImage(item.image)}"
          alt="${accessibilityCopy.campaignWallImage(item)}"
          loading="${index < 3 ? "eager" : "lazy"}"
          decoding="async"
        />
      `;
    }

    return `
      <div class="portfolio-other-works__ai-placeholder" aria-hidden="true">
      </div>
    `;
  }

  function buildOtherWorksGallery() {
    const { heroCinema, posterStage, desktopTable, cinemaStrips } = otherWorksGallery;
    const firstPoster = posterStage[0];

    return `
        <section id="other-works" class="portfolio-other-works portfolio-chapter portfolio-chapter--dark" data-chapter="07">
          <div id="other-works-hero" class="portfolio-panel portfolio-other-works__hero portfolio-chapter__screen portfolio-chapter__screen--first" data-other-scene>
            <div class="portfolio-other-works__hero-copy">
              ${titleBlock(otherWorksCopy.headings.hero, "h2", { main: true })}
            </div>
            <figure class="portfolio-other-works__hero-frame ${heroCinema.image ? "" : "is-placeholder"}" data-ratio="${heroCinema.ratio}">
              ${otherWorkMedia(heroCinema, 0)}
            </figure>
            <div class="portfolio-other-works__hero-label">
              <strong>${heroCinema.title}</strong>
            </div>
          </div>

          <div id="other-works-posters" class="portfolio-panel portfolio-other-works__poster-stage" data-poster-stage data-other-scene>
            <div class="portfolio-other-works__scene-copy">
              ${titleBlock(otherWorksCopy.headings.poster, "h3", { main: true })}
            </div>
            <div class="portfolio-other-works__poster-viewport" tabindex="0" aria-label="${accessibilityCopy.posterViewport}">
              <div class="portfolio-other-works__poster-rail">
                ${posterStage.map((item, index) => `
                  <figure
                    class="portfolio-other-works__poster-card ${item.image ? "" : "is-placeholder"} ${index === 0 ? "is-active" : ""}"
                    data-poster-card
                    data-poster-index="${index}"
                    data-title="${escapeAttr(item.title)}"
                    data-meta="${escapeAttr(exhibitMeta(item, index))}"
                    data-note="${escapeAttr(item.note)}"
                    style="--poster-index: ${index};"
                  >
                    ${otherWorkMedia(item, index + 1)}
                  </figure>
                `).join("")}
              </div>
              <button class="portfolio-other-works__poster-control portfolio-other-works__poster-control--prev" type="button" data-poster-control="prev" aria-label="${accessibilityCopy.previousPoster}">
              </button>
              <button class="portfolio-other-works__poster-control portfolio-other-works__poster-control--next" type="button" data-poster-control="next" aria-label="${accessibilityCopy.nextPoster}">
              </button>
              <div class="portfolio-other-works__pedestal" aria-live="polite">
                <strong data-poster-title>${escapeHtml(firstPoster.title)}</strong>
                ${firstPoster.note ? `<p data-poster-note>${escapeHtml(firstPoster.note)}</p>` : ""}
              </div>
            </div>
          </div>

          <div id="other-works-light-table" class="portfolio-panel portfolio-other-works__light-table" data-other-scene>
            <div class="portfolio-other-works__scene-copy">
              ${titleBlock(otherWorksCopy.headings.light, "h3", { main: true })}
            </div>
            <div class="portfolio-other-works__light-controls" data-light-controls aria-label="${accessibilityCopy.lightSpeedControls}">
              <button type="button" data-light-speed="slower" aria-label="${accessibilityCopy.slowerLightSpeed}">
                <span aria-hidden="true">-</span>
                <b>减速</b>
              </button>
              <button type="button" data-light-toggle aria-label="${accessibilityCopy.pauseLightCarousel}" aria-pressed="false">
                <span data-light-toggle-icon aria-hidden="true">Ⅱ</span>
                <b data-light-toggle-label>暂停</b>
              </button>
              <button type="button" data-light-speed="faster" aria-label="${accessibilityCopy.fasterLightSpeed}">
                <span aria-hidden="true">+</span>
                <b>加速</b>
              </button>
              <output data-light-speed-label aria-live="polite">1.0x</output>
            </div>
            <div class="portfolio-other-works__light-viewport" data-light-carousel aria-label="${accessibilityCopy.lightCarousel}">
              <div class="portfolio-other-works__light-deck" data-light-deck>
                <div class="portfolio-other-works__light-set" data-light-set>
                  ${desktopTable.map((item, index) => `
                    <article class="portfolio-other-works__light-card" data-light-card data-light-index="${index}" style="--item-index: ${index};">
                      <figure class="portfolio-other-works__light-media ${item.image ? "" : "is-placeholder"}" data-ratio="${item.ratio}">
                        ${otherWorkMedia(item, index + 13)}
                      </figure>
                      <div>
                        <strong>${item.title}</strong>
                      </div>
                    </article>
                  `).join("")}
                </div>
                <div class="portfolio-other-works__light-set portfolio-other-works__light-set--clone" data-light-clone aria-hidden="true">
                  ${desktopTable.map((item, index) => `
                    <article class="portfolio-other-works__light-card" style="--item-index: ${index + desktopTable.length};">
                      <figure class="portfolio-other-works__light-media ${item.image ? "" : "is-placeholder"}" data-ratio="${item.ratio}">
                        ${otherWorkMedia(item, index + 13)}
                      </figure>
                      <div>
                        <strong>${item.title}</strong>
                      </div>
                    </article>
                  `).join("")}
                </div>
              </div>
            </div>
          </div>

          <div id="other-works-cinema" class="portfolio-panel portfolio-other-works__cinema-strips" data-other-scene>
            <div class="portfolio-other-works__scene-copy">
              ${titleBlock(otherWorksCopy.headings.cinema, "h3", { main: true })}
            </div>
            <div class="portfolio-other-works__strip-stack">
              ${cinemaStrips.map((item, index) => `
                <article
                  class="portfolio-other-works__strip portfolio-other-works__strip--${index % 2 === 0 ? "left" : "right"}"
                  data-other-scroll-item
                  data-cinema-strip
                  data-strip-direction="${index % 2 === 0 ? 1 : -1}"
                  style="--item-index: ${index};"
                >
                  <figure class="portfolio-other-works__strip-media ${item.image ? "" : "is-placeholder"}" data-ratio="${item.ratio}">
                    ${otherWorkMedia(item, index + 17)}
                  </figure>
                  <div>
                    <strong>${item.title}</strong>
                  </div>
                </article>
              `).join("")}
            </div>
          </div>

          <div id="other-works-wall" class="portfolio-panel portfolio-other-works__ai-wall" data-other-scene>
            <div class="portfolio-other-works__finale-copy">
              ${titleBlock(otherWorksCopy.headings.aiWall, "h3", { main: true })}
            </div>
            <div class="portfolio-other-works__ai-grid" aria-label="${accessibilityCopy.aiWall}">
              ${otherWorksCampaignWall.map((item, index) => `
                <article class="portfolio-other-works__ai-card portfolio-other-works__ai-card--${item.ratio} portfolio-other-works__ai-card--${item.tone} ${item.featured ? "is-featured" : ""}" data-wall-index="${index + 1}" data-ratio="${item.ratio}" data-grid="${item.gridLabel}" style="--item-index: ${index}; --ai-col-start: ${item.gridColumn}; --ai-row-start: ${item.gridRow}; --ai-col-span: ${item.gridColumnSpan}; --ai-row-span: ${item.gridRowSpan};">
                  <figure class="${item.image ? "" : "is-placeholder"}">
                    ${campaignWallMedia(item, index)}
                  </figure>
                </article>
              `).join("")}
            </div>
          </div>

        </section>
    `;
  }

  function placeholderPanel({ id, moduleNo, pageLabel, kicker, title, text, items, showChapter = true }) {
    const chapterAttr = showChapter ? ` data-chapter="${moduleNo}"` : "";
    return `
        <section id="${id}" class="portfolio-chapter portfolio-chapter--workflow portfolio-placeholder-chapter"${chapterAttr}>
          <div class="portfolio-panel portfolio-placeholder portfolio-chapter__screen portfolio-chapter__screen--first">
            <div class="portfolio-section__intro reveal">
              <p class="portfolio-kicker">${kicker}</p>
              <h2>${title}</h2>
              <p class="portfolio-titleline">${text}</p>
            </div>
            <div class="portfolio-placeholder__grid">
              ${items.map((item, index) => card(item.title, item.text, String(index + 1).padStart(2, "0"), item.icon || "")).join("")}
            </div>
          </div>
        </section>
    `;
  }

  function buildPortfolioPage(introHtml) {
    const heroTitle = pageCopy.hero.title.join("");
    const heroTitleFitCount = Math.max(4, Array.from(heroTitle.replace(/\s+/g, "")).length);
    return `
      <main class="portfolio-page">
        <a class="portfolio-skip-link" href="#about-me">跳到关于我</a>
        ${introHtml}
        <div class="portfolio-chapter-one" aria-label="作品集开场与设计理念">
          <section id="visual-files" class="portfolio-hero" data-chapter="01">
            <div class="portfolio-hero__galaxy" data-reactbits-galaxy-home aria-hidden="true"></div>
            <div class="portfolio-hero__shade"></div>
            <div class="portfolio-hero__bottom-fade" aria-hidden="true"></div>
            <div class="portfolio-hero__content motion-hero-frame">
              <p class="portfolio-hero__titleline portfolio-titleline portfolio-titleline--main">${escapeHtml(pageCopy.hero.line)}</p>
              <h1 class="portfolio-main-title" style="--title-fit-count:${heroTitleFitCount}">${pageCopy.hero.title.map((line) => `<span>${escapeHtml(line)}</span>`).join("")}</h1>
            </div>
          </section>

          <section id="before-visuals" class="portfolio-panel portfolio-profile-reserve portfolio-profile-cinema portfolio-ai-judgment portfolio-design-creed" aria-label="设计理念">
            <div class="portfolio-ai-judgment__inner portfolio-design-creed__inner">
              <div class="portfolio-design-creed__statement" role="heading" aria-level="2" data-reactbits-blur-text="让 AI 打开画面的边界，让设计决定它去往哪里。">让 AI 打开画面的边界，让设计决定它去往哪里。</div>
            </div>
            <div class="portfolio-design-creed__scroll-cue" aria-hidden="true">
              <span class="portfolio-design-creed__scroll-cue-mark" aria-hidden="true"></span>
            </div>
          </section>
        </div>

        ${buildAigcDesignIntro()}

        ${buildTransplantedDesign()}

        <section id="commercial-film" class="portfolio-chapter portfolio-chapter--dark portfolio-work--dark portfolio-chapter--editing" data-chapter="03">
          <div class="portfolio-panel portfolio-video-feature portfolio-video-feature--main portfolio-video-feature--cinema portfolio-chapter__screen portfolio-chapter__screen--first">
            <div class="portfolio-video-feature__media portfolio-video-feature__media--cinema reveal">
              <div class="portfolio-video-stage portfolio-video-stage--wide portfolio-video-stage--cinema">
                <div class="portfolio-video-feature__copy portfolio-video-feature__copy--cinema portfolio-video-stage__title">
                  ${titleBlock(sectionHeadings.commercialFilm, "h2", { main: true })}
                </div>
                ${brandFilmHeroMedia()}
              </div>
            </div>
          </div>
          <div id="film-storyboard" class="portfolio-panel portfolio-storyboard portfolio-storyboard--prompt portfolio-chapter__screen portfolio-chapter__screen--continue" data-prompt-section>
            <div class="portfolio-section__intro reveal">
              ${titleBlock(sectionHeadings.filmStoryboard, "h2", { main: true })}
            </div>
            <div class="portfolio-storyboard-strip reveal" aria-label="${accessibilityCopy.storyboardStrip}">
              ${videoAssets.storyboardClips.map(storyboardClipCard).join("")}
            </div>
            <div class="portfolio-prompt-console reveal">
              <div class="portfolio-prompt-console__bar">
                <span></span><span></span><span></span>
                <strong>${pageCopy.filmCaption.promptTitle}</strong>
              </div>
              <pre data-prompt-input data-prompt="${escapeHtml(videoPromptPreview)}">${escapeHtml(videoPromptPreview)}</pre>
            </div>
          </div>
        </section>

        ${buildRealityFusion()}

        ${buildCommercialPhotoIntro()}

        ${buildTransplantedPhoto()}

        ${buildOtherWorksGallery()}

        ${buildAboutProfile()}

        ${buildPortfolioThanks()}
      </main>
    `;
  }

  // Navigation

    return {
      buildPortfolioPage,
    };
  }

  window.portfolioRenderers = {
    create: createPortfolioRenderers,
  };
})();
