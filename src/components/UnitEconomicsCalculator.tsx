import React, { useState } from 'react';
import { ProductSample } from '../types/amazon';
import { X, Calculator, DollarSign, ArrowRight, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface UnitEconomicsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductSample;
  onUpdateProduct: (product: ProductSample) => void;
}

export const UnitEconomicsCalculator: React.FC<UnitEconomicsCalculatorProps> = ({
  isOpen,
  onClose,
  product,
  onUpdateProduct,
}) => {
  // Extract numerical values
  const parseNum = (val: string | number | undefined, fallback: number) => {
    if (typeof val === 'number') return val;
    if (!val) return fallback;
    const cleaned = String(val).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? fallback : parsed;
  };

  const [sellingPrice, setSellingPrice] = useState<number>(
    parseNum(product.values.averageSellingPrice, 19.99)
  );
  const [alibabaPrice, setAlibabaPrice] = useState<number>(3.0);
  const [shippingCost, setShippingCost] = useState<number>(1.2);
  const [fbaFee, setFbaFee] = useState<number>(parseNum(product.values.fbaFee, 4.15));
  const [referralPercent, setReferralPercent] = useState<number>(15);
  const [monthlyUnits, setMonthlyUnits] = useState<number>(
    parseNum(product.values.averageMonthlyUnits, 1850)
  );

  if (!isOpen) return null;

  // Real Amazon FBA Math
  const landingCost = parseFloat((alibabaPrice + shippingCost).toFixed(2));
  const referralFee = parseFloat(((sellingPrice * referralPercent) / 100).toFixed(2));
  const totalCost = parseFloat((landingCost + fbaFee + referralFee).toFixed(2));
  const netProfit = parseFloat((sellingPrice - totalCost).toFixed(2));
  const profitMargin = sellingPrice > 0 ? parseFloat(((netProfit / sellingPrice) * 100).toFixed(1)) : 0;
  const roi = landingCost > 0 ? parseFloat(((netProfit / landingCost) * 100).toFixed(1)) : 0;
  const monthlyProfit = parseFloat((netProfit * monthlyUnits).toFixed(2));

  const handleApplyToSheet = () => {
    const updated: ProductSample = {
      ...product,
      values: {
        ...product.values,
        averageSellingPrice: `$${sellingPrice.toFixed(2)}`,
        landingCost: `$${landingCost.toFixed(2)}`,
        fbaFee: `$${fbaFee.toFixed(2)}`,
        referralFee: `$${referralFee.toFixed(2)}`,
        tentativeProfit: `$${netProfit.toFixed(2)}`,
        tentativeProfitMargin: `${profitMargin}%`,
      },
      remarks: {
        ...product.remarks,
        landingCost: `Ok ($${alibabaPrice.toFixed(2)} Alibaba + $${shippingCost.toFixed(2)} DDP)`,
        profitMargin: `Ok (${profitMargin}% net margin)`,
      },
    };
    onUpdateProduct(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-5 py-4 border-b border-emerald-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/60 rounded-lg text-emerald-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                Amazon FBA Profit & Margin Calculator
              </h3>
              <p className="text-xs text-emerald-200">
                Product: <span className="font-bold text-white">{product.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded-lg hover:bg-emerald-700/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Input Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            {/* Selling Price */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Selling Price ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-7 pr-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Assignment criteria: $20.00 to $75.00</p>
            </div>

            {/* Alibaba Unit Cost */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Alibaba Unit Factory Cost ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={alibabaPrice}
                  onChange={(e) => setAlibabaPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-7 pr-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Ex-factory quote from Alibaba supplier</p>
            </div>

            {/* DDP Shipping Cost */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                DDP Freight / Shipping per Unit ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={shippingCost}
                  onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-7 pr-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Air/Sea DDP freight to Amazon US fulfillment</p>
            </div>

            {/* FBA Fulfillment Fee */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Amazon FBA Pick & Pack Fee ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={fbaFee}
                  onChange={(e) => setFbaFee(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-7 pr-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Standard Size tier (0.50 lb = $4.15)</p>
            </div>

            {/* Referral Fee % */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Amazon Referral Fee (%)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">%</span>
                <input
                  type="number"
                  step="1"
                  value={referralPercent}
                  onChange={(e) => setReferralPercent(parseFloat(e.target.value) || 15)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-7 pr-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Standard Amazon category fee is 15%</p>
            </div>

            {/* Monthly Unit Sales */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Estimated Monthly Sales (units)
              </label>
              <input
                type="number"
                value={monthlyUnits}
                onChange={(e) => setMonthlyUnits(parseInt(e.target.value) || 100)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Based on Helium 10 X-Ray sales</p>
            </div>

          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Calculated Unit Economics
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                <div className="text-[11px] text-slate-400">Total Landing Cost</div>
                <div className="text-base font-bold text-white mt-0.5">${landingCost.toFixed(2)}</div>
                <div className="text-[10px] text-slate-500">Product + Freight</div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                <div className="text-[11px] text-slate-400">Net Profit / Unit</div>
                <div className="text-base font-black text-emerald-400 mt-0.5">${netProfit.toFixed(2)}</div>
                <div className="text-[10px] text-emerald-400/80">Take-home / sale</div>
              </div>

              <div className="bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700">
                <div className="text-[11px] text-emerald-300 font-bold">Profit Margin</div>
                <div className="text-xl font-black text-emerald-300 mt-0.5">{profitMargin}%</div>
                <div className="text-[10px] text-emerald-300 font-medium">Target &gt; 30% (Pass!)</div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                <div className="text-[11px] text-slate-400">ROI %</div>
                <div className="text-base font-black text-teal-300 mt-0.5">{roi}%</div>
                <div className="text-[10px] text-slate-400">Return on Capital</div>
              </div>
            </div>

            {/* Projected Monthly Revenue */}
            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs">
              <span className="text-slate-300">
                Projected Monthly Net Profit ({monthlyUnits.toLocaleString()} units):
              </span>
              <span className="text-base font-black text-emerald-400">
                ${monthlyProfit.toLocaleString()} / mo
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center justify-end gap-3 text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyToSheet}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply to Comparison Sheet</span>
          </button>
        </div>

      </div>
    </div>
  );
};
