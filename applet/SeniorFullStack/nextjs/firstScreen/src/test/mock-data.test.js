import { describe, it, expect } from 'vitest'
import { getProducts, getProduct, getReviews, getCart } from '@/lib/mock'

// TC-1/TC-2: 验证 mock 数据层正确性
describe('Mock 数据层', () => {
  it('getProducts 返回6个商品', async () => {
    const products = await getProducts()
    expect(products).toHaveLength(6)
    products.forEach(p => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('price')
      expect(p).toHaveProperty('image')
      expect(p).toHaveProperty('category')
      expect(p).toHaveProperty('rating')
    })
  })

  it('getProduct 返回单个商品含 fetchedAt', async () => {
    const product = await getProduct(1)
    expect(product).not.toBeNull()
    expect(product.name).toBe('iPhone 16 Pro')
    expect(product.fetchedAt).toBeDefined()
    expect(typeof product.price).toBe('number')
    expect(typeof product.stock).toBe('number')
  })

  it('getProduct 不存在的 id 返回 null', async () => {
    const product = await getProduct(999)
    expect(product).toBeNull()
  })

  it('getReviews 返回评论数组', async () => {
    const reviews = await getReviews(1)
    expect(reviews.length).toBeGreaterThan(0)
    reviews.forEach(r => {
      expect(r).toHaveProperty('id')
      expect(r).toHaveProperty('user')
      expect(r).toHaveProperty('content')
      expect(r).toHaveProperty('time')
    })
  })

  it('getReviews 不存在的商品返回空数组', async () => {
    const reviews = await getReviews(999)
    expect(reviews).toEqual([])
  })

  it('getCart 返回购物车含商品信息', async () => {
    const cart = await getCart()
    expect(cart.length).toBeGreaterThan(0)
    cart.forEach(item => {
      expect(item).toHaveProperty('productId')
      expect(item).toHaveProperty('quantity')
      expect(item).toHaveProperty('product')
      if (item.product) {
        expect(item.product).toHaveProperty('name')
        expect(item.product).toHaveProperty('price')
        expect(item.product).toHaveProperty('image')
      }
    })
  })
})
