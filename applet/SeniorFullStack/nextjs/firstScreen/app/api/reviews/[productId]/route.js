import { getReviews } from '@/lib/mock';

// 商品评论 API（实时数据，不缓存）
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { productId } = await params;
  const data = await getReviews(productId);
  return Response.json(data);
}
