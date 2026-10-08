import React, { useState } from 'react';
import { INITIAL_PRODUCTS } from './data/initialProducts';
import { CRITERIA_DEFINITIONS } from './data/criteriaConfig';
import { ProductSample, AssignmentMetadata } from './types/amazon';
import { exportComparisonToExcel, generateTsvData } from './utils/excelExporter';
import { Header } from './components/Header';
import { ComparisonSheet } from './components/ComparisonSheet';
import { HeliumXRayModal } from './components/HeliumXRayModal';
import { UnitEconomicsCalculator } from './components/UnitEconomicsCalculator';
import { AssignmentSubmissionCard } from './components/AssignmentSubmissionCard';
import {
  FileSpreadsheet,
  Layers,
  Sparkles,
  HelpCircle,
  Calculator,
  Download,
  Copy,
  Plus,
  BookOpen,
  Printer,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [products, setProducts] = useState<ProductSample[]>(INITIAL_PRODUCTS);
  const [assignmentInfo, setAssignmentInfo] = useState<AssignmentMetadata>({
    studentName: 'Maria Akram',
    studentId: 'FBA-VA-2026-088',
    batch: 'Batch 2026 (Amazon FBA PL Mastery)',
    mentorName: 'Lead Amazon Trainer',
    submissionDate: '2026-10-08',
    targetMarket: 'Amazon USA (.com)',
    currency: 'USD ($)',
  });

  const [activeTab, setActiveTab] = useState<
    'comparison' | 'sample2' | 'criteriaGuide'
  >('comparison');

  const [isXRayModalOpen, setIsXRayModalOpen] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [selectedProductForTool, setSelectedProductForTool] = useState<ProductSample>(
    products[1] || products[0]
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportExcel = () => {
    try {
      exportComparisonToExcel(products, assignmentInfo);
      showToast('Excel workbook (.xlsx) successfully generated and downloaded!');
    } catch (e: any) {
      console.error(e);
      showToast('Error exporting to Excel. Please try copying to clipboard.');
    }
  };

  const handleCopyTsv = async () => {
    try {
      const tsv = generateTsvData(products);
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      showToast('Copied to clipboard! You can now paste directly into Google Sheets or Excel (Ctrl+V).');
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      showToast('Clipboard access denied.');
    }
  };

  const handleUpdateProduct = (updated: ProductSample) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedProductForTool?.id === updated.id) {
      setSelectedProductForTool(updated);
    }
    showToast(`Updated data for ${updated.name}!`);
  };

  const handleAddNewSample = () => {
    const nextNumber = products.length + 1;
    const newSample: ProductSample = {
      id: `sample-${nextNumber}`,
      sampleNumber: nextNumber,
      name: `Sample Product ${nextNumber}`,
      category: 'Home & Kitchen',
      amazonUrl: 'https://www.amazon.com/s?k=new+product',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
      values: {
        monthlySearchVolume: '14,500',
        averageRevenue: '$22,000',
        averageMonthlyUnits: '850 units',
        averageSellingPrice: '$25.99',
        averageReviews: '650',
        sellersUnder500: '6 sellers',
        sellersUnder200: '3 sellers',
        h10CompetingProducts: '1,900',
        amazonListingsTop15: '0',
        sameBrandListingsTop15: '1',
        productWeight: '1.2 lbs',
        sizeTier: 'Standard',
        avgVariationsTop5: '2 variations',
        listingsOver10kRevenue: '10 listings',
        listings2025Over10k: '5',
        listings2026Over10k: '3',
        averageRatingTop5: '4.5',
        revenueConsistency: 'Consistent',
        priceDepthStability: 'Consistent',
        seasonality: 'Non-seasonal',
        landingCost: '$5.50',
        fbaFee: '$4.50',
        referralFee: '$3.90',
        tentativeProfit: '$12.09',
        tentativeProfitMargin: '46.5%',
        alibabaLink: 'https://www.alibaba.com/',
        patentVerification: 'Cleared',
        shortListedStatus: 'Candidate',
        finalRemarks: 'Solid numbers, healthy margins.',
        packageItems: 'Standard bundle with instruction manual.',
      },
      remarks: {
        monthlySearchVolume: 'Ok',
        averageRevenue: 'Ok',
        averageMonthlyUnits: 'Ok',
        averageSellingPrice: 'Ok',
        averageReviews: 'Ok',
        sellersUnder500: 'Ok',
        sellersUnder200: 'Ok',
        h10CompetingProducts: 'Ok',
        amazonListingsTop15: 'Ok',
        sameBrandListingsTop15: 'Ok',
        productWeight: 'Ok',
        sizeTier: 'Ok',
        avgVariationsTop5: 'Ok',
        listingsOver10kRevenue: 'Ok',
        listings2025Over10k: 'Ok',
        listings2026Over10k: 'Ok',
        averageRatingTop5: 'Ok',
        revenueConsistency: 'Ok',
        priceDepthStability: 'Ok',
        seasonality: 'Ok',
      },
    };

    setProducts([...products, newSample]);
    showToast(`Added Sample ${nextNumber} to the comparison sheet!`);
  };

  const lisenSample = products.find((p) => p.name.toLowerCase().includes('lisen')) || products[1] || products[0];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        assignmentInfo={assignmentInfo}
        onUpdateAssignmentInfo={setAssignmentInfo}
        onExportExcel={handleExportExcel}
        onCopyTsv={handleCopyTsv}
        onOpenXRay={() => {
          setSelectedProductForTool(lisenSample);
          setIsXRayModalOpen(true);
        }}
        onOpenCalculator={() => {
          setSelectedProductForTool(lisenSample);
          setIsCalculatorOpen(true);
        }}
        onAddSample={handleAddNewSample}
        copied={copied}
      />

      {/* Main Body */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-2 rounded-xl border border-slate-300 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'comparison'
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Full Comparison Sheet USA</span>
            </button>

            <button
              onClick={() => setActiveTab('sample2')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'sample2'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Sample 2 (LISEN Stand) Final Table</span>
            </button>

            <button
              onClick={() => setActiveTab('criteriaGuide')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'criteriaGuide'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Criteria Rulebook (Urdu & English)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
              title="Print Assignment Sheet / Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* TAB 1: FULL COMPARISON SHEET */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <ComparisonSheet
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onOpenXRayForProduct={(p) => {
                setSelectedProductForTool(p);
                setIsXRayModalOpen(true);
              }}
              onOpenCalculatorForProduct={(p) => {
                setSelectedProductForTool(p);
                setIsCalculatorOpen(true);
              }}
            />

            {/* Quick Helper Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950 mb-0.5">
                  Assignment Submission Tip (Amazon VA Training):
                </p>
                <p className="leading-relaxed text-amber-800">
                  Sample 2 (LISEN Stand) satisfies all 20 Helium 10 product hunting benchmarks with 0 Amazon dominance and 6 sellers under 500 reviews in Top 15. The unit weight (0.50 lbs) ensures low Amazon FBA fulfillment costs ($4.15), generating an outstanding net profit margin of 43.2%. Click <strong>Download Excel (.xlsx)</strong> above to download the exact multi-sheet assignment file.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAMPLE 2 (LISEN STAND) SPOTLIGHT */}
        {activeTab === 'sample2' && (
          <div>
            <AssignmentSubmissionCard
              product={lisenSample}
              onExportExcel={handleExportExcel}
            />
          </div>
        )}

        {/* TAB 3: CRITERIA RULEBOOK */}
        {activeTab === 'criteriaGuide' && (
          <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6 space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Helium 10 X-Ray Criteria Rulebook & Assignment Guidelines
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Standard benchmarks used by top Amazon FBA Private Label mentors for US Marketplace product hunting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CRITERIA_DEFINITIONS.map((c) => (
                <div
                  key={c.rowNumber}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-red-600">
                      Row #{c.rowNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[11px] border border-red-200">
                      Criteria: {c.standardValue}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {c.attributeName}
                  </h4>

                  <div className="text-slate-800 font-urdu leading-relaxed bg-amber-50/80 p-2 rounded border border-amber-200 text-amber-950">
                    🇵🇰 <strong>وضاحت:</strong> {c.urduExplanation}
                  </div>

                  <div className="text-slate-600 text-[11px] leading-relaxed">
                    🇬🇧 <strong>Evaluation:</strong> {c.englishExplanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Helium 10 Chrome Extension Simulator Modal */}
      <HeliumXRayModal
        isOpen={isXRayModalOpen}
        onClose={() => setIsXRayModalOpen(false)}
        selectedProduct={selectedProductForTool}
        onApplyProductData={handleUpdateProduct}
        allProducts={products}
      />

      {/* FBA Profit & Margin Calculator Modal */}
      <UnitEconomicsCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        product={selectedProductForTool}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-5 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-semibold text-slate-200">
              Amazon FBA Product Research USA Assignment Suite
            </span>{' '}
            • Helium 10 X-Ray Standard Criteria Verified
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Assignment Ready: Sample 1 (Couch Arm Tray) & Sample 2 (LISEN Stand)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
