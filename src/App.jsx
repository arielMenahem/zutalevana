import { useState, useEffect, useRef, useCallback } from "react";
import he from "./i18n/he.json";
import en from "./i18n/en.json";

const translations = { he, en };

function useT(lang) {
  return useCallback(
    (key) => key.split(".").reduce((o, k) => (o ? o[k] : undefined), translations[lang]) ?? key,
    [lang]
  );
}

/* ── Shared close-on-escape hook ─────────────────── */
function useEscClose(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}

/* ── Lock body scroll ─────────────────────────────── */
function useLockScroll(lock) {
  useEffect(() => {
    document.body.style.overflow = lock ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lock]);
}

/* ══════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════ */
function Modal({ open, onClose, title, children, dir }) {
  useEscClose(open, onClose);
  useLockScroll(open);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      dir={dir}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <h2 id="modal-title" className="text-xl font-bold text-stone-800 mb-1">{title}</h2>
        <div className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">{children}</div>
      </div>
    </div>
  );
}

/* ── Gallery Carousel Modal ─────────────────────── */
function GalleryModal({ open, onClose, images, startIndex, t }) {
  const [idx, setIdx] = useState(startIndex);
  useEscClose(open, onClose);
  useLockScroll(open);

  useEffect(() => { setIdx(startIndex); }, [startIndex]);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft") next();
      if (e.key === "ArrowRight") prev();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-4 end-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
        aria-label="Close gallery"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        onClick={prev}
        className="absolute start-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
        aria-label="Previous image"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex flex-col items-center gap-4 px-16 max-w-2xl w-full">
        <div className="w-full aspect-[4/3] bg-stone-800 rounded-xl overflow-hidden">
          <img
            src={images[idx].src}
            alt={images[idx].alt}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-white text-center font-medium">{images[idx].caption}</p>
        <div className="flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-amber-400 scale-125" : "bg-white/40 hover:bg-white/70"}`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={next}
        className="absolute end-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
        aria-label="Next image"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* ── Contact/Lead Form ───────────────────────────── */
function LeadForm({ t, lang, context = "General Inquiry", onSuccess }) {
  const [fields, setFields] = useState({ full_name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle");

  const set = (k) => (e) => setFields((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, catering_interest: context, preferred_language: lang }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border border-stone-300 rounded-lg px-4 py-3 text-stone-800 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all placeholder:text-stone-400 bg-white";

  if (status === "success")
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
        <p className="text-stone-700 font-semibold text-lg">{t("form.success")}</p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="block text-stone-700 text-sm font-semibold mb-1.5">{t("form.full_name")}</label>
        <input
          type="text"
          required
          maxLength={255}
          autoComplete="name"
          value={fields.full_name}
          onChange={set("full_name")}
          className={inputClass}
          placeholder={lang === "he" ? "טליה הלטמן" : "Talia Haltman"}
        />
      </div>
      <div>
        <label className="block text-stone-700 text-sm font-semibold mb-1.5">{t("form.phone")}</label>
        <input
          type="tel"
          required
          autoComplete="tel"
          value={fields.phone}
          onChange={set("phone")}
          className={`${inputClass} text-start`}
          dir="ltr"
          placeholder="054-0000000"
        />
      </div>
      <div>
        <label className="block text-stone-700 text-sm font-semibold mb-1.5">{t("form.email")}</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={fields.email}
          onChange={set("email")}
          className={`${inputClass} text-start`}
          dir="ltr"
          placeholder="talia@example.com"
        />
      </div>
      {status === "error" && (
        <p className="text-red-600 text-sm">{t("form.error")}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-200 text-base"
      >
        {status === "loading" ? "..." : t("form.submit")}
      </button>
    </form>
  );
}

/* ── Testimonial Slider ──────────────────────────── */
function TestimonialSlider({ t, lang }) {
  const items = t("testimonials");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIdx((i) => (i + 1) % items.length), 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[idx];

  return (
    <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8">
      <div className="text-amber-600 text-4xl font-serif mb-3 opacity-60">"</div>
      <p className="text-stone-700 italic leading-relaxed mb-4">{current.quote}</p>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="font-bold text-stone-800">{current.name}</p>
          <p className="text-amber-700 text-sm">{current.event}</p>
        </div>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? "bg-amber-600 scale-125" : "bg-amber-300 hover:bg-amber-400"}`}
              aria-label={`Testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Accessibility Widget ────────────────────────── */
function AccessibilityWidget({ t, dir }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize ? "110%" : "";
  }, [fontSize]);

  useEffect(() => {
    document.body.style.fontFamily = readableFont ? "Arial, sans-serif" : "";
  }, [readableFont]);

  useEffect(() => {
    document.documentElement.classList.toggle("keyboard-focus-mode", keyboardFocus);
  }, [keyboardFocus]);

  const toggleItem = (setter) => () => setter((v) => !v);

  const options = [
    { label: t("a11y.contrast"), active: highContrast, toggle: toggleItem(setHighContrast) },
    { label: t("a11y.fontSize"), active: fontSize, toggle: toggleItem(setFontSize) },
    { label: t("a11y.readableFont"), active: readableFont, toggle: toggleItem(setReadableFont) },
    { label: t("a11y.keyboardFocus"), active: keyboardFocus, toggle: toggleItem(setKeyboardFocus) },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-50" dir={dir}>
      {panelOpen && (
        <div className="mb-3 bg-white border border-stone-200 rounded-2xl shadow-2xl p-4 w-56">
          <div className="flex items-center justify-between mb-3">
            <p className="text-stone-800 font-bold text-sm">{t("a11y.title")}</p>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-stone-400 hover:text-stone-700 text-xs font-medium"
            >
              {t("a11y.close")}
            </button>
          </div>
          <div className="space-y-2">
            {options.map(({ label, active, toggle }) => (
              <button
                key={label}
                onClick={toggle}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-stone-50 text-stone-700 border border-stone-200 hover:border-amber-300"
                }`}
              >
                <span>{label}</span>
                <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${active ? "bg-amber-500 border-amber-500" : "border-stone-300"}`} />
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setPanelOpen((v) => !v)}
        aria-label={t("a11y.open")}
        aria-expanded={panelOpen}
        className="w-12 h-12 bg-stone-800 hover:bg-stone-700 text-white rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-110 focus:outline-2 focus:outline-amber-600 focus:outline-offset-2"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
          <path d="M12 6v6M9 9.5L7 14M15 9.5L17 14M9 14l-1.5 5M15 14l1.5 5M10 14h4" />
        </svg>
      </button>
    </div>
  );
}

/* ── WhatsApp Sticky Button ──────────────────────── */
function WhatsAppButton() {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=972545696903&text=%D7%94%D7%99%2C%20%D7%96%D7%95%20%D7%98%D7%9C%D7%99%D7%94"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all focus:outline-2 focus:outline-amber-600 focus:outline-offset-2"
      aria-label="WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [lang, setLang] = useState("he");
  const [contactModal, setContactModal] = useState(false);
  const [privacyModal, setPrivacyModal] = useState(false);
  const [a11yModal, setA11yModal] = useState(false);
  const [galleryModal, setGalleryModal] = useState({ open: false, index: 0 });
  const [activeTab, setActiveTab] = useState("dairy");
  const [headerScrolled, setHeaderScrolled] = useState(false);

  const t = useT(lang);
  const dir = lang === "he" ? "rtl" : "ltr";

  /* sync document direction */
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  /* header scroll shadow */
  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const aboutRef = useRef(null);
  const scrollToAbout = () =>
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });

  /* gallery images */
  const galleryImages = [
    { src: "/gallery/event-1.jpg", alt: t("gallery.event_1"), caption: t("gallery.event_1") },
    { src: "/gallery/event-2.jpg", alt: t("gallery.event_2"), caption: t("gallery.event_2") },
    { src: "/gallery/event-3.jpg", alt: t("gallery.event_3"), caption: t("gallery.event_3") },
    { src: "/gallery/event-4.jpg", alt: t("gallery.event_1"), caption: t("gallery.event_1") },
    { src: "/gallery/event-5.jpg", alt: t("gallery.event_2"), caption: t("gallery.event_2") },
    { src: "/gallery/event-6.jpg", alt: t("gallery.event_3"), caption: t("gallery.event_3") },
  ];

  /* service tabs config */
  const tabs = [
    { key: "dairy", label: t("services.tab_dairy"), text: t("services.dairy_text"), imgAlt: t("services.dairy_img_alt"), img: "/services/dairy.jpg" },
    { key: "meat",  label: t("services.tab_meat"),  text: t("services.meat_text"),  imgAlt: t("services.meat_img_alt"),  img: "/services/meat.jpg"  },
    { key: "corporate", label: t("services.tab_corporate"), text: t("services.corporate_text"), imgAlt: t("services.corporate_img_alt"), img: "/services/corporate.jpg" },
  ];
  const activeService = tabs.find((tb) => tb.key === activeTab);

  return (
    <div dir={dir} lang={lang} className="font-sans bg-[#F8F9FA] text-stone-800 overflow-x-hidden">

      {/* ══ STICKY NAVBAR ══════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          headerScrolled ? "bg-white/98 shadow-md" : "bg-white/90"
        } backdrop-blur-md border-b border-stone-100`}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 flex-shrink-0 focus:outline-2 focus:outline-amber-600 focus:outline-offset-2 rounded">
            <img src="/logo.png" alt="זוטה לבנה" className="h-10 w-auto" onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }} />
            <span className="hidden text-amber-700 font-bold text-xl font-serif">זוטה לבנה</span>
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-stone-600" aria-label="Main navigation">
            <a href="#about"   className="hover:text-amber-700 transition-colors focus:outline-2 focus:outline-amber-600 focus:outline-offset-2 rounded">{t("nav.about")}</a>
            <a href="#gallery" className="hover:text-amber-700 transition-colors focus:outline-2 focus:outline-amber-600 focus:outline-offset-2 rounded">{t("nav.gallery")}</a>
            <a href="#services"className="hover:text-amber-700 transition-colors focus:outline-2 focus:outline-amber-600 focus:outline-offset-2 rounded">{t("nav.services")}</a>
            <a href="#contact" className="hover:text-amber-700 transition-colors focus:outline-2 focus:outline-amber-600 focus:outline-offset-2 rounded">{t("nav.contact")}</a>
          </nav>

          {/* Lang toggle + CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "he" ? "en" : "he")}
              className="text-xs font-bold text-stone-500 border border-stone-300 rounded-full px-3 py-1.5 hover:border-amber-500 hover:text-amber-700 transition-all focus:outline-2 focus:outline-amber-600 focus:outline-offset-2"
              aria-label="Switch language"
            >
              {lang === "he" ? "EN" : "עב"}
            </button>
            <button
              onClick={() => setContactModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all shadow focus:outline-2 focus:outline-amber-400 focus:outline-offset-2"
            >
              {t("nav.contact")}
            </button>
          </div>
        </div>
      </header>

      {/* ══ HERO ══════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="/hero.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
          <p className="text-amber-300 text-sm font-bold tracking-widest uppercase mb-4 opacity-90">
            {lang === "he" ? "קייטרינג גלילי בוטיק" : "Galilean Boutique Catering"}
          </p>
          <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-5 leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToAbout}
              className="bg-white text-stone-800 font-black text-base px-8 py-4 rounded-xl hover:bg-amber-50 transition-all shadow-xl focus:outline-2 focus:outline-amber-400 focus:outline-offset-2"
            >
              {t("hero.cta_about")}
            </button>
            <button
              onClick={() => setContactModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black text-base px-8 py-4 rounded-xl transition-all shadow-xl focus:outline-2 focus:outline-white focus:outline-offset-2"
            >
              {t("hero.cta_talk")}
            </button>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 start-1/2 -translate-x-1/2 z-10 animate-bounce" aria-hidden="true">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ══ ABOUT ══════════════════════════════════════ */}
      <section id="about" ref={aboutRef} className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <p className="text-amber-600 text-sm font-bold tracking-widest uppercase mb-3">
                {lang === "he" ? "הסיפור שלנו" : "Our Story"}
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-800 mb-4">
                {t("about.title")}
              </h2>
              <div className="w-14 h-0.5 bg-amber-500 mb-6" />
              <p className="text-stone-600 leading-relaxed text-base">{t("about.text")}</p>
            </div>
            <div className="aspect-[4/3] bg-amber-50 rounded-2xl overflow-hidden border border-amber-100">
              <img
                src="/about/talia.jpg"
                alt={t("about.img_alt_talia")}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.classList.add("flex", "items-center", "justify-center");
                  e.target.parentElement.innerHTML = `<span class="text-amber-300 text-4xl">👩‍🍳</span>`;
                }}
              />
            </div>
          </div>

          {/* Three images */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { src: "/about/talia.jpg", alt: t("about.img_alt_talia") },
              { src: "/about/staff.jpg", alt: t("about.img_alt_staff") },
              { src: "/about/buffet.jpg", alt: t("about.img_alt_buffet") },
            ].map((img, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50 border border-amber-100">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-amber-200 text-5xl">🍽️</div>`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALLERY ════════════════════════════════════ */}
      <section id="gallery" className="py-24 bg-[#F8F9FA]">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-amber-600 text-sm font-bold tracking-widest uppercase mb-3">
              {lang === "he" ? "גלריה" : "Gallery"}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-800 mb-2">
              {t("gallery.title")}
            </h2>
            <div className="w-14 h-0.5 bg-amber-500 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setGalleryModal({ open: true, index: i })}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-amber-50 border border-amber-100 hover:shadow-xl transition-all focus:outline-2 focus:outline-amber-600 focus:outline-offset-2"
                aria-label={img.caption}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-amber-200 text-4xl bg-amber-50">🍽️</div>`;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end p-3">
                  <p className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    {img.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SERVICES ════════════════════════════════════ */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-amber-600 text-sm font-bold tracking-widest uppercase mb-3">
              {lang === "he" ? "התפריטים שלנו" : "Our Menus"}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-800 mb-2">
              {t("services.title")}
            </h2>
            <div className="w-14 h-0.5 bg-amber-500 mx-auto" />
          </div>

          {/* Tab bar */}
          <div
            role="tablist"
            aria-label={lang === "he" ? "בחר קטגוריה" : "Select category"}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {tabs.map((tb) => (
              <button
                key={tb.key}
                role="tab"
                aria-selected={activeTab === tb.key}
                onClick={() => setActiveTab(tb.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all focus:outline-2 focus:outline-amber-600 focus:outline-offset-2 ${
                  activeTab === tb.key
                    ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                    : "bg-stone-100 text-stone-600 hover:bg-amber-100 hover:text-amber-700"
                }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeService && (
            <div
              role="tabpanel"
              className="grid md:grid-cols-2 gap-10 items-center"
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-amber-50 border border-amber-100 order-last md:order-first">
                <img
                  src={activeService.img}
                  alt={activeService.imgAlt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-amber-200 text-5xl bg-amber-50">🍽️</div>`;
                  }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-stone-800 mb-4">{activeService.label}</h3>
                <p className="text-stone-600 leading-relaxed text-base">{activeService.text}</p>
                <button
                  onClick={() => setContactModal(true)}
                  className="mt-6 inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow focus:outline-2 focus:outline-amber-400 focus:outline-offset-2"
                >
                  {t("nav.contact")}
                </button>
              </div>
            </div>
          )}

          {/* Testimonials */}
          <TestimonialSlider t={t} lang={lang} />
        </div>
      </section>

      {/* ══ CONTACT FORM ════════════════════════════════ */}
      <section id="contact" className="py-24 bg-[#F8F9FA]">
        <div className="max-w-lg mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-amber-600 text-sm font-bold tracking-widest uppercase mb-3">
              {lang === "he" ? "צרו קשר" : "Get in Touch"}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-800 mb-2">
              {t("nav.contact")}
            </h2>
            <div className="w-14 h-0.5 bg-amber-500 mx-auto" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-stone-100 p-6 md:p-8">
            <LeadForm t={t} lang={lang} context="General Inquiry" />
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════ */}
      <footer className="bg-stone-900 text-stone-300 py-10 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm">{t("footer.rights")}</p>
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => setPrivacyModal(true)}
              className="hover:text-amber-400 transition-colors underline underline-offset-2 focus:outline-2 focus:outline-amber-400 focus:outline-offset-2"
            >
              {t("footer.privacy")}
            </button>
            <button
              onClick={() => setA11yModal(true)}
              className="hover:text-amber-400 transition-colors underline underline-offset-2 focus:outline-2 focus:outline-amber-400 focus:outline-offset-2"
            >
              {t("footer.accessibility")}
            </button>
            <a
              href="https://api.whatsapp.com/send?phone=972545696903&text=%D7%94%D7%99%2C%20%D7%96%D7%95%20%D7%98%D7%9C%D7%99%D7%94"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-green-400 hover:text-green-300 transition-colors focus:outline-2 focus:outline-amber-400 focus:outline-offset-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {t("footer.whatsapp")}
            </a>
          </div>
        </div>
      </footer>

      {/* ══ PERSISTENT WIDGETS ══════════════════════════ */}
      <WhatsAppButton />
      <AccessibilityWidget t={t} dir={dir} />

      {/* ══ MODALS ══════════════════════════════════════ */}
      <Modal
        open={contactModal}
        onClose={() => setContactModal(false)}
        title={t("nav.contact")}
        dir={dir}
      >
        <LeadForm t={t} lang={lang} context="Hero Modal" onSuccess={() => setContactModal(false)} />
      </Modal>

      <Modal
        open={privacyModal}
        onClose={() => setPrivacyModal(false)}
        title={t("privacy.title")}
        dir={dir}
      >
        <p className="text-xs text-stone-400 mb-4">{t("privacy.updated")}</p>
        {t("privacy.body")}
      </Modal>

      <Modal
        open={a11yModal}
        onClose={() => setA11yModal(false)}
        title={t("a11yStatement.title")}
        dir={dir}
      >
        <p className="text-xs text-stone-400 mb-4">{t("a11yStatement.updated")}</p>
        {t("a11yStatement.body")}
      </Modal>

      <GalleryModal
        open={galleryModal.open}
        onClose={() => setGalleryModal((s) => ({ ...s, open: false }))}
        images={galleryImages}
        startIndex={galleryModal.index}
        t={t}
      />
    </div>
  );
}
