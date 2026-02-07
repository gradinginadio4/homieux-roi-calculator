'use client'

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  TrendingUp, Clock, Zap, ChevronRight, ChevronLeft, Download, Calendar,
  CheckCircle2, AlertTriangle, Trophy, Lightbulb, Target, Loader2,
  Play, Calculator, FileText, Mail, X, Sparkles, ArrowRight, MessageCircle
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer
} from "recharts"

type Lang = "fr" | "nl" | "en"

const translations: Record<Lang, any> = {
  fr: {
    tagline: "AI Marketing Agency • Belgium",
    badge: "Basé sur 47 contrats GTB analysés en Belgique",
    welcome_title: "Combien d'euros laissez-vous sur la table chaque année ?",
    welcome_subtitle: "Calculez vos gains cachés en 60 secondes — sans engagement",
    welcome_point1: "Mes équipes perdent du temps en déplacements inutiles",
    welcome_point2: "Ma marge fond sans que je comprenne pourquoi",
    welcome_point3: "Mes factures énergie explosent chaque trimestre",
    welcome_cta: "Découvrir mon potentiel",
    step_1_title: "Remplissez", step_1_desc: "30 sec",
    step_2_title: "Calculez", step_2_desc: "Instantané",
    step_3_title: "Recevez", step_3_desc: "Votre rapport",
    founder_message: "Chez Homieux Media, on croit que chaque facility manager mérite de connaître le vrai potentiel de ses contrats. Cet outil est notre cadeau pour vous.",
    founder_sign: "— L'équipe Homieux Media, Bruxelles",
    your_estimate: "Votre estimation", step_indicator: "Étape {step}/3",
    step1_title: "Parlons de vos sites", step1_desc: "Commençons : combien de sites gérez-vous ?",
    sites_label: "Nombre de sites", sites_tooltip: "Sites industriels, bureaux ou commerciaux gérés",
    volume_label: "Volume contrats annuels", volume_tooltip: "Chiffre d'affaires total de vos contrats maintenance",
    step2_title: "Vos chiffres clés", step2_desc: "Ces données permettent d'affiner votre estimation",
    marge_label: "Marge opérationnelle", marge_tooltip: "Marge nette sur vos contrats maintenance (hors charges fixes)",
    absenteisme_label: "Absentéisme maintenance", absenteisme_tooltip: "Arrêts maladie, formation, remplacements non assurés",
    energie_label: "Coût énergie annuel", energie_tooltip: "Total de vos factures énergie sur l'année",
    step3_title: "L'inefficacité cachée", step3_desc: "Dernière étape : évaluez les pertes de temps",
    heures_label: "Heures perdues par site/an", heures_tooltip: "Déplacements non optimisés, attentes, interventions répétées",
    benchmark_avg: "Moyenne BE: 145h", benchmark_better: "mieux", benchmark_worse: "plus élevé",
    continue: "Continuer", back: "Retour", see_results: "Voir mes gains",
    results_title: "Vos gains estimés", results_total: "Votre gain total estimé (12 mois)", results_profit: "de rentabilité supplémentaire",
    margin_gain: "Optimisation marge", margin_detail: "+8 points de marge grâce à l'efficacité",
    saturation_gain: "Réduction saturation", saturation_detail: "heures récupérées",
    energy_gain: "Économie énergie", energy_detail: "-12% sur vos factures énergie",
    chart_marge: "Marge (%)", chart_heures: "Heures perdues", chart_before: "Avant", chart_after: "Après",
    insight_warning: "Marge challengée — voyons ensemble les leviers d'optimisation",
    insight_success: "Excellente marge — vous êtes dans le top 15%",
    insight_info: "Potentiel de gains:", insight_info_suffix: "€ vous attendent",
    opportunity_label: "Opportunité de rentabilité", opportunity_sublabel: "sans investissement lourd en infrastructure",
    download_pdf: "Télécharger mon analyse complète (PDF)",
    cta_title: "On en discute ?", cta_subtitle: "30 min d'échange, sans engagement, pour explorer ensemble vos leviers d'optimisation", cta_button: "Planifier mon appel gratuit",
    footer_text: "Outil créé avec ❤️ par l'équipe Homieux Media à Bruxelles", footer_contact: "Des questions ? gradinginadio4@gmail.com",
    email_title: "Recevez votre analyse par email", email_desc: "Pour montrer ces chiffres à votre CFO ou board, recevez le PDF détaillé",
    email_placeholder: "votre@email.com", email_send: "Envoyer mon analyse", email_skip: "Non merci, fermer",
    email_success: "Envoyé ! Vérifiez votre boîte mail", email_error: "Erreur lors de l'envoi. Veuillez réessayer.",
    methodology: "Comment calculons-nous ?", methodology_text: "Basé sur l'analyse de 47 contrats GTB en Belgique, nos algorithmes croisent vos données avec les benchmarks sectoriels 2024.",
    live_gain: "Gain estimé"
  },
  nl: {
    tagline: "AI Marketing Agency • Belgium",
    badge: "Gebaseerd op 47 geanalyseerde GTB-contracten in België",
    welcome_title: "Hoeveel euro laat u elk jaar liggen?",
    welcome_subtitle: "Bereken uw verborgen winsten in 60 seconden — zonder verplichtingen",
    welcome_point1: "Mijn teams verliezen tijd met onnodige verplaatsingen",
    welcome_point2: "Mijn marge smelt zonder dat ik begrijp waarom",
    welcome_point3: "Mijn energiefacturen exploderen elk kwartaal",
    welcome_cta: "Ontdek mijn potentieel",
    step_1_title: "Invullen", step_1_desc: "30 sec",
    step_2_title: "Berekenen", step_2_desc: "Direct",
    step_3_title: "Ontvangen", step_3_desc: "Uw rapport",
    founder_message: "Bij Homieux Media geloven we dat elke facility manager het ware potentieel van zijn contracten moet kennen. Deze tool is ons geschenk voor u.",
    founder_sign: "— Het Homieux Media team, Brussel",
    your_estimate: "Uw schatting", step_indicator: "Stap {step}/3",
    step1_title: "Laten we over uw sites praten", step1_desc: "Laten we beginnen: hoeveel sites beheert u?",
    sites_label: "Aantal sites", sites_tooltip: "Industriële sites, kantoren of commerciële panden",
    volume_label: "Jaarlijks contractvolume", volume_tooltip: "Totale omzet van uw onderhoudscontracten",
    step2_title: "Uw belangrijkste cijfers", step2_desc: "Deze gegevens verfijnen uw schatting",
    marge_label: "Operationele marge", marge_tooltip: "Nettomarge op uw onderhoudscontracten (excl. vaste kosten)",
    absenteisme_label: "Onderhoudsabsentie", absenteisme_tooltip: "Ziekteverlof, training, niet-ingevulde vervangingen",
    energie_label: "Jaarlijkse energiekosten", energie_tooltip: "Totaal van uw energiefacturen over het jaar",
    step3_title: "De verborgen inefficiëntie", step3_desc: "Laatste stap: evalueer tijdverlies",
    heures_label: "Verloren uren per site/jaar", heures_tooltip: "Niet-geoptimaliseerde verplaatsingen, wachttijden, herhaalde interventies",
    benchmark_avg: "Gemiddelde BE: 145u", benchmark_better: "beter", benchmark_worse: "hoger",
    continue: "Doorgaan", back: "Terug", see_results: "Bekijk mijn winst",
    results_title: "Uw geschatte winst", results_total: "Uw totale geschatte winst (12 maanden)", results_profit: "extra rendement",
    margin_gain: "Margeoptimalisatie", margin_detail: "+8 margepunten door efficiëntie",
    saturation_gain: "Verzadigingsreductie", saturation_detail: "uren teruggewonnen",
    energy_gain: "Energiebesparing", energy_detail: "-12% op uw energiefacturen",
    chart_marge: "Marge (%)", chart_heures: "Verloren uren", chart_before: "Voor", chart_after: "Na",
    insight_warning: "Uitdagende marge — laten we samen de hefbomen bekijken",
    insight_success: "Uitstekende marge — u bent in de top 15%",
    insight_info: "Winstpotentieel:", insight_info_suffix: "€ wacht op u",
    opportunity_label: "Rendementsmogelijkheid", opportunity_sublabel: "zonder zware infrastructuurinvestering",
    download_pdf: "Download mijn volledige analyse (PDF)",
    cta_title: "Laten we erover praten?", cta_subtitle: "30 minuten uitwisseling, zonder verplichtingen, om samen uw optimalisatiehefbomen te verkennen", cta_button: "Plan mijn gratis gesprek",
    footer_text: "Tool gemaakt met ❤️ door het Homieux Media team in Brussel", footer_contact: "Vragen? gradinginadio4@gmail.com",
    email_title: "Ontvang uw analyse per e-mail", email_desc: "Om deze cijfers aan uw CFO of board te tonen, ontvang het gedetailleerde PDF",
    email_placeholder: "uw@email.com", email_send: "Stuur mijn analyse", email_skip: "Nee bedankt, sluiten",
    email_success: "Verzonden! Controleer uw inbox", email_error: "Fout bij verzenden. Probeer opnieuw.",
    methodology: "Hoe berekenen we?", methodology_text: "Gebaseerd op de analyse van 47 GTB-contracten in België, kruisen onze algoritmes uw gegevens met sectorbenchmarks 2024.",
    live_gain: "Geschatte winst"
  },
  en: {
    tagline: "AI Marketing Agency • Belgium",
    badge: "Based on 47 GTB contracts analyzed in Belgium",
    welcome_title: "How many euros are you leaving on the table each year?",
    welcome_subtitle: "Calculate your hidden gains in 60 seconds — no commitment",
    welcome_point1: "My teams waste time on unnecessary travel",
    welcome_point2: "My margin is melting and I don't understand why",
    welcome_point3: "My energy bills explode every quarter",
    welcome_cta: "Discover my potential",
    step_1_title: "Fill in", step_1_desc: "30 sec",
    step_2_title: "Calculate", step_2_desc: "Instant",
    step_3_title: "Receive", step_3_desc: "Your report",
    founder_message: "At Homieux Media, we believe every facility manager deserves to know the true potential of their contracts. This tool is our gift to you.",
    founder_sign: "— The Homieux Media team, Brussels",
    your_estimate: "Your estimate", step_indicator: "Step {step}/3",
    step1_title: "Let's talk about your sites", step1_desc: "Let's start: how many sites do you manage?",
    sites_label: "Number of sites", sites_tooltip: "Industrial sites, offices or commercial buildings managed",
    volume_label: "Annual contract volume", volume_tooltip: "Total revenue from your maintenance contracts",
    step2_title: "Your key figures", step2_desc: "This data helps refine your estimate",
    marge_label: "Operating margin", marge_tooltip: "Net margin on your maintenance contracts (excl. fixed costs)",
    absenteisme_label: "Maintenance absenteeism", absenteisme_tooltip: "Sick leave, training, unfilled replacements",
    energie_label: "Annual energy cost", energie_tooltip: "Total of your energy bills for the year",
    step3_title: "The hidden inefficiency", step3_desc: "Final step: evaluate time loss",
    heures_label: "Lost hours per site/year", heures_tooltip: "Non-optimized travel, waiting, repeated interventions",
    benchmark_avg: "BE average: 145h", benchmark_better: "better", benchmark_worse: "higher",
    continue: "Continue", back: "Back", see_results: "See my gains",
    results_title: "Your estimated gains", results_total: "Your total estimated gain (12 months)", results_profit: "additional profitability",
    margin_gain: "Margin optimization", margin_detail: "+8 margin points through efficiency",
    saturation_gain: "Saturation reduction", saturation_detail: "hours recovered",
    energy_gain: "Energy savings", energy_detail: "-12% on your energy bills",
    chart_marge: "Margin (%)", chart_heures: "Lost hours", chart_before: "Before", chart_after: "After",
    insight_warning: "Challenged margin — let's explore optimization levers together",
    insight_success: "Excellent margin — you're in the top 15%",
    insight_info: "Gain potential:", insight_info_suffix: "€ await you",
    opportunity_label: "Profitability opportunity", opportunity_sublabel: "without heavy infrastructure investment",
    download_pdf: "Download my complete analysis (PDF)",
    cta_title: "Shall we discuss it?", cta_subtitle: "30 minutes exchange, no commitment, to explore your optimization levers together", cta_button: "Schedule my free call",
    footer_text: "Tool created with ❤️ by the Homieux Media team in Brussels", footer_contact: "Questions? gradinginadio4@gmail.com",
    email_title: "Receive your analysis by email", email_desc: "To show these figures to your CFO or board, receive the detailed PDF",
    email_placeholder: "your@email.com", email_send: "Send my analysis", email_skip: "No thanks, close",
    email_success: "Sent! Check your inbox", email_error: "Error sending. Please try again.",
    methodology: "How do we calculate?", methodology_text: "Based on the analysis of 47 GTB contracts in Belgium, our algorithms cross-reference your data with 2024 sector benchmarks.",
    live_gain: "Estimated gain"
  }
}

function useLanguage() {
  const [lang, setLang] = useState<Lang>("fr")
  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2) as Lang
    if (translations[browserLang]) setLang(browserLang)
    const urlLang = new URLSearchParams(window.location.search).get("lang") as Lang
    if (urlLang && translations[urlLang]) setLang(urlLang)
  }, [])
  const t = useCallback((key: string, vars?: Record<string, string | number>) => {
    let text = translations[lang][key] || key
    if (vars) Object.entries(vars).forEach(([k, v]) => { text = text.replace(`{${k}}`, String(v)) })
    return text
  }, [lang])
  return { lang, setLang, t }
}

const fmt = (n: number) => new Intl.NumberFormat("fr-BE").format(Math.round(n))

function AnimatedCounter({ value, duration = 1500, suffix = " €" }: any) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [value, duration])
  return <span>{fmt(display)}{suffix}</span>
}

function Tooltip({ children, text }: any) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex items-center" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#00008B] text-white text-xs rounded-lg whitespace-nowrap z-50 max-w-[250px] text-center">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#00008B]"></span>
        </span>
      )}
    </span>
  )
}

function LiveGainCounter({ gains }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#00008B] to-[#ED51C2] text-white px-6 py-4 rounded-2xl shadow-2xl">
      <div className="text-xs opacity-90 mb-1">💰 Gain estimé</div>
      <div className="text-2xl font-bold">{fmt(gains)} €</div>
    </motion.div>
  )
}

function Confetti() {
  const [pieces] = useState(() => Array.from({ length: 30 }, (_, i) => ({
    id: i, x: Math.random() * 100, delay: Math.random() * 0.5,
    color: ["#ED51C2", "#00008B", "#10b981", "#f59e0b", "#ffffff"][Math.floor(Math.random() * 5)]
  })))
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div key={piece.id} initial={{ y: -100, x: `${piece.x}%`, opacity: 1, rotate: 0 }}
          animate={{ y: "100vh", opacity: 0, rotate: 720, x: `${piece.x + (Math.random() - 0.5) * 20}%` }}
          transition={{ duration: 2.5, delay: piece.delay, ease: "easeOut" }}
          style={{ position: "absolute", width: 8, height: 8, backgroundColor: piece.color, borderRadius: Math.random() > 0.5 ? "50%" : "0" }} />
      ))}
    </div>
  )
}

function LanguageSelector({ lang, setLang }: any) {
  const langs = [{ code: "fr", label: "FR", flag: "🇫🇷" }, { code: "nl", label: "NL", flag: "🇧🇪" }, { code: "en", label: "EN", flag: "🇬🇧" }]
  return (
    <div className="inline-flex items-center gap-1 rounded-full p-0.5 bg-gray-100">
      {langs.map((l: any) => (
        <button key={l.code} onClick={() => setLang(l.code)} className="px-2.5 py-1 rounded-full text-xs font-semibold transition-all" style={{ background: lang === l.code ? "#00008B" : "transparent", color: lang === l.code ? "#ffffff" : "#5a6c7d" }}>
          <span className="mr-1">{l.flag}</span>{l.label}
        </button>
      ))}
    </div>
  )
}

export default function ROICalculator() {
  const { t, lang, setLang } = useLanguage()
  const [screen, setScreen] = useState<any>("welcome")
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)

  const [sites, setSites] = useState(20)
  const [volume, setVolume] = useState(500000)
  const [marge, setMarge] = useState(18)
  const [absenteisme, setAbsenteisme] = useState(15)
  const [energie, setEnergie] = useState(150000)
  const [heures, setHeures] = useState(120)

  const calculate = useCallback(() => {
    const saturationCost = heures * sites * 65
    const saturationReduction = saturationCost * 0.45
    const marginGain = volume * 0.08
    const energySave = energie * 0.12
    const totalGains = marginGain + saturationReduction + energySave
    const profitPercent = (totalGains / volume) * 100
    const heuresSaved = Math.round(heures * sites * 0.45)
    return { sites, volume, marge, absenteisme, energie, heures, totalGains, profitPercent, marginGain, saturationReduction, energySave, heuresSaved }
  }, [sites, volume, marge, absenteisme, energie, heures])

  const results = calculate()

  const chartData = useMemo(() => [
    { name: t("chart_marge"), [t("chart_before")]: marge, [t("chart_after")]: marge + 8 },
    { name: t("chart_heures"), [t("chart_before")]: heures * sites, [t("chart_after")]: Math.round(heures * sites * 0.55) }
  ], [marge, heures, sites, t])

  const benchmarkDiff = ((145 - heures) / 145) * 100
  const benchmarkText = benchmarkDiff > 0 ? `${Math.round(benchmarkDiff)}% ${t("benchmark_better")}` : `${Math.abs(Math.round(benchmarkDiff))}% ${t("benchmark_worse")}`

  const getInsight = () => {
    if (marge < 10) return { type: "warning", icon: <AlertTriangle className="w-6 h-6 text-amber-600" />, text: `${t("insight_warning")} (${marge}%)` }
    if (marge > 25) return { type: "success", icon: <Trophy className="w-6 h-6 text-emerald-600" />, text: `${t("insight_success")} (${marge}%)` }
    return { type: "info", icon: <Lightbulb className="w-6 h-6 text-amber-500" />, text: `${t("insight_info")} ${fmt(results.totalGains)}€ ${t("insight_info_suffix")}` }
  }

  const insight = getInsight()

  const handleShowResults = () => {
    setScreen("results")
    if (results.totalGains > 50000) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000) }
    window.scrollTo(0, 0)
  }

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) return
    setEmailSending(true); setEmailError("")
    try {
      const response = await fetch("/api/send-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, lang, data: results })
      })
      if (!response.ok) throw new Error("Failed")
      setEmailSent(true)
      setTimeout(() => { setShowEmailModal(false); setEmailSent(false); setEmail(""); setEmailSending(false) }, 2500)
    } catch { setEmailError(t("email_error")); setEmailSending(false) }
  }

  const handleCTAClick = () => {
    window.open("https://calendly.com/homieuxmedia/discovery-call-gratuit-discutons-de-vos-defis", "_blank")
  }

  const stepNumber = screen === "step1" ? 1 : screen === "step2" ? 2 : screen === "step3" ? 3 : 0
  const progressPercent = (stepNumber / 3) * 100
  const volumeOptions = [{ label: "250K€", value: 250000 }, { label: "500K€", value: 500000 }, { label: "1M€", value: 1000000 }, { label: "2M€+", value: 2000000 }]
  const showLiveGains = screen === "step2" || screen === "step3"

  return (
    <div className="min-h-screen py-5 sm:py-8" style={{ background: "linear-gradient(135deg, #f0f2f5 0%, #e4e8ed 100%)" }}>
      {showConfetti && <Confetti />}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6">
        <div className="text-center pb-5">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-extrabold shadow-lg flex-shrink-0" style={{ background: "#00008B", color: "#ED51C2" }}>Hm</div>
              <div className="text-left">
                <div className="font-extrabold text-xl tracking-tight" style={{ color: "#00008B" }}>Homieux Media</div>
                <div className="text-xs font-medium text-gray-500 hidden sm:block">{t("tagline")}</div>
              </div>
            </div>
            <LanguageSelector lang={lang} setLang={setLang} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold mt-2" style={{ background: "#fdf0f9", color: "#00008B", border: "1px solid #ED51C2" }}>
            <CheckCircle2 className="w-3.5 h-3.5" />{t("badge")}
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,139,0.08)", border: "1px solid rgba(0,0,139,0.05)" }}>
          <AnimatePresence mode="wait">
            {screen === "welcome" && (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <div className="relative p-8 sm:p-10 text-center text-white overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(0,0,139,0.95) 0%, rgba(26,26,156,0.95) 100%)" }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  </motion.div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight" style={{ fontFamily: "DM Sans, sans-serif" }}>{t("welcome_title")}</h1>
                  <p className="text-base opacity-95 mb-6 font-normal">{t("welcome_subtitle")}</p>

                  <div className="flex justify-center gap-4 mb-6">
                    {[{ icon: Play, title: t("step_1_title"), desc: t("step_1_desc") }, { icon: Calculator, title: t("step_2_title"), desc: t("step_2_desc") }, { icon: FileText, title: t("step_3_title"), desc: t("step_3_desc") }].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 relative">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><step.icon className="w-5 h-5" /></div>
                        <div className="text-xs font-bold">{step.title}</div>
                        <div className="text-[10px] opacity-80">{step.desc}</div>
                        {i < 2 && <ArrowRight className="w-4 h-4 opacity-50 absolute -right-6 top-6" />}
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(237,81,194,0.3)" }}>
                    {[t("welcome_point1"), t("welcome_point2"), t("welcome_point3")].map((point, i) => (
                      <div key={i} className="flex items-center gap-2.5 mb-2.5 last:mb-0 text-sm">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: "#ED51C2", color: "#ffffff" }}>✓</div>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6 text-left bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-sm italic opacity-95 mb-2">"{t("founder_message")}"</p>
                    <p className="text-xs font-semibold opacity-80">{t("founder_sign")}</p>
                  </div>

                  <button onClick={() => setScreen("step1")} className="w-full py-4 px-8 rounded-xl text-base font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2" style={{ background: "#ED51C2", color: "#ffffff", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
                    {t("welcome_cta")} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {(screen === "step1" || screen === "step2" || screen === "step3") && (
              <motion.div key={screen} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
                <div className="px-8 sm:px-10 pt-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("your_estimate")}</span>
                    <span className="text-xs font-bold" style={{ color: "#00008B" }}>{t("step_indicator", { step: stepNumber })}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #00008B 0%, #ED51C2 100%)" }} initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 0.5 }} />
                  </div>
                </div>

                <div className="p-8 sm:p-10">
                  {screen === "step1" && (
                    <>
                      <h2 className="text-2xl font-bold mb-2" style={{ color: "#00008B" }}>{t("step1_title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("step1_desc")}</p>

                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">{t("sites_label")}<Tooltip text={t("sites_tooltip")}><span className="w-4 h-4 rounded-full bg-[#fdf0f9] text-[#00008B] text-xs flex items-center justify-center cursor-help border border-[#ED51C2]">?</span></Tooltip></label>
                          <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: "#fdf0f9", color: "#00008B" }}>{sites}</span>
                        </div>
                        <input type="range" min="1" max="200" value={sites} onChange={(e) => setSites(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00008B]" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>Moyenne BE: 15</span><span>200</span></div>
                      </div>

                      <div className="mb-6">
                        <label className="text-sm font-semibold text-gray-700 mb-3 block">{t("volume_label")}</label>
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {volumeOptions.map((opt) => (
                            <button key={opt.value} onClick={() => setVolume(opt.value)} className="px-4 py-2 rounded-lg text-sm font-semibold transition-all" style={{ background: volume === opt.value ? "#fdf0f9" : "#f3f4f6", color: volume === opt.value ? "#00008B" : "#6b7280", border: volume === opt.value ? "2px solid #ED51C2" : "2px solid transparent" }}>{opt.label}</button>
                          ))}
                        </div>
                        <div className="relative">
                          <input type="number" value={volume} onChange={(e) => setVolume(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00008B] focus:outline-none text-lg font-semibold" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
                        </div>
                      </div>

                      <button onClick={() => setScreen("step2")} className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5" style={{ background: "#00008B", boxShadow: "0 4px 16px rgba(0,0,139,0.25)" }}>{t("continue")} <ChevronRight className="w-5 h-5" /></button>
                    </>
                  )}

                  {screen === "step2" && (
                    <>
                      <button onClick={() => setScreen("step1")} className="mb-4 text-sm text-gray-500 hover:text-[#00008B] flex items-center gap-1 transition-colors"><ChevronLeft className="w-4 h-4" /> {t("back")}</button>
                      <h2 className="text-2xl font-bold mb-2" style={{ color: "#00008B" }}>{t("step2_title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("step2_desc")}</p>

                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">{t("marge_label")}<Tooltip text={t("marge_tooltip")}><span className="w-4 h-4 rounded-full bg-[#fdf0f9] text-[#00008B] text-xs flex items-center justify-center cursor-help border border-[#ED51C2]">?</span></Tooltip></label>
                          <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: "#fdf0f9", color: "#00008B" }}>{marge}%</span>
                        </div>
                        <input type="range" min="5" max="35" value={marge} onChange={(e) => setMarge(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00008B]" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>Moyenne: 14%</span><span>35%</span></div>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">{t("absenteisme_label")}<Tooltip text={t("absenteisme_tooltip")}><span className="w-4 h-4 rounded-full bg-[#fdf0f9] text-[#00008B] text-xs flex items-center justify-center cursor-help border border-[#ED51C2]">?</span></Tooltip></label>
                          <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: "#fdf0f9", color: "#00008B" }}>{absenteisme}%</span>
                        </div>
                        <input type="range" min="5" max="40" value={absenteisme} onChange={(e) => setAbsenteisme(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00008B]" />
                      </div>

                      <div className="mb-8">
                        <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center gap-2">{t("energie_label")}<Tooltip text={t("energie_tooltip")}><span className="w-4 h-4 rounded-full bg-[#fdf0f9] text-[#00008B] text-xs flex items-center justify-center cursor-help border border-[#ED51C2]">?</span></Tooltip></label>
                        <div className="relative">
                          <input type="number" value={energie} onChange={(e) => setEnergie(parseInt(e.target.value) || 0)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00008B] focus:outline-none text-lg font-semibold" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={() => setScreen("step1")} className="px-6 py-4 rounded-xl font-semibold text-gray-600 border-2 border-gray-200 hover:border-[#00008B] hover:text-[#00008B] transition-all">{t("back")}</button>
                        <button onClick={() => setScreen("step3")} className="flex-1 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5" style={{ background: "#00008B", boxShadow: "0 4px 16px rgba(0,0,139,0.25)" }}>{t("continue")} <ChevronRight className="w-5 h-5" /></button>
                      </div>
                    </>
                  )}

                  {screen === "step3" && (
                    <>
                      <button onClick={() => setScreen("step2")} className="mb-4 text-sm text-gray-500 hover:text-[#00008B] flex items-center gap-1 transition-colors"><ChevronLeft className="w-4 h-4" /> {t("back")}</button>
                      <h2 className="text-2xl font-bold mb-2" style={{ color: "#00008B" }}>{t("step3_title")}</h2>
                      <p className="text-sm text-gray-500 mb-8">{t("step3_desc")}</p>

                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">{t("heures_label")}<Tooltip text={t("heures_tooltip")}><span className="w-4 h-4 rounded-full bg-[#fdf0f9] text-[#00008B] text-xs flex items-center justify-center cursor-help border border-[#ED51C2]">?</span></Tooltip></label>
                          <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ background: "#fdf0f9", color: "#00008B" }}>{heures}h</span>
                        </div>
                        <input type="range" min="20" max="500" value={heures} onChange={(e) => setHeures(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#00008B]" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>20h</span><span>250h</span><span>500h</span></div>
                      </div>

                      <div className="rounded-xl p-4 mb-8 text-center" style={{ background: "#fdf0f9", border: "1px solid #ED51C2" }}>
                        <div className="text-xs text-gray-500 mb-1">{t("benchmark_avg")}</div>
                        <div className="text-lg font-bold" style={{ color: "#00008B" }}>{benchmarkText}</div>
                      </div>

                      <button onClick={() => setShowMethodology(!showMethodology)} className="text-xs text-[#00008B] underline mb-6 block">{t("methodology")}</button>
                      {showMethodology && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">{t("methodology_text")}</motion.div>}

                      <div className="flex gap-3">
                        <button onClick={() => setScreen("step2")} className="px-6 py-4 rounded-xl font-semibold text-gray-600 border-2 border-gray-200 hover:border-[#00008B] hover:text-[#00008B] transition-all">{t("back")}</button>
                        <button onClick={handleShowResults} className="flex-1 py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #ED51C2 0%, #00008B 100%)", boxShadow: "0 4px 16px rgba(237,81,194,0.35)" }}>{t("see_results")} <TrendingUp className="w-5 h-5" /></button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {screen === "results" && (
              <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="relative p-8 sm:p-10 text-center text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #00008B 0%, #1a1a9c 100%)" }}>
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  </motion.div>
                  <div className="relative z-10">
                    <div className="text-sm opacity-90 mb-2">{t("results_total")}</div>
                    <div className="text-5xl sm:text-6xl font-extrabold mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}><AnimatedCounter value={results.totalGains} suffix=" €" /></div>
                    <div className="text-lg font-semibold opacity-95">+{results.profitPercent.toFixed(1)}% {t("results_profit")}</div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#ED51C2] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                </div>

                <div className="p-8 sm:p-10">
                  <div className="grid gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-2xl border-l-4 bg-gray-50" style={{ borderLeftColor: "#10b981" }}>
                      <div className="flex justify-between items-start mb-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("margin_gain")}</span><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{fmt(results.marginGain)} €</div>
                      <div className="text-sm text-emerald-600 font-medium">{t("margin_detail")}</div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-2xl border-l-4 bg-gray-50" style={{ borderLeftColor: "#00008B" }}>
                      <div className="flex justify-between items-start mb-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("saturation_gain")}</span><Clock className="w-5 h-5 text-[#00008B]" /></div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{fmt(results.saturationReduction)} €</div>
                      <div className="text-sm text-[#00008B] font-medium">{fmt(results.heuresSaved)} {t("saturation_detail")}</div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-2xl border-l-4 bg-gray-50" style={{ borderLeftColor: "#f59e0b" }}>
                      <div className="flex justify-between items-start mb-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("energy_gain")}</span><Zap className="w-5 h-5 text-amber-500" /></div>
                      <div className="text-2xl font-bold text-gray-800 mb-1">{fmt(results.energySave)} €</div>
                      <div className="text-sm text-amber-600 font-medium">{t("energy_detail")}</div>
                    </motion.div>
                  </div>

                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 mb-6">
                    <div className="text-sm font-bold text-center mb-4" style={{ color: "#00008B" }}>Avant / Après optimisation</div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} barGap={8}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <RechartsTooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                          <Legend />
                          <Bar dataKey={t("chart_before")} fill="#e5e7eb" radius={[6, 6, 0, 0]} />
                          <Bar dataKey={t("chart_after")} fill="#00008B" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{ background: insight.type === "warning" ? "#fef3c7" : insight.type === "success" ? "#d1fae5" : "#fdf0f9", border: `1px solid ${insight.type === "warning" ? "#f59e0b" : insight.type === "success" ? "#10b981" : "#ED51C2"}` }}>
                    {insight.icon}
                    <span className="text-sm font-semibold text-gray-800">{insight.text}</span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="text-center p-6 rounded-2xl mb-6 text-white" style={{ background: "linear-gradient(135deg, #00008B 0%, #ED51C2 100%)" }}>
                    <div className="text-sm opacity-90 mb-1">{t("opportunity_label")}</div>
                    <div className="text-4xl font-extrabold mb-1">+{results.profitPercent.toFixed(1)}%</div>
                    <div className="text-xs opacity-90">{t("opportunity_sublabel")}</div>
                  </motion.div>

                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} onClick={() => setShowEmailModal(true)} className="w-full py-4 rounded-xl border-2 border-dashed border-[#00008B] text-[#00008B] font-semibold flex items-center justify-center gap-2 hover:bg-[#fdf0f9] transition-all mb-6">
                    <Download className="w-5 h-5" />{t("download_pdf")}
                  </motion.button>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-gray-50 rounded-2xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3"><MessageCircle className="w-5 h-5 text-[#00008B]" /><h3 className="text-lg font-bold text-gray-800">{t("cta_title")}</h3></div>
                    <p className="text-sm text-gray-500 mb-5">{t("cta_subtitle")}</p>
                    <button onClick={handleCTAClick} className="w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5" style={{ background: "#ff7a59", boxShadow: "0 4px 16px rgba(255,122,89,0.35)" }}>
                      <Calendar className="w-5 h-5" />{t("cta_button")}
                    </button>
                  </motion.div>
                </div>

                <div className="px-8 pb-8 text-center border-t border-gray-100 pt-6">
                  <p className="text-xs text-gray-400 mb-1">{t("footer_text")}</p>
                  <p className="text-sm font-semibold" style={{ color: "#00008B" }}>{t("footer_contact")}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showLiveGains && <LiveGainCounter gains={results.totalGains} />}

      <AnimatePresence>
        {showEmailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowEmailModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-2xl p-8 max-w-md w-full relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              {!emailSent ? (
                <>
                  <div className="flex items-center gap-3 mb-4"><div className="w-12 h-12 rounded-full bg-[#fdf0f9] flex items-center justify-center"><Mail className="w-6 h-6 text-[#00008B]" /></div><div><h3 className="text-xl font-bold" style={{ color: "#00008B" }}>{t("email_title")}</h3></div></div>
                  <p className="text-sm text-gray-500 mb-6">{t("email_desc")}</p>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("email_placeholder")} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#00008B] focus:outline-none mb-4" />
                  {emailError && <div className="text-red-500 text-sm mb-4">{emailError}</div>}
                  <button onClick={handleEmailSubmit} disabled={emailSending || !email.includes("@")} className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: "#00008B" }}>{emailSending ? <Loader2 className="w-5 h-5 animate-spin" /> : t("email_send")}</button>
                  <button onClick={() => setShowEmailModal(false)} className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600">{t("email_skip")}</button>
                </>
              ) : (
                <div className="text-center py-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-8 h-8 text-emerald-600" /></motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{t("email_success")}</h3>
                  <p className="text-sm text-gray-500">gradinginadio4@gmail.com</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
