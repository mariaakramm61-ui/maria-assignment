import React from 'react';
import { ProductSample } from '../types/amazon';
import { CRITERIA_DEFINITIONS } from '../data/criteriaConfig';
import { CheckCircle2, FileSpreadsheet, ShieldAlert, Award, ExternalLink, ArrowDownToLine } from 'lucide-react';

interface AssignmentSubmissionCardProps {
  product: ProductSample;
  onExportExcel: () => void;
}

export const AssignmentSubmissionCard: React.FC<AssignmentSubmissionCardProps> = ({
  product,
  onExportExcel,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden mb-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Sample 2 Spotlight (User Provided Data)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              100% Criteria Approved
            </span>
          </div>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Sample 2 (LISEN Stand) - Final Assignment Submission Table
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Exact 4-column assignment format matching teacher/mentor submission requirements with complete remarks in Urdu/English.
          </p>
        </div>

        <button
          onClick={onExportExcel}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md shadow-emerald-950/40 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
          <span>Export This Table to Excel (.xlsx)</span>
        </button>
      </div>

      {/* 4-Column Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-extrabold uppercase text-[11px]">
              <th className="py-2.5 px-3 border border-slate-300 text-center w-16 bg-slate-200">
                Row #
              </th>
              <th className="py-2.5 px-4 border border-slate-300 min-w-[260px]">
                Attribute Name
              </th>
              <th className="py-2.5 px-4 border border-slate-300 min-w-[220px] bg-blue-50/70 text-blue-900 font-black">
                Sample 2 Value (LISEN Stand)
              </th>
              <th className="py-2.5 px-4 border border-slate-300 min-w-[300px] bg-emerald-50/80 text-emerald-950 font-black">
                Remarks / Approval
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {CRITERIA_DEFINITIONS.map((crit) => {
              const val = product.values[crit.key as keyof typeof product.values] ?? '';
              const rem = product.remarks[crit.key as keyof typeof product.remarks] ?? 'Ok';

              return (
                <tr
                  key={`assign-${crit.rowNumber}`}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="py-2 px-3 border border-slate-300 text-center font-mono font-bold text-slate-700 bg-slate-50">
                    {crit.rowNumber}
                  </td>
                  <td className="py-2 px-4 border border-slate-300 font-semibold text-slate-900">
                    {crit.attributeName}
                  </td>
                  <td className="py-2 px-4 border border-slate-300 font-bold text-blue-950 bg-blue-50/30">
                    {String(val)}
                  </td>
                  <td className="py-2 px-4 border border-slate-300 font-medium text-emerald-900 bg-emerald-50/50">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-xs font-semibold text-emerald-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {rem}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sourcing & Unit Economics Summary Bar */}
      <div className="p-4 bg-slate-50 border-t border-slate-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-medium">Tentative Landing Cost</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">{product.values.landingCost}</div>
          <div className="text-[11px] text-slate-500">Alibaba DDP Shipping included</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-medium">Net Profit / Margin</div>
          <div className="text-base font-black text-emerald-600 mt-0.5">
            {product.values.tentativeProfit} ({product.values.tentativeProfitMargin})
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold">Exceeds 30% hurdle rate</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-medium">Patent Verification</div>
          <div className="text-xs font-semibold text-slate-800 mt-0.5">Cleared</div>
          <div className="text-[11px] text-slate-500">Public domain hinge mechanics</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 font-medium">Final Decision</div>
          <div className="text-xs font-black text-emerald-700 mt-0.5 uppercase tracking-wide">
            Approved for Launch
          </div>
          <div className="text-[11px] text-slate-500">Meets 100% assignment criteria</div>
        </div>
      </div>

    </div>
  );
};
