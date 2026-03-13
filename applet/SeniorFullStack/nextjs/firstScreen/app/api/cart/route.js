import { getCart } from '@/lib/mock';

// 购物车 API（实时数据，不缓存）
export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getCart();
  return Response.json(data);
}
