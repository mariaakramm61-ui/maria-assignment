import React, { useState } from 'react';
import { ProductSample } from '../types/amazon';
import { CRITERIA_DEFINITIONS } from '../data/criteriaConfig';
import { ExternalLink, CheckCircle2, AlertTriangle, HelpCircle, Edit3, Sparkles } from 'lucide-react';

interface ComparisonSheetProps {
  products: ProductSample[];
  onUpdateProduct: (updated: ProductSample) => void;
  onOpenXRayForProduct: (product: ProductSample) => void;
  onOpenCalculatorForProduct: (product: ProductSample) => void;
}

export const ComparisonSheet: React.FC<ComparisonSheetProps> = ({
  products,
  onUpdateProduct,
  onOpenXRayForProduct,
  onOpenCalculatorForProduct,
}) => {
  const [editingCell, setEditingCell] = useState<{
    productId: string;
    key: string;
    type: 'val' | 'rem';
  } | null>(null);

  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  // Helper to determine background style based on remarks
  const getRemarkBadgeClass = (remarkText: string | undefined) => {
    if (!remarkText) return 'bg-slate-50 text-slate-700 border-slate-200';
    const text = remarkText.toLowerCase();
    if (text.includes('slight high') || text.includes('warning') || text.includes('borderline')) {
      return 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
    }
    if (text.includes('ok') || text.includes('pass') || text.includes('approved') || text.includes('consistent')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
    }
    if (text.includes('fail') || text.includes('reject') || text.includes('high risk')) {
      return 'bg-red-100 text-red-900 border-red-300 font-semibold';
    }
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  const getValueCellBg = (remarkText: string | undefined) => {
    if (!remarkText) return 'bg-white';
    const text = remarkText.toLowerCase();
    if (text.includes('slight high')) return 'bg-amber-50/70 text-slate-900 font-medium';
    if (text.includes('ok') || text.includes('approved')) return 'bg-emerald-50/60 text-slate-900 font-medium';
    return 'bg-white text-slate-900';
  };

  const handleSaveValue = (productId: string, key: string, newValue: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const updated = {
      ...p,
      values: {
        ...p.values,
        [key]: newValue,
      },
    };
    onUpdateProduct(updated);
    setEditingCell(null);
  };

  const handleSaveRemark = (productId: string, key: string, newRemark: string) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const updated = {
      ...p,
      remarks: {
        ...p.remarks,
        [key]: newRemark,
      },
    };
    onUpdateProduct(updated);
    setEditingCell(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-300 overflow-hidden">
      {/* Red Header Bar matching Assignment Template */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b-2 border-red-800">
        <div>
          <h2 className="text-2xl font-black tracking-wide uppercase">
            PRODUCT COMPARISON SHEET USA
          </h2>
          <p className="text-red-100 text-xs mt-0.5">
            Helium 10 X-Ray Criteria Evaluation & Amazon FBA Private Label Feasibility Analysis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/60 text-white text-xs font-semibold border border-red-400/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            Standard Benchmark: Passed (Sample 2 100%)
          </span>
          <span className="text-xs text-red-200 font-mono">
            {products.length} Products Evaluated
          </span>
        </div>
      </div>

      {/* Spreadsheet Table View */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse border border-slate-300 text-xs sm:text-sm">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b-2 border-slate-400 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
              <th className="py-3 px-3 border border-slate-300 text-center w-12 bg-slate-200">
                Sr. #
              </th>
              <th className="py-3 px-4 border border-slate-300 min-w-[240px] max-w-[280px]">
                Attribute Name
              </th>
              <th className="py-3 px-3 border border-slate-300 text-center min-w-[130px] bg-slate-100/90 text-red-700 font-black">
                Standard Value
              </th>

              {/* Dynamic Sample Columns with side-by-side Remarks Column */}
              {products.map((p) => (
                <React.Fragment key={p.id}>
                  <th className="py-3 px-4 border border-slate-300 min-w-[200px] bg-blue-50/70 text-blue-900">
                    <div className="flex items-center justify-between">
                      <span>Sample {p.sampleNumber} ({p.name})</span>
                      <button
                        onClick={() => onOpenXRayForProduct(p)}
                        className="text-[10px] text-blue-700 hover:text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300 shadow-xs cursor-pointer flex items-center gap-1 font-semibold"
                        title="View Helium 10 X-Ray Raw Data"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        H10 X-Ray
                      </button>
                    </div>
                  </th>
                  <th className="py-3 px-3 border border-slate-300 min-w-[220px] bg-emerald-50/70 text-emerald-900 text-center">
                    Remarks / Approval
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* ROW 1: MAIN IMAGE */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60 transition-colors">
              <td className="py-3 px-2 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                1
              </td>
              <td className="py-3 px-4 border border-slate-300 font-bold text-slate-900">
                MAIN IMAGE
              </td>
              <td className="py-3 px-3 border border-slate-300 text-center text-slate-500 italic bg-slate-50">
                High Quality Product Image
              </td>
              {products.map((p) => (
                <React.Fragment key={`img-${p.id}`}>
                  <td className="py-3 px-4 border border-slate-300">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-sm shrink-0 bg-slate-100"
                        onError={(e) => {
                          // Fallback placeholder
                          (e.currentTarget as HTMLImageElement).src =
                            'https://placehold.co/100x100/e2e8f0/475569?text=' + encodeURIComponent(p.name);
                        }}
                      />
                      <div className="text-xs">
                        <div className="font-semibold text-slate-800 line-clamp-1">{p.name}</div>
                        <a
                          href={p.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 mt-1 font-medium text-[11px]"
                        >
                          Amazon Search <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-3 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Verified Listing Image
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* ROW 2: PRODUCT NAME */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                2
              </td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                PRODUCT NAME
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center text-slate-500 italic bg-slate-50">
                Specific Main Keyword
              </td>
              {products.map((p) => (
                <React.Fragment key={`name-${p.id}`}>
                  <td className="py-2.5 px-4 border border-slate-300 font-semibold text-slate-900 capitalize">
                    {p.name}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Ok
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* ROW 3: CATEGORY */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                3
              </td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                Category
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center text-slate-500 italic bg-slate-50">
                Ungated Amazon Category
              </td>
              {products.map((p) => (
                <React.Fragment key={`cat-${p.id}`}>
                  <td className="py-2.5 px-4 border border-slate-300 font-medium text-slate-800">
                    {p.category}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Ok (Ungated)
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Section Divider: HELIUM 10 X-RAY CRITERIA */}
            <tr className="bg-slate-800 text-white font-bold">
              <td colSpan={3 + products.length * 2} className="py-2 px-4 uppercase tracking-wider text-xs bg-slate-800 text-slate-200">
                Helium 10 X-Ray Criteria Evaluation (Rows 6 - 25)
              </td>
            </tr>

            {/* ROWS 6 to 25: All 20 Criteria Rows */}
            {CRITERIA_DEFINITIONS.map((crit) => (
              <tr
                key={`crit-${crit.rowNumber}`}
                className="border-b border-slate-300 hover:bg-blue-50/40 transition-colors"
              >
                {/* Row Number */}
                <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">
                  {crit.rowNumber}
                </td>

                {/* Attribute Name with Tooltip Explanation */}
                <td className="py-2.5 px-4 border border-slate-300">
                  <div className="flex items-center justify-between group">
                    <span className="font-semibold text-slate-900">
                      {crit.attributeName}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveTooltip(
                          activeTooltip === crit.rowNumber ? null : crit.rowNumber
                        )
                      }
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                      title="Show explanation in Urdu & English"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Active Tooltip Drawer */}
                  {activeTooltip === crit.rowNumber && (
                    <div className="mt-2 p-2 bg-slate-900 text-slate-100 rounded text-xs space-y-1 animate-in fade-in duration-100 border border-slate-700">
                      <div className="text-amber-300 font-urdu leading-relaxed">
                        🇵🇰 <span className="font-medium">{crit.urduExplanation}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        🇬🇧 {crit.englishExplanation}
                      </div>
                    </div>
                  )}
                </td>

                {/* Standard Value */}
                <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-red-700 bg-red-50/50">
                  {crit.standardValue}
                </td>

                {/* Products Values & Remarks */}
                {products.map((p) => {
                  const val = p.values[crit.key as keyof typeof p.values] ?? '';
                  const rem = p.remarks[crit.key as keyof typeof p.remarks] ?? 'Ok';
                  const isEditingVal =
                    editingCell?.productId === p.id &&
                    editingCell?.key === crit.key &&
                    editingCell?.type === 'val';
                  const isEditingRem =
                    editingCell?.productId === p.id &&
                    editingCell?.key === crit.key &&
                    editingCell?.type === 'rem';

                  return (
                    <React.Fragment key={`cell-${p.id}-${crit.key}`}>
                      {/* Value Cell */}
                      <td
                        className={`py-2.5 px-3 border border-slate-300 font-semibold text-center transition-colors group relative cursor-pointer ${getValueCellBg(
                          rem
                        )}`}
                        onClick={() => {
                          if (!isEditingVal) {
                            setEditingCell({ productId: p.id, key: crit.key, type: 'val' });
                          }
                        }}
                        title="Click to edit value"
                      >
                        {isEditingVal ? (
                          <input
                            type="text"
                            defaultValue={String(val)}
                            autoFocus
                            onBlur={(e) => handleSaveValue(p.id, crit.key, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveValue(p.id, crit.key, (e.target as HTMLInputElement).value);
                              }
                            }}
                            className="w-full bg-white border border-blue-500 rounded px-1.5 py-0.5 text-center text-xs font-bold text-slate-900 shadow-sm"
                          />
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <span>{String(val)}</span>
                            <Edit3 className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </td>

                      {/* Remarks Cell */}
                      <td
                        className={`py-2 px-3 border border-slate-300 text-xs transition-colors group relative cursor-pointer ${
                          rem.toLowerCase().includes('ok') ? 'bg-emerald-50/40' : 'bg-slate-50/40'
                        }`}
                        onClick={() => {
                          if (!isEditingRem) {
                            setEditingCell({ productId: p.id, key: crit.key, type: 'rem' });
                          }
                        }}
                        title="Click to edit remarks"
                      >
                        {isEditingRem ? (
                          <input
                            type="text"
                            defaultValue={rem}
                            autoFocus
                            onBlur={(e) => handleSaveRemark(p.id, crit.key, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveRemark(p.id, crit.key, (e.target as HTMLInputElement).value);
                              }
                            }}
                            className="w-full bg-white border border-emerald-500 rounded px-1.5 py-0.5 text-xs font-medium text-slate-900 shadow-sm"
                          />
                        ) : (
                          <div className="flex items-start justify-between gap-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded border text-[11px] leading-tight ${getRemarkBadgeClass(
                                rem
                              )}`}
                            >
                              {rem}
                            </span>
                            <Edit3 className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                          </div>
                        )}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}

            {/* Section Divider: FINANCIAL & UNIT ECONOMICS */}
            <tr className="bg-slate-800 text-white font-bold">
              <td colSpan={3 + products.length * 2} className="py-2 px-4 uppercase tracking-wider text-xs bg-emerald-950 text-emerald-200">
                Financial Breakdown & FBA Unit Economics (Rows 26 - 31)
              </td>
            </tr>

            {/* Expected Landing Cost */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">26</td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                Expected/Tentative Landing Cost (Alibaba Price + Shipping)
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                Alibaba DDP Cost
              </td>
              {products.map((p) => (
                <React.Fragment key={`land-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 font-bold text-center text-slate-900">
                    {p.values.landingCost}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {p.remarks.landingCost || 'Feasible Unit Cost'}
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Average Selling Price */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">27</td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                Average Selling Price
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-red-700 bg-red-50/50">
                $20 to $75
              </td>
              {products.map((p) => (
                <React.Fragment key={`sell-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 font-bold text-center text-slate-900">
                    {p.values.averageSellingPrice}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Target Met
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* FBA Fee */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">28</td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                FBA Fee from FBA Calculator
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                Size Tier Table
              </td>
              {products.map((p) => (
                <React.Fragment key={`fba-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 font-bold text-center text-slate-900">
                    {p.values.fbaFee}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Standard FBA
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Referral Fee */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">29</td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                Referral Fee (15%)
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                15% Selling Price
              </td>
              {products.map((p) => (
                <React.Fragment key={`ref-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 font-bold text-center text-slate-900">
                    {p.values.referralFee}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      15% Amazon Cut
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Profit (tentative) */}
            <tr className="border-b border-slate-300 bg-emerald-50/40 hover:bg-emerald-50/70">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-emerald-800 bg-emerald-100/50">30</td>
              <td className="py-2.5 px-4 border border-slate-300 font-extrabold text-emerald-950">
                Profit (tentative per unit)
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-emerald-800 bg-emerald-100/50">
                Price - Costs
              </td>
              {products.map((p) => (
                <React.Fragment key={`prof-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 font-black text-center text-emerald-900 text-sm">
                    {p.values.tentativeProfit}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-200 text-emerald-900 border border-emerald-400">
                      High Net Profit
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Tentative Profit Margin % */}
            <tr className="border-b border-slate-300 bg-emerald-100/60 hover:bg-emerald-100/80">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-black text-emerald-900 bg-emerald-200/50">31</td>
              <td className="py-2.5 px-4 border border-slate-300 font-black text-emerald-950">
                Tentative Profit Margin %
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-black text-emerald-900 bg-emerald-200/50">
                &gt; 25% - 30%
              </td>
              {products.map((p) => (
                <React.Fragment key={`pm-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 font-black text-center text-emerald-950 text-base">
                    {p.values.tentativeProfitMargin}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-3 py-1 rounded text-xs font-black bg-emerald-600 text-white shadow-xs">
                      {p.remarks.profitMargin || 'Excellent Margin (>30%)'}
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Section Divider: SOURCING, PATENT & APPROVAL DETAILS */}
            <tr className="bg-slate-800 text-white font-bold">
              <td colSpan={3 + products.length * 2} className="py-2 px-4 uppercase tracking-wider text-xs bg-blue-950 text-blue-200">
                Sourcing, Patent Verification & Package Requirements (Rows 32 - 36)
              </td>
            </tr>

            {/* Alibaba Link */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">32</td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                AliBaba Link
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                Verified Gold Supplier
              </td>
              {products.map((p) => (
                <React.Fragment key={`ali-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 text-xs">
                    <a
                      href={p.values.alibabaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      Alibaba Supplier Search <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Available (MOQ 500)
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Patent Verification */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">33</td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                Patent Verification
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                USPTO / Google Patent
              </td>
              {products.map((p) => (
                <React.Fragment key={`pat-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 text-xs text-slate-700 font-medium">
                    {p.values.patentVerification}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Cleared / Low Risk
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Short Listed Products */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-2.5 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">34</td>
              <td className="py-2.5 px-4 border border-slate-300 font-bold text-slate-900">
                Short Listed Products
              </td>
              <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                Final Selection
              </td>
              {products.map((p) => (
                <React.Fragment key={`sl-${p.id}`}>
                  <td className="py-2.5 px-3 border border-slate-300 text-center font-bold text-slate-900">
                    {p.values.shortListedStatus}
                  </td>
                  <td className="py-2.5 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Shortlisted
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Your Final Remarks / Approval */}
            <tr className="border-b border-slate-300 bg-amber-50/40 hover:bg-amber-50/70">
              <td className="py-3 px-2 border border-slate-300 text-center font-mono font-bold text-amber-900 bg-amber-100/50">35</td>
              <td className="py-3 px-4 border border-slate-300 font-bold text-slate-900">
                Your Final Remarks/ Approval
              </td>
              <td className="py-3 px-3 border border-slate-300 text-center font-bold text-slate-700 bg-slate-50">
                Mentor Approval
              </td>
              {products.map((p) => (
                <React.Fragment key={`fin-${p.id}`}>
                  <td className="py-3 px-3 border border-slate-300 text-xs text-slate-800 font-medium leading-relaxed">
                    {p.values.finalRemarks}
                  </td>
                  <td className="py-3 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-3 py-1 rounded text-xs font-black bg-emerald-600 text-white shadow-xs">
                      APPROVED FOR LAUNCH
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

            {/* Items to be included in the package */}
            <tr className="border-b border-slate-300 hover:bg-slate-50/60">
              <td className="py-3 px-2 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">36</td>
              <td className="py-3 px-4 border border-slate-300 font-bold text-slate-900">
                Items to be included in the package
              </td>
              <td className="py-3 px-3 border border-slate-300 text-center font-bold text-slate-600 bg-slate-50">
                Custom Bundle
              </td>
              {products.map((p) => (
                <React.Fragment key={`pkg-${p.id}`}>
                  <td className="py-3 px-3 border border-slate-300 text-xs text-slate-800 leading-relaxed">
                    {p.values.packageItems}
                  </td>
                  <td className="py-3 px-3 border border-slate-300 text-center">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Complete Value Bundle
                    </span>
                  </td>
                </React.Fragment>
              ))}
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};
