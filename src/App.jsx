import { useState, useEffect, useRef } from "react";
import "./App.css";

/* ──────────────────────────────────────────────
   Parallax Floating Shapes Background
────────────────────────────────────────────── */
function ParallaxBg() {
  const ref = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!ref.current) return;
      const shapes = ref.current.children;
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      Array.from(shapes).forEach((el, i) => {
        const depth = ((i % 4) + 1) * 14;
        el.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
      });
    };
    const onScroll = () => {
      if (!ref.current) return;
      const shapes = ref.current.children;
      const sy = window.scrollY * 0.03;
      Array.from(shapes).forEach((el, i) => {
        const d = ((i % 3) + 1) * 0.4;
        el.style.transform = `translateY(${sy * d}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const shapes = [
    { tag: "tri",  top: "8%",  left: "4%",   size: 70,  delay: "0s" },
    { tag: "sq",   top: "18%", right: "6%",  size: 90,  delay: "1s" },
    { tag: "line", top: "38%", left: "12%",  w: 130,    delay: "0.5s" },
    { tag: "tri",  top: "55%", right: "10%", size: 55,  delay: "2s" },
    { tag: "sq",   bottom: "28%", left: "6%", size: 75, delay: "1.5s" },
    { tag: "line", bottom: "18%", right: "18%", w: 160, delay: "0.8s" },
    { tag: "tri",  top: "48%", left: "42%",  size: 45,  delay: "3s" },
    { tag: "sq",   top: "72%", right: "38%", size: 60,  delay: "2.5s" },
  ];

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {shapes.map((s, i) => {
        const pos = {
          position: "absolute",
          top: s.top,
          bottom: s.bottom,
          left: s.left,
          right: s.right,
          transition: "transform 0.15s ease-out",
          animationDelay: s.delay,
        };
        if (s.tag === "tri")
          return (
            <div key={i} style={pos} className="animate-float-slow opacity-0 shape-visible">
              <svg width={s.size} height={s.size} viewBox="0 0 100 100">
                <polygon points="50,6 94,94 6,94" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="1.5" />
              </svg>
            </div>
          );
        if (s.tag === "sq")
          return (
            <div key={i} style={pos} className="animate-float-medium opacity-0 shape-visible">
              <svg width={s.size} height={s.size} viewBox="0 0 100 100">
                <rect x="6" y="6" width="88" height="88" fill="none" stroke="rgba(160,170,180,0.12)" strokeWidth="1.5" />
              </svg>
            </div>
          );
        return (
          <div
            key={i}
            style={{ ...pos, width: s.w, height: 1, background: "rgba(201,168,76,0.15)" }}
          />
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────
   Main App
────────────────────────────────────────────── */
export default function App() {
  const [formData, setFormData] = useState({ name: "", phone: "", type: "new" });
  const [submitted, setSubmitted] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div dir="rtl" lang="he" className="font-sans bg-charcoal text-white overflow-x-hidden">
      <ParallaxBg />

      {/* ══════════════════════════════
          STICKY HEADER
      ══════════════════════════════ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          headerScrolled
            ? "bg-charcoal/98 shadow-2xl shadow-black/60"
            : "bg-charcoal/90"
        } backdrop-blur-md border-b border-gold/15`}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.png" alt="תוואי הצפון" className="h-11 w-auto" />
          </a>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-300">
            <a href="#why" className="hover:text-gold transition-colors">למה קבלן רשום?</a>
            <a href="#services" className="hover:text-gold transition-colors">שירותים</a>
            <a href="#portfolio" className="hover:text-gold transition-colors">פרויקטים</a>
            <a href="#contact" className="hover:text-gold transition-colors">צור קשר</a>
          </nav>

          {/* Badge + CTA */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 bg-gold/10 border border-gold/35 text-gold text-xs px-3 py-1.5 rounded-full font-bold tracking-wide">
              ✓ קבלן רשום
            </span>
            <a
              href="#contact"
              className="bg-gold text-charcoal text-sm font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-all shadow-lg"
            >
              צור קשר
            </a>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient"
      >
        {/* Video / overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-transparent to-charcoal/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 text-gold text-sm px-5 py-2 rounded-full mb-8 font-bold tracking-wide">
            <span>✓</span>
            <span>קבלן רשום מוסמך</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-tight">
            בונים לכם בית,
            <br />
            <span className="text-gold">בראש שקט.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            תכנון וביצוע פרויקטים בסטנדרט הגבוה ביותר על ידי קבלן רשום. אנחנו לוקחים אחריות על כל שלב בדרך – מהיסודות ועד המפתח.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-gold text-charcoal font-black text-base md:text-lg px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-2xl hover:shadow-gold/30 hover:-translate-y-0.5"
            >
              תיאום פגישת ייעוץ בשטח
            </a>
            <a
              href="#contact"
              className="border-2 border-white/40 text-white font-bold text-base md:text-lg px-8 py-4 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all"
            >
              קבלו הצעת מחיר ראשונית
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          VALUE PROPOSITION
      ══════════════════════════════ */}
      <section id="why" className="relative z-10 py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-bold tracking-widest uppercase mb-3">היתרון שלנו</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">
              למה דווקא קבלן רשום?
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 64 64" className="w-16 h-16">
                    <polygon points="32,6 58,56 6,56" fill="none" stroke="#C9A84C" strokeWidth="2" />
                    <text x="32" y="46" textAnchor="middle" fill="#C9A84C" fontSize="20" fontWeight="bold">✓</text>
                  </svg>
                ),
                title: "ביטחון וחוקיות",
                desc: "פעילות מלאה לפי תקנות רשם הקבלנים. פיקוח מקצועי בכל שלב עם עמידה מוחלטת בתקנים הגבוהים ביותר.",
              },
              {
                icon: (
                  <svg viewBox="0 0 64 64" className="w-16 h-16">
                    <rect x="8" y="8" width="48" height="48" fill="none" stroke="#C9A84C" strokeWidth="2" />
                    <text x="32" y="40" textAnchor="middle" fill="#C9A84C" fontSize="22" fontWeight="bold">§</text>
                  </svg>
                ),
                title: "ביטוח ואחריות",
                desc: "כיסוי ביטוחי מלא לאורך כל הפרויקט, כולל אחריות לטווח ארוך על עבודות קונסטרוקציה ושלד.",
              },
              {
                icon: (
                  <svg viewBox="0 0 64 64" className="w-16 h-16">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#C9A84C" strokeWidth="2" />
                    <line x1="32" y1="10" x2="32" y2="54" stroke="#C9A84C" strokeWidth="1.5" />
                    <line x1="10" y1="32" x2="54" y2="32" stroke="#C9A84C" strokeWidth="1.5" />
                  </svg>
                ),
                title: "ניסיון מוכח",
                desc: "יכולות הנדסיות גבוהות, עמידה מוצלחת בבחינות ההסמכה, ועשרות פרויקטים מושלמים בצפון הארץ.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1.5 group"
              >
                <div className="flex justify-center mb-5 opacity-75 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SERVICES
      ══════════════════════════════ */}
      <section id="services" className="relative z-10 py-24 bg-charcoal">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-bold tracking-widest uppercase mb-3">מה אנחנו עושים</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">
              השירותים שלנו
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-4" />
            <p className="text-slate-400 text-lg">מהיסוד ועד הגמר – אנחנו עושים הכל</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                title: "בנייה פרטית",
                desc: "מהשלד ועד הגמר היוקרתי. בנייה של בתים פרטיים מאפס, כולל ניהול פרויקט מלא, תיאום מול אדריכלים ומהנדסים.",
                tags: ["שלד ובטון", "חומרי בנייה איכותיים", "ניהול פרויקט"],
              },
              {
                num: "02",
                title: "שיפוצי עומק",
                desc: "הרחבות, הוספת קומות, וחיזוק מבני. שיפוץ מקצועי תוך שמירה על בטיחות מבנית ועמידה מלאה בתקנות.",
                tags: ["הוספת קומות", "חיזוק מבני", "הרחבות"],
              },
              {
                num: "03",
                title: "עבודות גמר",
                desc: "ריצוף יוקרתי, גבס מתקדם, ותשתיות פנים מתוחכמות. גמר ברמה האירופאית הגבוהה ביותר.",
                tags: ["ריצוף יוקרתי", "גבס ומחיצות", "תשתיות"],
              },
            ].map((s, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl bg-slate-800/40 border border-slate-700 hover:border-gold/50 hover:bg-slate-800/70 transition-all duration-300 overflow-hidden cursor-default"
              >
                <div className="absolute top-3 left-4 text-8xl font-black text-slate-700/20 group-hover:text-gold/8 transition-colors select-none leading-none">
                  {s.num}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">{s.title}</h3>
                <p className="text-slate-400 leading-relaxed mb-6 text-sm relative z-10">{s.desc}</p>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {s.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs bg-gold/10 border border-gold/25 text-gold px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>

          {/* Bureaucracy Clause */}
          <div className="mt-10 p-6 rounded-2xl bg-gold/6 border border-gold/20 flex items-start gap-4">
            <div className="text-gold text-2xl flex-shrink-0 mt-0.5">📋</div>
            <div>
              <p className="text-gold font-bold mb-1">אנחנו מטפלים בבירוקרטיה בשבילכם</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                אנחנו מטפלים בבירוקרטיה מול הרשויות והאדריכלים – מהיתרי בנייה ועד אישורי גמר. אתם לא צריכים לדאוג לשום דבר.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          PORTFOLIO & SOCIAL PROOF
      ══════════════════════════════ */}
      <section id="portfolio" className="relative z-10 py-24 bg-slate-900">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-gold text-sm font-bold tracking-widest uppercase mb-3">הפרויקטים שלנו</p>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4">
              הוכחות בשטח
            </h2>
            <div className="w-16 h-0.5 bg-gold mx-auto" />
          </div>

          {/* Project Cards (Before/After placeholders) */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { label: "וילה פרטית – כרמיאל", type: "בנייה פרטית" },
              { label: "בית קרקע – נהריה", type: "שיפוץ עומק" },
            ].map((p, i) => (
              <div key={i} className="group">
                <div className="relative h-60 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl overflow-hidden border border-slate-700 group-hover:border-gold/40 transition-all">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <span className="text-5xl opacity-20">🏗</span>
                    <span className="text-slate-500 text-sm">הוסיפו תמונות לפני / אחרי</span>
                  </div>
                  {/* Registered contractor badge */}
                  <div className="absolute top-3 right-3 bg-gold/90 text-charcoal text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    ✓ קבלן רשום
                  </div>
                  <div className="absolute top-3 left-3 bg-slate-800/80 text-slate-300 text-xs px-2.5 py-1 rounded-full">
                    {p.type}
                  </div>
                </div>
                <p className="text-slate-300 font-semibold mt-3 text-center">{p.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "המקצוענות של הצוות והעמידה בלוחות הזמנים נתנו לנו לישון בשקט.",
                name: "משפחת כהן",
                project: "בנייה פרטית – עכו",
              },
              {
                quote: "לא האמנו שאפשר לגמור פרויקט כזה בלי בעיות. תוואי הצפון הוכיחו שאפשר.",
                name: "יוסי ורחל מ.",
                project: "שיפוץ עומק – חיפה",
              },
              {
                quote: "הטיפול בבירוקרטיה היה חלום. לא נגענו בשום נייר.",
                name: "אורית ש.",
                project: "הוספת קומה – נשר",
              },
              {
                quote: "הגמר שקיבלנו הוא ברמה אירופאית. כולם שואלים מי הקבלן.",
                name: "משפחת לוין",
                project: "עבודות גמר – קריית אתא",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 hover:border-gold/30 transition-all hover:-translate-y-0.5 shadow-lg"
              >
                <div className="text-gold text-4xl font-serif leading-none mb-3 opacity-70">"</div>
                <p className="text-slate-300 leading-relaxed mb-5 italic text-sm">{t.quote}</p>
                <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
                  <span className="text-white font-bold text-sm">{t.name}</span>
                  <span className="text-gold text-xs">{t.project}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          CONTACT
      ══════════════════════════════ */}
      <section id="contact" className="relative z-10 py-24 bg-charcoal overflow-hidden">
        {/* Ariel's photo as background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/ariel.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/88 to-charcoal/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left column */}
            <div>
              <p className="text-gold text-sm font-bold tracking-widest uppercase mb-3">בואו נדבר</p>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-2">
                יצירת קשר
              </h2>
              <div className="w-12 h-0.5 bg-gold mb-6" />
              <p className="text-slate-400 mb-8 leading-relaxed">
                דברו ישירות עם אריאל לוי, מנהל הפרויקטים ובעל הרישיון. נחזור אליכם תוך 24 שעות.
              </p>

              {/* Ariel card */}
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-800/60 border border-slate-700 mb-6 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gold/40">
                  <img
                    src="/ariel.jpg"
                    alt="אריאל לוי"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-white font-black text-lg">אריאל לוי</p>
                  <p className="text-gold text-sm font-bold">קבלן רשום מוסמך</p>
                  <p className="text-slate-400 text-sm">הנדסה תוואי הצפון</p>
                </div>
              </div>

              {/* Lead Magnet */}
              <div className="p-5 rounded-2xl bg-gold/8 border border-gold/25 backdrop-blur-sm">
                <p className="text-gold font-bold mb-1 flex items-center gap-2">
                  <span>📥</span> מדריך חינמי
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  הורידו את המדריך שלנו:{" "}
                  <strong className="text-white">5 דברים שחובה לבדוק לפני שבוחרים קבלן</strong>
                </p>
                <a
                  href="#"
                  className="inline-block mt-3 text-xs bg-gold text-charcoal font-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  הורדה חינמית ←
                </a>
              </div>
            </div>

            {/* Right column – Form */}
            <div className="p-8 rounded-2xl bg-slate-900/85 border border-slate-700 backdrop-blur-sm shadow-2xl">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-3xl mx-auto mb-5">
                    ✓
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">הפנייה התקבלה!</h3>
                  <p className="text-slate-400">אריאל יחזור אליך בהקדם האפשרי.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">שלחו פנייה</h3>
                    <p className="text-slate-400 text-sm mt-1 mb-5">נחזור אליכם תוך 24 שעות</p>
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                      שם מלא
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, name: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-slate-500"
                      placeholder="הכניסו את שמכם"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                      טלפון
                    </label>
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      pattern="[0-9\-\+\s]{7,15}"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-slate-500 text-left"
                      placeholder="050-0000000"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 text-sm font-semibold mb-1.5">
                      סוג פרויקט
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, type: e.target.value }))
                      }
                      className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                    >
                      <option value="new">בנייה חדשה</option>
                      <option value="renovation">שיפוץ</option>
                      <option value="finish">עבודות גמר</option>
                      <option value="other">אחר</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold text-charcoal font-black py-3.5 rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-gold/20 text-base"
                  >
                    שלחו פנייה ←
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER
      ══════════════════════════════ */}
      <footer className="relative z-10 bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-5xl mx-auto px-5">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <img src="/logo.png" alt="תוואי הצפון" className="h-12 mb-4" />
              <p className="text-slate-400 text-sm leading-relaxed">
                הנדסה ובנייה בצפון הארץ. קבלן רשום מוסמך עם ניסיון עשיר בבנייה פרטית ושיפוצים מסחריים.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">שירותים</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#services" className="hover:text-gold transition-colors">
                    בנייה פרטית
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-gold transition-colors">
                    שיפוצי עומק
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-gold transition-colors">
                    עבודות גמר
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">צרו קשר</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-gold font-semibold">מספר רישיון:</span>
                  <span>########</span>
                </li>
                <li>
                  <a
                    href="https://wa.me/972500000000"
                    className="hover:text-green-400 transition-colors flex items-center gap-1.5"
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 WhatsApp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors">
                    פייסבוק
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors">
                    אינסטגרם
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">
              © 2026 הנדסה תוואי הצפון. כל הזכויות שמורות.
            </p>
            <a
              href="https://wa.me/972500000000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-lg"
            >
              <span>💬</span>
              <span>שלחו הודעה ב-WhatsApp</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/972500000000"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all text-2xl"
        aria-label="WhatsApp"
      >
        💬
      </a>
    </div>
  );
}

