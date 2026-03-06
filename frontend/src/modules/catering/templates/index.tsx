import { HttpTypes } from "@medusajs/types"

import CateringBuilder from "@modules/catering/components/catering-builder"

type CateringTemplateProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default function CateringTemplate({
  product,
  countryCode,
}: CateringTemplateProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 pb-40">
      <CateringBuilder product={product} countryCode={countryCode} />
    </div>
  )
}
