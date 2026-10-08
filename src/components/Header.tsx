import React, { useState } from 'react';
import { Download, Copy, Check, Search, Plus, Calculator, FileSpreadsheet, User, Calendar, Award } from 'lucide-react';
import { AssignmentMetadata } from '../types/amazon';

interface HeaderProps {
  assignmentInfo: AssignmentMetadata;
  onUpdateAssignmentInfo: (info: AssignmentMetadata) => void;
  onExportExcel: () => void;
  onCopyTsv: () => void;
  onOpenXRay: () => void;
  onOpenCalculator: () => void;
  onAddSample: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  assignmentInfo,
  onUpdateAssignmentInfo,
  onExportExcel,
  onCopyTsv,
  onOpenXRay,
  onOpenCalculator,
  onAddSample,
  copied,
}) => {
  const [showMetadataEdit, setShowMetadataEdit] = useState(false);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white shadow-xl sticky top-0 z-40">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Assignment Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20 font-black text-xl text-white">
              H10
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600/90 text-white tracking-wider uppercase">
                  USA Marketplace
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Helium 10 X-Ray Criteria
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Assignment Ready
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                PRODUCT COMPARISON SHEET USA
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Download Excel Button - The main user request! */}
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/40 cursor-pointer"
              title="Download full assignment as formatted Excel .xlsx workbook"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Download Excel (.xlsx)</span>
            </button>

            {/* Copy for Sheets */}
            <button
              onClick={onCopyTsv}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Copy table to paste directly into Google Sheets or Excel"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied TSV!' : 'Copy for Sheets'}</span>
            </button>

            {/* Launch Helium 10 X-Ray Extension Simulator */}
            <button
              onClick={onOpenXRay}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-sm transition-colors border border-blue-400/30 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Helium 10 X-Ray</span>
            </button>

            {/* FBA Profit Calculator */}
            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>FBA Fee Calc</span>
            </button>

            {/* Add Sample */}
            <button
              onClick={onAddSample}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sample</span>
            </button>
          </div>
        </div>

        {/* Assignment Metadata Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/60">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Student:</span>
              <span className="font-semibold text-white">{assignmentInfo.studentName}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/60">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Batch / Mentor:</span>
              <span className="font-semibold text-white">{assignmentInfo.batch} ({assignmentInfo.mentorName})</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/60">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">Submission Date:</span>
              <span className="font-semibold text-white">{assignmentInfo.submissionDate}</span>
            </div>
          </div>

          <button
            onClick={() => setShowMetadataEdit(!showMetadataEdit)}
            className="text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2 cursor-pointer font-medium"
          >
            {showMetadataEdit ? 'Hide Details' : 'Edit Student & Submission Details'}
          </button>
        </div>

        {/* Student Metadata Edit Drawer */}
        {showMetadataEdit && (
          <div className="mt-3 p-4 bg-slate-800/90 rounded-xl border border-slate-700 text-xs text-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div>
              <label className="block text-slate-400 mb-1">Student Name</label>
              <input
                type="text"
                value={assignmentInfo.studentName}
                onChange={(e) => onUpdateAssignmentInfo({ ...assignmentInfo, studentName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Batch / Group</label>
              <input
                type="text"
                value={assignmentInfo.batch}
                onChange={(e) => onUpdateAssignmentInfo({ ...assignmentInfo, batch: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Mentor / Instructor</label>
              <input
                type="text"
                value={assignmentInfo.mentorName}
                onChange={(e) => onUpdateAssignmentInfo({ ...assignmentInfo, mentorName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Submission Date</label>
              <input
                type="text"
                value={assignmentInfo.submissionDate}
                onChange={(e) => onUpdateAssignmentInfo({ ...assignmentInfo, submissionDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-600 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
