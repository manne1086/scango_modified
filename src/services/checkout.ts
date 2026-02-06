export async function checkout(cart: any[], total: number, storeId: string) {
  const res = await fetch("http://localhost:3001/api/orders/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, total, storeId })
  });

  if (!res.ok) throw new Error("Checkout failed");

  return res.json();
}
