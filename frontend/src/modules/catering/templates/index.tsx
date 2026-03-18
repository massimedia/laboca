import { HttpTypes } from "@medusajs/types"

import CateringBuilder from "@modules/catering/components/catering-builder"
import Container from "@modules/ui/components/container"

type CateringTemplateProps = {
  product: HttpTypes.StoreProduct
}

export default function CateringTemplate({ product }: CateringTemplateProps) {
  return (
    <Container className="py-10 pb-40">
      <CateringBuilder product={product} />
    </Container>
  )
}
