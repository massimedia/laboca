import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { listRegions } from "@lib/data/regions"
import CateringTemplate from "@modules/catering/templates"

export const metadata: Metadata = {
  title: "Empanada Catering",
  description: "Build your empanada catering order.",
}

const CATERING_PRODUCT_HANDLE = "empanada"

type ProductList = Awaited<ReturnType<typeof listProducts>>["response"]["products"]

function getEmpanadaProduct(products: ProductList) {
  return (
    products.find((product) => product.handle === CATERING_PRODUCT_HANDLE) ?? null
  )
}

export default async function CateringPage() {
  try {
    const regions = (await listRegions()) ?? []
    const region = regions?.[0]

    if (!region) {
      console.error("No region configured")
      return (
        <div className="content-container py-16">
          Catering is temporarily unavailable while the store region is loading.
        </div>
      )
    }

    const { response } = await listProducts({
      regionId: region.id,
      queryParams: {
        limit: 100,
      },
    })

    const empanadaProduct = getEmpanadaProduct(response.products ?? [])

    if (!empanadaProduct) {
      console.error("Empanada product not found")
      return (
        <div className="content-container py-16">
          Catering is temporarily unavailable while the empanada product is loading.
        </div>
      )
    }

    return <CateringTemplate product={empanadaProduct} />
  } catch (error) {
    console.error("Failed to load catering data", error)
    return (
      <div className="content-container py-16">
        Catering is temporarily unavailable while we connect to the store.
      </div>
    )
  }
}
