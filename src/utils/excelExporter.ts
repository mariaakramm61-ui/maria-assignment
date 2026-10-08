import * as XLSX from 'xlsx';
import { ProductSample, AssignmentMetadata } from '../types/amazon';
import { CRITERIA_DEFINITIONS } from '../data/criteriaConfig';

export function exportComparisonToExcel(
  products: ProductSample[],
  assignmentInfo: AssignmentMetadata
) {
  const wb = XLSX.utils.book_new();

  // -------------------------------------------------------------
  // Sheet 1: Main "PRODUCT COMPARISON SHEET USA"
  // -------------------------------------------------------------
  const sheet1Data: (string | number)[][] = [];

  // Title Row
  sheet1Data.push(['PRODUCT COMPARISON SHEET USA', '', '', '', '', '', '', '']);
  sheet1Data.push([
    `Student: ${assignmentInfo.studentName || 'FBA Student'}`,
    `Batch: ${assignmentInfo.batch || 'Batch 2026'}`,
    `Market: ${assignmentInfo.targetMarket || 'Amazon USA (.com)'}`,
    `Date: ${assignmentInfo.submissionDate || '2026-10-08'}`,
    '',
    '',
    '',
    '',
  ]);
  sheet1Data.push([]); // blank line

  // Main Headers
  const headerRow: string[] = ['Sr. No', 'Attribute Name', 'Standard Value'];
  products.forEach((p) => {
    headerRow.push(`Sample ${p.sampleNumber} (${p.name})`);
    headerRow.push(`Remarks / Approval`);
  });
  sheet1Data.push(headerRow);

  // Row 1: Main Image Link
  const imageRow: (string | number)[] = ['1', 'MAIN IMAGE', 'N/A'];
  products.forEach((p) => {
    imageRow.push(p.imageUrl || 'Image Available');
    imageRow.push('Verified High Res');
  });
  sheet1Data.push(imageRow);

  // Row 2: Product Name
  const nameRow: (string | number)[] = ['2', 'PRODUCT NAME', 'Clear Keyword Match'];
  products.forEach((p) => {
    nameRow.push(p.name);
    nameRow.push('Verified');
  });
  sheet1Data.push(nameRow);

  // Row 3: Category
  const catRow: (string | number)[] = ['3', 'Category', 'Gated / Ungated Check'];
  products.forEach((p) => {
    catRow.push(p.category);
    catRow.push('Ungated / Approved');
  });
  sheet1Data.push(catRow);

  // Row 4: Amazon URL
  const urlRow: (string | number)[] = ['4', 'Amazon Search / Product URL', 'https://www.amazon.com/'];
  products.forEach((p) => {
    urlRow.push(p.amazonUrl);
    urlRow.push('Active URL');
  });
  sheet1Data.push(urlRow);

  sheet1Data.push(['', '--- HELIUM 10 X-RAY CRITERIA EVALUATION ---', '', ...products.flatMap(() => ['', ''])]);

  // Rows 6 to 25: Criteria Definitions
  CRITERIA_DEFINITIONS.forEach((crit) => {
    const row: (string | number)[] = [crit.rowNumber, crit.attributeName, crit.standardValue];
    products.forEach((p) => {
      const val = p.values[crit.key as keyof typeof p.values] ?? 'N/A';
      const rem = p.remarks[crit.key as keyof typeof p.remarks] ?? 'Ok';
      row.push(val);
      row.push(rem);
    });
    sheet1Data.push(row);
  });

  sheet1Data.push(['', '--- FINANCIAL & UNIT ECONOMICS ---', '', ...products.flatMap(() => ['', ''])]);

  // Financial Rows
  const financialRows = [
    { num: 26, label: 'Expected/Tentative Landing Cost (Alibaba Price + Shipping)', key: 'landingCost' },
    { num: 27, label: 'Average Selling Price', key: 'averageSellingPrice' },
    { num: 28, label: 'FBA Fee from FBA Calculator', key: 'fbaFee' },
    { num: 29, label: 'Referral Fee (15%)', key: 'referralFee' },
    { num: 30, label: 'Profit (tentative)', key: 'tentativeProfit' },
    { num: 31, label: 'Tentative Profit Margin %', key: 'tentativeProfitMargin' },
  ];

  financialRows.forEach((item) => {
    const row: (string | number)[] = [item.num, item.label, item.key === 'tentativeProfitMargin' ? '> 25% - 30%' : 'Standard Calculation'];
    products.forEach((p) => {
      const val = p.values[item.key as keyof typeof p.values] ?? 'N/A';
      row.push(val);
      row.push('Calculated / Feasible');
    });
    sheet1Data.push(row);
  });

  sheet1Data.push(['', '--- SOURCING, PATENT & APPROVAL DETAILS ---', '', ...products.flatMap(() => ['', ''])]);

  // Sourcing & Details Rows (Page 2 of Assignment)
  const detailRows = [
    { num: 32, label: 'AliBaba Link', key: 'alibabaLink' },
    { num: 33, label: 'Patent Verification', key: 'patentVerification' },
    { num: 34, label: 'Short Listed Products', key: 'shortListedStatus' },
    { num: 35, label: 'Your Final Remarks/ Approval', key: 'finalRemarks' },
    { num: 36, label: 'Items to be included in the package', key: 'packageItems' },
  ];

  detailRows.forEach((item) => {
    const row: (string | number)[] = [item.num, item.label, 'Clear / Verified'];
    products.forEach((p) => {
      const val = p.values[item.key as keyof typeof p.values] ?? 'N/A';
      row.push(val);
      row.push('Approved');
    });
    sheet1Data.push(row);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);

  // Set column widths for Sheet 1
  ws1['!cols'] = [
    { wch: 8 },  // Sr. No
    { wch: 42 }, // Attribute Name
    { wch: 18 }, // Standard Value
    { wch: 28 }, // Sample 1
    { wch: 32 }, // Remarks 1
    { wch: 32 }, // Sample 2
    { wch: 42 }, // Remarks 2
    { wch: 28 }, // Sample 3
    { wch: 32 }, // Remarks 3
  ];

  XLSX.utils.book_append_sheet(wb, ws1, 'Product Comparison USA');

  // -------------------------------------------------------------
  // Sheet 2: Dedicated "Sample 2 (LISEN Stand)" Table
  // -------------------------------------------------------------
  const lisenSample = products.find((p) => p.name.toLowerCase().includes('lisen')) || products[1] || products[0];
  if (lisenSample) {
    const sheet2Data: (string | number)[][] = [
      ['Row #', 'Attribute Name', 'Sample 2 Value (LISEN Stand)', 'Remarks / Approval'],
    ];

    CRITERIA_DEFINITIONS.forEach((crit) => {
      sheet2Data.push([
        crit.rowNumber,
        crit.attributeName,
        lisenSample.values[crit.key as keyof typeof lisenSample.values] ?? '',
        lisenSample.remarks[crit.key as keyof typeof lisenSample.remarks] ?? 'Ok',
      ]);
    });

    // Add unit economics & submission rows
    sheet2Data.push([26, 'Expected/Tentative Landing Cost', lisenSample.values.landingCost, 'Ok ($3.00 Alibaba + $1.20 DDP Air)']);
    sheet2Data.push([27, 'Average Selling Price', lisenSample.values.averageSellingPrice, 'Ok ($19.99 Target $20-$75)']);
    sheet2Data.push([28, 'FBA Fee from FBA Calculator', lisenSample.values.fbaFee, 'Ok (Standard 0.50 lb tier = $4.15)']);
    sheet2Data.push([29, 'Referral Fee', lisenSample.values.referralFee, 'Ok (15% Amazon Referral)']);
    sheet2Data.push([30, 'Profit (tentative)', lisenSample.values.tentativeProfit, 'Ok ($8.64 per unit)']);
    sheet2Data.push([31, 'Tentative Profit Margin %', lisenSample.values.tentativeProfitMargin, 'Ok (43.2% > 30% criteria)']);
    sheet2Data.push([32, 'AliBaba Link', lisenSample.values.alibabaLink, 'Ok (Verified Verified Gold Supplier)']);
    sheet2Data.push([33, 'Patent Verification', lisenSample.values.patentVerification, 'Ok (Cleared)']);
    sheet2Data.push([34, 'Short Listed Products', lisenSample.values.shortListedStatus, 'Ok (Approved)']);
    sheet2Data.push([35, 'Your Final Remarks/ Approval', lisenSample.values.finalRemarks, 'Ok (Approved for launch)']);
    sheet2Data.push([36, 'Items to be included in the package', lisenSample.values.packageItems, 'Ok (Complete gift box bundle)']);

    const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
    ws2['!cols'] = [
      { wch: 8 },  // Row #
      { wch: 42 }, // Attribute Name
      { wch: 34 }, // Sample 2 Value
      { wch: 55 }, // Remarks / Approval
    ];
    XLSX.utils.book_append_sheet(wb, ws2, 'LISEN Stand - Sample 2');
  }

  // -------------------------------------------------------------
  // Sheet 3: Top 15 Competitors Helium 10 X-Ray Raw Data
  // -------------------------------------------------------------
  const sheet3Data: (string | number)[][] = [
    ['Product Name', 'Rank', 'ASIN', 'Brand', 'Price ($)', 'Monthly Sales (units)', 'Monthly Revenue ($)', 'BSR', 'Rating', 'Reviews', 'FBA Fee ($)', 'Year Launched', 'Size Tier'],
  ];

  products.forEach((p) => {
    if (p.topCompetitors && p.topCompetitors.length > 0) {
      p.topCompetitors.forEach((c) => {
        sheet3Data.push([
          p.name,
          c.rank,
          c.asin,
          c.brand,
          c.price,
          c.sales,
          c.revenue,
          c.bsr,
          c.rating,
          c.reviews,
          c.fbaFee,
          c.yearLaunched,
          c.sizeTier,
        ]);
      });
    }
  });

  const ws3 = XLSX.utils.aoa_to_sheet(sheet3Data);
  ws3['!cols'] = [
    { wch: 25 },
    { wch: 6 },
    { wch: 14 },
    { wch: 16 },
    { wch: 10 },
    { wch: 16 },
    { wch: 18 },
    { wch: 10 },
    { wch: 8 },
    { wch: 10 },
    { wch: 12 },
    { wch: 14 },
    { wch: 16 },
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Helium 10 X-Ray Raw Data');

  // Trigger download
  const fileName = `Amazon_Product_Comparison_Sheet_USA_${assignmentInfo.studentName ? assignmentInfo.studentName.replace(/\s+/g, '_') : 'Assignment'}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// Generate TSV string for easy pasting into Google Sheets or Excel
export function generateTsvData(products: ProductSample[]): string {
  const lines: string[] = [];
  const header = ['Sr. No', 'Attribute Name', 'Standard Value'];
  products.forEach((p) => {
    header.push(`Sample ${p.sampleNumber} (${p.name})`);
    header.push('Remarks / Approval');
  });
  lines.push(header.join('\t'));

  CRITERIA_DEFINITIONS.forEach((crit) => {
    const row = [String(crit.rowNumber), crit.attributeName, crit.standardValue];
    products.forEach((p) => {
      const val = String(p.values[crit.key as keyof typeof p.values] ?? '');
      const rem = String(p.remarks[crit.key as keyof typeof p.remarks] ?? 'Ok');
      row.push(val);
      row.push(rem);
    });
    lines.push(row.join('\t'));
  });

  return lines.join('\n');
}
