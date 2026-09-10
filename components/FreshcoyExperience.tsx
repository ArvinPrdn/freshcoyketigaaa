"use client";

import { useMemo, useState } from "react";
import { care, indicators, steps, type IndicatorKey } from "@/lib/content";

const indicatorKeys = Object.keys(indicators) as IndicatorKey[];

function Dot({ color, large = false }: { color: string; large?: boolean }) {
  return <span className={large ? "status-dot status-dot-large" : "status-dot"} style={{ backgroundColor: color }} aria-hidden />;
}

function Arrow({ direction = "right" }: { direction?: "right" | "down" | "up" }) {
  return <span aria-hidden className="arrow" data-direction={direction}>→</span>;
}

function Packaging({ indicator }: { indicator: IndicatorKey }) {
  const item = indicators[indicator];
  return (
    <div className="package-art" aria-label={`Ilustrasi kemasan Freshcoy, ${item.name}`}>
      <div className="package-halo" />
      <div className="package-card">
        <div className="package-top"><span>FRESHCOY</span><span>PAKCOY</span></div>
        <div className="package-title">PAKCOY</div>
        <div className="leaves" aria-hidden>
          <i/><i/><i/><i/><i/>
        </div>
        <div className="package-indicator">
          <span className="mini-label">INDICATOR</span>
          <Dot color={item.color} large />
          <strong>{item.name.replace("Indikator ", "")}</strong>
        </div>
        <div className="package-bottom">SCAN / READ / ACT</div>
      </div>
      <div className="package-caption">
        <Dot color={item.color} />
        <span>{item.short}</span>
      </div>
    </div>
  );
}

export default function FreshcoyExperience() {
  const [active, setActive] = useState<IndicatorKey>("ungu");
  const [allOpen, setAllOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackState, setFeedbackState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const current = indicators[active];
  const currentIndex = useMemo(() => indicatorKeys.indexOf(active), [active]);

  async function sendFeedback() {
    const message = feedback.trim();
    if (!message || feedbackState === "sending") return;

    setFeedbackState("sending");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const result = (await response.json()) as { ok?: boolean; telegramDelivered?: boolean; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "Request failed");
      setFeedback("");
      setFeedbackState(result.telegramDelivered ? "sent" : "sent");
    } catch {
      setFeedbackState("error");
    }
  }

  return (
    <main>
      <header className="site-nav">
        <a className="brand" href="#top"><span className="brand-mark" /> FRESHCOY</a>
        <nav>
          <a href="#cara-kerja">Cara kerja</a>
          <a href="#indikator">Indikator</a>
          <a href="#pemanfaatan">Pemanfaatan</a>
          <a href="#tentang">Tentang</a>
        </nav>
        <a className="nav-button" href="#indikator">Mulai <Arrow /></a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="kicker">SMART PACKAGING / PAKCOY</p>
            <h1>Manfaatkan<br/><span>lebih tepat.</span></h1>
            <p className="hero-text">Freshcoy memberi konteks tambahan saat kondisi pakcoy berubah selama penyimpanan. Pantau indikator, periksa pakcoy, lalu tentukan pemanfaatannya.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#indikator">Lihat indikator <Arrow /></a>
              <a className="plain-link" href="#cara-kerja">Cara kerjanya <Arrow /></a>
            </div>
          </div>
          <div className="hero-visual"><Packaging indicator={active} /></div>
        </div>
        <div className="hero-meta"><span>01 / 07</span><span>SCROLL UNTUK MENGIKUTI ALURNYA</span><span>FRESHCOY © 2026</span></div>
      </section>

      <section className="light-section intro" id="cara-kerja">
        <div className="section-top"><span>01 / MENGAPA FRESHCOY?</span><span>CATATAN PENTING</span></div>
        <div className="split-heading">
          <h2>Perubahan kecil<br/><span>butuh konteks.</span></h2>
          <div className="copy-stack">
            <p>Freshcoy dibuat untuk memberi satu petunjuk tambahan ketika indikator pada kemasan berubah. Indikator bukan pengganti pemeriksaan fisik.</p>
            <div className="principle-table">
              <div><span>01</span><strong>Pantau</strong><p>Perhatikan perubahan indikator.</p></div>
              <div><span>02</span><strong>Periksa</strong><p>Lihat kondisi fisik pakcoy.</p></div>
              <div><span>03</span><strong>Tentukan</strong><p>Pilih pemanfaatan yang sesuai.</p></div>
            </div>
          </div>
        </div>
        <div className="notice"><strong>INDIKATOR = PETUNJUK TAMBAHAN</strong><span>Keputusan konsumsi tetap perlu mempertimbangkan kondisi fisik pakcoy dan cara penyimpanannya.</span></div>
      </section>

      <section className="dark-section indicator-section" id="indikator">
        <div className="section-top inverse"><span>02 / BACA PERUBAHANNYA</span><span>{current.no} / 03</span></div>
        <div className="indicator-heading">
          <h2>Tiga kondisi.<br/><span>Satu keputusan.</span></h2>
          <p>Tekan satu kondisi untuk melihat konteks dan tindakan yang dipertimbangkan. Tidak ada kondisi ke-4 pada panduan ini.</p>
        </div>
        <div className="indicator-layout">
          <div className="indicator-list">
            {indicatorKeys.map((key) => {
              const item = indicators[key];
              const selected = key === active;
              return (
                <button key={key} className={`indicator-row ${selected ? "selected" : ""}`} onClick={() => setActive(key)} aria-pressed={selected}>
                  <span className="row-no">{item.no}</span>
                  <Dot color={item.color} />
                  <span className="row-name">{item.name}</span>
                  <span className="row-short">{item.short}</span>
                  <Arrow />
                </button>
              );
            })}
          </div>

          <div className="indicator-detail" key={active}>
            <div className="detail-copy">
              <div className="detail-status"><Dot color={current.color} large/><span>{current.no} / KONDISI AKTIF</span></div>
              <h3>{current.name}</h3>
              <p>{current.text}</p>
              <div className="detail-action"><span>TINDAKAN YANG DIPERTIMBANGKAN</span><strong>{current.action}</strong></div>
            </div>
            <Packaging indicator={active} />
          </div>
        </div>
      </section>

      <section className="light-section use-section" id="pemanfaatan">
        <div className="section-top"><span>03 / PRIORITAS PEMANFAATAN</span><span>BUKA PER TAHAP</span></div>
        <div className="use-heading">
          <h2>Pilih pemanfaatan<br/><span>yang paling masuk akal.</span></h2>
          <div>
            <p>Urutan berikut mengikuti tiga kondisi indikator. Buka kartu untuk melihat seluruh pilihan dengan jelas.</p>
            <button className="button button-outline" onClick={() => setAllOpen((value) => !value)}>{allOpen ? "Tutup semua tahapan" : "Buka semua tahapan"} <span aria-hidden>{allOpen ? "↑" : "↓"}</span></button>
          </div>
        </div>

        <div className="use-cards">
          {indicatorKeys.map((key) => {
            const item = indicators[key];
            const open = allOpen || active === key;
            return (
              <article key={key} className={`use-card ${open ? "open" : ""}`}>
                <button className="use-card-head" onClick={() => setActive(key)} aria-expanded={open}>
                  <span className="use-number">{item.no}</span>
                  <Dot color={item.color} />
                  <span>{item.name}</span>
                  <span className="use-toggle">{open ? "−" : "+"}</span>
                </button>
                <div className="use-card-body">
                  <div className="use-decision">
                    <span>PRIORITAS</span>
                    <strong>{item.action}</strong>
                  </div>
                  <div className="use-items">
                    {item.uses.map((use, index) => <div key={use}><span>{String(index + 1).padStart(2, "0")}</span>{use}</div>)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dark-section timeline-section">
        <div className="section-top inverse"><span>04 / DARI AWAL KE AKHIR</span><span>5 LANGKAH</span></div>
        <div className="timeline-heading"><h2>Rawat dari awal.<br/><span>Manfaatkan tepat waktu.</span></h2><p>Indikator bekerja paling baik saat dibaca bersama kebiasaan penyimpanan dan pemeriksaan fisik.</p></div>
        <div className="timeline">
          {steps.map((step, index) => (
            <article key={step.no} className="timeline-step">
              <div className="timeline-index">{step.no}</div>
              <div className="timeline-marker"><span /></div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              {index < steps.length - 1 && <span className="timeline-connector">→</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="light-section care-section">
        <div className="section-top"><span>05 / PERIKSA FISIK</span><span>JANGAN HANYA MENGANDALKAN INDIKATOR</span></div>
        <div className="care-layout">
          <div><h2>Indikator memberi<br/><span>petunjuk.</span><br/>Pakcoy memberi<br/><em>bukti fisik.</em></h2><p className="care-lead">Gunakan indikator sebagai konteks tambahan. Pemeriksaan langsung tetap penting sebelum menentukan tindakan.</p></div>
          <div className="care-list">
            {care.map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
          </div>
        </div>
        <div className="care-note">Perubahan tampilan, tekstur, atau aroma dapat membantu pemeriksaan, tetapi tidak dapat mendeteksi seluruh bahaya mikrobiologis. Jangan gunakan warna indikator sebagai satu-satunya dasar keputusan konsumsi.</div>
      </section>

      <section className="dark-section package-section" id="tentang">
        <div className="section-top inverse"><span>06 / FRESHCOY PACKAGE</span><span>SCAN THE PACKAGE</span></div>
        <div className="package-layout">
          <div><h2>Satu kemasan.<br/><span>Satu konteks tambahan.</span></h2><p>Freshcoy Package adalah konsep smart packaging yang membantu memantau perubahan kondisi pakcoy selama penyimpanan melalui indikator pada kemasan dan akses QR menuju panduan.</p></div>
          <div className="qr-card">
            <img src="/qr-freshcoy.svg" alt="QR Freshcoy. Ganti dengan QR asli kamu." />
            <div className="qr-copy"><span>SCAN THE PACKAGE</span><h3>Buka panduan Freshcoy</h3><p>Ganti gambar QR di <code>public/qr-freshcoy.svg</code> dengan QR asli yang menuju halaman Freshcoy.</p><a href="#indikator" className="button button-light">Baca panduan <Arrow /></a></div>
          </div>
        </div>
      </section>

      <section className="light-section feedback-section">
        <div className="section-top"><span>07 / MASUKAN</span><span>LOCAL API</span></div>
        <div className="feedback-layout">
          <div><h2>Apa yang masih<br/><span>membingungkan?</span></h2><p>Kirim masukan. Ulasan disimpan secara lokal untuk development dan diteruskan ke Telegram kamu melalui Bot API.</p></div>
          <div className="feedback-box">
            <textarea value={feedback} maxLength={1000} onChange={(event) => { setFeedback(event.target.value); if (feedbackState !== "idle") setFeedbackState("idle"); }} placeholder="Tulis masukanmu..." aria-label="Masukan Freshcoy" />
            <div className="feedback-footer"><span>{feedbackState === "sent" ? "Terkirim. Terima kasih!" : feedbackState === "error" ? "Gagal mengirim. Coba lagi." : `${feedback.length}/1000`}</span><button className="button button-primary" onClick={sendFeedback} disabled={feedbackState === "sending"}>{feedbackState === "sending" ? "Mengirim..." : "Kirim masukan"} <Arrow /></button></div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div><div className="footer-brand"><span className="brand-mark"/> FRESHCOY</div><p>Smart packaging untuk membantu memahami perubahan kondisi pakcoy.</p></div>
        <div className="footer-links"><a href="#cara-kerja">Cara kerja</a><a href="#indikator">Indikator</a><a href="#pemanfaatan">Pemanfaatan</a><a href="#top">Kembali ke atas ↑</a></div>
        <div className="footer-meta">© 2026 Freshcoy · Informasi penelitian / edukasi</div>
      </footer>
    </main>
  );
}
