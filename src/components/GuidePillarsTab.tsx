import React from 'react';
import { 
  GUIDE_QUESTIONS, 
  GuideQuestion 
} from '../data/newcomerGuide';
import { 
  Coins, 
  ReceiptText, 
  TrendingUp, 
  CreditCard, 
  PiggyBank, 
  Flame, 
  Building2, 
  ShieldAlert, 
  CalendarClock, 
  Scale, 
  Compass, 
  Home, 
  HardHat, 
  FileCheck2, 
  Percent, 
  AlertOctagon, 
  Users, 
  HeartHandshake, 
  DoorOpen, 
  Landmark, 
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Coins: <Coins className="w-5 h-5" />,
  ReceiptText: <ReceiptText className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  PiggyBank: <PiggyBank className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5" />,
  CalendarClock: <CalendarClock className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Home: <Home className="w-5 h-5" />,
  HardHat: <HardHat className="w-5 h-5" />,
  FileCheck2: <FileCheck2 className="w-5 h-5" />,
  Percent: <Percent className="w-5 h-5" />,
  AlertOctagon: <AlertOctagon className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  DoorOpen: <DoorOpen className="w-5 h-5" />,
  Landmark: <Landmark className="w-5 h-5" />,
};

const CATEGORIES = [
  { id: 'all', label: 'All Questions (17)' },
  { id: 'money', label: '1. Money & Down Payment' },
  { id: 'real-costs', label: '2. The Real Monthly Cost' },
  { id: 'fit-timing', label: '3. Fit & Timing' },
  { id: 'process', label: '4. Process & Team' },
  { id: 'personal', label: '5. Personal & Family' },
];

export const GuidePillarsTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(
    new Set(['money-downpayment', 'process-conditions', 'personal-funds-transfer'])
  );
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredQuestions = GUIDE_QUESTIONS.filter(q => {
    const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
    const matchesSearch = 
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answerSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.insiderTip.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-xl">
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30">
              First-Time Home Buyer Playbook
            </span>
            <span className="text-xs text-slate-400">
              5 Essential Pillars · 17 Critical Questions
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Key Questions Every Buyer Must Ask Before Making an Offer
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Buying a home in Canada involves nuanced rules around mortgage default insurance, land transfer taxes, qualifying stress tests, and legal closing conditions. Use this guide to navigate your purchase with total confidence.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions, tips, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            No questions matched your search query. Try searching for "closing costs", "condo", "pre-approval", or "FHSA".
          </div>
        ) : (
          filteredQuestions.map(q => {
            const isExpanded = expandedIds.has(q.id);
            const isCompleted = completedIds.has(q.id);

            return (
              <div
                key={q.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden shadow-sm ${
                  isExpanded
                    ? 'bg-slate-900/90 border-slate-700 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleExpand(q.id)}
                  className="p-4 md:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                      {ICON_MAP[q.iconName] || <Coins className="w-5 h-5" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {q.category.replace('-', ' ')}
                        </span>
                        {q.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                            {q.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm md:text-base text-white hover:text-sky-300 transition">
                        {q.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-snug">
                        {q.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <button
                      onClick={(e) => toggleComplete(q.id, e)}
                      title={isCompleted ? 'Mark as unread' : 'Mark as understood'}
                      className={`p-1.5 rounded-lg border transition ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>

                    <div className="p-1.5 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content Drawer */}
                {isExpanded && (
                  <div className="px-4 md:px-5 pb-5 pt-1 space-y-4 border-t border-slate-800/80">
                    {/* Summary Callout */}
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 leading-relaxed font-medium">
                      {q.answerSummary}
                    </div>

                    {/* Detailed Bullet Points */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Detailed Breakdown & Canadian Guidelines:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {q.detailedPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-sky-400 font-bold shrink-0 mt-0.5">•</span>
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Insider Pro Tip */}
                    <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/20 to-slate-950 border border-sky-500/30 rounded-xl p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
                        <Lightbulb className="w-4 h-4 shrink-0" />
                        <span>First-Time Buyer Pro Tip:</span>
                      </div>
                      <p className="text-xs text-sky-200/90 leading-relaxed">
                        {q.insiderTip}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
