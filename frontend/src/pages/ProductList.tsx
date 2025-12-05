import React, { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Navbar } from '@/pages/Navbar'
import { Footer } from '@/pages/Footer'
import { useCart } from '@/context/CartContext'
import { ShoppingCart, ChevronDown } from 'lucide-react'
import { SlimHeroCarousel } from './SlimCarousel'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ==================== TYPES ====================
interface Product {
  product_id: number
  name: string
  price: number
  rating: number
  numReviews: number
  image_url?: string
  short_description?: string
  CPU?: string
  RAM?: string
  Storage?: string
}

interface Category {
  category_id: number
  name: string
  parent_id: number | null
}

interface Brand {
  brand_id: number
  name: string
}

// ==================== UTILS ====================
function formatPrice(price?: number) {
  if (typeof price !== 'number') return ''
  try {
    const s = Math.round(price).toLocaleString('vi-VN')
    return `${s} đ`
  } catch (e) {
    return String(price) + ' đ'
  }
}

function normalizePriceValue(p?: number): number | undefined {
  if (p == null) return undefined
  if (p >= 1_000_000_000) {
    return Math.round(p / 100)
  }
  return p
}

// ==================== PRODUCTLIST COMPONENT ====================
export default function ProductList() {
  const { addToCart, cartCount } = useCart()

  // ===== State =====
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100_000_000])
  const [selectedRAM, setSelectedRAM] = useState<string[]>([])
  const [selectedStorage, setSelectedStorage] = useState<string[]>([])
  const [selectedCPU, setSelectedCPU] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest')
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    sort: false,
    category: true,
    brand: true,
    price: true,
    ram: true,
    storage: true,
    cpu: true,
  })

  // State to hold raw products returned from API (before client-side spec filters)
  const [rawProducts, setRawProducts] = useState<Product[]>([])

  // Extract unique spec values from raw products (these reflect the selected category)
  const uniqueRAM = Array.from(new Set(rawProducts.map(p => p.RAM).filter(Boolean)))
  const uniqueStorage = Array.from(new Set(rawProducts.map(p => p.Storage).filter(Boolean)))
  const uniqueCPU = Array.from(new Set(rawProducts.map(p => p.CPU).filter(Boolean)))

  // Child category selection (filter by subcategory)
  const [selectedChildCategory, setSelectedChildCategory] = useState<number | null>(null)

  // Read `category` query param from URL (Navbar links may set `?category=...`)
  const [searchParams] = useSearchParams()

  // ===== Fetch Categories =====
  useEffect(() => {
    axios.get(`${API_URL}/categories`)
      .then(res => {
        const cats = res.data?.data || res.data || []
        setCategories(cats)
      })
      .catch(e => console.error('Error fetching categories:', e))
  }, [])

  // ===== Fetch Brands (when category changes) =====
  useEffect(() => {
    if (selectedCategory) {
      axios.get(`${API_URL}/brands?category_id=${selectedCategory}`)
        .then(res => {
          const brandsData = res.data?.data || res.data || []
          setBrands(brandsData)
        })
        .catch(e => console.error('Error fetching brands:', e))
    } else {
      axios.get(`${API_URL}/brands`)
        .then(res => {
          const brandsData = res.data?.data || res.data || []
          setBrands(brandsData)
        })
        .catch(e => console.error('Error fetching brands:', e))
    }
  }, [selectedCategory])

  // ===== Fetch Products (with filters) =====
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      let query = `${API_URL}/products?`

      // Apply filters - prefer child category if selected
      const params: string[] = []
      const categoryForQuery = selectedChildCategory || selectedCategory
      if (categoryForQuery) {
        params.push(`category_id=${categoryForQuery}`)
      }
      if (selectedBrands.length > 0) {
        params.push(`brand_id=${selectedBrands.join(',')}`)
      }
      if (priceRange) {
        params.push(`price_min=${priceRange[0]}`)
        params.push(`price_max=${priceRange[1]}`)
      }

      query += params.join('&')

      const res = await axios.get(query)
      let data = res.data?.data || res.data || []

      // Normalize prices and set raw products (before spec filtering)
      data = data.map((p: any) => ({
        ...p,
        price: normalizePriceValue(p.price) || p.price,
      }))

      setRawProducts(data)

      // Client-side filter by specs (use selected spec filters)
      let filtered = data.filter((p: any) => {
        if (selectedRAM.length > 0 && !selectedRAM.includes(p.RAM)) return false
        if (selectedStorage.length > 0 && !selectedStorage.includes(p.Storage)) return false
        if (selectedCPU.length > 0 && !selectedCPU.includes(p.CPU)) return false
        return true
      })

      // Sort
      if (sortBy === 'price-asc') {
        filtered.sort((a: any, b: any) => (a.price || 0) - (b.price || 0))
      } else if (sortBy === 'price-desc') {
        filtered.sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
      } else if (sortBy === 'rating') {
        filtered.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      }

      setProducts(filtered)
    } catch (e) {
      console.error('Error fetching products:', e)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, selectedChildCategory, selectedBrands, priceRange, selectedRAM, selectedStorage, selectedCPU, sortBy])

  // Initialize selectedCategory from URL param if present
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      const id = parseInt(cat)
      if (!isNaN(id)) setSelectedCategory(id)
    }
  }, [searchParams])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Reset child-category and spec filters when main category changes
  useEffect(() => {
    setSelectedChildCategory(null)
    setSelectedBrands([])
    setSelectedRAM([])
    setSelectedStorage([])
    setSelectedCPU([])
  }, [selectedCategory])

  // ===== Handle Add to Cart =====
  const handleAddToCart = (product: Product) => {
    addToCart({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      image_url: product.image_url || '',
    }, 1)
    alert(`Đã thêm ${product.name} vào giỏ hàng!`)
  }

  // ===== Computed =====
  const mainCategories = categories.filter(c => c.parent_id === null)
  const childCategories = selectedCategory
    ? categories.filter(c => c.parent_id === selectedCategory)
    : []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartCount={cartCount} />

      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:underline">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">Danh sách sản phẩm</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ===== LEFT SIDEBAR: FILTERS ===== */}
            <aside className="lg:col-span-1">
              <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 sticky top-28">
                {/* Sort By */}
                <div className="mb-6">
                  <button
                    onClick={() => setExpandedFilters({ ...expandedFilters, sort: !expandedFilters.sort })}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <h3 className="font-semibold text-lg">Sắp xếp</h3>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedFilters.sort ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.sort && (
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort" value="newest" checked={sortBy === 'newest'} onChange={e => setSortBy(e.target.value as any)} className="w-4 h-4" />
                        Mới nhất
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort" value="price-asc" checked={sortBy === 'price-asc'} onChange={e => setSortBy(e.target.value as any)} className="w-4 h-4" />
                        Giá: Thấp → Cao
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort" value="price-desc" checked={sortBy === 'price-desc'} onChange={e => setSortBy(e.target.value as any)} className="w-4 h-4" />
                        Giá: Cao → Thấp
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="sort" value="rating" checked={sortBy === 'rating'} onChange={e => setSortBy(e.target.value as any)} className="w-4 h-4" />
                        Đánh giá cao
                      </label>
                    </div>
                  )}
                  <hr className="my-6 border-gray-700" />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => setExpandedFilters({ ...expandedFilters, category: !expandedFilters.category })}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <h3 className="font-semibold text-lg">Danh mục</h3>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedFilters.category ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.category && (
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === null}
                          onChange={() => setSelectedCategory(null)}
                          className="w-4 h-4"
                        />
                        Tất cả
                      </label>
                      {mainCategories.map(cat => (
                        <label key={cat.category_id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === cat.category_id}
                            onChange={() => setSelectedCategory(cat.category_id)}
                            className="w-4 h-4"
                          />
                          {cat.name}
                        </label>
                      ))}
                      {selectedCategory && childCategories.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-400 mb-2">Loại</div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="child-category"
                              checked={selectedChildCategory === null}
                              onChange={() => setSelectedChildCategory(null)}
                              className="w-4 h-4"
                            />
                            Tất cả loại
                          </label>
                          {childCategories.map(cc => (
                            <label key={cc.category_id} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="child-category"
                                checked={selectedChildCategory === cc.category_id}
                                onChange={() => setSelectedChildCategory(cc.category_id)}
                                className="w-4 h-4"
                              />
                              {cc.name}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <hr className="my-6 border-gray-700" />
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <button
                    onClick={() => setExpandedFilters({ ...expandedFilters, brand: !expandedFilters.brand })}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <h3 className="font-semibold text-lg">Thương hiệu</h3>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedFilters.brand ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.brand && (
                    <div className="space-y-2 text-sm max-h-[300px] overflow-y-auto">
                      {brands.length > 0 ? (
                        brands.map(brand => (
                          <label key={brand.brand_id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand.brand_id)}
                              onChange={() => {
                                setSelectedBrands(
                                  selectedBrands.includes(brand.brand_id)
                                    ? selectedBrands.filter(b => b !== brand.brand_id)
                                    : [...selectedBrands, brand.brand_id]
                                )
                              }}
                              className="w-4 h-4"
                            />
                            {brand.name}
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500">Không có thương hiệu</p>
                      )}
                    </div>
                  )}
                  <hr className="my-6 border-gray-700" />
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <button
                    onClick={() => setExpandedFilters({ ...expandedFilters, price: !expandedFilters.price })}
                    className="w-full flex items-center justify-between mb-3"
                  >
                    <h3 className="font-semibold text-lg">Khoảng giá</h3>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedFilters.price ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFilters.price && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          placeholder="Min"
                          className="w-20 px-2 py-1 bg-[#0b0b0b] border border-gray-700 rounded text-white"
                        />
                        <span>-</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 100_000_000])}
                          placeholder="Max"
                          className="w-20 px-2 py-1 bg-[#0b0b0b] border border-gray-700 rounded text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* ===== RIGHT CONTENT: PRODUCTS GRID ===== */}
            <div className="lg:col-span-3">
              {/* Results info */}
              <div className="mb-6">
                <p className="text-gray-400">
                  {loading ? 'Đang tải...' : `Tìm thấy ${products.length} sản phẩm`}
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <Link
                    to={`/product/${product.product_id}`}
                    key={product.product_id}
                    className="group bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-red-600 transition-all"
                  >
                    {/* Image with price badge */}
                    <div className="relative h-48 bg-[#0b0b0b] overflow-hidden">
                      <img
                        src={product.image_url || 'https://via.placeholder.com/300x300?text=Product'}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-lg">
                        {formatPrice(product.price)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium line-clamp-2 mb-2 text-white">{product.name}</h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400'
                                  : 'text-gray-600'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.numReviews})</span>
                      </div>

                      {/* Price */}
                      <div className="mb-3">
                        <div className="text-lg font-bold text-blue-400">{formatPrice(product.price)}</div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={e => {
                          e.preventDefault()
                          handleAddToCart(product)
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Empty State */}
              {!loading && products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">Không tìm thấy sản phẩm nào</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
