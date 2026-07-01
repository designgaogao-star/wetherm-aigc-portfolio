(function () {
  function createPortfolioInteractions(content) {
    if (!content) {
      throw new Error("[portfolio] Missing content for interactions.");
    }

    const sections = content.navigation;
    const accessibilityCopy = content.accessibility;
    const designToneOptions = content.galleries.designToneOptions;

    const img = (name) => "images/" + name;
    const originalImage = (name) => "images/" + name;
    let navScrollToken = 0;
    let navScrollTimers = [];
    let navActiveTarget = "";
    let navActiveUntil = 0;

  function clearNavScrollTimers() {
    navScrollTimers.forEach((timer) => window.clearTimeout(timer));
    navScrollTimers = [];
  }

  function withInstantScroll(callback) {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    callback();
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  }

  function cancelActiveSmoothScroll() {
    withInstantScroll(() => {
      window.scrollTo({ top: window.scrollY, left: 0, behavior: "auto" });
    });
  }

  function setNavActiveTarget(id, duration = 1700) {
    navActiveTarget = id;
    navActiveUntil = Date.now() + duration;
  }

  function getNavActiveTarget() {
    if (!navActiveTarget) return "";
    if (Date.now() > navActiveUntil) {
      navActiveTarget = "";
      navActiveUntil = 0;
      return "";
    }
    return navActiveTarget;
  }

  function clearNavActiveTarget(id) {
    if (id && navActiveTarget !== id) return;
    navActiveTarget = "";
    navActiveUntil = 0;
  }

  function isIntroPending() {
    return document.documentElement.classList.contains("is-intro-running") ||
      document.body.classList.contains("is-intro-running") ||
      Boolean(document.querySelector(".portfolio-intro:not(.is-hidden)"));
  }

  function isHomeHeroMotionNode(node) {
    return Boolean(node?.closest?.("#visual-files")) &&
      (
        node.classList.contains("motion-hero-frame") ||
        node.classList.contains("motion-split") ||
        node.classList.contains("motion-content")
      );
  }

  function releaseViewportReveals(scope = document) {
    const root = scope || document;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const viewportPad = Math.max(180, viewportHeight * 0.28);
    const candidates = [];

    if (root.matches?.(".reveal, .motion-split, .motion-content, .motion-hero-frame")) {
      candidates.push(root);
    }

    candidates.push(...Array.from(root.querySelectorAll?.(".reveal, .motion-split, .motion-content, .motion-hero-frame") || []));

    candidates.forEach((node) => {
      const rect = node.getBoundingClientRect();
      const isNearViewport = rect.bottom >= -viewportPad && rect.top <= viewportHeight + viewportPad;
      if (!isNearViewport) return;
      if (isIntroPending() && isHomeHeroMotionNode(node)) return;
      if (node.classList.contains("reveal")) {
        node.style.removeProperty("--reveal-delay");
        node.classList.add("is-visible");
      }
      if (
        node.classList.contains("motion-split") ||
        node.classList.contains("motion-content") ||
        node.classList.contains("motion-hero-frame")
      ) {
        node.classList.add("is-motion-visible");
      }
    });
  }

  function scheduleViewportReveal(scope = document) {
    window.requestAnimationFrame(() => releaseViewportReveals(scope));
    window.setTimeout(() => releaseViewportReveals(scope), 160);
    window.setTimeout(() => releaseViewportReveals(scope), 520);
  }

  function createQuickNav() {
    const nav = document.createElement("nav");
    nav.className = "portfolio-quick-nav";
    nav.setAttribute("aria-label", accessibilityCopy.quickNav);
    const links = document.createElement("div");
    links.className = "portfolio-nav-links";
    nav.appendChild(links);

    sections.forEach((item) => {
      const navItem = document.createElement("div");
      navItem.className = "portfolio-nav-item";
      const link = document.createElement("a");
      link.className = "portfolio-nav-link";
      link.href = `#${item.id}`;
      link.dataset.target = item.id;
      const label = document.createElement("span");
      label.textContent = item.label;
      link.appendChild(label);
      if (item.children?.length) {
        link.setAttribute("aria-haspopup", "true");
        link.setAttribute("aria-expanded", "false");
      }
      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (item.children?.length) {
          closeNavSubmenu(navItem);
        }
        scrollToSection(item.id, "smooth");
      });
      navItem.appendChild(link);

      if (item.children?.length) {
        const submenu = document.createElement("div");
        submenu.className = "portfolio-nav-submenu";
        submenu.setAttribute("aria-label", accessibilityCopy.innerNav(item.label));
        item.children.forEach((child) => {
          const childLink = document.createElement("a");
          childLink.href = `#${child.id}`;
          childLink.className = "portfolio-nav-subitem";
          childLink.dataset.target = child.id;
          childLink.textContent = child.label;
          childLink.addEventListener("click", (event) => {
            event.preventDefault();
            closeNavSubmenu(navItem);
            scrollToSection(child.id, "smooth");
          });
          submenu.appendChild(childLink);
        });
        navItem.appendChild(submenu);
        setupNavSubmenu(navItem);
      }

      links.appendChild(navItem);
    });

    const bgmButton = document.createElement("button");
    bgmButton.className = "portfolio-bgm-toggle";
    bgmButton.type = "button";
    bgmButton.dataset.bgmToggle = "";
    bgmButton.setAttribute("aria-label", "播放背景音乐");
    bgmButton.setAttribute("aria-pressed", "false");
    bgmButton.title = "背景音乐";
    bgmButton.innerHTML = `
      <span class="portfolio-bgm-toggle__bars" aria-hidden="true">
        <i></i><i></i><i></i>
      </span>
    `;
    const bgmAudio = document.createElement("audio");
    bgmAudio.dataset.bgmAudio = "";
    bgmAudio.dataset.src = "audio/Quiet Gold Water.mp3";
    bgmAudio.loop = true;
    bgmAudio.preload = "auto";
    bgmAudio.volume = 0.24;
    bgmAudio.setAttribute("aria-hidden", "true");
    nav.appendChild(bgmButton);
    nav.appendChild(bgmAudio);

    document.body.appendChild(nav);
  }

  function openNavSubmenu(navItem) {
    const trigger = navItem?.querySelector?.(".portfolio-nav-link[aria-haspopup='true']");
    if (!trigger) return;
    closeSiblingNavSubmenus(navItem);
    window.clearTimeout(Number(navItem.dataset.closeTimer || 0));
    navItem.dataset.closeTimer = "";
    navItem.classList.add("is-submenu-open");
    trigger.setAttribute("aria-expanded", "true");
  }

  function closeSiblingNavSubmenus(activeNavItem) {
    document.querySelectorAll(".portfolio-nav-item.is-submenu-open").forEach((navItem) => {
      if (navItem !== activeNavItem) closeNavSubmenu(navItem);
    });
  }

  function closeNavSubmenu(navItem) {
    const trigger = navItem?.querySelector?.(".portfolio-nav-link[aria-haspopup='true']");
    if (!trigger) return;
    window.clearTimeout(Number(navItem.dataset.closeTimer || 0));
    navItem.dataset.closeTimer = "";
    navItem.classList.remove("is-submenu-open");
    trigger.setAttribute("aria-expanded", "false");
  }

  function scheduleNavSubmenuClose(navItem) {
    window.clearTimeout(Number(navItem.dataset.closeTimer || 0));
    navItem.dataset.closeTimer = String(window.setTimeout(() => {
      if (navItem.matches(":hover")) return;
      closeNavSubmenu(navItem);
    }, 180));
  }

  function setupNavSubmenu(navItem) {
    navItem.addEventListener("pointerenter", () => openNavSubmenu(navItem));
    navItem.addEventListener("pointerleave", () => scheduleNavSubmenuClose(navItem));
    navItem.addEventListener("focusin", () => openNavSubmenu(navItem));
    navItem.addEventListener("focusout", () => {
      window.setTimeout(() => {
        if (!navItem.contains(document.activeElement)) scheduleNavSubmenuClose(navItem);
      }, 0);
    });
    navItem.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeNavSubmenu(navItem);
      navItem.querySelector(".portfolio-nav-link")?.focus({ preventScroll: true });
    });
  }

  function initBgmControl() {
    const button = document.querySelector("[data-bgm-toggle]");
    const audio = document.querySelector("[data-bgm-audio]");
    if (!button || !audio) return;
    const preferenceKey = "portfolio-bgm-enabled-v2";
    const autoplayPreference = (() => {
      try {
        return window.localStorage.getItem(preferenceKey);
      } catch (error) {
        return null;
      }
    })();
    const shouldAutoplay = autoplayPreference !== "0";
    let awaitingGesturePlayback = false;

    const remember = (enabled) => {
      try {
        window.localStorage.setItem(preferenceKey, enabled ? "1" : "0");
      } catch (error) {}
    };

    const setState = (state) => {
      const isPlaying = state === "playing";
      button.classList.toggle("is-playing", isPlaying);
      button.classList.toggle("is-unavailable", state === "unavailable");
      button.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      button.setAttribute(
        "aria-label",
        state === "unavailable" ? "背景音乐暂未接入" : isPlaying ? "暂停背景音乐" : "播放背景音乐"
      );
      button.title = state === "unavailable" ? "背景音乐暂未接入" : isPlaying ? "暂停背景音乐" : "背景音乐";
    };

    const ensureSource = () => {
      if (audio.getAttribute("src")) return;
      audio.src = audio.dataset.src || "";
      audio.load();
    };

    const playBgm = async ({ rememberPreference = true, markUnavailable = true } = {}) => {
      button.classList.remove("is-unavailable");
      ensureSource();
      try {
        await audio.play();
        awaitingGesturePlayback = false;
        setState("playing");
        if (rememberPreference) remember(true);
        return true;
      } catch (error) {
        if (markUnavailable) {
          setState("unavailable");
          if (rememberPreference) remember(false);
        }
        return false;
      }
    };

    const stopGesturePlayback = () => {
      awaitingGesturePlayback = false;
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach((eventName) => {
        window.removeEventListener(eventName, handleFirstPlaybackGesture);
      });
    };

    function handleFirstPlaybackGesture(event) {
      if (!awaitingGesturePlayback || !audio.paused) {
        stopGesturePlayback();
        return;
      }
      if (event.target?.closest?.("[data-bgm-toggle]")) return;
      playBgm({ rememberPreference: false, markUnavailable: false }).then((started) => {
        if (started) stopGesturePlayback();
      });
    }

    const waitForGesturePlayback = () => {
      awaitingGesturePlayback = true;
      ["pointerdown", "keydown", "wheel", "touchstart"].forEach((eventName) => {
        window.addEventListener(eventName, handleFirstPlaybackGesture, { passive: true });
      });
    };

    button.addEventListener("click", async () => {
      stopGesturePlayback();
      if (!audio.paused) {
        audio.pause();
        setState("paused");
        remember(false);
        return;
      }

      await playBgm();
    });

    audio.addEventListener("pause", () => {
      if (!audio.error) setState("paused");
    });
    audio.addEventListener("ended", () => setState("paused"));
    audio.addEventListener("error", () => {
      setState("unavailable");
      remember(false);
    });
    setState("paused");
    if (shouldAutoplay) {
      playBgm({ rememberPreference: false, markUnavailable: false }).then((started) => {
        if (!started && audio.paused) waitForGesturePlayback();
      });
    }

    window.portfolioBgmControl = {
      pauseForMedia() {
        const wasPlaying = !audio.paused && !audio.ended;
        if (wasPlaying) {
          audio.pause();
          setState("paused");
        }
        return wasPlaying;
      },
      resumeFromMedia() {
        return playBgm({ rememberPreference: false, markUnavailable: false });
      },
      isPlaying() {
        return !audio.paused && !audio.ended;
      },
    };
  }

  function initBrandFilmClickVideo() {
    const video = document.querySelector("[data-brand-film-video]");
    if (!video || !video.dataset.src) return;

    const stage = video.closest(".portfolio-video-stage--cinema");
    if (!stage) return;

    let shouldResumeBgm = false;
    let sourceReady = Boolean(
      video.currentSrc ||
        video.getAttribute("src") ||
        video.querySelector("source[data-video-source][src]")
    );
    let internalStop = false;
    let controlsHideTimer = 0;

    const ensureVideoSource = () => {
      if (sourceReady) return;
      const source = video.querySelector("source[data-video-source]");
      if (source) source.src = video.dataset.src;
      else video.src = video.dataset.src;
      video.load();
      sourceReady = true;
    };

    const updateControls = (visible) => {
      window.clearTimeout(controlsHideTimer);
      if (visible) video.setAttribute("controls", "");
      else video.removeAttribute("controls");
    };

    const revealControls = () => {
      if (!sourceReady || !stage.classList.contains("is-video-active") || video.paused) return;
      updateControls(true);
      controlsHideTimer = window.setTimeout(() => updateControls(false), 1600);
    };

    const updateControlsFromPointer = (event) => {
      if (!sourceReady) return;
      const rect = stage.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (isInside) revealControls();
      else updateControls(false);
    };

    const resumeBgmIfNeeded = () => {
      if (!shouldResumeBgm) return;
      window.portfolioBgmControl?.resumeFromMedia?.();
      shouldResumeBgm = false;
    };

    const stopVideo = ({ reset = true } = {}) => {
      internalStop = true;
      video.pause();
      if (reset) {
        try {
          video.currentTime = 0;
        } catch (error) {}
      }
      stage.classList.remove("is-video-active");
      resumeBgmIfNeeded();
      window.setTimeout(() => {
        internalStop = false;
      }, 0);
    };

    const playVideo = async () => {
      ensureVideoSource();
      shouldResumeBgm = Boolean(window.portfolioBgmControl?.pauseForMedia?.());
      try {
        await video.play();
        stage.classList.add("is-video-active");
        revealControls();
      } catch (error) {
        stage.classList.remove("is-video-active");
        resumeBgmIfNeeded();
      }
    };

    const toggleVideo = () => {
      if (video.paused || video.ended) {
        playVideo();
        return;
      }
      stopVideo({ reset: false });
    };

    stage.tabIndex = 0;
    stage.setAttribute("role", "button");
    stage.setAttribute("aria-label", "点击播放横版品牌广告片");

    stage.addEventListener("click", (event) => {
      if (event.target?.closest?.("[data-brand-film-video]") && video.controls && !video.paused) return;
      toggleVideo();
    });

    stage.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleVideo();
    });

    stage.addEventListener("pointerenter", () => {
      revealControls();
    });
    stage.addEventListener("pointermove", () => {
      revealControls();
    });
    stage.addEventListener("pointerleave", () => {
      updateControls(false);
    });
    stage.addEventListener("mouseenter", () => {
      revealControls();
    });
    stage.addEventListener("mousemove", () => {
      revealControls();
    });
    stage.addEventListener("mouseleave", () => {
      updateControls(false);
    });
    video.addEventListener("pointerenter", () => {
      revealControls();
    });
    video.addEventListener("pointermove", () => {
      revealControls();
    });
    video.addEventListener("mouseenter", () => {
      revealControls();
    });
    video.addEventListener("mousemove", () => {
      revealControls();
    });
    video.addEventListener("pointerleave", () => {
      updateControls(false);
    });
    video.addEventListener("mouseleave", () => {
      updateControls(false);
    });
    document.addEventListener("pointermove", updateControlsFromPointer, { passive: true });
    document.addEventListener("mousemove", updateControlsFromPointer, { passive: true });
    stage.addEventListener("focusin", () => {
      revealControls();
    });
    stage.addEventListener("focusout", () => {
      if (!stage.contains(document.activeElement)) updateControls(false);
    });
    video.addEventListener("ended", () => stopVideo());
    video.addEventListener("pause", () => {
      stage.classList.remove("is-video-active");
      if (!internalStop) resumeBgmIfNeeded();
      if (!stage.matches(":hover") && !stage.contains(document.activeElement)) updateControls(false);
    });
  }

  function scrollToSection(id, behavior) {
    const target = document.getElementById(id);
    if (!target) return;
    const token = ++navScrollToken;
    clearNavScrollTimers();
    cancelActiveSmoothScroll();
    setNavActiveTarget(id, 2200);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollBehavior = prefersReducedMotion ? "auto" : behavior;
    const getTop = () => Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY));
    const scrollToTarget = (nextBehavior = scrollBehavior) => {
      if (token !== navScrollToken) return;
      const scrollAction = () => window.scrollTo({ top: getTop(), behavior: nextBehavior });
      if (nextBehavior === "auto") {
        withInstantScroll(scrollAction);
      } else {
        scrollAction();
      }
      scheduleViewportReveal();
    };

    scrollToTarget();
    scheduleViewportReveal(target);

    if (scrollBehavior !== "smooth") return;

    [620, 1260].forEach((delay, index) => {
      const timer = window.setTimeout(() => {
        if (token !== navScrollToken) return;
        const delta = Math.round(target.getBoundingClientRect().top);
        if (Math.abs(delta) > 4) scrollToTarget(index === 0 ? "smooth" : "auto");
        scheduleViewportReveal(target);
      }, delay);
      navScrollTimers.push(timer);
    });

    const clearTimer = window.setTimeout(() => {
      if (token !== navScrollToken) return;
      clearNavActiveTarget(id);
      clearNavScrollTimers();
    }, 1850);
    navScrollTimers.push(clearTimer);
  }

  // Scroll and reveal motion
  function initRevealMotion() {
    const targets = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const revealTarget = (node, observer) => {
      node.classList.add("is-visible");
      observer.unobserve(node);
    };

    const standardTargets = targets.filter((node) => !node.matches("#commercial-photo .portfolio-fusion-device"));
    const earlyTargets = targets.filter((node) => node.matches("#commercial-photo .portfolio-fusion-device"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealTarget(entry.target, observer);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    const earlyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) revealTarget(entry.target, earlyObserver);
        });
      },
      { threshold: 0.04, rootMargin: "18% 0px 8% 0px" }
    );

    standardTargets.forEach((node) => {
      node.style.removeProperty("--reveal-delay");
      observer.observe(node);
    });

    earlyTargets.forEach((node) => {
      node.style.removeProperty("--reveal-delay");
      earlyObserver.observe(node);
    });

    scheduleViewportReveal();

    let revealFrame = 0;
    const requestViewportReveal = () => {
      if (revealFrame) return;
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = 0;
        releaseViewportReveals();
      });
    };

    window.addEventListener("scroll", requestViewportReveal, { passive: true });
    window.addEventListener("resize", requestViewportReveal);
    window.addEventListener("load", requestViewportReveal);
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function revealMotionTargets(targets) {
    const nodes = targets.filter(Boolean);
    if (!nodes.length) return;

    const revealNode = (node) => node.classList.add("is-motion-visible");
    const initialHash = window.location.hash;
    const shouldDelayHero = !initialHash || initialHash === "#visual-files";
    const shouldDeferHomeHero = shouldDelayHero || isIntroPending();

    const deferredHeroNodes = nodes.filter((node) => shouldDeferHomeHero && node.closest("#visual-files"));
    const deferredHeroNodeSet = new Set(deferredHeroNodes);
    if (deferredHeroNodes.length) {
      let didRevealDeferredHero = false;
      let heroIntroObserver = null;
      const revealDeferredHero = () => {
        if (didRevealDeferredHero) return;
        didRevealDeferredHero = true;
        heroIntroObserver?.disconnect();
        window.requestAnimationFrame(() => {
          deferredHeroNodes.forEach(revealNode);
        });
      };
      if (isIntroPending()) {
        window.addEventListener("portfolio:intro-complete", revealDeferredHero, { once: true });
        heroIntroObserver = new MutationObserver(() => {
          if (!isIntroPending()) revealDeferredHero();
        });
        [document.documentElement, document.body, document.querySelector(".portfolio-intro")]
          .filter(Boolean)
          .forEach((node) => heroIntroObserver.observe(node, { attributes: true, attributeFilter: ["class"] }));
        [8840, 9180, 9800].forEach((delay) => {
          window.setTimeout(() => {
            if (!isIntroPending()) revealDeferredHero();
          }, delay);
        });
      } else {
        revealDeferredHero();
      }
    }

    const observedNodes = nodes.filter((node) => !deferredHeroNodeSet.has(node));
    if (!observedNodes.length) return;

    if (!("IntersectionObserver" in window)) {
      observedNodes.forEach(revealNode);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealNode(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.22, rootMargin: "0px 0px -10% 0px" });

    observedNodes.forEach((node) => observer.observe(node));
  }

  function splitMotionText(node) {
    if (!node || node.dataset.motionSplitReady === "true") return null;
    const source = (node.textContent || "").replace(/\s+/g, " ").trim();
    if (!source) return null;

    node.dataset.motionSplitReady = "true";
    node.classList.add("motion-split");
    node.setAttribute("aria-label", source);
    node.style.setProperty("--motion-count", String(Array.from(source).length));
    node.textContent = "";

    Array.from(source).forEach((char, index) => {
      const span = document.createElement("span");
      span.className = char.trim() ? "motion-char" : "motion-char motion-char--space";
      span.style.setProperty("--motion-index", index);
      span.setAttribute("aria-hidden", "true");
      span.textContent = char === " " ? "\u00a0" : char;
      node.appendChild(span);
    });

    return node;
  }

  function initMotionSplitAndContent() {
    const splitTargets = [
      "#visual-files .portfolio-main-title",
      "#before-visuals .portfolio-profile-film__title h2",
    ].flatMap((selector) => Array.from(document.querySelectorAll(selector))).map(splitMotionText).filter(Boolean);

    const contentTargets = [
      "#visual-files .portfolio-kicker",
      "#visual-files .portfolio-hero__titleline",
      "#before-visuals .portfolio-profile-film__lead",
      "#before-visuals .portfolio-profile-film__intro p",
      "#before-visuals .portfolio-profile-film__philosophy p",
    ].flatMap((selector) => Array.from(document.querySelectorAll(selector)));

    const frameTargets = Array.from(document.querySelectorAll("#visual-files .motion-hero-frame"));

    contentTargets.forEach((node, index) => {
      if (node.dataset.motionContentReady === "true") return;
      node.dataset.motionContentReady = "true";
      node.classList.add("motion-content");
      node.style.setProperty("--motion-index", index);
    });

    frameTargets.forEach((node) => {
      if (node.dataset.motionFrameReady === "true") return;
      node.dataset.motionFrameReady = "true";
    });

    revealMotionTargets([...frameTargets, ...splitTargets, ...contentTargets]);
  }

  function bindPointerSurface(target, options = {}) {
    if (!target || target.dataset.motionPointerReady === "true") return;
    target.dataset.motionPointerReady = "true";
    if (options.depth) target.classList.add("motion-depth-surface");

    let frame = 0;
    let pendingPoint = null;
    const maxTilt = options.maxTilt || 2.4;

    const applyPointer = () => {
      frame = 0;
      if (!pendingPoint) return;
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = Math.max(0, Math.min(1, (pendingPoint.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (pendingPoint.clientY - rect.top) / rect.height));
      const tiltX = (0.5 - y) * maxTilt;
      const tiltY = (x - 0.5) * maxTilt;

      target.style.setProperty("--motion-tilt-x", `${tiltX.toFixed(2)}deg`);
      target.style.setProperty("--motion-tilt-y", `${tiltY.toFixed(2)}deg`);
      target.classList.add("is-pointer-active");
    };

    target.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      pendingPoint = { clientX: event.clientX, clientY: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(applyPointer);
    });

    const resetPointer = () => {
      pendingPoint = null;
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      target.classList.remove("is-pointer-active");
      target.style.removeProperty("--motion-tilt-x");
      target.style.removeProperty("--motion-tilt-y");
    };

    target.addEventListener("pointerleave", resetPointer);
    target.addEventListener("pointercancel", resetPointer);
  }

  function initPointerDepthMotion() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    [
      "#visual-system .xiaomi-hover-card",
      "#film-storyboard .portfolio-storyboard-card",
      "#other-works .portfolio-other-works__light-card",
    ].flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .forEach((node) => bindPointerSurface(node, { depth: true, maxTilt: 2.2 }));
  }

  function bindStoryboardBorderGlow(target, options = {}) {
    if (!target || target.dataset.storyboardGlowReady === "true") return;
    target.dataset.storyboardGlowReady = "true";
    target.classList.add("border-glow-card");
    target.classList.add(options.quiet ? "border-glow-card--quiet" : "border-glow-card--storyboard");

    let edgeLight = target.querySelector(":scope > .edge-light");
    if (!edgeLight) {
      edgeLight = document.createElement("span");
      edgeLight.className = "edge-light";
      edgeLight.setAttribute("aria-hidden", "true");
    }

    let inner = target.querySelector(":scope > .border-glow-inner");
    if (!inner) {
      inner = document.createElement("div");
      inner.className = "border-glow-inner";
    }

    Array.from(target.childNodes)
      .filter((node) => node !== edgeLight && node !== inner)
      .forEach((node) => inner.appendChild(node));

    if (edgeLight.parentNode !== target) target.prepend(edgeLight);
    if (inner.parentNode !== target) target.appendChild(inner);

    const glowColor = options.glowColor || "40 80 80";
    const glowIntensity = options.glowIntensity || 1;
    const colors = options.colors || ["rgba(232, 211, 169, 0.95)", "rgba(250, 242, 226, 0.82)", "rgba(45, 132, 158, 0.5)"];
    const opacities = [100, 60, 50, 40, 30, 20, 10];
    const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
    const colorMap = [0, 1, 2, 0, 1, 2, 1];
    const gradientPositions = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
    const gradientKeys = [
      "--gradient-one",
      "--gradient-two",
      "--gradient-three",
      "--gradient-four",
      "--gradient-five",
      "--gradient-six",
      "--gradient-seven",
    ];
    const colorParts = String(glowColor).match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
    const hslBase = colorParts ? `${parseFloat(colorParts[1])}deg ${parseFloat(colorParts[2])}% ${parseFloat(colorParts[3])}%` : "40deg 80% 80%";
    opacities.forEach((opacity, index) => {
      target.style.setProperty(`--glow-color${keys[index]}`, `hsl(${hslBase} / ${Math.min(opacity * glowIntensity, 100)}%)`);
    });
    gradientKeys.forEach((key, index) => {
      const color = colors[Math.min(colorMap[index], colors.length - 1)];
      target.style.setProperty(key, `radial-gradient(at ${gradientPositions[index]}, ${color} 0px, transparent 50%)`);
    });
    target.style.setProperty("--gradient-base", `linear-gradient(${colors[0]} 0 100%)`);
    target.style.setProperty("--card-bg", options.backgroundColor || "rgba(5, 4, 3, 0.74)");
    const edgeSensitivity = Number(options.edgeSensitivity || 30);
    const colorSensitivity = Number(options.colorSensitivity || edgeSensitivity + 20);
    const fillOpacity = Number(options.fillOpacity ?? 0.5);
    target.style.setProperty("--edge-sensitivity", edgeSensitivity);
    target.style.setProperty("--color-sensitivity", colorSensitivity);
    target.style.setProperty("--border-radius", `${options.borderRadius || 8}px`);
    target.style.setProperty("--glow-padding", `${options.glowRadius || 40}px`);
    target.style.setProperty("--cone-spread", options.coneSpread || 25);
    target.style.setProperty("--fill-opacity", fillOpacity);

    let frame = 0;
    let pendingPoint = null;
    const clamp01 = (value) => Math.max(0, Math.min(1, value));

    const applyGlow = () => {
      frame = 0;
      if (!pendingPoint) return;
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = pendingPoint.clientX - rect.left;
      const y = pendingPoint.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
      const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      const edgeValue = edge * 100;
      const edgeAlpha = clamp01((edgeValue - edgeSensitivity) / (100 - edgeSensitivity));
      const colorAlpha = clamp01((edgeValue - colorSensitivity) / (100 - colorSensitivity));
      const fillAlpha = clamp01(fillOpacity * colorAlpha);

      target.style.setProperty("--edge-proximity", `${edgeValue.toFixed(3)}`);
      target.style.setProperty("--edge-alpha", edgeAlpha.toFixed(3));
      target.style.setProperty("--color-alpha", colorAlpha.toFixed(3));
      target.style.setProperty("--fill-alpha", fillAlpha.toFixed(3));
      target.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
      target.classList.add("is-border-glowing");
    };

    target.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      pendingPoint = { clientX: event.clientX, clientY: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(applyGlow);
    });

    const resetGlow = () => {
      pendingPoint = null;
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      target.classList.remove("is-border-glowing");
      target.style.setProperty("--edge-proximity", "0");
      target.style.setProperty("--edge-alpha", "0");
      target.style.setProperty("--color-alpha", "0");
      target.style.setProperty("--fill-alpha", "0");
    };

    target.addEventListener("pointerleave", resetGlow);
    target.addEventListener("pointercancel", resetGlow);
  }

  function initStoryboardBorderGlow() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.querySelectorAll("#film-storyboard .portfolio-storyboard-card")
      .forEach((node) => bindStoryboardBorderGlow(node, {
        glowColor: "40 80 80",
        backgroundColor: "rgba(5, 4, 3, 0.82)",
        edgeSensitivity: 30,
        borderRadius: 8,
        glowRadius: 40,
        glowIntensity: 1,
        coneSpread: 25,
        colors: ["rgba(232, 211, 169, 0.95)", "rgba(250, 242, 226, 0.82)", "rgba(45, 132, 158, 0.5)"],
        fillOpacity: 0.34,
      }));
    document.querySelectorAll("#film-storyboard .portfolio-prompt-console")
      .forEach((node) => bindStoryboardBorderGlow(node, {
        quiet: true,
        glowColor: "40 80 80",
        backgroundColor: "rgba(5, 4, 3, 0.72)",
        edgeSensitivity: 42,
        borderRadius: 8,
        glowRadius: 22,
        glowIntensity: 0.42,
        coneSpread: 18,
        colors: ["rgba(232, 211, 169, 0.34)", "rgba(250, 242, 226, 0.24)", "rgba(45, 132, 158, 0.16)"],
        fillOpacity: 0.18,
      }));
  }

  function bindMagnetTarget(target) {
    if (!target || target.dataset.motionMagnetReady === "true") return;
    target.dataset.motionMagnetReady = "true";
    target.classList.add("motion-magnet");

    let frame = 0;
    let pendingPoint = null;

    const applyMagnet = () => {
      frame = 0;
      if (!pendingPoint) return;
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = (pendingPoint.clientX - rect.left) / rect.width - 0.5;
      const y = (pendingPoint.clientY - rect.top) / rect.height - 0.5;
      target.style.setProperty("--magnet-x", `${(x * 8).toFixed(2)}px`);
      target.style.setProperty("--magnet-y", `${(y * 8).toFixed(2)}px`);
      target.classList.add("is-magnet-active");
    };

    target.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      pendingPoint = { clientX: event.clientX, clientY: event.clientY };
      if (!frame) frame = window.requestAnimationFrame(applyMagnet);
    });

    const resetMagnet = () => {
      pendingPoint = null;
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      target.classList.remove("is-magnet-active");
      target.style.removeProperty("--magnet-x");
      target.style.removeProperty("--magnet-y");
    };

    target.addEventListener("pointerleave", resetMagnet);
    target.addEventListener("pointercancel", resetMagnet);
  }

  function initLightMagnetMotion() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    [
      ".xiaomi-carousel__arrows button",
      ".portfolio-bgm-toggle",
    ].flatMap((selector) => Array.from(document.querySelectorAll(selector)))
      .forEach(bindMagnetTarget);
  }

  function initScrollVelocityAccents() {
    const accentSections = ["#film-storyboard"]
      .map((selector) => document.querySelector(selector))
      .filter(Boolean);
    if (!accentSections.length) return;

    accentSections.forEach((section) => section.classList.add("motion-scroll-accent"));

    let lastY = window.scrollY;
    let frame = 0;
    let settleTimer = 0;

    const setVelocity = (value) => {
      accentSections.forEach((section) => {
        section.style.setProperty("--motion-scroll-velocity", value.toFixed(3));
      });
    };

    const updateVelocity = () => {
      frame = 0;
      const nextY = window.scrollY;
      const delta = nextY - lastY;
      lastY = nextY;
      const velocity = Math.max(-1, Math.min(1, delta / 56));
      setVelocity(velocity);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => setVelocity(0), 140);
    };

    window.addEventListener("scroll", () => {
      if (!frame) frame = window.requestAnimationFrame(updateVelocity);
    }, { passive: true });
  }

  function initReactBitsMotionPolish() {
    if (prefersReducedMotion()) return;
    initMotionSplitAndContent();
    initPointerDepthMotion();
    initStoryboardBorderGlow();
    initLightMagnetMotion();
    initScrollVelocityAccents();
  }

  function initActiveNav() {
    const navLinks = Array.from(document.querySelectorAll(".portfolio-nav-link"));
    const subLinks = Array.from(document.querySelectorAll(".portfolio-nav-subitem"));
    const targetItems = sections.flatMap((item) => [
      { id: item.id, parentId: item.id },
      ...(item.children || []).map((child) => ({ id: child.id, parentId: item.id })),
    ]);
    const targets = targetItems
      .map((item) => ({ ...item, node: document.getElementById(item.id) }))
      .filter((item) => item.node);
    if (!targets.length || !navLinks.length) return;

    let ticking = false;

    function updateActiveNav() {
      const lockedTargetId = getNavActiveTarget();
      const marker = window.scrollY + window.innerHeight * 0.5;
      let current = lockedTargetId ? targets.find((target) => target.id === lockedTargetId) : null;
      if (!current && lockedTargetId) {
        current = targets.find((target) => target.parentId === lockedTargetId);
      }
      if (!current) current = targets[0];

      if (!lockedTargetId) {
        targets.forEach((target) => {
          const top = target.node.getBoundingClientRect().top + window.scrollY;
          if (top <= marker) current = target;
        });
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.target === current.parentId);
      });
      subLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.target === current.id);
      });
      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActiveNav);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);
    updateActiveNav();
  }

  // Intro exit and shared interaction helpers
  function setActiveButton(buttons, index) {
    buttons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle("is-active", isActive);
      if (button.getAttribute("role") === "tab") {
        button.setAttribute("aria-selected", isActive ? "true" : "false");
        button.tabIndex = isActive ? 0 : -1;
        if (isActive && button.id) {
          const panel = document.getElementById(button.getAttribute("aria-controls") || "");
          panel?.setAttribute("aria-labelledby", button.id);
        }
      }
    });
  }

  // Gallery, carousel, and accordion interactions
  function initColorStages() {
    document.querySelectorAll("[data-xiaomi-color-stage]").forEach((stage) => {
      const image = stage.querySelector("[data-color-image]");
      const nextImage = stage.querySelector("[data-color-image-next]");
      const title = stage.querySelector("[data-color-title]");
      const desc = stage.querySelector("[data-color-desc]");
      const buttons = Array.from(stage.querySelectorAll("[data-color-option]"));
      let activeIndex = 0;
      let fadeTimer = 0;

      const finishFade = (option) => {
        image.src = originalImage(option.main);
        image.alt = option.title;
        nextImage?.classList.remove("is-active");
        stage.classList.remove("is-fading");
      };

      const activateColorOption = (index, shouldFocus = false) => {
        const option = designToneOptions[index];
        if (!option) return;
        if (shouldFocus) buttons[index]?.focus();
        if (index === activeIndex) return;
        activeIndex = index;
        window.clearTimeout(fadeTimer);

        if (nextImage) {
          const nextSrc = originalImage(option.main);
          nextImage.classList.remove("is-active");
          nextImage.src = nextSrc;
          nextImage.alt = "";
          stage.classList.add("is-fading");

          const startFade = () => {
            window.requestAnimationFrame(() => nextImage.classList.add("is-active"));
            fadeTimer = window.setTimeout(() => finishFade(option), 720);
          };
          const handleImageError = () => {
            finishFade(option);
          };

          if (nextImage.complete && nextImage.naturalWidth > 0) {
            startFade();
          } else if (nextImage.complete) {
            finishFade(option);
          } else {
            nextImage.addEventListener("load", startFade, { once: true });
            nextImage.addEventListener("error", handleImageError, { once: true });
          }
        } else {
          image.src = originalImage(option.main);
          image.alt = option.title;
        }

        title.textContent = option.title;
        desc.textContent = option.desc;
        setActiveButton(buttons, index);
      };

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          activateColorOption(Number(button.dataset.index || 0));
        });
        button.addEventListener("keydown", (event) => {
          const keyMap = {
            ArrowRight: 1,
            ArrowDown: 1,
            ArrowLeft: -1,
            ArrowUp: -1,
          };
          if (event.key === "Home") {
            event.preventDefault();
            activateColorOption(0, true);
          } else if (event.key === "End") {
            event.preventDefault();
            activateColorOption(buttons.length - 1, true);
          } else if (Object.prototype.hasOwnProperty.call(keyMap, event.key)) {
            event.preventDefault();
            const nextIndex = (activeIndex + keyMap[event.key] + buttons.length) % buttons.length;
            activateColorOption(nextIndex, true);
          }
        });
      });
    });
  }

  function initLoopingCarousel(root, length, onChange) {
    if (!root || !length) return;
    let index = 0;
    const progress = Array.from(root.querySelectorAll("[data-go]"));
    const prev = root.querySelector("[data-prev]");
    const next = root.querySelector("[data-next]");
    const setIndex = (nextIndex) => {
      index = (nextIndex + length) % length;
      setActiveButton(progress, index);
      onChange(index);
    };

    progress.forEach((button) => {
      button.addEventListener("click", () => setIndex(Number(button.dataset.go || 0)));
    });
    prev?.addEventListener("click", () => setIndex(index - 1));
    next?.addEventListener("click", () => setIndex(index + 1));
    setIndex(0);
  }

  function initHoverCarousels() {
    document.querySelectorAll("[data-xiaomi-carousel]").forEach((carousel) => {
      const track = carousel.querySelector("[data-carousel-track]");
      const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
      const realSlides = slides.filter((slide) => slide.dataset.slide === "real");
      if (!track || !realSlides.length) return;

      const realLength = realSlides.length;
      const loopStart = slides.findIndex((slide) => slide.dataset.slide === "real");
      const canLoop = loopStart > 0 && slides.length > realLength;
      const reduceMotion = prefersReducedMotion();
      let visualIndex = canLoop ? loopStart : 0;
      let realIndex = 0;
      let isJumping = false;
      let resizeFrame = 0;

      const progress = Array.from(carousel.querySelectorAll("[data-go]"));
      const prev = carousel.querySelector("[data-prev]");
      const next = carousel.querySelector("[data-next]");

      const normalizeRealIndex = (nextIndex) => (nextIndex + realLength) % realLength;
      const slideRealIndex = (slide) => normalizeRealIndex(Number(slide?.dataset.realIndex || 0));

      const centerSlide = (slide) => {
        if (!slide) return;
        const viewportWidth = track.parentElement.clientWidth || window.innerWidth;
        const cardWidth = slide.getBoundingClientRect().width;
        const offset = Math.max(0, slide.offsetLeft - track.offsetLeft - (viewportWidth - cardWidth) / 2);
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      };

      const setCurrent = (nextRealIndex, currentVisualIndex = visualIndex) => {
        setActiveButton(progress, nextRealIndex);
        slides.forEach((item, itemIndex) => {
          item.classList.toggle("is-current", itemIndex === currentVisualIndex);
        });
      };

      const setVisualIndex = (nextVisualIndex, options = {}) => {
        const { animate = true } = options;
        const slide = slides[nextVisualIndex];
        if (!slide) return;
        visualIndex = nextVisualIndex;
        realIndex = slideRealIndex(slide);
        setCurrent(realIndex, visualIndex);

        if (!animate) {
          isJumping = true;
          track.classList.add("is-loop-jump");
        }

        centerSlide(slide);

        if (!animate) {
          void track.offsetWidth;
          track.classList.remove("is-loop-jump");
          isJumping = false;
        }
      };

      const goToRealIndex = (nextRealIndex) => {
        const normalized = normalizeRealIndex(nextRealIndex);
        const targetVisual = canLoop ? loopStart + normalized : normalized;
        setVisualIndex(targetVisual, { animate: !reduceMotion });
      };

      const goBy = (delta) => {
        if (reduceMotion) {
          goToRealIndex(realIndex + delta);
          return;
        }
        setVisualIndex(visualIndex + delta);
      };

      progress.forEach((button) => {
        button.addEventListener("click", () => goToRealIndex(Number(button.dataset.go || 0)));
      });
      prev?.addEventListener("click", () => goBy(-1));
      next?.addEventListener("click", () => goBy(1));

      track.addEventListener("transitionend", (event) => {
        if (event.target !== track || event.propertyName !== "transform" || isJumping || !canLoop) return;
        const currentSlide = slides[visualIndex];
        if (!currentSlide || currentSlide.dataset.slide === "real") return;
        setVisualIndex(loopStart + realIndex, { animate: false });
      });

      window.addEventListener("resize", () => {
        window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => setVisualIndex(visualIndex, { animate: false }));
      });

      setVisualIndex(visualIndex, { animate: false });
    });
  }

  function initDualGalleries() {
    document.querySelectorAll("[data-xiaomi-dual-gallery]").forEach((gallery) => {
      const big = Array.from(gallery.querySelectorAll("[data-gallery-big]"));
      const small = Array.from(gallery.querySelectorAll("[data-gallery-small]"));
      initLoopingCarousel(gallery, Math.max(big.length, small.length), (index) => {
        big.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
        small.forEach((item, itemIndex) => item.classList.toggle("is-active", itemIndex === index));
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-xiaomi-accordion]").forEach((accordion) => {
      const buttons = Array.from(accordion.querySelectorAll("[data-accordion-item]"));
      const images = Array.from(accordion.querySelectorAll("[data-accordion-image]"));
      let transitionTimer = 0;

      const syncCopyHeights = () => {
        buttons.forEach((button) => {
          const copy = button.querySelector("em");
          if (!copy) return;
          button.style.setProperty("--accordion-copy-height", `${copy.scrollHeight}px`);
        });
      };

      const markTransitioning = () => {
        accordion.classList.add("is-transitioning");
        window.clearTimeout(transitionTimer);
        transitionTimer = window.setTimeout(() => accordion.classList.remove("is-transitioning"), 430);
      };

      syncCopyHeights();
      window.addEventListener("resize", syncCopyHeights);

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.index || 0);
          if (button.classList.contains("is-active")) return;
          syncCopyHeights();
          markTransitioning();
          accordion.dataset.activeIndex = String(index);
          setActiveButton(buttons, index);
          images.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === index));
        });
      });
    });
  }

  function initReversibleTitleReveal() {
    const targets = Array.from(document.querySelectorAll("[data-reversible-title]"));
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
          entry.target.classList.toggle("is-title-locked", entry.isIntersecting);
        });
      },
      { threshold: 0.08, rootMargin: "-18% 0px -42% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
  }

  function initProductComparisons() {
    document.querySelectorAll("[data-compare-slider]").forEach((slider) => {
      const card = slider.closest(".portfolio-product-card");
      const update = () => card?.style.setProperty("--split", `${slider.value}%`);
      slider.addEventListener("input", update);
      update();
    });
  }

  function initProductFusionScrub() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll("[data-fusion-scrub]").forEach((media) => {
      const card = media.closest(".portfolio-product-card--hover-fusion");
      if (!card) return;
      let activePointerId = null;
      let isHovering = false;
      let pendingClientX = null;
      let animationFrame = null;
      let activeRect = null;

      const commitScrubPosition = () => {
        animationFrame = null;
        if (pendingClientX === null) return;
        const rect = activeRect || media.getBoundingClientRect();
        const progress = rect.width ? ((pendingClientX - rect.left) / rect.width) * 100 : 50;
        const clamped = Math.min(100, Math.max(0, progress));
        card.style.setProperty("--fusion-x", `${clamped.toFixed(2)}%`);
        pendingClientX = null;
      };

      const setScrubPosition = (clientX) => {
        pendingClientX = clientX;
        if (animationFrame === null) {
          animationFrame = window.requestAnimationFrame(commitScrubPosition);
        }
      };

      const startScrub = (event) => {
        activeRect = media.getBoundingClientRect();
        card.classList.add("is-scrubbing");
        setScrubPosition(event.clientX);
      };

      const updateScrub = (event) => {
        if (activePointerId !== null && event.pointerId !== activePointerId) return;
        if (activePointerId === null && !isHovering) return;
        if (!activeRect) activeRect = media.getBoundingClientRect();
        if (!card.classList.contains("is-scrubbing")) card.classList.add("is-scrubbing");
        setScrubPosition(event.clientX);
      };

      const resetScrub = () => {
        activePointerId = null;
        isHovering = false;
        activeRect = null;
        card.classList.remove("is-scrubbing");
        pendingClientX = null;
        if (animationFrame !== null) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        }
        card.style.setProperty("--fusion-x", "50%");
      };

      const startHoverScrub = (event) => {
        if (event.pointerType === "touch") return;
        isHovering = true;
        startScrub(event);
      };

      const stopHoverScrub = () => {
        isHovering = false;
        if (activePointerId === null) resetScrub();
      };

      const finishPointerScrub = (event) => {
        if (activePointerId !== null && event?.pointerId !== activePointerId) return;
        activePointerId = null;
        activeRect = isHovering ? media.getBoundingClientRect() : null;
        if (!isHovering) resetScrub();
      };

      if (window.PointerEvent) {
        media.addEventListener("pointerenter", startHoverScrub, { passive: true });

        media.addEventListener("pointermove", (event) => {
          updateScrub(event);
        }, { passive: true });

        media.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          activePointerId = event.pointerId;
          isHovering = true;
          if (media.setPointerCapture) media.setPointerCapture(event.pointerId);
          startScrub(event);
        });

        media.addEventListener("pointerup", (event) => {
          if (activePointerId !== null && event.pointerId !== activePointerId) return;
          if (media.releasePointerCapture && activePointerId !== null) {
            media.releasePointerCapture(activePointerId);
          }
          finishPointerScrub(event);
        });

        media.addEventListener("pointercancel", resetScrub);
        media.addEventListener("lostpointercapture", (event) => {
          if (activePointerId !== null && event.pointerId === activePointerId) finishPointerScrub(event);
        });
        media.addEventListener("pointerleave", stopHoverScrub);
      } else {
        media.addEventListener("mouseenter", startHoverScrub);
        media.addEventListener("mousemove", updateScrub, { passive: true });
        media.addEventListener("mouseleave", stopHoverScrub);
        media.addEventListener("mousedown", (event) => {
          event.preventDefault();
          isHovering = true;
          startScrub(event);
        });
        document.addEventListener("mouseup", () => {
          if (!isHovering) resetScrub();
        });
      }

      card.addEventListener("focus", () => {
        card.style.setProperty("--fusion-x", "50%");
      });
    });
  }

  function initTransplantedInteractions() {
    initColorStages();
    initHoverCarousels();
    initDualGalleries();
    initAccordions();
    initProductComparisons();
    initProductFusionScrub();
  }

  // Other works exhibition interactions
  function initOtherWorksMotion() {
    const section = document.getElementById("other-works");
    if (!section) return;

    const posterStage = section.querySelector("#other-works-posters");
    const lightStage = section.querySelector("#other-works-light-table");
    const POSTER_AUTO_INTERVAL = 2600;
    const POSTER_MANUAL_PAUSE = 6000;
    const LIGHT_RAIL_SPEED = 160;
    const LIGHT_SPEED_STEPS = [0.65, 1, 1.45, 2, 2.6];
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const isReducedMotion = () => reducedQuery.matches;
    const isMobileFlow = () => mobileQuery.matches;
    const canObserveMotion = "IntersectionObserver" in window;
    const posterCards = Array.from(section.querySelectorAll("[data-poster-card]"));
    const posterControls = Array.from(section.querySelectorAll("[data-poster-control]"));
    const posterMeta = section.querySelector("[data-poster-meta]");
    const posterTitle = section.querySelector("[data-poster-title]");
    const posterNote = section.querySelector("[data-poster-note]");
    const lightDeck = section.querySelector("[data-light-deck]");
    const lightSet = section.querySelector("[data-light-set]");
    const lightControls = section.querySelector("[data-light-controls]");
    const lightSpeedButtons = Array.from(section.querySelectorAll("[data-light-speed]"));
    const lightToggle = section.querySelector("[data-light-toggle]");
    const lightToggleIcon = section.querySelector("[data-light-toggle-icon]");
    const lightToggleLabel = section.querySelector("[data-light-toggle-label]");
    const lightSpeedLabel = section.querySelector("[data-light-speed-label]");
    let activePoster = 0;
    let posterTimer = null;
    let posterResumeTimer = null;
    let posterResumeAt = 0;
    let posterStageVisible = !canObserveMotion;
    let lightSpeedIndex = 1;
    let lightPaused = false;
    let lightLoopDistance = 0;
    let lightStageVisible = !canObserveMotion;

    if (posterStage) posterStage.classList.toggle("is-motion-paused", !posterStageVisible);
    if (lightStage) lightStage.classList.toggle("is-motion-paused", !lightStageVisible);

    const normalizedOffset = (index, active, total) => {
      let offset = index - active;
      if (offset > total / 2) offset -= total;
      if (offset < total / -2) offset += total;
      return offset;
    };

    const setPoster = (nextIndex) => {
      if (!posterCards.length) return;
      activePoster = (nextIndex + posterCards.length) % posterCards.length;
      posterCards.forEach((card, index) => {
        const offset = normalizedOffset(index, activePoster, posterCards.length);
        const distance = Math.abs(offset);
        card.style.setProperty("--poster-offset", offset);
        card.classList.toggle("is-active", offset === 0);
        card.dataset.posterState = offset === 0 ? "active" : distance === 1 ? "near" : distance === 2 ? "far" : distance === 3 ? "outer" : "hidden";
        card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
      });

      const activeCard = posterCards[activePoster];
      if (posterMeta) posterMeta.textContent = activeCard?.dataset.meta || "";
      if (posterTitle) posterTitle.textContent = activeCard?.dataset.title || "";
      if (posterNote) posterNote.textContent = activeCard?.dataset.note || "";
    };

    const stopPosterAuto = () => {
      if (!posterTimer) return;
      window.clearInterval(posterTimer);
      posterTimer = null;
    };

    const clearPosterResumeTimer = () => {
      if (!posterResumeTimer) return;
      window.clearTimeout(posterResumeTimer);
      posterResumeTimer = null;
    };

    const schedulePosterAuto = (delay = 0) => {
      clearPosterResumeTimer();
      if (isReducedMotion() || isMobileFlow() || !posterStageVisible) return;
      if (delay <= 0) {
        startPosterAuto();
        return;
      }
      posterResumeTimer = window.setTimeout(() => {
        posterResumeTimer = null;
        startPosterAuto();
      }, delay);
    };

    const startPosterAuto = () => {
      if (!posterCards.length || isReducedMotion() || isMobileFlow() || posterTimer || !posterStageVisible) return;
      posterTimer = window.setInterval(() => setPoster(activePoster + 1), POSTER_AUTO_INTERVAL);
      posterResumeAt = 0;
    };

    const pausePosterAuto = (duration = POSTER_MANUAL_PAUSE) => {
      stopPosterAuto();
      clearPosterResumeTimer();
      if (isReducedMotion() || isMobileFlow()) {
        posterResumeAt = 0;
        return;
      }
      posterResumeAt = window.performance.now() + duration;
      schedulePosterAuto(duration);
    };

    const setPosterStageVisible = (isVisible) => {
      posterStageVisible = isVisible;
      if (posterStage) posterStage.classList.toggle("is-motion-paused", !isVisible);
      if (!isVisible) {
        stopPosterAuto();
        clearPosterResumeTimer();
        return;
      }

      const remainingPause = posterResumeAt - window.performance.now();
      schedulePosterAuto(remainingPause > 0 ? remainingPause : 0);
    };

    setPoster(0);

    posterControls.forEach((control) => {
      control.addEventListener("click", () => {
        const direction = control.dataset.posterControl === "prev" ? -1 : 1;
        setPoster(activePoster + direction);
        pausePosterAuto();
      });
    });

    startPosterAuto();

    const updateLightControls = () => {
      const multiplier = LIGHT_SPEED_STEPS[lightSpeedIndex] || 1;
      const effectiveLightPaused = lightPaused || !lightStageVisible;
      if (lightDeck) lightDeck.classList.toggle("is-paused", effectiveLightPaused);
      if (lightStage) lightStage.classList.toggle("is-motion-paused", !lightStageVisible);
      if (lightControls) lightControls.classList.toggle("is-paused", lightPaused);
      if (lightSpeedLabel) lightSpeedLabel.textContent = `${multiplier.toFixed(multiplier % 1 === 0 ? 0 : 2)}x`;
      lightSpeedButtons.forEach((button) => {
        const direction = button.dataset.lightSpeed;
        const disabled =
          (direction === "slower" && lightSpeedIndex === 0) ||
          (direction === "faster" && lightSpeedIndex === LIGHT_SPEED_STEPS.length - 1);
        button.disabled = disabled;
      });
      if (lightToggle) {
        lightToggle.setAttribute("aria-pressed", lightPaused ? "true" : "false");
        lightToggle.setAttribute(
          "aria-label",
          lightPaused ? content.accessibility.resumeLightCarousel : content.accessibility.pauseLightCarousel
        );
      }
      if (lightToggleIcon) lightToggleIcon.textContent = lightPaused ? "▶" : "Ⅱ";
      if (lightToggleLabel) lightToggleLabel.textContent = lightPaused ? "继续" : "暂停";
    };

    const syncLightRail = () => {
      if (!lightDeck || !lightSet) return;
      const runningStyles = window.getComputedStyle(lightDeck);
      const runningMatrix = runningStyles.transform === "none" ? null : new DOMMatrixReadOnly(runningStyles.transform);
      const currentX = runningMatrix ? runningMatrix.m41 : 0;
      const currentDistance = lightLoopDistance || parseFloat(runningStyles.getPropertyValue("--light-loop-distance")) || 0;
      const currentProgress = currentDistance ? ((-currentX % currentDistance) + currentDistance) % currentDistance / currentDistance : 0;

      if (isReducedMotion() || isMobileFlow()) {
        lightDeck.classList.remove("is-running");
        lightDeck.style.setProperty("--light-loop-distance", "0px");
        lightDeck.style.setProperty("--light-loop-duration", "1s");
        lightDeck.style.setProperty("--light-loop-delay", "0s");
        lightDeck.classList.remove("is-paused");
        lightLoopDistance = 0;
        if (lightControls) lightControls.hidden = true;
        return;
      }
      if (lightControls) lightControls.hidden = false;

      const deckStyles = window.getComputedStyle(lightDeck);
      const deckGap = parseFloat(deckStyles.columnGap || deckStyles.gap || "0") || 0;
      const setWidth = lightSet.getBoundingClientRect().width || 0;
      const distance = setWidth + deckGap;
      if (!distance) return;

      const lightSpeed = LIGHT_RAIL_SPEED * (LIGHT_SPEED_STEPS[lightSpeedIndex] || 1);
      const duration = Math.max(10, distance / lightSpeed);
      const delay = -currentProgress * duration;
      lightDeck.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      lightDeck.classList.remove("is-running");
      lightDeck.style.setProperty("--light-loop-distance", `${distance.toFixed(2)}px`);
      lightDeck.style.setProperty("--light-loop-duration", `${duration.toFixed(2)}s`);
      lightDeck.style.setProperty("--light-loop-delay", `${delay.toFixed(2)}s`);
      void lightDeck.offsetWidth;
      lightDeck.classList.add("is-running");
      lightDeck.style.removeProperty("transform");
      lightLoopDistance = distance;
      updateLightControls();
    };

    lightSpeedButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.dataset.lightSpeed === "faster" ? 1 : -1;
        lightSpeedIndex = clamp(lightSpeedIndex + direction, 0, LIGHT_SPEED_STEPS.length - 1);
        syncLightRail();
      });
    });

    if (lightToggle) {
      lightToggle.addEventListener("click", () => {
        lightPaused = !lightPaused;
        updateLightControls();
      });
    }

    const setLightStageVisible = (isVisible) => {
      lightStageVisible = isVisible;
      if (lightStage) lightStage.classList.toggle("is-motion-paused", !isVisible);
      updateLightControls();
      if (isVisible) syncLightRail();
    };

    if (canObserveMotion) {
      const motionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target === posterStage) setPosterStageVisible(entry.isIntersecting);
          if (entry.target === lightStage) setLightStageVisible(entry.isIntersecting);
        });
      }, { threshold: 0.01, rootMargin: "22% 0px 22% 0px" });

      if (posterStage) motionObserver.observe(posterStage);
      if (lightStage) motionObserver.observe(lightStage);
    }

    syncLightRail();

    const scenes = Array.from(section.querySelectorAll("[data-other-scene]"));
    if (!scenes.length) return;

    if (isReducedMotion()) {
      scenes.forEach((scene) => scene.classList.add("is-static"));
      return;
    }

    const visibleScenes = new Set();
    let ticking = false;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);
    const aiWallCardCache = new WeakMap();
    const aiWallRowCache = new WeakMap();

    const getAiWallCards = (scene) => {
      if (!aiWallCardCache.has(scene)) {
        aiWallCardCache.set(scene, Array.from(scene.querySelectorAll(".portfolio-other-works__ai-card")));
      }
      return aiWallCardCache.get(scene);
    };

    const getAiWallRows = (scene) => {
      if (aiWallRowCache.has(scene)) return aiWallRowCache.get(scene);

      const rows = new Map();
      getAiWallCards(scene).forEach((card, index) => {
        const styles = window.getComputedStyle(card);
        const row = Number(card.style.getPropertyValue("--ai-row-start"))
          || Number(styles.getPropertyValue("--ai-row-start"))
          || Math.floor(index / 4) + 1;
        const col = Number(card.style.getPropertyValue("--ai-col-start"))
          || Number(styles.getPropertyValue("--ai-col-start"))
          || (index % 4) + 1;
        if (!rows.has(row)) rows.set(row, []);
        rows.get(row).push({ card, index, col });
      });

      const orderedRows = Array.from(rows.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([row, items]) => ({
          row,
          items: items.sort((a, b) => a.col - b.col || a.index - b.index),
          revealed: false,
          animating: false,
        }));

      aiWallRowCache.set(scene, orderedRows);
      return orderedRows;
    };

    const prepareAiWallRows = (scene) => {
      if (scene.dataset.aiWallRowsReady === "true") return;
      const cards = getAiWallCards(scene);
      if (!cards.length) return;
      scene.dataset.aiWallRowsReady = "true";

      cards.forEach((card) => {
        const styles = window.getComputedStyle(card);
        const brightness = styles.getPropertyValue("--ai-card-brightness").trim() || "0.92";
        const saturate = styles.getPropertyValue("--ai-card-saturate").trim() || "0.96";

        card.dataset.aiWallRowReady = "true";
        card.style.setProperty("--masonry-x", "0px");
        card.style.setProperty("--masonry-y", "78px");
        card.style.setProperty("--masonry-rotate", "0deg");
        card.style.setProperty("--masonry-scale", "0.985");
        card.style.setProperty("--masonry-opacity", "0");
        card.style.setProperty("--masonry-blur", "8px");
        card.style.setProperty("--masonry-delay", "0ms");
        card.style.transition = "none";
        card.style.transform = "translate3d(0, 78px, 0) scale(0.985)";
        card.style.opacity = "0";
        card.style.filter = `brightness(${brightness}) saturate(${saturate}) blur(8px)`;
      });
    };

    const revealAiWallRow = (rowState) => {
      if (!rowState || rowState.revealed || rowState.animating) return;
      rowState.revealed = true;
      rowState.animating = true;

      const states = rowState.items.map(({ card }, indexInRow) => {
        const styles = window.getComputedStyle(card);
        const baseOpacity = parseFloat(styles.getPropertyValue("--ai-card-opacity")) || 0.94;
        const brightness = styles.getPropertyValue("--ai-card-brightness").trim() || "0.92";
        const saturate = styles.getPropertyValue("--ai-card-saturate").trim() || "0.96";
        const delay = indexInRow * 38;
        const duration = 620;

        card.dataset.aiWallRowAnimating = "true";
        card.style.transition = "none";

        return { card, delay, duration, baseOpacity, brightness, saturate };
      });

      const startedAt = window.performance.now();
      const maxEnd = states.reduce((max, state) => Math.max(max, state.delay + state.duration), 0);

      const finish = () => {
        states.forEach(({ card }) => {
          card.dataset.aiWallRowRevealed = "true";
          delete card.dataset.aiWallRowAnimating;
          card.style.setProperty("--masonry-y", "0px");
          card.style.setProperty("--masonry-scale", "1");
          card.style.setProperty("--masonry-opacity", "1");
          card.style.setProperty("--masonry-blur", "0px");
          card.style.removeProperty("transform");
          card.style.removeProperty("opacity");
          card.style.removeProperty("filter");
          card.style.removeProperty("transition");
        });
        rowState.animating = false;
      };

      const tick = (now) => {
        const elapsed = now - startedAt;
        states.forEach((state) => {
          const local = clamp((elapsed - state.delay) / state.duration, 0, 1);
          const eased = easeOutCubic(local);
          const y = 78 * (1 - eased);
          const scale = 0.985 + eased * 0.015;
          const opacity = state.baseOpacity * eased;
          const blur = 8 * (1 - eased);

          state.card.style.setProperty("--masonry-y", `${y.toFixed(2)}px`);
          state.card.style.setProperty("--masonry-scale", scale.toFixed(4));
          state.card.style.setProperty("--masonry-opacity", local.toFixed(4));
          state.card.style.setProperty("--masonry-blur", `${blur.toFixed(2)}px`);
          state.card.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
          state.card.style.opacity = opacity.toFixed(4);
          state.card.style.filter = `brightness(${state.brightness}) saturate(${state.saturate}) blur(${blur.toFixed(2)}px)`;
        });

        if (elapsed < maxEnd) {
          window.requestAnimationFrame(tick);
        } else {
          finish();
        }
      };

      window.requestAnimationFrame(tick);
    };

    const updateAiWallRows = (scene) => {
      const grid = scene.querySelector(".portfolio-other-works__ai-grid");
      const gridRect = grid?.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      if (!gridRect) return;

      if (gridRect.top <= viewportHeight * 1.08) prepareAiWallRows(scene);
      if (scene.dataset.aiWallRowsReady !== "true") return;

      const triggerLine = viewportHeight * 0.76;
      getAiWallRows(scene).forEach((rowState) => {
        const firstCard = rowState.items[0]?.card;
        if (!firstCard) return;
        const rowTop = gridRect.top + firstCard.offsetTop;
        if (rowTop <= triggerLine) revealAiWallRow(rowState);
      });
    };

    const updateScene = (scene) => {
      const rect = scene.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const raw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const progress = clamp(raw, 0, 1);
      const centerOffset = progress - 0.5;
      const y = centerOffset * -34;
      const spotlight = 1 - Math.abs(centerOffset) * 2;

      scene.style.setProperty("--scene-progress", progress.toFixed(4));
      scene.style.setProperty("--scene-y", `${y.toFixed(2)}px`);
      scene.style.setProperty("--scene-spotlight", clamp(spotlight, 0, 1).toFixed(3));

      if (scene.classList.contains("portfolio-other-works__ai-wall") && !isMobileFlow()) {
        updateAiWallRows(scene);
      }

      if (scene.classList.contains("portfolio-other-works__cinema-strips")) {
        const strips = Array.from(scene.querySelectorAll("[data-cinema-strip]"));
        strips.forEach((strip, index) => {
          const direction = Number(strip.dataset.stripDirection || 1);
          const stripRect = strip.getBoundingClientRect();
          const revealProgress = clamp((viewportHeight - stripRect.top) / (viewportHeight * 0.62), 0, 1);
          const outsideRatio = index % 2 === 0 ? 0.24 : 0.22;
          const revealDistance = Math.min(stripRect.width * outsideRatio, viewportHeight * 0.34);
          const stripShift = isMobileFlow() ? 0 : -direction * (1 - revealProgress) * revealDistance;
          strip.style.setProperty("--strip-shift", `${stripShift.toFixed(2)}px`);
        });
      }
    };

    const update = () => {
      ticking = false;
      const targets = visibleScenes.size ? Array.from(visibleScenes) : scenes;
      targets.forEach(updateScene);
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleScenes.add(entry.target);
            entry.target.classList.add("is-in-view");
          } else {
            visibleScenes.delete(entry.target);
            entry.target.classList.remove("is-in-view");
          }
        });
        requestUpdate();
      }, { threshold: 0.01, rootMargin: "24% 0px 24% 0px" });

      scenes.forEach((scene) => observer.observe(scene));
    } else {
      scenes.forEach((scene) => visibleScenes.add(scene));
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", () => {
      syncLightRail();
      requestUpdate();
    });
    update();
  }

  // Prompt interactions
  function initPromptTyping() {
    const prompts = Array.from(document.querySelectorAll("[data-prompt-input]"));
    if (!prompts.length) return;

    const typePrompt = (target) => {
      if (target.dataset.typed === "true") return;
      target.dataset.typed = "true";
      const text = target.dataset.prompt || "";
      target.textContent = text;
    };

    if (!("IntersectionObserver" in window)) {
      prompts.forEach(typePrompt);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typePrompt(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.42 });

    prompts.forEach((target) => observer.observe(target));
  }

  function resetInitialScroll() {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    let userInteracted = false;
    let userScrolled = false;
    ["wheel", "touchstart"].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        userInteracted = true;
        userScrolled = true;
      }, { once: true, passive: true });
    });
    ["pointerdown", "keydown"].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        userInteracted = true;
      }, { once: true, passive: true });
    });

    const initialHash = window.location.hash;
    const scrollToInitialHash = () => {
      if (!initialHash || (userScrolled && window.scrollY > 24)) return;
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
      scheduleViewportReveal(target);
    };

    if (initialHash) {
      window.requestAnimationFrame(scrollToInitialHash);
      window.setTimeout(scrollToInitialHash, 180);
      window.setTimeout(scrollToInitialHash, 8900);
      window.setTimeout(scrollToInitialHash, 9300);
      window.setTimeout(scrollToInitialHash, 10400);
      return;
    }

    const scrollTop = () => {
      if (!userInteracted) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };
    scrollTop();
    window.requestAnimationFrame(scrollTop);
    window.setTimeout(scrollTop, 120);
    window.setTimeout(scrollTop, 520);
  }

    function initAll() {
      initRevealMotion();
      initReactBitsMotionPolish();
      initReversibleTitleReveal();
      initActiveNav();
      initBgmControl();
      initBrandFilmClickVideo();
      initTransplantedInteractions();
      initOtherWorksMotion();
      initPromptTyping();
      resetInitialScroll();
    }

    return {
      createQuickNav,
      initAll,
    };
  }

  window.portfolioInteractions = {
    create: createPortfolioInteractions,
  };
})();
