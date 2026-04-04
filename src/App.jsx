import { useState, useMemo, useEffect, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, List, Lightbulb, Shield, Eye,
  Plus, Pencil, Trash2, Search, X, TrendingUp, TrendingDown,
  Wallet, ArrowUpRight, ArrowDownRight, Menu, Sun, Moon
} from "lucide-react";
import BorderGlow from "./components/borderglow";

// ═══════════════════════════════════════════════════════════════════════════════
// THEME SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
const darkTheme = {
  mode:    "dark",
  bg:      "#050505",
  surface: "#0f172a",
  card:    "rgba(255,255,255,0.04)",
  cardSolid: "#0f172a",
  sidebar: "linear-gradient(to right, rgba(10,15,30,0.98), rgba(10,15,30,0.95))",
  sidebarBorder: "rgba(255,255,255,0.08)",
  header:  "rgba(5,5,5,0.6)",
  border:  "rgba(255,255,255,0.08)",
  borderH: "rgba(255,255,255,0.14)",
  blue:    "#3b82f6",
  gold:    "#d4af37",
  text:    "#9ca3af",
  textH:   "#e5e7eb",
  muted:   "#6b7280",
  dim:     "#374151",
  inputBg: "rgba(255,255,255,0.03)",
  inputBgSelect: "rgba(255,255,255,0.05)",
  pageBg:  `radial-gradient(circle at 0% 0%, rgba(59,130,246,0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(212,175,55,0.06) 0%, transparent 50%),
            #050505`,
  cardGrad: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
  cardShadow: "0 10px 40px rgba(0,0,0,0.5)",
  tooltipBg: "rgba(10,15,30,0.95)",
  modalBg: "rgba(5,5,5,0.98)",
  rowHover: "rgba(255,255,255,0.03)",
  trackBg: "rgba(255,255,255,0.08)",
  syncBg:  "rgba(10,15,30,0.95)",
  navActive: "rgba(59,130,246,0.15)",
  navHover:  "rgba(255,255,255,0.04)",
  glowBg:  "rgba(10,15,30,0.9)",
  glowBgDeep: "rgba(5,5,5,0.95)",
  glowIntensity: 0.8,
  colorScheme: "dark",
};

const lightTheme = {
  mode:    "light",
  bg:      "#f8fafc",
  surface: "#ffffff",
  card:    "#ffffff",
  cardSolid: "#ffffff",
  sidebar: "linear-gradient(to right, rgba(255,255,255,0.98), rgba(248,250,252,0.95))",
  sidebarBorder: "rgba(0,0,0,0.07)",
  header:  "rgba(255,255,255,0.85)",
  border:  "rgba(0,0,0,0.07)",
  borderH: "rgba(0,0,0,0.13)",
  blue:    "#2563eb",
  gold:    "#b45309", // Refined gold-ish for light mode
  text:    "#64748b",
  textH:   "#0f172a",
  muted:   "#94a3b8",
  dim:     "#e2e8f0",
  inputBg: "rgba(0,0,0,0.04)",
  inputBgSelect: "rgba(0,0,0,0.05)",
  pageBg:  `radial-gradient(circle at 0% 0%, rgba(59,130,246,0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(180,83,9,0.03) 0%, transparent 50%),
            #f8fafc`,
  cardGrad: "linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)",
  cardShadow: "0 4px 24px rgba(0,0,0,0.06)",
  tooltipBg: "rgba(255,255,255,0.98)",
  modalBg: "rgba(255,255,255,0.99)",
  rowHover: "rgba(59,130,246,0.03)",
  trackBg: "rgba(0,0,0,0.06)",
  syncBg:  "rgba(255,255,255,0.95)",
  navActive: "rgba(37,99,235,0.08)",
  navHover:  "rgba(0,0,0,0.04)",
  glowBg:  "rgba(255,255,255,0.92)",
  glowBgDeep: "rgba(248,250,252,0.95)",
  glowIntensity: 0.3,
  colorScheme: "light",
};

// ─── Theme Context ────────────────────────────────────────────────────────────
const ThemeCtx = createContext({ T: darkTheme, isDark: true, toggleTheme: () => {} });
const useTheme = () => useContext(ThemeCtx);

// ─── Style factory — all styles derived from T ────────────────────────────────
function makeStyles(T) {
  return {
    page:    { display:"flex", width:"100%", flex:1, minHeight:"100vh", background:T.pageBg, color:T.text, fontFamily:"'Inter', system-ui, sans-serif", position:"relative", overflowX:"hidden", transition:"background 0.35s ease, color 0.35s ease" },
    sidebar: { width:260, minHeight:"100vh", background:T.sidebar, backdropFilter:"blur(24px)", borderRight:`1px solid ${T.sidebarBorder}`, display:"flex", flexDirection:"column", position:"relative", zIndex:10, flexShrink:0, transition:"background 0.35s ease, border-color 0.35s ease" },
    main:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, position:"relative", zIndex:1 },
    header:  { padding:"20px 32px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:T.header, backdropFilter:"blur(20px)", zIndex:5, transition:"background 0.35s ease, border-color 0.35s ease" },
    scroll:  { flex:1, padding:"32px", overflowY:"auto", scrollBehavior:"smooth" },
    card:    { background:T.card, backdropFilter:T.mode==="dark"?"blur(20px)":"none", border:`1px solid ${T.border}`, borderRadius:16, padding:"24px", position:"relative", overflow:"hidden", boxShadow:T.cardShadow, transition:"background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease" },
    cardGradient: { background:T.cardGrad, border:`1px solid ${T.border}` },
    chip:    (color) => ({ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:`${color}18`, color }),
    badge:   (color) => ({ padding:"3px 8px", borderRadius:6, fontSize:11, fontWeight:700, background:`${color}15`, color, letterSpacing:0.5 }),
    input:   { background:T.inputBg, border:`1px solid ${T.borderH}`, color:T.textH, borderRadius:8, padding:"10px 14px", fontSize:14, width:"100%", outline:"none", transition:"all 0.3s ease" },
    btn:     { background:`linear-gradient(135deg, ${T.blue} 0%, ${T.mode==="dark"?"#1d4ed8":"#1e40af"} 100%)`, color:"#ffffff", border:"none", borderRadius:8, padding:"10px 20px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, letterSpacing:0.5, boxShadow:`0 4px 14px ${T.blue}40` },
    btnOutline: { background:T.mode==="dark"?"transparent":T.surface, color:T.textH, border:`1px solid ${T.borderH}`, borderRadius:8, padding:"10px 20px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, transition:"all 0.2s" },
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CAT_COLORS = {
  Housing:      "#3b82f6",
  Food:         "#60a5fa",
  Transport:    "#1d4ed8",
  Entertainment:"#d4af37",
  Healthcare:   "#fbbf24",
  Shopping:     "#b45309",
  Utilities:    "#94a3b8",
  Salary:       "#3b82f6",
  Freelance:    "#60a5fa",
  Investment:   "#d4af37"
};
const ALL_CATEGORIES = Object.keys(CAT_COLORS);
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun"];
const MM_MAP  = { "01":"Jan","02":"Feb","03":"Mar","04":"Apr","05":"May","06":"Jun" };
let _nextId = 100;

const SEED = [
  { id:1,  date:"2025-01-02", description:"Acme Corp Salary",    amount:5500, type:"income",  category:"Salary" },
  { id:2,  date:"2025-01-05", description:"Apartment Rent",      amount:1800, type:"expense", category:"Housing" },
  { id:3,  date:"2025-01-08", description:"Whole Foods",         amount: 280, type:"expense", category:"Food" },
  { id:4,  date:"2025-01-10", description:"Uber Rides",          amount:  75, type:"expense", category:"Transport" },
  { id:5,  date:"2025-01-12", description:"Netflix Subscription",amount:  18, type:"expense", category:"Entertainment" },
  { id:6,  date:"2025-01-15", description:"Upwork Client",       amount:1200, type:"income",  category:"Freelance" },
  { id:7,  date:"2025-01-18", description:"ConEdison Bill",      amount:  95, type:"expense", category:"Utilities" },
  { id:8,  date:"2025-01-22", description:"Sweetgreen",          amount:  85, type:"expense", category:"Food" },
  { id:9,  date:"2025-01-25", description:"Apple Store",         amount: 220, type:"expense", category:"Shopping" },
  { id:10, date:"2025-01-28", description:"CVS Pharmacy",        amount: 150, type:"expense", category:"Healthcare" },
  { id:11, date:"2025-02-01", description:"Acme Corp Salary",    amount:5500, type:"income",  category:"Salary" },
  { id:12, date:"2025-02-03", description:"Apartment Rent",      amount:1800, type:"expense", category:"Housing" },
  { id:13, date:"2025-02-07", description:"Amazon Purchases",    amount: 310, type:"expense", category:"Shopping" },
  { id:14, date:"2025-02-10", description:"Shell Gas",           amount:  60, type:"expense", category:"Transport" },
  { id:15, date:"2025-03-03", description:"Company Bonus",       amount:7500, type:"income",  category:"Salary" },
  { id:16, date:"2025-03-05", description:"Apartment Rent",      amount:1800, type:"expense", category:"Housing" },
  { id:17, date:"2025-03-12", description:"Trader Joe's",        amount: 295, type:"expense", category:"Food" },
  { id:18, date:"2025-04-01", description:"Vanguard Transfer",   amount:8500, type:"income",  category:"Investment" },
  { id:19, date:"2025-04-04", description:"Apartment Rent",      amount:1800, type:"expense", category:"Housing" },
  { id:20, date:"2025-05-02", description:"Wire Transfer In",    amount:6800, type:"income",  category:"Salary" },
  { id:21, date:"2025-06-02", description:"Acme Corp Salary",    amount:9800, type:"income",  category:"Salary" },
];

const $   = (n) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);
const pct = (n) => `${n.toFixed(1)}%`;

// ─── Motion Variants ──────────────────────────────────────────────────────────
const pageTransition = {
  initial: { opacity:0, y:8 },
  animate: { opacity:1, y:0, transition:{ duration:0.25, ease:"easeOut", staggerChildren:0.03 } },
  exit:    { opacity:0, y:-6, transition:{ duration:0.2, ease:"easeIn" } }
};
const itemAnim  = { initial:{ opacity:0, y:6 }, animate:{ opacity:1, y:0, transition:{ duration:0.25, ease:"easeOut" } } };
const headerAnim = { initial:{ opacity:0, y:-8 }, animate:{ opacity:1, y:0, transition:{ duration:0.25, ease:"easeOut" } } };
const sidebarAnim = {
  open:   { x:0,      transition:{ duration:0.3,  ease:"easeOut" } },
  closed: { x:"-100%", transition:{ duration:0.25, ease:"easeIn"  } }
};

// ─── Theme Toggle Button ──────────────────────────────────────────────────────
function ThemeToggle() {
  const { T, isDark, toggleTheme } = useTheme();
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale:1.05 }}
      whileTap={{ scale:0.92 }}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        display:"flex", alignItems:"center", gap:8,
        padding:"8px 14px", borderRadius:20,
        background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        border:`1px solid ${T.border}`,
        cursor:"pointer", fontSize:12, fontWeight:600,
        color:T.textH, transition:"all 0.3s ease",
        whiteSpace:"nowrap",
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span key="sun" initial={{ rotate:-30, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:30, opacity:0 }} transition={{ duration:0.2 }}>
            <Sun size={14} color="#f59e0b"/>
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ rotate:30, opacity:0 }} animate={{ rotate:0, opacity:1 }} exit={{ rotate:-30, opacity:0 }} transition={{ duration:0.2 }}>
            <Moon size={14} color="#6366f1"/>
          </motion.span>
        )}
      </AnimatePresence>
      <span className="theme-label">{isDark ? "Light" : "Dark"}</span>
    </motion.button>
  );
}

// ─── Chart Tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  const { T } = useTheme();
  if (!active || !payload?.length) return null;
  return (
    <motion.div initial={{ opacity:0, y:3 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.15 }}
      style={{ background:T.tooltipBg, border:`1px solid ${T.borderH}`, borderRadius:8, padding:"14px", fontSize:13, boxShadow:`0 10px 30px rgba(0,0,0,${T.mode==="dark"?0.5:0.12})`, backdropFilter:"blur(12px)" }}>
      <p style={{ margin:"0 0 10px", color:T.text, fontWeight:500, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin:"6px 0", color:p.color || T.textH, display:"flex", justifyContent:"space-between", gap:24, fontWeight:600 }}>
          <span style={{ color:T.text }}>{p.name}</span>
          <span>{$(p.value)}</span>
        </p>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
function DashboardView({ stats, monthlyData, catData }) {
  const { T } = useTheme();
  const S = makeStyles(T);
  const summaryCards = [
    { label:"Total Balance",  value:$(stats.balance),  icon:<Wallet size={20}/>,        color:T.gold,   sub:"Net liquid assets", glow:"gold" },
    { label:"Total Income",   value:$(stats.income),   icon:<ArrowUpRight size={20}/>,  color:T.blue,   sub:`${pct(stats.savingsRate)} savings rate`, glow:"blue" },
    { label:"Total Expenses", value:$(stats.expense),  icon:<ArrowDownRight size={20}/>,color:T.gold,   sub:"Monthly burn rate", glow:"gold" },
    { label:"Security Status",value:"SECURE",           icon:<Shield size={20}/>,        color:T.muted,  sub:"End-to-end encrypted", glow:"blue" }
  ];

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div className="summary-grid">
        {summaryCards.map((c) => (
          <motion.div key={c.label} variants={itemAnim} whileHover={{ y:-3, scale:1.008 }} transition={{ duration:0.2 }}>
            <BorderGlow
              glowColor={c.glow === "blue" ? "210 100 60" : "46 65 52"}
              colors={[T.blue, T.gold]}
              backgroundColor={T.glowBg}
              glowIntensity={T.glowIntensity}
            >
              <div style={{ ...S.card, ...S.cardGradient, height:"100%", boxSizing:"border-box", border:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:14 }}>
                  <div className="card-label" style={{ color:T.text }}>{c.label}</div>
                  <div style={{ color:c.color, opacity:0.8 }}>{c.icon}</div>
                </div>
                <div className="card-value" style={{ color:T.textH }}>{c.value}</div>
                <div style={{ fontSize:13, color:T.text }}>{c.sub}</div>
              </div>
            </BorderGlow>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid">
        <motion.div variants={itemAnim} whileHover={{ y:-3, scale:1.008 }} transition={{ duration:0.2 }}>
          <BorderGlow glowColor="210 100 60" colors={[T.blue, T.gold]} backgroundColor={T.glowBg} glowIntensity={T.glowIntensity}>
            <div style={{ ...S.card, height:"100%", width:"100%", boxSizing:"border-box", border:"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <div>
                  <p style={{ margin:"0 0 4px", fontSize:16, fontWeight:600, color:T.textH }}>Cash Flow Overview</p>
                  <p style={{ margin:0, fontSize:13, color:T.text }}>Income vs expenses over time</p>
                </div>
                <div style={{ padding:"5px 10px", background:`${T.blue}18`, color:T.blue, fontSize:11, borderRadius:20, fontWeight:600 }}>Active Period</div>
              </div>
              <div className="chart-container-large">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top:5, right:8, bottom:0, left:8 }}>
                    <defs>
                      <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor={T.blue} stopOpacity={T.mode==="dark"?0.2:0.12}/>
                        <stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:T.text }} axisLine={{ stroke:T.border }} tickLine={false} dy={10}/>
                    <YAxis tick={{ fontSize:11, fill:T.text }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} dx={-10}/>
                    <Tooltip content={<ChartTooltip/>}/>
                    <Area type="monotone" dataKey="balance" stroke={T.blue} strokeWidth={2.5} fill="url(#gBlue)" activeDot={{ r:5, fill:T.bg, stroke:T.blue, strokeWidth:2 }}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </motion.div>

        <motion.div variants={itemAnim} whileHover={{ y:-3, scale:1.008 }} transition={{ duration:0.2 }}>
          <BorderGlow glowColor="46 65 52" colors={[T.blue, T.gold]} backgroundColor={T.glowBg} glowIntensity={T.glowIntensity}>
            <div style={{ ...S.card, height:"100%", width:"100%", boxSizing:"border-box", border:"none" }}>
              <p style={{ margin:"0 0 4px", fontSize:16, fontWeight:600, color:T.textH }}>Spend by Category</p>
              <p style={{ margin:"0 0 20px", fontSize:13, color:T.text }}>Distribution of current expenses</p>
              <div className="chart-container-pie">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={catData} cx="50%" cy="50%" innerRadius="50%" outerRadius="72%" dataKey="value" paddingAngle={4} stroke="none">
                      {catData.map((e, i) => <Cell key={i} fill={CAT_COLORS[e.name]||T.muted}/>)}
                    </Pie>
                    <Tooltip content={<ChartTooltip/>}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"10px 16px", marginTop:16, justifyContent:"center" }}>
                {catData.slice(0,4).map(c => (
                  <div key={c.name} style={{ display:"flex", alignItems:"center", gap:8, fontSize:12, color:T.textH, fontWeight:500 }}>
                    <div style={{ width:8, height:8, borderRadius:3, background:CAT_COLORS[c.name]||T.muted }}/>
                    {c.name}
                  </div>
                ))}
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
function TransactionsView({ txs, allTxs, search, setSearch, filterCat, setFilterCat, filterType, setFilterType, sortField, sortDir, handleSort, role, onEdit, onDelete, onAdd }) {
  const { T } = useTheme();
  const S = makeStyles(T);
  const allCats = useMemo(() => [...new Set(allTxs.map(t=>t.category))].sort(), [allTxs]);
  const SortArrow = ({ f }) => sortField===f
    ? <span style={{ color:T.blue, fontSize:10 }}>{sortDir==="asc"?"▲":"▼"}</span>
    : <span style={{ color:T.dim, fontSize:10 }}>⇅</span>;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <motion.div variants={itemAnim} className="filter-bar" style={{ background: T.mode==="dark"?"rgba(255,255,255,0.02)":T.surface, border:`1px solid ${T.border}` }}>
        <div style={{ position:"relative", flex:1, minWidth:180 }}>
          <Search size={15} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:T.muted }}/>
          <motion.input whileFocus={{ borderColor:T.blue, boxShadow:`0 0 0 3px ${T.blue}30` }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions..." style={{ ...S.input, paddingLeft:40 }}/>
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.text, cursor:"pointer" }}><X size={15}/></button>}
        </div>

        <div className="filter-selects">
          <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ ...S.input, width:"auto", cursor:"pointer", background:T.inputBgSelect, minWidth:130 }}>
            <option value="all">All Categories</option>
            {allCats.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ ...S.input, width:"auto", cursor:"pointer", background:T.inputBgSelect, minWidth:110 }}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {role==="admin" && (
          <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} style={S.btn} onClick={onAdd}>
            <Plus size={15}/> <span className="btn-text">New Transaction</span>
          </motion.button>
        )}
      </motion.div>

      {txs.length===0 ? (
        <motion.div variants={itemAnim} style={{ ...S.card, textAlign:"center", padding:"60px 24px", borderStyle:"dashed", borderColor:T.borderH }}>
          <div style={{ fontSize:36, marginBottom:16, opacity:0.3, color:T.blue }}>💳</div>
          <p style={{ margin:"0 0 8px", fontSize:18, fontWeight:600, color:T.textH }}>No records found</p>
          <p style={{ margin:0, fontSize:14, color:T.text }}>Try adjusting your filters or search terms.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemAnim} style={{ ...S.card, padding:0 }}>
          <div style={{ overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            <table className="transactions-table" style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.border}`, background:T.mode==="dark"?"rgba(255,255,255,0.01)":T.bg }}>
                  {[["date","Date"],["description","Description"],["category","Category"],["type","Type"],["amount","Amount"]].map(([f,l])=>(
                    <th key={f} onClick={()=>handleSort(f)} className={`th-${f}`}
                      style={{ padding:"16px 20px", textAlign:f==="amount"?"right":"left", color:T.text, cursor:"pointer", fontSize:12, fontWeight:500, letterSpacing:0.5, whiteSpace:"nowrap" }}>
                      {l} <SortArrow f={f}/>
                    </th>
                  ))}
                  {role==="admin" && <th style={{ width:80 }}/>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {txs.map((tx, idx)=>(
                    <motion.tr key={tx.id} layout initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      transition={{ duration:0.2, delay:idx*0.01, ease:"easeOut" }}
                      whileHover={{ backgroundColor:T.rowHover }}
                      style={{ borderBottom:`1px solid ${T.border}`, transition:"background-color 0.2s ease" }}>
                      <td style={{ padding:"14px 20px", color:T.text, whiteSpace:"nowrap" }}>{tx.date}</td>
                      <td style={{ padding:"14px 20px", color:T.textH, fontWeight:500, minWidth:140 }}>{tx.description}</td>
                      <td className="td-category" style={{ padding:"14px 20px" }}><span style={S.chip(CAT_COLORS[tx.category]||T.muted)}>{tx.category}</span></td>
                      <td className="td-type" style={{ padding:"14px 20px" }}><span style={S.badge(tx.type==="income"?T.blue:T.gold)}>{tx.type==="income"?"Income":"Expense"}</span></td>
                      <td style={{ padding:"14px 20px", textAlign:"right", fontWeight:600, color: tx.type==="income" ? T.blue : T.textH, whiteSpace:"nowrap" }}>
                        {tx.type==="income"?"+":"-"}{$(tx.amount)}
                      </td>
                      {role==="admin" && (
                        <td style={{ padding:"14px 20px" }}>
                          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                            <motion.button whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }} onClick={()=>onEdit(tx)} style={{ background:"transparent", border:"none", padding:"4px", cursor:"pointer", color:T.muted, transition:"color 0.2s" }}><Pencil size={15}/></motion.button>
                            <motion.button whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }} onClick={()=>onDelete(tx.id)} style={{ background:"transparent", border:"none", padding:"4px", cursor:"pointer", color:T.muted, transition:"color 0.2s" }}><Trash2 size={15}/></motion.button>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
function InsightsView({ monthlyData, catData }) {
  const { T } = useTheme();
  const S = makeStyles(T);
  const last    = monthlyData[monthlyData.length-1];
  const prev    = monthlyData[monthlyData.length-2];
  const expChg  = prev.expense>0 ? ((last.expense-prev.expense)/prev.expense*100) : 0;
  const totalExp = catData.reduce((s,c)=>s+c.value,0);

  const insightCards = [
    { label:"Highest Expense", color:CAT_COLORS[catData[0]?.name]||T.gold, value:catData[0]?.name||"None", sub:$(catData[0]?.value||0)+" spent", icon:<TrendingDown size={20}/>, detail:"Accounts for "+pct(catData[0]?.value/totalExp*100)+" of expenses" },
    { label:"Burn Rate Change", color:expChg<0?T.blue:T.gold, value:(expChg<0?"Decreased ":"Increased ")+Math.abs(expChg).toFixed(1)+"%", sub:"Compared to last month", icon:expChg<0?<TrendingDown size={20}/>:<TrendingUp size={20}/>, detail:expChg<0?"Lower monthly spend":"Higher capital outflow" },
    { label:"Net Retention", color:T.blue, value:pct(last.income>0?(last.income-last.expense)/last.income*100:0), sub:"Current period", icon:<Shield size={20}/>, detail:`${$(last.income-last.expense)} net addition` },

    { label:"Fixed Overheads", color:CAT_COLORS["Housing"], value:"Housing", sub:$(10800)+" annual", icon:<Shield size={20}/>, detail:"Predictable recurring costs" }
  ];

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div className="summary-grid" style={{ marginBottom:24 }}>
        {insightCards.map((c)=>(
          <motion.div key={c.label} variants={itemAnim} whileHover={{ y:-3, scale:1.008 }} transition={{ duration:0.2 }}>
            <BorderGlow glowColor={c.color===T.blue?"210 100 60":"46 65 52"} colors={[T.blue, T.gold]} backgroundColor={T.glowBg} glowIntensity={T.glowIntensity}>
              <div style={{ ...S.card, ...S.cardGradient, height:"100%", boxSizing:"border-box", border:"none" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                  <span style={{ fontSize:13, color:T.text, fontWeight:500 }}>{c.label}</span>
                  <span style={{ color:c.color }}>{c.icon}</span>
                </div>
                <div style={{ fontSize:20, fontWeight:700, color:T.textH, marginBottom:6 }}>{c.value}</div>
                <div style={{ fontSize:13, fontWeight:500, color:T.textH, marginBottom:6 }}>{c.sub}</div>
                <div style={{ fontSize:12, color:T.text }}>{c.detail}</div>
              </div>
            </BorderGlow>
          </motion.div>
        ))}
      </div>

      <div className="insights-charts-grid">
        <motion.div variants={itemAnim} whileHover={{ y:-3, scale:1.008 }} transition={{ duration:0.2 }}>
          <BorderGlow glowColor="210 100 60" colors={[T.blue, T.gold]} backgroundColor={T.glowBgDeep} fillOpacity={T.mode==="dark"?0.15:0.08} glowIntensity={T.glowIntensity*0.6}>
            <div style={{ ...S.card, height:"100%", width:"100%", boxSizing:"border-box", border:"none" }}>
              <p style={{ margin:"0 0 4px", fontSize:16, fontWeight:600, color:T.textH }}>Income &amp; Expenses</p>
              <p style={{ margin:"0 0 24px", fontSize:13, color:T.text }}>Financial health over the last 6 months</p>
              <div className="chart-container-large">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top:5, right:8, bottom:0, left:8 }} barCategoryGap="25%">
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:T.text }} axisLine={{ stroke:T.border }} tickLine={false} dy={10}/>
                    <YAxis tick={{ fontSize:11, fill:T.text }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} dx={-10}/>
                    <Tooltip content={<ChartTooltip/>}/>
                    <Bar dataKey="income" fill={T.blue} radius={[6,6,0,0]}/>
                    <Bar dataKey="expense" fill={T.gold} radius={[6,6,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </BorderGlow>
        </motion.div>

        <motion.div variants={itemAnim} whileHover={{ y:-3, scale:1.008 }} transition={{ duration:0.2 }}>
          <BorderGlow glowColor="46 65 52" colors={[T.blue, T.gold]} backgroundColor={T.glowBgDeep} fillOpacity={T.mode==="dark"?0.15:0.08} glowIntensity={T.glowIntensity*0.6}>
            <div style={{ ...S.card, height:"100%", width:"100%", boxSizing:"border-box", border:"none" }}>
              <p style={{ margin:"0 0 4px", fontSize:16, fontWeight:600, color:T.textH }}>Expense Breakdown</p>
              <p style={{ margin:"0 0 24px", fontSize:13, color:T.text }}>Category-level allocation metrics</p>
              <div style={{ display:"flex", flexDirection:"column", gap:20, flex:1, overflowY:"auto" }}>
                {catData.slice(0,6).map((c, i)=>{
                  const pctVal = (c.value/totalExp*100);
                  return (
                    <motion.div key={c.name} initial={{ opacity:0, x:-5 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.04, duration:0.2 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <div style={{ width:10, height:10, borderRadius:4, background:CAT_COLORS[c.name]||T.muted }}/>
                          <span style={{ fontSize:13, fontWeight:500, color:T.textH }}>{c.name}</span>
                        </div>
                        <span style={{ fontSize:13, color:T.textH, fontWeight:600 }}>{$(c.value)} <span style={{ color:T.text, fontWeight:400, fontSize:12, marginLeft:6 }}>{pctVal.toFixed(1)}%</span></span>
                      </div>
                      <div style={{ height:7, background:T.trackBg, borderRadius:8, overflow:"hidden" }}>
                        <motion.div initial={{ width:0 }} animate={{ width:`${pctVal}%` }} transition={{ duration:0.4, ease:"easeOut", delay:0.1 }}
                          style={{ height:"100%", background:CAT_COLORS[c.name]||T.muted, borderRadius:8 }}/>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
function TransactionModal({ mode, initialTx, onSave, onClose }) {
  const { T } = useTheme();
  const S = makeStyles(T);
  const [form, setForm] = useState(initialTx);
  const set = (key) => (e) => setForm(f=>({...f,[key]:e.target.value}));
  const isValid = form.description.trim() && parseFloat(form.amount)>0 && form.date;

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:200, padding:"20px" }}>
      <motion.div initial={{ opacity:0, scale:0.97, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.97, y:8 }} transition={{ duration:0.2, ease:"easeOut" }}
        style={{ background:T.modalBg, backdropFilter:"blur(40px)", border:`1px solid ${T.borderH}`, borderRadius:20, padding:"32px", width:"100%", maxWidth:480, position:"relative", boxShadow:`0 25px 60px rgba(0,0,0,${T.mode==="dark"?0.4:0.15})` }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:600, color:T.textH }}>{mode==="add"?"New Transaction":"Edit Transaction"}</h2>
          <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onClose} style={{ background:"none", border:"none", color:T.text, cursor:"pointer" }}><X size={20}/></motion.button>
        </div>

        <div style={{ display:"grid", gap:20 }}>
          <div>
            <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Description</label>
            <motion.input whileFocus={{ borderColor:T.blue, boxShadow:`0 0 0 3px ${T.blue}30` }} style={S.input} value={form.description} onChange={set("description")} placeholder="e.g. AWS Invoice"/>
          </div>
          <div className="modal-grid-2">
            <div>
              <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Amount ($)</label>
              <motion.input whileFocus={{ borderColor:T.blue, boxShadow:`0 0 0 3px ${T.blue}30` }} type="number" style={S.input} value={form.amount} onChange={set("amount")} placeholder="0.00"/>
            </div>
            <div>
              <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Date</label>
              <motion.input whileFocus={{ borderColor:T.blue, boxShadow:`0 0 0 3px ${T.blue}30` }} type="date" style={{...S.input, colorScheme:T.colorScheme}} value={form.date} onChange={set("date")}/>
            </div>
          </div>
          <div className="modal-grid-2">
            <div>
              <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Type</label>
              <select style={S.input} value={form.type} onChange={set("type")}><option value="expense">Expense</option><option value="income">Income</option></select>
            </div>
            <div>
              <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Category</label>
              <select style={S.input} value={form.category} onChange={set("category")}>{ALL_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:12, marginTop:32, justifyContent:"flex-end" }}>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={onClose} style={S.btnOutline}>Cancel</motion.button>
          <motion.button whileHover={isValid?{ scale:1.02, boxShadow:`0 6px 20px ${T.blue}50` }:{}} whileTap={isValid?{ scale:0.98 }:{}}
            onClick={()=>isValid&&onSave({...form,amount:parseFloat(form.amount)})} disabled={!isValid}
            style={{ ...S.btn, opacity:isValid?1:0.5 }}>Save Changes</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP — Theme Provider lives here
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── Theme state ──
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("fundly-theme");
    return saved ? saved === "dark" : true;  // default dark
  });
  const T = isDark ? darkTheme : lightTheme;
  const S = makeStyles(T);

  const toggleTheme = useCallback(() => {
    setIsDark(d => {
      const next = !d;
      localStorage.setItem("fundly-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  // ── App state ──
  const [view, setView]       = useState("dashboard");
  const [role, setRole]       = useState("admin");
  const [txs, setTxs]         = useState(SEED);
  const [search, setSearch]   = useState("");
  const [filterCat, setFilterCat]   = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortField, setSortField]   = useState("date");
  const [sortDir, setSortDir]       = useState("desc");
  const [modal, setModal]     = useState(null);
  const [syncActive, setSyncActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = useCallback((id) => { setView(id); setSidebarOpen(false); }, []);
  const handleOverlayClick = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  // Sync theme to body class for global CSS overrides (scrollbar, etc)
  useEffect(() => {
    if (isDark) {
      document.body.classList.remove("theme-light");
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
      document.body.classList.add("theme-light");
    }
  }, [isDark]);

  const stats = useMemo(()=>{
    const income  = txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const expense = txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return { income, expense, balance:income-expense, savingsRate:income>0?(income-expense)/income*100:0 };
  },[txs]);

  const monthlyData = useMemo(()=>{
    const map={}; MONTHS.forEach(m=>{map[m]={month:m,income:0,expense:0,balance:0};});
    txs.forEach(t=>{ const m=MM_MAP[t.date.slice(5,7)]; if(!m)return; if(t.type==="income") map[m].income+=t.amount; else map[m].expense+=t.amount; });
    let run=0; return MONTHS.map(m=>{ run+=map[m].income-map[m].expense; return{...map[m],balance:run}; });
  },[txs]);

  const catData = useMemo(()=>{
    const map={}; txs.filter(t=>t.type==="expense").forEach(t=>{map[t.category]=(map[t.category]||0)+t.amount;});
    return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  },[txs]);

  const filteredTxs = useMemo(()=>{
    let list=[...txs];
    if(search) list=list.filter(t=>t.description.toLowerCase().includes(search.toLowerCase())||t.category.toLowerCase().includes(search.toLowerCase()));
    if(filterCat!=="all") list=list.filter(t=>t.category===filterCat);
    if(filterType!=="all") list=list.filter(t=>t.type===filterType);
    list.sort((a,b)=>{ const av=sortField==="amount"?a.amount:a[sortField]; const bv=sortField==="amount"?b.amount:b[sortField]; return sortDir==="asc"?(av<bv?-1:av>bv?1:0):(av>bv?-1:av<bv?1:0); });
    return list;
  },[txs,search,filterCat,filterType,sortField,sortDir]);

  const handleSort   = (f) => { if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortField(f); setSortDir("desc"); } };
  const handleDelete = (id) => setTxs(p=>p.filter(t=>t.id!==id));
  const handleSave   = (tx) => { if(tx.id) setTxs(p=>p.map(t=>t.id===tx.id?tx:t)); else setTxs(p=>[{...tx,id:++_nextId},...p]); setModal(null); };
  const openAdd      = () => setModal({ mode:"add", tx:{ description:"", amount:"", type:"expense", category:"Housing", date:new Date().toISOString().slice(0,10) }});

  const navItems = [
    { id:"dashboard",    label:"Overview",     icon:<LayoutDashboard size={18}/> },
    { id:"transactions", label:"Transactions", icon:<List size={18}/> },
    { id:"insights",     label:"Insights",     icon:<Lightbulb size={18}/> }
  ];

  const SidebarContent = () => (
    <>
      <div style={{ padding:"28px 24px", borderBottom:`1px solid ${T.sidebarBorder}` }}>
        <motion.div initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.25 }}
          style={{ fontSize:20, fontWeight:700, color:T.textH, display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:`linear-gradient(135deg, ${T.blue}, ${T.mode==="dark"?"#1d4ed8":"#1e40af"})`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Wallet size={16} color="#fff"/>
          </div>
          Fundly
        </motion.div>
      </div>
      <nav style={{ flex:1, padding:"24px 16px" }}>
        {navItems.map(item=>(
          <motion.button key={item.id} onClick={()=>handleNavClick(item.id)}
            whileHover={{ backgroundColor: view===item.id ? T.navActive : T.navHover }}
            whileTap={{ scale:0.98 }}
            style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 18px", borderRadius:12, border:"none", cursor:"pointer", background:view===item.id?T.navActive:"transparent", color:view===item.id?T.blue:T.text, fontSize:14, fontWeight:view===item.id?600:500, marginBottom:6, transition:"all 0.2s ease" }}>
            {item.icon}{item.label}
          </motion.button>
        ))}
        <div style={{ marginTop:32 }}>
          <motion.button onClick={()=>{ setSyncActive(true); setSidebarOpen(false); setTimeout(()=>setSyncActive(false),2500); }}
            whileHover={{ backgroundColor: T.navHover }}
            whileTap={{ scale:0.98 }}
            style={{ width:"100%", background:"transparent", color:T.text, border:`1px solid ${T.border}`, padding:"13px", borderRadius:12, fontWeight:500, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            Sync Accounts
          </motion.button>
        </div>
      </nav>
      <div style={{ padding:"20px 24px", borderTop:`1px solid ${T.sidebarBorder}` }}>
        <select value={role} onChange={e=>setRole(e.target.value)} style={{ ...S.input, background:T.inputBgSelect, color:T.textH, borderColor:T.borderH, fontSize:13 }}>
          <option value="admin">Administrator</option>
          <option value="viewer">Viewer Access</option>
        </select>
      </div>
    </>
  );

  return (
    <ThemeCtx.Provider value={{ T, isDark, toggleTheme }}>
      <div style={S.page}>
        {/* ── Sync toast ── */}
        <AnimatePresence>
          {syncActive && (
            <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }} transition={{ duration:0.3 }}
              style={{ position:"fixed", top:24, left:"50%", transform:"translateX(-50%)", zIndex:999, background:T.syncBg, backdropFilter:"blur(12px)", border:`1px solid ${T.border}`, borderRadius:20, padding:"10px 22px", color:T.textH, fontWeight:600, fontSize:13, boxShadow:`0 10px 40px rgba(0,0,0,0.25)` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1, ease:"linear" }}
                  style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${T.border}`, borderTopColor:T.blue }}/>
                Syncing Ledger Data...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile overlay ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}
              onClick={handleOverlayClick}
              style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", backdropFilter:"blur(2px)", zIndex:90 }}/>
          )}
        </AnimatePresence>

        {/* ── Desktop Sidebar ── */}
        <aside className="sidebar-desktop" style={S.sidebar}>
          <SidebarContent/>
        </aside>

        {/* ── Mobile Sidebar (drawer) ── */}
        <motion.aside className="sidebar-mobile" variants={sidebarAnim} animate={sidebarOpen?"open":"closed"} initial="closed"
          style={{ ...S.sidebar, position:"fixed", top:0, left:0, zIndex:100, width:260, height:"100vh", boxShadow:"4px 0 40px rgba(0,0,0,0.3)" }}>
          <SidebarContent/>
        </motion.aside>

        {/* ── Main ── */}
        <main style={S.main}>
          <motion.header variants={headerAnim} initial="initial" animate="animate" style={S.header}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <motion.button className="hamburger-btn" whileTap={{ scale:0.9 }} onClick={()=>setSidebarOpen(o=>!o)}
                style={{ background:T.mode==="dark"?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.05)", border:`1px solid ${T.border}`, borderRadius:10, padding:"8px", cursor:"pointer", color:T.textH, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Menu size={20}/>
              </motion.button>
              <div>
                <h1 className="page-title" style={{ margin:0, fontWeight:600, color:T.textH }}>
                  {view==="dashboard"?"Dashboard":view==="transactions"?"Transactions":"Financial Insights"}
                </h1>
                <p className="page-subtitle" style={{ margin:"2px 0 0", fontSize:13, color:T.text }}>Manage your cash flow and analytics</p>
              </div>
            </div>

            {/* ── Header right: Role badge + Theme Toggle ── */}
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <motion.div whileHover={{ scale:1.02 }}
                style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 14px", background:T.mode==="dark"?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.04)", border:`1px solid ${T.border}`, borderRadius:20, fontSize:12, color:T.text, fontWeight:500 }}>
                {role==="admin"?<Shield size={13}/>:<Eye size={13}/>}
                <span className="role-label">{role==="admin"?"Admin Controls":"Read Only"}</span>
              </motion.div>
              <ThemeToggle/>
            </div>
          </motion.header>

          <div style={S.scroll} className="main-scroll">
            <AnimatePresence mode="wait">
              {view==="dashboard"    && <DashboardView    key="dashboard"    stats={stats} monthlyData={monthlyData} catData={catData}/>}
              {view==="transactions" && <TransactionsView key="transactions" txs={filteredTxs} allTxs={txs} search={search} setSearch={setSearch} filterCat={filterCat} setFilterCat={setFilterCat} filterType={filterType} setFilterType={setFilterType} sortField={sortField} sortDir={sortDir} handleSort={handleSort} role={role} onEdit={(tx)=>setModal({mode:"edit",tx:{...tx}})} onDelete={handleDelete} onAdd={openAdd}/>}
              {view==="insights"     && <InsightsView     key="insights"     monthlyData={monthlyData} catData={catData}/>}
            </AnimatePresence>
          </div>
        </main>

        <AnimatePresence>
          {modal && <TransactionModal key="modal" mode={modal.mode} initialTx={modal.tx} onSave={handleSave} onClose={()=>setModal(null)}/>}
        </AnimatePresence>
      </div>
    </ThemeCtx.Provider>
  );
}
