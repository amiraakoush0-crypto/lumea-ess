import { ProductsManager } from "@/components/admin/products-manager"
import { getProducts } from "@/lib/data"

export default async function AdminProductsPage() {
  const products = await getProducts()
  return <ProductsManager products={products} />
}
