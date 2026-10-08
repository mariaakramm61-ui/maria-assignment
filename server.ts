import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API endpoint to analyze a product using Helium 10 X-Ray criteria
app.post('/api/analyze-product', async (req: Request, res: Response) => {
  try {
    const { keyword, category, targetMarket = 'USA' } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: 'Keyword or product title is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API is not configured. Falling back to local intelligence.',
      });
    }

    const prompt = `You are a professional Amazon FBA Private Label Product Hunting Expert specializing in the US Marketplace and Helium 10 X-Ray Chrome extension analysis.
Analyze the following product or keyword: "${keyword}" (Category: "${category || 'General'}").
Marketplace: Amazon ${targetMarket}.

Evaluate the product against the standard Helium 10 X-Ray Amazon hunting criteria:
1. Monthly Search Volume (main KW) (Standard: > 2,000)
2. Average Revenue (top sellers, 6 mo) (Standard: > $12,000)
3. Average Monthly units (Standard: > 100 units)
4. Average Selling Price (Standard: $20 to $75)
5. Average Reviews (top sellers) (Standard: < 2,000)
6. Sellers with < 500 reviews in Top 15 (Standard: > 5 sellers)
7. Sellers with < 200 reviews in Top 15 (Standard: > 2 sellers)
8. H10 Competing Products (Standard: < 3,000)
9. Amazon Listings in Top 15 (Standard: < 4 listings)
10. Same-Brand Listings in Top 15 (Standard: < 4 brands)
11. Product Weight (Standard: < 7 lb)
12. Size Tier (Standard: Standard)
13. Avg Variations of Top 5 (Standard: < 4 variations)
14. Listings with > $10,000 Revenue (Standard: > 7 listings)
15. 2025 Listings with > $10,000 (Standard: > 4 listings)
16. 2026 Listings with > $10,000 (Standard: > 3 listings)
17. Average Rating of Top 5 Sellers (Standard: > 4.2)
18. Revenue Consistency (Standard: Consistent)
19. Price Depth / Stability (Standard: Consistent)
20. Seasonality (Standard: Non-seasonal)
21. Expected/Tentative Landing Cost (USD)
22. FBA Fee (USD)
23. Referral Fee (15% USD)
24. Profit (tentative USD)
25. Tentative Profit Margin %
26. Patent Verification (Cleared / Infringement Risk)
27. Items to be included in the package
28. Final Remarks / Approval in Urdu/English mix (e.g., "Ok (Criteria se behtar hai)", "Sari zindagi chalne wala product")

Return a clean, valid JSON object with:
{
  "productName": "string",
  "category": "string",
  "searchVolume": number,
  "searchVolumeRemarks": "string",
  "averageRevenue": number,
  "averageRevenueRemarks": "string",
  "monthlyUnits": number,
  "monthlyUnitsRemarks": "string",
  "averagePrice": number,
  "averagePriceRemarks": "string",
  "averageReviews": number,
  "averageReviewsRemarks": "string",
  "sellersUnder500": number,
  "sellersUnder500Remarks": "string",
  "sellersUnder200": number,
  "sellersUnder200Remarks": "string",
  "competingProducts": number,
  "competingProductsRemarks": "string",
  "amazonListings": number,
  "amazonListingsRemarks": "string",
  "sameBrandListings": number,
  "sameBrandListingsRemarks": "string",
  "weightLbs": number,
  "weightRemarks": "string",
  "sizeTier": "Standard" | "Large Standard" | "Oversize",
  "sizeTierRemarks": "string",
  "variations": number,
  "variationsRemarks": "string",
  "revenueOver10k": number,
  "revenueOver10kRemarks": "string",
  "revenue2025Over10k": number,
  "revenue2025Over10kRemarks": "string",
  "revenue2026Over10k": number,
  "revenue2026Over10kRemarks": "string",
  "averageRating": number,
  "averageRatingRemarks": "string",
  "revenueConsistency": "Consistent" | "Fluctuating",
  "revenueConsistencyRemarks": "string",
  "priceStability": "Consistent" | "Price War",
  "priceStabilityRemarks": "string",
  "seasonality": "Non-seasonal" | "Seasonal",
  "seasonalityRemarks": "string",
  "landingCost": number,
  "fbaFee": number,
  "referralFee": number,
  "profit": number,
  "profitMargin": number,
  "patentStatus": "string",
  "shortlistStatus": "Approved" | "Borderline" | "Rejected",
  "finalRemarks": "string",
  "packageItems": "string",
  "topCompetitors": [
    {
      "rank": number,
      "asin": "string",
      "title": "string",
      "brand": "string",
      "price": number,
      "sales": number,
      "revenue": number,
      "bsr": number,
      "rating": number,
      "reviews": number,
      "fbaFee": number,
      "yearLaunched": number
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing product with Gemini:', error);
    return res.status(500).json({ error: error.message || 'Analysis failed' });
  }
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

startServer();
