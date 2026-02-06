
import { dbEngine, TABLE_PRODUCT_MASTER } from '../../data/sqlDb';

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: number;
}

import Groq from 'groq-sdk';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const aiService = {
    processQuery: async (query: string, storeId: string): Promise<string> => {
        // 1. Intent Classification (Simple Rule-Based for now)
        const lowerQuery = query.toLowerCase();

        const isAvailabilityQuery = lowerQuery.includes('have') || lowerQuery.includes('stock') || lowerQuery.includes('available');
        const isLocationQuery = lowerQuery.includes('where') || lowerQuery.includes('find') || lowerQuery.includes('location') || lowerQuery.includes('aisle') || lowerQuery.includes('shelf');
        const isPriceQuery = lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('much');

        // Check for specific product mentions
        const products = TABLE_PRODUCT_MASTER;
        const foundProduct = products.find(p => lowerQuery.includes(p.name.toLowerCase()) || lowerQuery.includes(p.brand.toLowerCase()) || lowerQuery.includes(p.category.toLowerCase()));

        // MODE 1: FACTUAL MODE
        if ((isAvailabilityQuery || isLocationQuery || isPriceQuery) && foundProduct) {
            if (!storeId) return "Please select a store first so I can check the inventory.";

            const productDetails = dbEngine.queryProductByBarcode(foundProduct.barcode, storeId);

            if (!productDetails) {
                return `I'm sorry, I couldn't find details for ${foundProduct.name} in this store.`;
            }

            const storeTable = dbEngine.getInventoryTable(storeId);
            const inventoryRecord = storeTable.find(i => i.product_id === foundProduct.id);

            if (!inventoryRecord || !inventoryRecord.in_stock) {
                return `I'm sorry, ${foundProduct.name} is currently not available in this store.`;
            }

            const { aisle, rack, shelf } = inventoryRecord.location;
            const price = inventoryRecord.store_price;

            if (isLocationQuery) {
                return `You can find ${foundProduct.name} in Aisle ${aisle}, Rack ${rack}, Shelf ${shelf}.`;
            }

            if (isPriceQuery) {
                return `${foundProduct.name} corresponds to ₹${price}.`;
            }

            return `Yes, we have ${foundProduct.name} in stock. It is located in Aisle ${aisle}, Rack ${rack}, Shelf ${shelf}.`;
        }

        // MODE 2: ADVISORY MODE (Real LLaMA-3.3 via Groq)
        if (!GROQ_API_KEY) {
            console.warn("Missing VITE_GROQ_API_KEY");
            return "I'm currently unable to provide advice as my connection is not configured. Please check the API key.";
        }

        try {
            const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are ScanGo AI, a helpful in-store shopping assistant. 
                        User is in a physical supermarket.
                        
                        RULES:
                        1. Be concise, polite, and neutral.
                        2. Do NOT invent specific store inventory, prices, or aisle locations (you don't have access to that in this mode).
                        3. Focus on general product advice, comparisons, health benefits, and cooking tips.
                        4. If asked to compare, provide objective pros/cons.
                        5. Keep answers under 3 sentences if possible.
                        `
                    },
                    {
                        role: "user",
                        content: query
                    }
                ],
                model: "llama-3.3-70b-versatile",
            });

            return completion.choices[0]?.message?.content || "I couldn't generate a response.";

        } catch (error) {
            console.error("Groq API Error:", error);
            return "I'm having trouble connecting to my brain right now. Please try again.";
        }
    }
};
