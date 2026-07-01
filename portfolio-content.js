(function () {
  const twoDigit = (value) => String(value).padStart(2, "0");

  const navigation = [
    {
      id: "visual-files",
      label: "作品集",
      children: [],
    },
    {
      id: "aigc-design",
      label: "视觉设计",
      children: [
        { id: "visual-tone", label: "泉感成形" },
        { id: "visual-system", label: "系统延展" },
      ],
    },
    {
      id: "commercial-film",
      label: "商业广告",
      children: [
        { id: "film-storyboard", label: "分镜故事板" },
      ],
    },
    {
      id: "commercial-photo",
      label: "商业摄影",
      children: [
        { id: "reality-imagination", label: "虚实融合" },
        { id: "photo-imagined", label: "所想所得" },
        { id: "photo-multi-scene", label: "一物多景" },
      ],
    },
    {
      id: "other-works",
      label: "GAO DESIGN",
      children: [
        { id: "other-works-hero", label: "品牌视觉" },
        { id: "other-works-posters", label: "海报展廊" },
        { id: "other-works-light-table", label: "材质叙事" },
        { id: "other-works-cinema", label: "宽幕张力" },
        { id: "other-works-wall", label: "设计档案" },
      ],
    },
    {
      id: "about-me",
      label: "关于我",
      children: [
        { id: "about-thanks", label: "致谢" },
      ],
    },
  ];

  const refreshAssets = {
    methodDirectionDefinition: "02-visual-design/method/02A-01-direction-definition-v1.webp",
    methodProductAnchor: "02-visual-design/method/02A-02-product-anchor-v1.webp",
    methodDirectionTesting: "02-visual-design/method/02A-03-direction-testing-v1.webp",
    methodVisualLanguage: "02-visual-design/method/02A-04-visual-language-equal-panels-v1.webp",
    methodSystemExtension: "02-visual-design/method/02A-05-system-extension-context-fit-v3.webp",
    blackGoldSeries: "02-visual-design/tone/02B-01-core-luxury-t272.webp",
    freshHydrationSeries: "02-visual-design/tone/02B-02-burst-hydration-surface-splash-t280.webp",
    skinSourceLiftingSeries: "02-visual-design/tone/02B-03-sculpting-renewal-t272.webp",
    primalRenewalSeries: "02-visual-design/tone/02B-04-primal-renewal-t272.webp",
    eightGlassesWaterSeries: "02-visual-design/tone/02B-05-eight-glasses-water-t272.webp",
    doubleElasticSeries: "02-visual-design/tone/02B-06-double-elastic-t272.webp",
    visualCore: "02-visual-design/system/02c-01-gift-box-t258.webp",
    colorSystem: "02-visual-design/system/02c-02-shopping-bag-t258.webp",
    materialSystem: "02-visual-design/system/02c-03-counter-display-t258.webp",
    productImageStandard: "02-visual-design/system/02c-04-membership-card-t258.webp",
    layoutGridSystem: "02-visual-design/system/02c-05-tester-bar-t258.webp",
    informationHierarchy: "02-visual-design/system/02c-06-counter-brochure-t258.webp",
    applicationExtension: "02-visual-design/system/02c-07-launch-invitation-t258.webp",
    aiVisualProcess: "02-visual-design/system/02c-08-brand-lookbook-t258.webp",
    storyboardHook: "03-commercial-film/storyboard/T-309-final-film-storyboard/03B-01-golden-light-hook-t309.webp",
    storyboardReveal: "03-commercial-film/storyboard/T-309-final-film-storyboard/03B-02-product-reveal-water-t309.webp",
    storyboardTexture: "03-commercial-film/storyboard/T-309-final-film-storyboard/03B-03-metal-logo-macro-t309.webp",
    storyboardApplication: "03-commercial-film/storyboard/T-309-final-film-storyboard/03B-04-cream-texture-proof-t309.webp",
    storyboardResult: "03-commercial-film/storyboard/T-309-final-film-storyboard/03B-05-golden-energy-activation-t309.webp",
    storyboardLockup: "03-commercial-film/storyboard/T-309-final-film-storyboard/03B-06-final-packshot-hold-t309.webp",
    fusionTaijiEmulsionWhite: "04-commercial-photography/fusion-device/04-taiji-emulsion-white-platinum-v1.webp",
    fusionTaijiEmulsionBlack: "04-commercial-photography/fusion-device/04-taiji-emulsion-black-gold-v1.webp",
    fusionCoreLuxuryRaw: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-01-core-luxury-raw-t294.webp",
    fusionCoreLuxuryScene: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-01-core-luxury-scene-t294.webp",
    fusionBurstHydrationRaw: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-02-burst-hydration-raw-t294.webp",
    fusionBurstHydrationScene: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-02-burst-hydration-scene-t294.webp",
    fusionSculptingRenewalRaw: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-03-sculpting-renewal-raw-t294.webp",
    fusionSculptingRenewalScene: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-03-sculpting-renewal-scene-t294.webp",
    fusionPrimalRenewalRaw: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-04-primal-renewal-raw-t294.webp",
    fusionPrimalRenewalScene: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-04-primal-renewal-scene-t294.webp",
    fusionEightGlassesWaterRaw: "04-commercial-photography/fusion-cards/T-308-eight-glasses-water/04A-fusion-05-eight-glasses-water-raw-t308.webp",
    fusionEightGlassesWaterScene: "04-commercial-photography/fusion-cards/T-308-eight-glasses-water/04A-fusion-05-eight-glasses-water-scene-t308.webp",
    fusionDoubleElasticRaw: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-06-double-elastic-raw-t294.webp",
    fusionDoubleElasticScene: "04-commercial-photography/fusion-cards/T-294-fusion-12/04A-fusion-06-double-elastic-scene-t294.webp",
  };

  const assets = {
    hero: {
      home: "",
    },
    beauty: {
      hero: refreshAssets.fusionCoreLuxuryRaw,
      sourcePackshot: refreshAssets.fusionTaijiEmulsionWhite,
      commercialScene: refreshAssets.fusionTaijiEmulsionBlack,
      products: refreshAssets.fusionCoreLuxuryRaw,
      scenes: refreshAssets.fusionCoreLuxuryScene,
    },
    video: {
      brandFilmVideo: "03-commercial-film/video/03A-black-gold-skincare-placeholder-t304.mp4",
      mainFrames: [
        refreshAssets.storyboardHook,
        refreshAssets.storyboardReveal,
        refreshAssets.storyboardTexture,
        refreshAssets.storyboardApplication,
        refreshAssets.storyboardResult,
        refreshAssets.storyboardLockup,
      ],
    },
  };

  const designToneOptions = [
    { title: "芯肌奢润系列", desc: "黑金水面与柔金边缘光，先奠定奢润系列的第一视觉印象。", main: refreshAssets.blackGoldSeries, swatch: "02-visual-design/tone-swatches/tone-swatch-core-skin-luxury-material-v4-512.webp" },
    { title: "爆水芯润系列", desc: "浅蓝、净白和透明水膜，把清爽水感放在画面前景。", main: refreshAssets.freshHydrationSeries, swatch: "02-visual-design/tone-swatches/tone-swatch-burst-hydration-glass-v4-512.webp" },
    { title: "肌源塑颜系列", desc: "金白光与雕塑台面建立秩序感，表达成熟紧致。", main: refreshAssets.skinSourceLiftingSeries, swatch: "02-visual-design/tone-swatches/tone-swatch-skin-source-metal-v4-512.webp" },
    { title: "初生系列", desc: "深蓝透明包材与柔水光，确立初生系列的干净、沉静与轻盈。", main: refreshAssets.primalRenewalSeries, swatch: "02-visual-design/tone-swatches/tone-swatch-primal-renewal-water-v4-512.webp" },
    { title: "八杯水系列", desc: "清水蓝与透明水层建立补水记忆，画面更年轻。", main: refreshAssets.eightGlassesWaterSeries, swatch: "02-visual-design/tone-swatches/tone-swatch-eight-glasses-ripple-v4-512.webp" },
    { title: "双重弹润系列", desc: "香槟金包材与双股水流，表达弹润、紧致和稳定质感。", main: refreshAssets.doubleElasticSeries, swatch: "02-visual-design/tone-swatches/tone-swatch-double-elastic-champagne-v4-512.webp" },
  ];

  const wheelCards = [
    { title: "套装礼盒", text: "把开箱、送礼和陈列收进同一套黑金秩序。", image: refreshAssets.visualCore },
    { title: "手提纸袋", text: "纸张、提绳与烫印同步延展，购买触点更完整。", image: refreshAssets.colorSystem },
    { title: "专柜展陈", text: "以灯带、层级和背板建立终端里的品牌识别。", image: refreshAssets.materialSystem },
    { title: "会员卡券", text: "卡套与礼赠券承接服务感，不让视觉停在包装。", image: refreshAssets.productImageStandard },
    { title: "试用台面", text: "将洁面、水、乳、霜排进可体验的导购动线。", image: refreshAssets.layoutGridSystem },
    { title: "导购折页", text: "用短标题和分区版式，让产品线被快速读懂。", image: refreshAssets.informationHierarchy },
    { title: "发布邀请", text: "请柬、信封与卡片为新品发布建立仪式感。", image: refreshAssets.applicationExtension },
    { title: "品牌画册", text: "把标识、色彩、图片和版式收束为可复用手册。", image: refreshAssets.aiVisualProcess },
  ];

  const quietItems = [
    { title: "方向定义 Direction", text: "先画清视觉边界，再让 AI 在边界内生成候选。", image: refreshAssets.methodDirectionDefinition },
    { title: "产品锚点 Product Anchor", text: "用真实包装约束瓶型、比例和品牌识别。", image: refreshAssets.methodProductAnchor },
    { title: "方向试验 Direction Testing", text: "同一标准比较候选，及时剔除跑偏方向。", image: refreshAssets.methodDirectionTesting },
    { title: "视觉成形 Visual Language", text: "把水感、矿物和暗金光影统一为同一种视觉语言。", image: refreshAssets.methodVisualLanguage },
    { title: "系统延展 Visual System", text: "把通过筛选的方向，固化为一套可复用的交付规范。", image: refreshAssets.methodSystemExtension },
  ];

  const productComparisons = [
    {
      title: "芯肌奢润系列",
      meta: "Core Luxury",
      crop: "center",
      rawImage: refreshAssets.fusionCoreLuxuryRaw,
      refinedImage: "",
      sceneImage: refreshAssets.fusionCoreLuxuryScene,
      note: "黑金水面、湿润矿石与柔金边缘光，作为后续融合的深色环境底。",
    },
    {
      title: "爆水芯润系列",
      meta: "Burst Hydration",
      crop: "center",
      rawImage: refreshAssets.fusionDoubleElasticRaw,
      refinedImage: "",
      sceneImage: refreshAssets.fusionDoubleElasticScene,
      note: "浅蓝净白、透明水膜与玻璃折射，作为后续融合的清爽环境底。",
    },
    {
      title: "肌源塑颜系列",
      meta: "Sculpting Renewal",
      crop: "center",
      rawImage: refreshAssets.fusionPrimalRenewalRaw,
      refinedImage: "",
      sceneImage: refreshAssets.fusionPrimalRenewalScene,
      note: "金白光、香槟色与雕塑化光面，作为后续融合的成熟秩序环境底。",
    },
    {
      title: "初生系列",
      meta: "Primal Renewal",
      crop: "center",
      rawImage: refreshAssets.fusionSculptingRenewalRaw,
      refinedImage: "",
      sceneImage: refreshAssets.fusionSculptingRenewalScene,
      note: "深蓝透明水感、柔雾与晨前冷光，作为后续融合的沉静环境底。",
    },
    {
      title: "八杯水系列",
      meta: "Eight Glasses Water",
      crop: "center",
      rawImage: refreshAssets.fusionEightGlassesWaterRaw,
      refinedImage: "",
      sceneImage: refreshAssets.fusionEightGlassesWaterScene,
      note: "清水蓝、透明水层与层叠涟漪，作为后续融合的轻盈环境底。",
    },
    {
      title: "双重弹润系列",
      meta: "Double Elastic",
      crop: "center",
      rawImage: refreshAssets.fusionBurstHydrationRaw,
      refinedImage: "",
      sceneImage: refreshAssets.fusionBurstHydrationScene,
      note: "香槟金、珍珠白与双股水膜流线，作为后续融合的弹润环境底。",
    },
  ];

  const photoGalleries = [
    {
      id: "photo-imagined",
      kicker: "IMAGINED, THEN REALIZED",
      title: "所想即所得",
      line: "构图判断、材质控制、页面成图",
      text: "构图、光线和材质先行判断，最终输出为可直接上版面的商业图像。",
      big: [
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/big-01-04B-imagined-composition-judgment-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/big-02-04B-imagined-material-control-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/big-03-04B-imagined-page-ready-campaign-t300.webp",
      ],
      small: [
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/small-01-04B-imagined-composition-judgment-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/small-02-04B-imagined-material-control-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/small-03-04B-imagined-page-ready-campaign-t300.webp",
      ],
      detailFromBig: false,
      reverse: false,
    },
    {
      id: "photo-multi-scene",
      kicker: "ONE PRODUCT, MANY SCENES",
      title: "一物多景",
      line: "同一产品、多场景延展、识别统一",
      text: "同一产品换材质与光线，瓶型比例和品牌识别不可偏离。",
      big: [
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/big-04-04B-multiscene-private-ritual-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/big-05-04B-multiscene-boutique-display-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/big-06-04B-multiscene-spring-source-stage-t300.webp",
      ],
      small: [
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/small-04-04B-multiscene-private-ritual-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/small-05-04B-multiscene-boutique-display-t300.webp",
        "04-commercial-photography/photo-galleries/T-300-04B-eco-4k-final-12/small-06-04B-multiscene-spring-source-stage-t300.webp",
      ],
      detailFromBig: false,
      reverse: true,
    },
  ];

  const storyboardCopy = [
    { title: "光线开场 Hook", text: "金色光线缓慢穿透炭黑空间，先建立黑金奢养的电影基调。" },
    { title: "产品登场 Reveal", text: "芯肌奢润精华霜从暗部显影，瓶身与水面倒影自然融合。" },
    { title: "细节微距 Macro", text: "镜头掠过香槟金瓶盖与哑光瓶身，最后聚焦 WETHERM 标识。" },
    { title: "质地证明 Texture", text: "乳白膏体缓缓延展，金色侧光勾出丰润细腻的质地层次。" },
    { title: "能量焕活 Energy", text: "产品周围浮现金色丁达尔光雾，表达肌底焕活的静谧力量。" },
    { title: "最终定格 Packshot", text: "产品正面稳定停留于水面中央，光线收束，为后期文字留白。" },
  ];

  assets.video.storyboardClips = assets.video.mainFrames.map((poster, index) => ({
    poster,
    clip: "",
    title: storyboardCopy[index].title,
    text: storyboardCopy[index].text,
  }));

  const videoPromptPreview = [
    "请生成一支15秒、21:9宽画幅的高端护肤广告。开场让一道纤细金色光线从炭黑空间深处缓慢穿透，液态黄金纹理与水面倒影若隐若现，先建立静谧、奢华、克制的黑金基调。随后温碧泉芯肌奢润精华霜从暗部缓缓显影，产品稳稳立在水面中央，哑光黑瓶身、香槟金瓶盖和 WETHERM 标识在柔和侧光里被慢慢勾出，瓶底保留真实接触阴影与倒影。中段切入瓶盖金属细节和瓶身标识微距，再转到乳白精华霜的丝滑膏体特写，质地丰润、细腻、缓慢延展。后段回到产品正面，金色丁达尔光雾从周围自然散开，像深海黑金能量被唤醒，但不要夸张粒子和科幻特效。最终产品正面稳定停留于平静水面中央，金色光线收束，画面纯净无文字，为后期标题留白，整体保持真实广告摄影质感、低反差高光、浅景深、8K级细节。"
  ].join("");

  const future = {
    opening: {
      title: "未来已来",
      line: "方向判断、筛选标准、交付意识",
      statement: "AI 负责提速，真正决定结果的是方向、筛选和交付意识。",
      image: refreshAssets.futureMegastructure,
      portalImage8k: refreshAssets.futureMegastructure,
    },
    proofFrames: [
      { label: "Prompt", title: "候选方向", image: refreshAssets.futureProofAesthetic },
      { label: "Select", title: "结果筛选", image: refreshAssets.futureProofSelection },
      { label: "Deliver", title: "交付归档", image: refreshAssets.futureProofDelivery },
    ],
    deliverySteps: [
      { step: "01", title: "Brief", note: "需求确认", icon: "brief" },
      { step: "02", title: "Direction", note: "方向定义", icon: "keywords" },
      { step: "03", title: "Storyboard", note: "镜头分镜", icon: "video" },
      { step: "04", title: "Generate", note: "出图测试", icon: "generate", key: true, image: refreshAssets.futureProofAesthetic },
      { step: "05", title: "Select", note: "结果筛选", icon: "select", key: true, image: refreshAssets.futureProofSelection },
      { step: "06", title: "Retouch", note: "精修统一", icon: "retouch" },
      { step: "07", title: "Deliver", note: "交付归档", icon: "delivery", key: true, image: refreshAssets.futureProofDelivery },
    ],
  };

  const sections = {
    hero: {
      kicker: "PERSONAL AIGC VISUAL PORTFOLIO",
      title: ["个人AIGC视觉作品集"],
      line: "PERSONAL AIGC VISUAL PORTFOLIO",
      imageAlt: "作品集主视觉：黑金水面、岩石、微雾和金色光影构成护肤视觉氛围",
    },
    headings: {
      aigcDesign: { kicker: "AIGC VISUAL DESIGN", title: "AIGC 视觉设计", line: "AIGC VISUAL DESIGN" },
      visualTone: { kicker: "VISUAL TONE FROM SPRING WATER", title: "从「泉」出发，泉感成形", line: "VISUAL TONE FROM SPRING WATER" },
      visualSystem: { kicker: "ONE VISUAL SYSTEM, MANY EXPRESSIONS", title: "一套视觉，多种生长", line: "ONE VISUAL SYSTEM, MANY EXPRESSIONS" },
      commercialFilm: { kicker: "AIGC COMMERCIAL FILM", title: "AIGC 商业广告", line: "AIGC COMMERCIAL FILM" },
      filmStoryboard: { kicker: "FROM STORYBOARD TO FILM", title: "从分镜到成片", line: "FROM STORYBOARD TO FILM" },
      realityFusion: { kicker: "AIGC COMMERCIAL PHOTOGRAPHY", title: "AIGC 商业摄影", line: "AIGC COMMERCIAL PHOTOGRAPHY" },
      commercialPhoto: { kicker: "REALITY MEETS IMAGINATION", title: "虚实融合", line: "REALITY MEETS IMAGINATION" },
      futureJudgment: { kicker: "AI AMPLIFIES JUDGMENT", title: "AI 放大的是判断力", line: "边界设定、候选筛选、交付判断" },
      futureDelivery: { kicker: "FROM JUDGMENT TO DELIVERY", title: "比速度更重要的，是能交付", line: "需求确认、生成筛选、精修归档" },
    },
    filmCaption: {
      meta: "16:9 / 15s",
      text: "产品出场 / 黑金水面 / 质地镜头 / 微雾柔金",
      promptTitle: "AI 视频生成分镜提示词",
    },
  };

  const designGaoBase = "05-gao-design";
  const designGaoPosters = [
    "香水 · Dawn Greenhouse", "机械腕表 · Observatory Time", "珠宝 · Closed Gallery", "手袋 · Rain Portico",
    "高跟鞋 · Backstage Light", "咖啡豆袋 · Mountain Roast", "音箱 · Sound Sculpture", "黑胶唱机 · Needle Drop",
    "羊毛大衣 · Quiet Luxury", "高端轿车 · Light Cut", "电影摄影机 · Lens Glass", "红酒 · Cellar Glow",
  ];
  const designGaoPosterOverrides = {
    "03": "OW-P-03-poster-t280.webp",
    "09": "OW-P-09-poster-t279.webp",
  };
  const designGaoDesktops = [
    "仿赛摩托 · 雨天压弯", "意式咖啡机 · 双头工作面", "高端沙发 · 家庭温度", "梳妆台 · 晨间仪式",
  ];
  const designGaoCinema = [
    "第一幕：苏醒", "第二幕：放行", "第三幕：逃逸", "第四幕：抵达",
  ];
  const designGaoWall = [
    ["创意咖啡杯 · Gravity Cup", "OW-W-01-landscape-t279.webp"],
    ["人体工学椅 · Spine Support", "OW-W-02-landscape-v8.webp"],
    ["乳胶枕头 · Cloud Cut", "OW-W-03-landscape-v8.webp"],
    ["眼影盘 · Color Theatre", "OW-W-04-detail-v8.webp"],
    ["精华液 · Water Dome", "OW-W-05-portrait-v8.webp"],
    ["口红 · Red Sculpture", "OW-W-06-portrait-v8.webp"],
    ["吹风机 · Airflow Form", "OW-W-07-detail-v8.webp"],
    ["运动鞋 · Starting Energy", "OW-W-08-portrait-v8.webp"],
    ["托特包 · Urban Volume", "OW-W-09-portrait-v8.webp"],
    ["高端巧克力 · Edible Jewel Box", "OW-W-10-detail-v8.webp"],
    ["电动牙刷 · Polar Clean", "OW-W-11-detail-v8.webp"],
    ["机械键盘 · Tactical Keys", "OW-W-12-landscape-v8.webp"],
    ["棒球帽 · Brim Shadow", "OW-W-13-poster-v8.webp"],
    ["皮鞋 · Mirror Step", "OW-W-14-landscape-v8.webp"],
    ["面霜 · Cream Vessel", "OW-W-15-landscape-v8.webp"],
    ["牛仔裤 · Indigo Fit", "OW-W-16-landscape-v8.webp"],
    ["电竞桌 · Control Console", "OW-W-17-poster-v8.webp"],
    ["游戏掌机 · Portable Play", "OW-W-18-poster-v8.webp"],
    ["行李箱 · Boarding Ark", "OW-W-19-landscape-v8.webp"],
    ["鼠标 · Palm Curve", "OW-W-20-landscape-v8.webp"],
  ];

  const otherWorksGallery = {
    heroCinema: {
      id: "OW-HERO-01",
      ratio: "cinema",
      ratioLabel: "2.35:1",
      title: "GAO DESIGN Atelier",
      type: "品牌主视觉",
      note: "以 2.35:1 宽幕确立 GAO DESIGN 的核心视觉立场：黑金克制、静物叙事。",
      image: `${designGaoBase}/hero/OW-HERO-01-cinema-hero-v8.webp`,
    },
    posterStage: Array.from({ length: 12 }, (_, index) => {
      const slot = twoDigit(index + 1);
      const imageName = designGaoPosterOverrides[slot] || `OW-P-${slot}-poster-v8.webp`;
      return {
        id: `OW-P-${slot}`,
        ratio: "poster",
        ratioLabel: "3:4",
        title: designGaoPosters[index],
        type: "产品宣传海报",
        note: "",
        image: `${designGaoBase}/posters/${imageName}`,
      };
    }),
    desktopTable: Array.from({ length: 4 }, (_, index) => {
      const slot = twoDigit(index + 1);
      return {
        id: `OW-D-${slot}`,
        ratio: "desktop",
        ratioLabel: "16:9",
        title: designGaoDesktops[index],
        type: "产品场景叙事",
        note: "横向版位中，主体居中锚定，两侧留出呼吸，阅读节奏比填充更重要。",
        image: `${designGaoBase}/material/OW-D-${slot}-desktop-v8.webp`,
      };
    }),
    cinemaStrips: Array.from({ length: 4 }, (_, index) => {
      const slot = twoDigit(index + 1);
      return {
        id: `OW-C-${slot}`,
        ratio: "cinema",
        ratioLabel: "2.35:1",
        title: designGaoCinema[index],
        type: "宽幕电影叙事",
        note: "以 2.35:1 电影画幅推敲品牌视觉的叙事张力，不是所有画面都撑得起宽幕。",
        image: `${designGaoBase}/cinema/OW-C-${slot}-cinema-v8.webp`,
      };
    }),
  };

  // DesignGao concept slots; keep Wetherm campaign assets out of this wall.
  const campaignWallBlueprints = [
    { ratio: "landscape", ratioLabel: "16:9", tone: "mineral", kind: "landscape", grid: [1, 1, 4, 3] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "pearl", kind: "landscape", grid: [5, 1, 4, 3] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "obsidian", kind: "landscape", grid: [9, 1, 4, 3] },
    { ratio: "square", ratioLabel: "1:1", tone: "gold", kind: "detail", grid: [1, 4, 3, 4] },
    { ratio: "portrait45", ratioLabel: "4:5", tone: "rose", kind: "portrait", grid: [4, 4, 3, 5] },
    { ratio: "portrait45", ratioLabel: "4:5", tone: "copper", kind: "portrait", grid: [7, 4, 3, 5] },
    { ratio: "square", ratioLabel: "1:1", tone: "jade", kind: "detail", grid: [10, 4, 3, 4] },
    { ratio: "portrait45", ratioLabel: "4:5", tone: "obsidian", kind: "portrait", grid: [1, 8, 3, 5] },
    { ratio: "portrait45", ratioLabel: "4:5", tone: "pearl", kind: "portrait", grid: [10, 8, 3, 5] },
    { ratio: "square", ratioLabel: "1:1", tone: "mineral", kind: "detail", grid: [4, 9, 3, 4] },
    { ratio: "square", ratioLabel: "1:1", tone: "carbon", kind: "detail", grid: [7, 9, 3, 4] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "gold", kind: "landscape", grid: [1, 13, 4, 3] },
    { ratio: "poster", ratioLabel: "3:4", tone: "jade", kind: "poster", grid: [5, 13, 4, 7] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "rose", kind: "landscape", grid: [9, 13, 4, 3] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "carbon", kind: "landscape", grid: [1, 16, 4, 3] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "pearl", kind: "landscape", grid: [9, 16, 4, 3] },
    { ratio: "poster", ratioLabel: "3:4", tone: "copper", kind: "poster", grid: [1, 19, 4, 7] },
    { ratio: "poster", ratioLabel: "3:4", tone: "obsidian", kind: "poster", grid: [9, 19, 4, 7] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "jade", kind: "landscape", grid: [5, 20, 4, 3] },
    { ratio: "landscape", ratioLabel: "16:9", tone: "mineral", kind: "landscape", grid: [5, 23, 4, 3] },
  ];

  const campaignWall = campaignWallBlueprints.map(({ title, ratio, ratioLabel, tone, kind, image, grid, featured }, index) => {
    const slot = twoDigit(index + 1);
    const [gridColumn, gridRow, gridColumnSpan, gridRowSpan] = grid;
    const designGaoItem = designGaoWall[index] || [`GD Concept ${slot}`, ""];
    return {
      id: `OW-W-${slot}`,
      title: title || designGaoItem[0],
      ratio,
      ratioLabel,
      image: image || (designGaoItem[1] ? `${designGaoBase}/archive/${designGaoItem[1]}` : ""),
      tone,
      gridColumn,
      gridRow,
      gridColumnSpan,
      gridRowSpan,
      featured,
      gridLabel: `${gridColumnSpan}C / ${gridRowSpan}R`,
    };
  });

  const otherWorks = {
    gallery: otherWorksGallery,
    campaignWall,
    headings: {
      hero: { kicker: "GAO DESIGN", title: "GAO DESIGN", line: "虚构设计师品牌，仅用于呈现个人设计理念" },
      poster: { kicker: "POSTER GALLERY", title: "海报展廊", line: "POSTER GALLERY" },
      light: { kicker: "MATERIAL NARRATIVE", title: "材质叙事", line: "MATERIAL NARRATIVE" },
      cinema: { kicker: "WIDESCREEN TENSION", title: "宽幕张力", line: "WIDESCREEN TENSION" },
      aiWall: { kicker: "GAO DESIGN BRAND ARCHIVE", title: "GAO DESIGN 品牌档案馆", line: "GAO DESIGN BRAND ARCHIVE" },
      thanks: {
        title: "感谢观看",
        line: "THANK YOU",
        signature: "Designed by 高晓霖 Gao XiaoLin / Shenzhen / 2026",
      },
    },
  };

  const galleries = {
    designToneOptions,
    wheelCards,
    quietItems,
    productComparisons,
    photoGalleries,
    storyboardCopy,
    videoPromptPreview,
    future,
  };

  const accessibility = {
    quickNav: "作品集快速导航",
    innerNav: (label) => `${label}内部导航`,
    colorTabs: "电商视觉调性切换",
    carouselGoto: (index) => `跳到第 ${index + 1} 项`,
    previousItem: "上一项",
    nextItem: "下一项",
    compareSlider: (title) => `${title} 前后对比拖动`,
    storyboardStrip: "横版广告视频关键分镜",
    storyboardImage: (index) => `横版广告视频分镜 ${index + 1}`,
    storyboardPreview: (index) => `横版广告视频分镜 ${index + 1} 悬停预览`,
    futureMetrics: "AI 导演控制台关键状态",
    futureProof: "未来已来 A 版面视觉证据",
    futureControls: "AI 导演控制台参数",
    futureStatus: "AI 导演控制台状态栏",
    fusionDevice: "白底产品图与 AI 商业摄影图的转换示意",
    fusionMask: "白底产品图与 AI 商业摄影图的圆形转换遮罩",
    futurePortalButton: "展开未来已来 AI 工作流概念图",
    futurePortalImage: "黑金水面中的 AI 工作流概念图，包含候选图墙、筛选工作台和护肤产品锚点",
    futureRippleAnalysis: "未来已来水波解剖：判断力关键层",
    futureDeliveryPath: "未来已来水波交付路径",
    otherWorkImage: (item) => `${item.title}，${item.type}`,
    campaignWallImage: (item) => `GAO DESIGN 品牌档案馆 ${item.title || item.id}，${item.ratioLabel}`,
    posterViewport: "海报展廊自动轮换",
    previousPoster: "上一张海报",
    nextPoster: "下一张海报",
    lightCarousel: "材质叙事自动轮播",
    lightSpeedControls: "材质叙事移动速度控制",
    slowerLightSpeed: "降低材质叙事移动速度",
    fasterLightSpeed: "提高材质叙事移动速度",
    pauseLightCarousel: "暂停材质叙事移动",
    resumeLightCarousel: "继续材质叙事移动",
    aiWall: "GAO DESIGN 品牌档案馆",
    deliveryPipeline: "AIGC 内容生产流程",
    judgmentMatrix: "AI 判断力控制矩阵",
  };

  window.portfolioContent = {
    navigation,
    assets,
    sections,
    galleries,
    otherWorks,
    accessibility,
  };
}());
