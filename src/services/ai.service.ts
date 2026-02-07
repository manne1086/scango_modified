import { dbEngine, TABLE_PRODUCT_MASTER } from "../../data/sqlDb";
import { supabase, isSupabaseConfigured } from "./supabase";
import Groq from "groq-sdk";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: number;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Enhanced Context Data
const REVIEWS_DATA = `
BRAND REVIEWS:
- Tata Salt: Rating 4.8/5, Trusted purity, consistent quality.
- Bru Coffee: Rating 4.5/5, Strong aroma, rich taste, preferred over competitors.
- Dabur Red: Rating 4.6/5, Effective ayurvedic ingredients, strong flavor.
- Maggi: Rating 4.3/5, Iconic taste, quick cooking, high sodium.
- Parle-G: Rating 4.9/5, World's largest selling biscuit, nostalgic taste, very affordable.
- Lizol: Rating 4.7/5, 99.9% germ kill, pleasant fragrance, highly recommended for hygiene.
- Yippee: Rating 3.9/5, Thicker noodles, less seasoning than Maggi.
`;

const STORE_OFFERS_DATA = `
STORE OFFERS:
- Store A (Malad West): 15% off groceries, Buy 1 Get 1 on snacks.
- Store B (Powai): 10% off household items.
- Store C (Thane): 20% flat discount on all staples, Best value for bulk buying.
`;

export const aiService = {
  processQuery: async (query: string, storeId: string, fileContent?: string): Promise<string> => {
    if (!GROQ_API_KEY) {
      console.warn("Missing VITE_GROQ_API_KEY");
      return "I'm currently unable to provide advice as my connection is not configured.";
    }

    let context = "";

    // 1. Attempt to fetch data from Supabase for context
    if (isSupabaseConfigured() && storeId) {
      try {
        const { data: products } = await supabase.from("product_master").select("*");
        const { data: inventory } = await supabase
          .from("store_inventory")
          .select("*")
          .eq("store_id", storeId);

        if (products && inventory) {
          context = products
            .map((p) => {
              const inv = inventory.find((i) => i.barcode === p.barcode);
              if (!inv) return null;
              return `Product: ${p.name}, Brand: ${p.brand}, Price: ₹${inv.store_price}, Category: ${p.category}, Stock: ${inv.in_stock ? "Yes" : "No"}.`;
            })
            .filter(Boolean)
            .join("\n");
        }
      } catch (err) {
        console.error("Supabase context fetch error:", err);
      }
    }

    // 2. Fallback to Local Data Context if Supabase failed or returned empty
    if (!context && storeId) {
      const products = TABLE_PRODUCT_MASTER;
      const storeTable = dbEngine.getInventoryTable(storeId);
      context = products
        .map((p) => {
          const inv = storeTable.find((i) => i.product_id === p.id);
          if (!inv) return null;
          return `Product: ${p.name}, Brand: ${p.brand}, Price: ₹${inv.store_price}, Category: ${p.category}, Stock: ${inv.in_stock ? "Yes" : "No"}.`;
        })
        .filter(Boolean)
        .join("\n");
    }

    const fullContext = `
${context}
${REVIEWS_DATA}
${STORE_OFFERS_DATA}
${fileContent ? `USER UPLOADED FILE CONTENT:\n${fileContent}` : ""}
    `;

    try {
      const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are ScanGo AI, a helpful and decisive in-store shopping assistant. 
                        
                        ${storeId ? `CURRENT STORE INVENTORY (${storeId}):\n${fullContext}` : "Note: No store selected yet. Prompt user to select a store for specific inventory info."}
                        
                        RULES:
                        1. CATEGORICAL QUERIES: If the user asks for items in a category (e.g., "what items are in household?"), respond ONLY with a markdown list. Each item should include: Name, Category, Location, Aisle, Shelf, and Expiry Date. Do NOT add any conversational filler.
                        2. BRAND COMPARISON: Never answer neutrally. Be rational and specific based on the provided reviews and ratings. Clearly recommend one option and explain why.
                        3. FILE UPLOAD: If user provided file content, extract items and match them against the inventory. Respond ONLY with a markdown list of the items found. For each item, include: Name, Availability, Store, Aisle, Shelf, and Expiry Date. Mark as "Not Available" if not found.
                        4. STORE QUERIES: If asked about store offers or which store is better, use the provided STORE OFFERS data to give a clear, data-driven recommendation.
                        5. Use the provided inventory to answer questions about prices, locations, and availability.
                        6. If a product is mentioned but not in inventory, say it's not available in this store.
                        7. Be concise. If not a list, max 3-4 sentences.`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      return completion.choices[0]?.message?.content || "I couldn't generate a response.";
    } catch (error) {
      console.error("Groq API Error:", error);
      return "I'm having trouble connecting right now. Please try again.";
    }
  },
  transcribeAudio: async (audioFile: File): Promise<string> => {
    if (!GROQ_API_KEY) return "";

    try {
      const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });
      const transcription = await groq.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-large-v3",
        response_format: "text",
      });
      return transcription as any;
    } catch (error) {
      console.error("Transcription Error:", error);
      return "";
    }
  },
};
