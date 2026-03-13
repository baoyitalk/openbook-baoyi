import { getProduct } from '@/lib/mock';

// 单个商品 API
export async function GET(request, { params }) {
  const { id } = await params;
  const data = await getProduct(id);
  if (!data) {
    return Response.json({ error: '商品不存在' }, { status: 404 });
  }
  return Response.json(data);
}
