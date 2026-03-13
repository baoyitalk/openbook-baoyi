import { getProducts } from '@/lib/mock';

// 商品列表 API
export async function GET() {
  const data = await getProducts();
  return Response.json(data);
}
