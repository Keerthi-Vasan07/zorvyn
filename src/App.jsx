import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  LayoutDashboard, List, Lightbulb, Shield, Eye,
  Plus, Pencil, Trash2, Search, X, TrendingUp, TrendingDown,
  Wallet, ArrowUpRight, ArrowDownRight, TerminalSquare
} from "lucide-react";

// ─── Design tokens (Modern Fintech Theme) ───────────────────────────────────
const T = {
  bg:      "#0b0f1a",
  surface: "#111827",
  card:    "rgba(255, 255, 255, 0.03)",
  border:  "rgba(255, 255, 255, 0.06)",
  borderH: "rgba(255, 255, 255, 0.12)",
  blue:    "#3b82f6",
  orange:  "#f97316",
  text:    "#9ca3af",
  textH:   "#f9fafb",
  muted:   "#6b7280",
  dim:     "#374151"
};

const CAT_COLORS = { Housing:"#3b82f6", Food:"#60a5fa", Transport:"#1d4ed8", Entertainment:"#f97316", Healthcare:"#fb923c", Shopping:"#ea580c", Utilities:"#9ca3af", Salary:"#3b82f6", Freelance:"#60a5fa", Investment:"#f97316" };
const ALL_CATEGORIES = Object.keys(CAT_COLORS);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
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

const $  = (n) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);
const pct = (n) => `${n.toFixed(1)}%`;

// ─── Style factory (Fintech Glassmorphism) ────────────────────────────────────
const S = {
  page:    { display:"flex", minHeight:"100vh", background:`radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(249, 115, 22, 0.1) 0%, transparent 45%), ${T.bg}`, color:T.text, fontFamily:"'Inter', system-ui, sans-serif", position:"relative" },
  sidebar: { width:260, minHeight:"100vh", background:`linear-gradient(to right, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.5))`, backdropFilter:"blur(24px)", borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", position:"relative", zIndex:10 },
  main:    { flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, position:"relative", zIndex:1 },
  header:  { padding:"24px 40px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0, background:"rgba(11, 15, 26, 0.5)", backdropFilter:"blur(20px)", zIndex:5 },
  scroll:  { flex:1, padding:"40px", overflowY:"auto", scrollBehavior:"smooth" },
  card:    { background:T.card, backdropFilter:"blur(20px)", border:`1px solid ${T.border}`, borderRadius:16, padding:"28px", position:"relative", overflow:"hidden", boxShadow:`0 10px 40px rgba(0,0,0,0.2)` },
  cardGradient: { background: `linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)`, border:`1px solid rgba(255,255,255,0.08)` },
  chip:    (color) => ({ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:20, fontSize:12, fontWeight:600, background:`${color}1a`, color }),
  badge:   (color) => ({ padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:700, background:`${color}15`, color, letterSpacing:0.5 }),
  input:   { background:"rgba(0,0,0,0.2)", border:`1px solid ${T.borderH}`, color:T.textH, borderRadius:8, padding:"12px 16px", fontSize:14, width:"100%", outline:"none", transition:"all 0.3s ease" },
  btn:     { background:`linear-gradient(135deg, ${T.blue} 0%, #2563eb 100%)`, color:"#ffffff", border:"none", borderRadius:8, padding:"12px 24px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, letterSpacing:0.5, boxShadow:`0 4px 14px rgba(59, 130, 246, 0.3)` },
  btnOutline:{ background:"transparent", color:T.textH, border:`1px solid ${T.borderH}`, borderRadius:8, padding:"12px 24px", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, transition:"all 0.2s" }
};

// ─── Framer Motion Variants (Smooth) ──────────────────────────────────────────
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.05 } },
  exit:    { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } }
};

const itemAnim = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const headerAnim = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// ─── Custom Tooltip (Glass Style) ────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <motion.div initial={{ opacity:0, y: 5 }} animate={{ opacity:1, y: 0 }}
      style={{ background:"rgba(17, 24, 39, 0.9)", border:`1px solid ${T.borderH}`, borderRadius:8, padding:"16px", fontSize:13, boxShadow:`0 10px 30px rgba(0,0,0,0.5)`, backdropFilter:"blur(12px)" }}>
      <p style={{ margin:"0 0 12px", color:T.text, fontWeight:500, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin:"6px 0", color:p.color || T.textH, display:"flex", justifyContent:"space-between", gap:24, fontWeight:600 }}>
          <span style={{ color: T.text }}>{p.name}</span>
          <span>{$(p.value)}</span>
        </p>
      ))}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
function DashboardView({ stats, monthlyData, catData }) {
  const summaryCards = [
    { label:"Total Balance",  value:$(stats.balance), icon:<Wallet size={20}/>, color:T.blue, sub:"Net liquid assets" },
    { label:"Total Income",   value:$(stats.income),  icon:<ArrowUpRight size={20}/>, color:T.blue, sub:`${pct(stats.savingsRate)} savings rate` },
    { label:"Total Expenses", value:$(stats.expense), icon:<ArrowDownRight size={20}/>, color:T.orange, sub:"Monthly burn rate" },
    { label:"Security Status",value:"SECURE", icon:<Shield size={20}/>, color:T.text, sub:"End-to-end encrypted" }
  ];

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, marginBottom:32 }}>
        {summaryCards.map((c, i) => (
          <motion.div key={c.label} variants={itemAnim} whileHover={{ y: -6, scale: 1.02, boxShadow: `0 20px 40px rgba(0,0,0,0.4)` }} transition={{ duration: 0.3 }}
               style={{ ...S.card, ...S.cardGradient }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
              <div style={{ fontSize:14, color:T.textH, fontWeight:500 }}>{c.label}</div>
              <div style={{ color:c.color, opacity:0.8 }}>{c.icon}</div>
            </div>
            <div style={{ fontSize:32, fontWeight:700, color:T.textH, letterSpacing:"-0.5px", marginBottom:8 }}>{c.value}</div>
            <div style={{ fontSize:13, color:T.text }}>{c.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:24, marginBottom:24 }}>
        <motion.div variants={itemAnim} whileHover={{ boxShadow: `0 15px 40px rgba(0,0,0,0.3)` }} transition={{ duration: 0.4 }} style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
            <div>
              <p style={{ margin:"0 0 4px", fontSize:18, fontWeight:600, color:T.textH }}>Cash Flow Overview</p>
              <p style={{ margin:0, fontSize:13, color:T.text }}>Income vs expenses over time</p>
            </div>
            <div style={{ padding:"6px 12px", background:`rgba(59, 130, 246, 0.1)`, color:T.blue, fontSize:12, borderRadius:20, fontWeight:600 }}>Active Period</div>
          </div>
          <div style={{ height:300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top:5, right:8, bottom:0, left:8 }}>
                <defs>
                  <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor={T.blue} stopOpacity={0.2}/>
                    <stop offset="100%" stopColor={T.blue} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize:12, fill:T.text }} axisLine={{ stroke:T.border }} tickLine={false} dy={10}/>
                <YAxis tick={{ fontSize:12, fill:T.text }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} dx={-10}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Area type="monotone" dataKey="balance" stroke={T.blue} strokeWidth={3} fill="url(#gBlue)" activeDot={{ r:6, fill:T.bg, stroke:T.blue, strokeWidth:2 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemAnim} whileHover={{ boxShadow: `0 15px 40px rgba(0,0,0,0.3)` }} transition={{ duration: 0.4 }} style={S.card}>
          <p style={{ margin:"0 0 4px", fontSize:18, fontWeight:600, color:T.textH }}>Spend by Category</p>
          <p style={{ margin:"0 0 24px", fontSize:13, color:T.text }}>Distribution of current expenses</p>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} dataKey="value" paddingAngle={4} stroke="none">
                  {catData.map((e, i) => <Cell key={i} fill={CAT_COLORS[e.name]||T.muted}/>)}
                </Pie>
                <Tooltip content={<ChartTooltip/>}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:"12px 20px", marginTop:24, justifyContent:"center" }}>
            {catData.slice(0,4).map(c => (
              <div key={c.name} style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, color:T.textH, fontWeight:500 }}>
                <div style={{ width:10, height:10, borderRadius:3, background:CAT_COLORS[c.name]||T.muted }}/>
                {c.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
function TransactionsView({ txs, allTxs, search, setSearch, filterCat, setFilterCat, filterType, setFilterType, sortField, sortDir, handleSort, role, onEdit, onDelete, onAdd }) {
  const allCats = useMemo(() => [...new Set(allTxs.map(t=>t.category))].sort(), [allTxs]);
  const SortArrow = ({ f }) => sortField===f ? <span style={{ color:T.blue, fontSize:10 }}>{sortDir==="asc"?"▲":"▼"}</span> : <span style={{ color:T.dim, fontSize:10 }}>⇅</span>;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <motion.div variants={itemAnim} style={{ display:"flex", flexWrap:"wrap", gap:16, marginBottom:32, alignItems:"center", background:"rgba(255, 255, 255, 0.02)", backdropFilter:"blur(12px)", padding:"20px", border:`1px solid ${T.border}`, borderRadius:16, boxShadow:"0 4px 20px rgba(0,0,0,0.1)" }}>
        <div style={{ position:"relative", flex:1, minWidth:260 }}>
          <Search size={16} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:T.muted }}/>
          <motion.input whileFocus={{ borderColor: T.blue, boxShadow:`0 0 0 3px rgba(59, 130, 246, 0.2)` }} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search transactions..." style={{ ...S.input, paddingLeft:44 }}/>
          {search && <button onClick={()=>setSearch("")} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:T.text, cursor:"pointer" }}><X size={16}/></button>}
        </div>

        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ ...S.input, width:"auto", cursor:"pointer", background:"rgba(0,0,0,0.3)" }}>
          <option value="all">All Categories</option>
          {allCats.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ ...S.input, width:"auto", cursor:"pointer", background:"rgba(0,0,0,0.3)" }}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {role==="admin" && (
          <motion.button whileHover={{ scale: 1.03, boxShadow:`0 6px 20px rgba(59, 130, 246, 0.4)` }} whileTap={{ scale: 0.97 }} style={S.btn} onClick={onAdd}>
            <Plus size={16}/> New Transaction
          </motion.button>
        )}
      </motion.div>

      {txs.length===0 ? (
        <motion.div variants={itemAnim} style={{ ...S.card, textAlign:"center", padding:"80px 24px", borderStyle:"dashed", borderColor: T.borderH }}>
          <div style={{ fontSize:40, marginBottom:20, opacity:0.3, color:T.blue }}>💳</div>
          <p style={{ margin:"0 0 8px", fontSize:20, fontWeight:600, color:T.textH }}>No records found</p>
          <p style={{ margin:0, fontSize:14, color:T.text }}>Try adjusting your filters or search terms.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemAnim} style={{ ...S.card, padding:0 }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${T.border}`, background:`rgba(255,255,255,0.01)` }}>
                  {[["date","Date"],["description","Description"],["category","Category"],["type","Type"],["amount","Amount"]].map(([f,l])=>(
                    <th key={f} onClick={()=>handleSort(f)} style={{ padding:"18px 28px", textAlign:f==="amount"?"right":"left", color:T.text, cursor:"pointer", fontSize:12, fontWeight:500, letterSpacing:0.5 }}>{l} <SortArrow f={f}/></th>
                  ))}
                  {role==="admin" && <th style={{ width:100 }}/>}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {txs.map((tx, idx)=>(
                    <motion.tr key={tx.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4, delay: idx * 0.02, ease: "easeOut" }}
                      whileHover={{ backgroundColor: `rgba(255, 255, 255, 0.03)` }} style={{ borderBottom:`1px solid ${T.border}`, transition: "background-color 0.2s ease" }}>
                      <td style={{ padding:"18px 28px", color:T.text }}>{tx.date}</td>
                      <td style={{ padding:"18px 28px", color:T.textH, fontWeight:500 }}>{tx.description}</td>
                      <td style={{ padding:"18px 28px" }}><span style={S.chip(CAT_COLORS[tx.category]||T.muted)}>{tx.category}</span></td>
                      <td style={{ padding:"18px 28px" }}><span style={S.badge(tx.type==="income"?T.blue:T.orange)}>{tx.type==="income"?"Income":"Expense"}</span></td>
                      <td style={{ padding:"18px 28px", textAlign:"right", fontWeight:600, color:T.textH }}>{tx.type==="income"?"+":"-"}{$(tx.amount)}</td>
                      {role==="admin" && (
                        <td style={{ padding:"18px 28px" }}>
                          <div style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
                            <motion.button whileHover={{ scale: 1.15, color:T.blue }} whileTap={{ scale: 0.9 }} onClick={()=>onEdit(tx)} style={{ background:`transparent`, border:`none`, padding:"4px", cursor:"pointer", color:T.text, transition:"color 0.2s" }}><Pencil size={16}/></motion.button>
                            <motion.button whileHover={{ scale: 1.15, color:T.orange }} whileTap={{ scale: 0.9 }} onClick={()=>onDelete(tx.id)} style={{ background:`transparent`, border:`none`, padding:"4px", cursor:"pointer", color:T.text, transition:"color 0.2s" }}><Trash2 size={16}/></motion.button>
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
  const last = monthlyData[monthlyData.length-1];
  const prev = monthlyData[monthlyData.length-2];
  const expChg = prev.expense > 0 ? ((last.expense-prev.expense)/prev.expense*100) : 0;
  const totalExp = catData.reduce((s,c)=>s+c.value,0);

  const insightCards = [
    { label:"Highest Expense", color:CAT_COLORS[catData[0]?.name]||T.blue, value:catData[0]?.name||"None", sub:$(catData[0]?.value||0)+" spent", icon:<TrendingDown size={20}/>, detail:"Accounts for "+pct(catData[0]?.value/totalExp*100)+" of expenses" },
    { label:"Burn Rate Change", color:expChg<0?T.blue:T.orange, value:(expChg<0?"Decreased ":"Increased ")+Math.abs(expChg).toFixed(1)+"%", sub:"Compared to last month", icon:expChg<0?<TrendingDown size={20}/>:<TrendingUp size={20}/>, detail:expChg<0?"Lower monthly spend":"Higher capital outflow" },
    { label:"Net Retention", color:T.blue, value:pct(last.income>0?(last.income-last.expense)/last.income*100:0), sub:"Current period", icon:<Shield size={20}/>, detail:`${$(last.income-last.expense)} net addition` },
    { label:"Fixed Overheads", color:CAT_COLORS["Housing"], value:"Housing", sub:$(10800)+" annual", icon:<Shield size={20}/>, detail:"Predictable recurring costs" }
  ];

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, marginBottom:32 }}>
        {insightCards.map((c,i)=>(
          <motion.div key={c.label} variants={itemAnim} whileHover={{ y: -6, scale: 1.02, boxShadow: `0 20px 40px rgba(0,0,0,0.3)` }} transition={{ duration: 0.4 }}
               style={{ ...S.card, ...S.cardGradient }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}><span style={{ fontSize:13, color:T.text, fontWeight:500 }}>{c.label}</span><span style={{ color:c.color }}>{c.icon}</span></div>
            <div style={{ fontSize:24, fontWeight:700, color:T.textH, marginBottom:8 }}>{c.value}</div>
            <div style={{ fontSize:14, fontWeight:500, color:T.textH, marginBottom:8 }}>{c.sub}</div>
            <div style={{ fontSize:13, color:T.text }}>{c.detail}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <motion.div variants={itemAnim} whileHover={{ boxShadow: `0 15px 40px rgba(0,0,0,0.3)` }} style={S.card}>
          <p style={{ margin:"0 0 6px", fontSize:18, fontWeight:600, color:T.textH }}>Income & Expenses</p>
          <p style={{ margin:"0 0 32px", fontSize:13, color:T.text }}>Financial health over the last 6 months</p>
          <div style={{ height:280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top:5, right:8, bottom:0, left:8 }} barCategoryGap="25%">
                <XAxis dataKey="month" tick={{ fontSize:12, fill:T.text }} axisLine={{ stroke:T.borderH }} tickLine={false} dy={10}/>
                <YAxis tick={{ fontSize:12, fill:T.text }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} dx={-10}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Bar dataKey="income" fill={T.blue} radius={[6,6,0,0]} />
                <Bar dataKey="expense" fill={T.orange} radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemAnim} whileHover={{ boxShadow: `0 15px 40px rgba(0,0,0,0.3)` }} style={S.card}>
          <p style={{ margin:"0 0 6px", fontSize:18, fontWeight:600, color:T.textH }}>Expense Breakdown</p>
          <p style={{ margin:"0 0 32px", fontSize:13, color:T.text }}>Category-level allocation metrics</p>
          <div style={{ display:"flex", flexDirection:"column", gap:24, flex:1, overflowY:"auto" }}>
            {catData.slice(0,6).map((c, i)=>{
              const pctVal = (c.value/totalExp*100);
              return (
                <motion.div key={c.name} initial={{ opacity:0, x: -10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:12, height:12, borderRadius:4, background:CAT_COLORS[c.name]||T.muted }}/>
                      <span style={{ fontSize:14, fontWeight:500, color:T.textH }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize:14, color:T.textH, fontWeight:600 }}>{$(c.value)} <span style={{ color:T.text, fontWeight:400, fontSize:13, marginLeft:8 }}>{pctVal.toFixed(1)}%</span></span>
                  </div>
                  <div style={{ height:8, background:"rgba(255,255,255,0.06)", borderRadius:8, overflow:"hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pctVal}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} style={{ height:"100%", background:CAT_COLORS[c.name]||T.muted, borderRadius:8 }}/>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
function TransactionModal({ mode, initialTx, onSave, onClose }) {
  const [form, setForm] = useState(initialTx);
  const set = (key) => (e) => setForm(f=>({...f,[key]:e.target.value}));
  const isValid = form.description.trim() && parseFloat(form.amount)>0 && form.date;

  return (
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ background:"rgba(17, 24, 39, 0.95)", backdropFilter:"blur(40px)", border:`1px solid ${T.borderH}`, borderRadius:20, padding:40, width:480, position:"relative", boxShadow:`0 25px 60px rgba(0,0,0,0.4)` }}>
        
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32 }}>
          <h2 style={{ margin:0, fontSize:20, fontWeight:600, color:T.textH }}>{mode==="add"?"New Transaction":"Edit Transaction"}</h2>
          <motion.button whileHover={{ scale: 1.1, color: T.textH }} whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background:"none", border:"none", color:T.text, cursor:"pointer" }}><X size={20}/></motion.button>
        </div>

        <div style={{ display:"grid", gap:24 }}>
          <div>
            <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Description</label>
            <motion.input whileFocus={{ borderColor: T.blue, boxShadow:`0 0 0 3px rgba(59, 130, 246, 0.2)` }} style={S.input} value={form.description} onChange={set("description")} placeholder="e.g. AWS Invoice"/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div>
              <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Amount ($)</label>
              <motion.input whileFocus={{ borderColor: T.blue, boxShadow:`0 0 0 3px rgba(59, 130, 246, 0.2)` }} type="number" style={S.input} value={form.amount} onChange={set("amount")} placeholder="0.00"/>
            </div>
            <div>
              <label style={{ fontSize:13, color:T.text, display:"block", marginBottom:8, fontWeight:500 }}>Date</label>
              <motion.input whileFocus={{ borderColor: T.blue, boxShadow:`0 0 0 3px rgba(59, 130, 246, 0.2)` }} type="date" style={{...S.input, colorScheme:"dark"}} value={form.date} onChange={set("date")}/>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
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

        <div style={{ display:"flex", gap:16, marginTop:40, justifyContent:"flex-end" }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} style={S.btnOutline}>Cancel</motion.button>
          <motion.button whileHover={isValid ? { scale: 1.02, boxShadow:`0 6px 20px rgba(59, 130, 246, 0.4)` } : {}} whileTap={isValid ? { scale: 0.98 } : {}} onClick={()=>isValid&&onSave({...form,amount:parseFloat(form.amount)})} disabled={!isValid} style={{ ...S.btn, opacity:isValid?1:0.5 }}>Save Changes</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("dashboard");
  const [role, setRole] = useState("admin");
  const [txs, setTxs] = useState(SEED);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [modal, setModal] = useState(null);
  const [syncActive, setSyncActive] = useState(false);

  const stats = useMemo(()=>{
    const income = txs.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const expense = txs.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return { income, expense, balance:income-expense, savingsRate:income>0?(income-expense)/income*100:0 };
  },[txs]);

  const monthlyData = useMemo(()=>{
    const map={}; MONTHS.forEach(m=>{map[m]={month:m,income:0,expense:0,balance:0};});
    txs.forEach(t=>{ const m=MM_MAP[t.date.slice(5,7)]; if(!m)return; if(t.type==="income") map[m].income+=t.amount; else map[m].expense+=t.amount; });
    let run=0; return MONTHS.map(m=>{run+=map[m].income-map[m].expense;return{...map[m],balance:run};});
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
    list.sort((a,b)=>{ const av=sortField==="amount"?a.amount:a[sortField]; const bv=sortField==="amount"?b.amount:b[sortField]; return sortDir==="asc"?(av<bv?-1:av>bv?1:0):(av>bv?-1:av<bv?1:0);});
    return list;
  },[txs,search,filterCat,filterType,sortField,sortDir]);

  const handleSort=(f)=>{ if(sortField===f) setSortDir(d=>d==="asc"?"desc":"asc"); else { setSortField(f); setSortDir("desc"); } };
  const handleDelete=(id)=>setTxs(p=>p.filter(t=>t.id!==id));
  const handleSave=(tx)=>{ if(tx.id) setTxs(p=>p.map(t=>t.id===tx.id?tx:t)); else setTxs(p=>[{...tx,id:++_nextId}, ...p]); setModal(null); };
  const openAdd=()=>setModal({ mode:"add", tx:{ description:"", amount:"", type:"expense", category:"Housing", date:new Date().toISOString().slice(0,10) }});

  return (
    <div style={S.page}>
      <AnimatePresence>
        {syncActive && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
            style={{ position:"fixed", top:30, left:"50%", transform:"translateX(-50%)", zIndex:999, background:"rgba(17, 24, 39, 0.9)", backdropFilter:"blur(12px)", border:`1px solid ${T.border}`, borderRadius:20, padding:"12px 24px", color:T.textH, fontWeight:600, fontSize:13, boxShadow:`0 10px 40px rgba(0,0,0,0.3)` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width:14, height:14, borderRadius:"50%", border:`2px solid ${T.border}`, borderTopColor:T.blue }}/>
              Syncing Ledger Data...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside style={S.sidebar}>
        <div style={{ padding:"36px 32px", borderBottom:`1px solid ${T.border}` }}>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ fontSize:22, fontWeight:700, color:T.textH, display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:`linear-gradient(135deg, ${T.blue}, #2563eb)`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}><Wallet size={16} color="#fff"/></div>
            Treasury
          </motion.div>
        </div>
        <nav style={{ flex:1, padding:"32px 20px" }}>
          {[ { id:"dashboard", label:"Overview", icon:<LayoutDashboard size={18}/> }, { id:"transactions", label:"Transactions", icon:<List size={18}/> }, { id:"insights", label:"Insights", icon:<Lightbulb size={18}/> } ].map(item=>(
            <motion.button key={item.id} onClick={()=>setView(item.id)} whileHover={{ backgroundColor: view===item.id?`rgba(59, 130, 246, 0.1)`:`rgba(255,255,255,0.03)` }} whileTap={{ scale: 0.98 }}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"14px 20px", borderRadius:12, border:"none", cursor:"pointer", background:view===item.id?`rgba(59, 130, 246, 0.1)`:"transparent", color:view===item.id?T.blue:T.text, fontSize:14, fontWeight:view===item.id?600:500, marginBottom:8, transition:"all 0.2s ease" }}>
              {item.icon}{item.label}
            </motion.button>
          ))}
          <div style={{ marginTop: 40 }}>
            <motion.button onClick={()=>{setSyncActive(true); setTimeout(()=>setSyncActive(false),2500);}} whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }} whileTap={{ scale: 0.98 }}
              style={{ width:"100%", background:"transparent", color:T.text, border:`1px solid ${T.border}`, padding:"14px", borderRadius:12, fontWeight:500, cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              Sync Accounts
            </motion.button>
          </div>
        </nav>
        <div style={{ padding:"24px 32px", borderTop:`1px solid ${T.border}` }}>
          <select value={role} onChange={e=>setRole(e.target.value)} style={{ ...S.input, background:"rgba(0,0,0,0.3)", color:T.textH, borderColor:T.borderH, fontSize:13 }}><option value="admin">Administrator</option><option value="viewer">Viewer Access</option></select>
        </div>
      </aside>

      <main style={S.main}>
        <motion.header variants={headerAnim} initial="initial" animate="animate" style={S.header}>
          <div>
            <h1 style={{ margin:0, fontSize:22, fontWeight:600, color:T.textH }}>{view==="dashboard"?"Dashboard":view==="transactions"?"Transactions":"Financial Insights"}</h1>
            <p style={{ margin:"4px 0 0", fontSize:13, color:T.text }}>Manage your cash flow and analytics</p>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", background:`rgba(255,255,255,0.03)`, border:`1px solid ${T.border}`, borderRadius:20, fontSize:12, color:T.text, fontWeight:500 }}>
            {role==="admin"?<Shield size={14}/>:<Eye size={14}/>}{role==="admin"?"Admin Controls":"Read Only"}
          </motion.div>
        </motion.header>

        <div style={S.scroll}>
          <AnimatePresence mode="wait">
            {view==="dashboard"    && <DashboardView key="dashboard" stats={stats} monthlyData={monthlyData} catData={catData}/>}
            {view==="transactions" && <TransactionsView key="transactions" txs={filteredTxs} allTxs={txs} search={search} setSearch={setSearch} filterCat={filterCat} setFilterCat={setFilterCat} filterType={filterType} setFilterType={setFilterType} sortField={sortField} sortDir={sortDir} handleSort={handleSort} role={role} onEdit={(tx)=>setModal({mode:"edit",tx:{...tx}})} onDelete={handleDelete} onAdd={openAdd} />}
            {view==="insights"     && <InsightsView key="insights" monthlyData={monthlyData} catData={catData} />}
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {modal && <TransactionModal key="modal" mode={modal.mode} initialTx={modal.tx} onSave={handleSave} onClose={()=>setModal(null)} />}
      </AnimatePresence>
    </div>
  );
}
