import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { Navbar } from '@/pages/Navbar'
import { Footer } from '@/pages/Footer'
import { useCart } from '@/context/CartContext'
import { ShoppingCart } from 'lucide-react'
import { FilterSidebar } from './FilterSidebar'
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
  Brand?: string
  Color?: string
}

interface Category {
  category_id: number
  name: string
  parent_id: number | null
}

// category interface not used in this page

// ==================== UTILS ====================
function formatPrice(price?: number) {
  if (typeof price !== 'number') return ''
  try {
    const s = Math.round(price).toLocaleString('vi-VN')
    return `${s} đ`
  } catch {
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

function slugify(s: string) {
  // Remove accents from Vietnamese characters
  const map: Record<string, string> = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
  }
  let str = String(s || '').toLowerCase().trim()
  for (const [k, v] of Object.entries(map)) {
    str = str.replace(new RegExp(k, 'g'), v)
  }
  return str.replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
}

// ==================== PRODUCTLIST COMPONENT ====================
export default function ProductList() {
  const { addToCart, cartCount } = useCart()

  // ===== State =====
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest')
  const [filters, setFilters] = useState({
    brands: [] as string[],
    priceRange: [0, 100_000_000] as [number, number],
    cpu: [] as string[],
    ram: [] as string[],
    storage: [] as string[],
    colors: [] as string[],
  })

  // Read `category` query param from URL (Navbar links may set `?category=...`)
  const [searchParams] = useSearchParams()

  // (categories fetching removed — not used in this view)

  // ===== Fetch Categories =====
  useEffect(() => {
    let mounted = true
    axios.get(`${API_URL}/categories`)
      .then(res => {
        const cats = res.data?.data || res.data || []
        if (mounted) setCategories(cats)
      })
      .catch(() => {
        console.error('Error fetching categories')
      })
    return () => { mounted = false }
  }, [])

  // Map `category` query param (slug or name) -> category_id so backend can filter by id
  useEffect(() => {
    const catParam = searchParams.get('category')
    if (!catParam) {
      setSelectedCategory(null)
      return
    }
    if (categories.length === 0) {
      console.warn('Categories not loaded yet, skipping category mapping')
      return
    }
    
    const trimmed = catParam.trim()
    // If category param is numeric id, use it directly
    const asNum = Number(trimmed)
    if (!Number.isNaN(asNum) && Number.isInteger(asNum)) {
      setSelectedCategory(asNum)
      return
    }
    
    // Try to match by slugified category name OR by name directly
    const paramSlug = trimmed.toLowerCase()
    console.log('Mapping category param:', paramSlug)
    console.log('Available categories:', categories.map(c => ({ 
      id: c.category_id,
      name: c.name, 
      slug: slugify(c.name || ''),
      parent_id: c.parent_id
    })))
    
    let matched = categories.find(c => {
      const categorySlug = slugify(c.name || '')
      const matches = categorySlug === paramSlug
      if (matches) console.log(`✓ Slug matched: "${c.name}" (${c.category_id}) -> ${categorySlug}`)
      return matches
    })
    
    // Fallback: try exact name match
    if (!matched) {
      matched = categories.find(c => (c.name || '').toLowerCase() === paramSlug)
      if (matched) console.log(`✓ Name matched: "${matched.name}" (${matched.category_id})`)
    }
    
    // Fallback: try substring match
    if (!matched) {
      matched = categories.find(c => {
        const catName = (c.name || '').toLowerCase()
        return catName.includes(paramSlug) || paramSlug.includes(catName)
      })
      if (matched) console.log(`✓ Substring matched: "${matched.name}" (${matched.category_id})`)
    }
    
    if (matched) {
      console.log('Setting selectedCategory to:', matched.category_id)
      setSelectedCategory(matched.category_id)
    } else {
      console.warn('✗ No category matched for:', paramSlug)
    }
  }, [searchParams, categories])

  // ===== Fetch Brands (when category changes) =====
  // Brands fetching can be added back if needed from FilterSidebar

  // ===== Fetch Products (with filters) =====
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      let query = `${API_URL}/products?`
      // Apply filters
      const params: string[] = []
      if (selectedCategory) {
        params.push(`category_id=${selectedCategory}`)
      }
      if (filters.priceRange) {
        params.push(`price_min=${filters.priceRange[0]}`)
        params.push(`price_max=${filters.priceRange[1]}`)
      }
      query += params.join('&')
      console.log('Fetching products with query:', query)
      const res = await axios.get(query)
      const data = res.data?.data || res.data || []
      console.log('Fetched products count:', data.length)
      // Normalize prices and set raw products (before spec filtering)
      const normalizedData = data.map((p: Product) => ({
        ...p,
        price: normalizePriceValue(p.price) || p.price,
      }))
      // helper to safely read string fields from product
      const getStringField = (obj: unknown, key: string) => {
        const r = obj as unknown as Record<string, unknown>
        const v = r[key]
        return typeof v === 'string' ? v : ''
      }

      const normalizeForMatch = (s?: string) =>
        String(s || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')

      const categoryParam = searchParams.get('category')

      // Client-side filter by all specs and brand/color
      const filtered = normalizedData.filter((p: Product) => {
        // If category query param provided from navbar, try to match product name
        if (categoryParam) {
          const cat = String(categoryParam).toLowerCase()
          const nameLower = (p.name || '').toLowerCase()
          if (!nameLower.includes(cat)) return false
        }
        // Brand filter
        if (filters.brands.length > 0) {
          // Accept both Brand and brand (case-insensitive), trim whitespace
          const productBrandRaw = (typeof p.Brand === 'string' ? p.Brand : getStringField(p, 'brand'))
          const productBrand = String(productBrandRaw).trim().toLowerCase()
          // If product has no explicit brand field, try to infer from product name
          const nameLower = (p.name || '').toLowerCase()
          const matchesBrand = filters.brands.some(b => {
            const bnorm = b.trim().toLowerCase()
            if (productBrand && productBrand === bnorm) return true
            if (nameLower && nameLower.includes(bnorm)) return true
            return false
          })
          if (!matchesBrand) return false
        }
        // CPU filter (substring, normalized)
        if (filters.cpu.length > 0) {
          const cpuRaw = typeof p.CPU === 'string' ? p.CPU : getStringField(p, 'cpu')
          const cpuNorm = normalizeForMatch(cpuRaw)
          const cpuMatch = filters.cpu.some(f => cpuNorm.includes(normalizeForMatch(f)))
          if (!cpuMatch) return false
        }
        // RAM filter (match numbers like 8GB, 16GB)
        if (filters.ram.length > 0) {
          const ramRaw = typeof p.RAM === 'string' ? p.RAM : getStringField(p, 'ram')
          const ramNorm = normalizeForMatch(ramRaw)
          const ramMatch = filters.ram.some(f => ramNorm.includes(normalizeForMatch(f)))
          if (!ramMatch) return false
        }
        // Storage filter
        if (filters.storage.length > 0) {
          const storageRaw = typeof p.Storage === 'string' ? p.Storage : getStringField(p, 'storage')
          const storageNorm = normalizeForMatch(storageRaw)
          const storageMatch = filters.storage.some(f => storageNorm.includes(normalizeForMatch(f)))
          if (!storageMatch) return false
        }
        // Color filter
        if (filters.colors.length > 0) {
          const productColorRaw = (typeof p.Color === 'string' ? p.Color : getStringField(p, 'color'))
          const productColor = String(productColorRaw).trim().toLowerCase()
          if (!filters.colors.some(c => productColor === String(c).trim().toLowerCase())) return false
        }
        return true
      })
      // Sort
      if (sortBy === 'price-asc') {
        filtered.sort((a: Product, b: Product) => (a.price || 0) - (b.price || 0))
      } else if (sortBy === 'price-desc') {
        filtered.sort((a: Product, b: Product) => (b.price || 0) - (a.price || 0))
      } else if (sortBy === 'rating') {
        filtered.sort((a: Product, b: Product) => (b.rating || 0) - (a.rating || 0))
      }
      setProducts(filtered)
    } catch {
      console.error('Error fetching products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, filters, sortBy, searchParams])

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

  // Re-fetch products when filters or sorting change
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts, searchParams])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar cartCount={cartCount} />
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Hero Carousel for Category */}
          <div className="mb-8">
            <SlimHeroCarousel 
              category={
                categories.find(c => c.category_id === selectedCategory)?.name.toLowerCase().replace(/\s+/g, '') || 'all'
              }
            />
          </div>
          
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:underline">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-300">Danh sách sản phẩm</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-x-12 items-start">
            {/* ===== LEFT SIDEBAR: FILTERS ===== */}
            <div className="lg:col-span-1 pr-0 lg:pr-10 relative z-10">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                />
            </div>
            {/* ===== RIGHT CONTENT: PRODUCTS GRID ===== */}
            <div className="lg:col-span-3 relative z-0">
              {/* Sort and Results info */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-400">
                  {loading ? 'Đang tải...' : `Tìm thấy ${products.length} sản phẩm`}
                </p>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc' | 'rating')}
                  className="px-3 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-white text-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp → Cao</option>
                  <option value="price-desc">Giá: Cao → Thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
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
