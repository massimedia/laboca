import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listProducts } from "@lib/data/products"
import CateringTemplate from "@modules/catering/templates"

export const metadata: Metadata = {
  title: "Empanada Catering",
  description: "Build your empanada catering order.",
}

type Props = {
  params: Promise<{ countryCode: string }>
}

const isEmpanadaProduct = (product: { title?: string | null; handle?: string | null }) => {
  const title = product.title?.trim().toLowerCase()
  const handle = product.handle?.trim().toLowerCase()

  return title === "empanada" || handle === "empanada"
}

export default async function CateringPage(props: Props) {
  const params = await props.params
  const { countryCode } = params

  const firstBatch = await listProducts({
    countryCode,
    queryParams: {
      limit: 100,
    },
  })

  let empanadaProduct = firstBatch.response.products.find(isEmpanadaProduct)

  if (!empanadaProduct) {
    const searchBatch = await listProducts({
      countryCode,
      queryParams: {
        q: "empanada",
        limit: 50,
      },
    })

    empanadaProduct = searchBatch.response.products.find(isEmpanadaProduct)
  }

  if (!empanadaProduct) {
    notFound()
  }

  return <CateringTemplate product={empanadaProduct} countryCode={countryCode} />
}
