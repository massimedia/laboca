"use client"

import {
  addToCart,
  deleteLineItem,
  retrieveCart,
  updateLineItem,
} from "@lib/data/cart"
import { getDefaultCountryCode } from "@lib/util/env"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { Carrot, Drumstick, Flame, Snowflake, Sprout } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Diet = "vegan" | "vegetarian" | "meat"
type DietFilter = "all" | Diet
type Preparation = "frozen" | "baked"

type VariantCardData = {
  id: string
  title: string
  diet: Diet
  description: string
  preparation: Preparation | "unknown"
  unitPrice: number
  currencyCode: string
}

type CateringBuilderProps = {
  product: HttpTypes.StoreProduct
}

const MIN_ORDER = 30

const PREPARATION_OPTIONS: { value: Preparation; label: string }[] = [
  { value: "frozen", label: "Frozen" },
  { value: "baked", label: "Baked" },
]

const DIET_OPTIONS: { value: DietFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "meat", label: "Meat" },
]

const asString = (value: unknown): string => {
  if (typeof value === "string") {
    return value
  }

  return ""
}

const normalizeDiet = (value: string): Diet => {
  const lower = value.toLowerCase()

  if (lower === "vegan") {
    return "vegan"
  }

  if (lower === "vegetarian") {
    return "vegetarian"
  }

  return "meat"
}

const getVariantDiet = (
  metadata: Record<string, unknown>,
  fallbackText: string
): Diet => {
  const metadataDiet = asString(metadata.diet)

  if (metadataDiet) {
    return normalizeDiet(metadataDiet)
  }

  const text = fallbackText.toLowerCase()

  if (text.includes("vegan")) {
    return "vegan"
  }

  if (text.includes("vegetarian")) {
    return "vegetarian"
  }

  return "meat"
}

const getVariantPreparation = (
  metadata: Record<string, unknown>,
  title: string,
  optionValues: string
): Preparation | "unknown" => {
  const metadataPreparation = asString(metadata.preparation).toLowerCase()

  if (metadataPreparation === "frozen" || metadataPreparation === "baked") {
    return metadataPreparation
  }

  const searchable = `${title} ${optionValues}`.toLowerCase()

  if (searchable.includes("frozen")) {
    return "frozen"
  }

  if (searchable.includes("baked")) {
    return "baked"
  }

  return "unknown"
}

const getVariantDescription = (
  metadata: Record<string, unknown>,
  fallbackDescription?: string | null
): string => {
  const fromMetadata = asString(metadata.description)

  if (fromMetadata) {
    return fromMetadata
  }

  return fallbackDescription ?? ""
}

const toVariantCardData = (
  variant: HttpTypes.StoreProductVariant,
  fallbackDescription?: string | null
): VariantCardData | null => {
  if (!variant.id || !variant.title) {
    return null
  }

  const metadata = (variant.metadata ?? {}) as Record<string, unknown>
  const optionValues =
    variant.options?.map((option) => option.value).filter(Boolean).join(" ") ?? ""

  const diet = getVariantDiet(metadata, variant.title)
  const preparation = getVariantPreparation(metadata, variant.title, optionValues)

  const calculatedAmount = variant.calculated_price?.calculated_amount
  const originalAmount = variant.calculated_price?.original_amount
  const unitPrice =
    typeof calculatedAmount === "number"
      ? calculatedAmount
      : typeof originalAmount === "number"
      ? originalAmount
      : 0

  const currencyCode = variant.calculated_price?.currency_code ?? "DKK"

  return {
    id: variant.id,
    title: variant.title,
    diet,
    preparation,
    description: getVariantDescription(metadata, fallbackDescription),
    unitPrice,
    currencyCode,
  }
}

function DietIcon({ diet }: { diet: "vegan" | "vegetarian" | "meat" }) {
  if (diet === "vegan") {
    return <Sprout size={16} className="text-green-600" />
  }

  if (diet === "vegetarian") {
    return <Carrot size={16} className="text-orange-500" />
  }

  return <Drumstick size={16} className="text-red-600" />
}

function PreparationIcon({
  preparation,
}: {
  preparation: "frozen" | "baked" | "unknown"
}) {
  if (preparation === "frozen") {
    return <Snowflake size={16} className="text-blue-500" />
  }

  if (preparation === "baked") {
    return <Flame size={16} className="text-orange-500" />
  }

  return null
}

export default function CateringBuilder({ product }: CateringBuilderProps) {
  const router = useRouter()
  const [preparation, setPreparation] = useState<Preparation>("frozen")
  const [dietFilter, setDietFilter] = useState<DietFilter>("all")
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isCartLoading, setIsCartLoading] = useState(true)
  const [isMutatingCart, setIsMutatingCart] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const variants = useMemo(() => {
    return (
      product.variants
        ?.map((variant) => toVariantCardData(variant, product.description))
        .filter((variant): variant is VariantCardData => variant !== null) ?? []
    )
  }, [product])

  const filteredVariants = useMemo(() => {
    return variants.filter((variant) => {
      const preparationMatch =
        variant.preparation === "unknown" || variant.preparation === preparation
      const dietMatch = dietFilter === "all" || variant.diet === dietFilter

      return preparationMatch && dietMatch
    })
  }, [variants, preparation, dietFilter])

  const cartItems = cart?.items ?? []

  const quantityForVariant = (variantId: string) => {
    const item = cartItems.find((lineItem) => lineItem.variant_id === variantId)
    return item?.quantity ?? 0
  }

  const lineItemForVariant = (variantId: string) => {
    return cartItems.find((lineItem) => lineItem.variant_id === variantId)
  }

  const selectedVariants = useMemo(() => {
    return variants
      .map((variant) => ({ variant, quantity: quantityForVariant(variant.id) }))
      .filter((entry) => entry.quantity > 0)
  }, [variants, cartItems])

  const totalEmpanadas = useMemo(() => {
    return selectedVariants.reduce((sum, entry) => sum + entry.quantity, 0)
  }, [selectedVariants])
  const canCheckout = totalEmpanadas >= MIN_ORDER

  const totalPrice = useMemo(() => {
    return selectedVariants.reduce(
      (sum, entry) => sum + entry.quantity * entry.variant.unitPrice,
      0
    )
  }, [selectedVariants])

  const currencyCode = variants[0]?.currencyCode ?? "DKK"
  const progress = Math.min((totalEmpanadas / MIN_ORDER) * 100, 100)
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const syncCart = async () => {
    const nextCart = await retrieveCart().catch(() => null)
    setCart(nextCart)
  }

  useEffect(() => {
    let isMounted = true

    const loadCart = async () => {
      const nextCart = await retrieveCart().catch(() => null)

      if (isMounted) {
        setCart(nextCart)
        setIsCartLoading(false)
      }
    }

    void loadCart()

    return () => {
      isMounted = false
    }
  }, [])

  const setVariantQuantity = async (variantId: string, nextQuantity: number) => {
    const safeQuantity = Number.isFinite(nextQuantity)
      ? Math.max(0, Math.floor(nextQuantity))
      : 0

    const existingLineItem = lineItemForVariant(variantId)

    if (!existingLineItem && safeQuantity === 0) {
      return
    }

    setIsMutatingCart(true)

    try {
      if (existingLineItem && safeQuantity === 0) {
        await deleteLineItem(existingLineItem.id)
      } else if (existingLineItem) {
        await updateLineItem({
          lineId: existingLineItem.id,
          quantity: safeQuantity,
        })
      } else if (safeQuantity > 0) {
        await addToCart({
          variantId,
          quantity: safeQuantity,
          countryCode: getDefaultCountryCode(),
        })
      }

      await syncCart()
      router.refresh()
    } finally {
      setIsMutatingCart(false)
    }
  }

  const increaseVariantQuantity = async (variantId: string, amount: number) => {
    const current = quantityForVariant(variantId)
    await setVariantQuantity(variantId, current + amount)
  }

  const handleCheckout = () => {
    if (!canCheckout) return
    router.push("/checkout")
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-ui-fg-base">Empanada Catering</h1>
        <p className="text-ui-fg-subtle">Choose how you want them prepared.</p>
        <div className="text-sm text-ui-fg-subtle leading-6">
          <p>Frozen = bake fresh yourself</p>
          <p>Baked = ready to heat and serve</p>
        </div>
      </header>

      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-xl bg-ui-bg-subtle p-1 border border-ui-border-base">
            {PREPARATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPreparation(option.value)}
                className={clx(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                  {
                    "bg-white text-ui-fg-base shadow-sm": preparation === option.value,
                    "text-ui-fg-subtle": preparation !== option.value,
                  }
                )}
              >
                {option.value === "frozen" ? (
                  <Snowflake size={16} />
                ) : (
                  <Flame size={16} />
                )}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setDietFilter(option.value)}
              className={clx(
                "rounded-full border px-3 py-1.5 text-sm transition-colors flex items-center gap-2",
                {
                  "bg-ui-bg-base text-ui-fg-base border-ui-border-interactive":
                    dietFilter === option.value,
                  "bg-white text-ui-fg-subtle border-ui-border-base":
                    dietFilter !== option.value,
                }
              )}
            >
              {option.value === "vegan" && <Sprout size={16} />}
              {option.value === "vegetarian" && <Carrot size={16} />}
              {option.value === "meat" && <Drumstick size={16} />}
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVariants.map((variant) => {
          const quantity = quantityForVariant(variant.id)

          return (
            <article
              key={variant.id}
              className="rounded-xl border border-ui-border-base bg-white p-4 shadow-sm flex flex-col gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg text-ui-fg-base">{variant.title}</h3>
                  <div className="flex items-center gap-2">
                    <PreparationIcon preparation={variant.preparation} />
                    <DietIcon diet={variant.diet} />
                  </div>
                </div>
                {variant.description && (
                  <p className="text-sm text-ui-fg-subtle leading-5">{variant.description}</p>
                )}
                <p className="text-sm font-medium text-ui-fg-base">
                  {convertToLocale({
                    amount: variant.unitPrice,
                    currency_code: variant.currencyCode,
                  })}
                </p>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={isMutatingCart || isCartLoading}
                    onClick={() => {
                      void increaseVariantQuantity(variant.id, -1)
                    }}
                    className="h-9 w-9 rounded-lg border border-ui-border-base text-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={quantity}
                    onChange={(event) => {
                      void setVariantQuantity(variant.id, Number(event.target.value))
                    }}
                    disabled={isMutatingCart || isCartLoading}
                    className="h-9 w-20 rounded-lg border border-ui-border-base px-2 text-center"
                  />
                  <button
                    type="button"
                    disabled={isMutatingCart || isCartLoading}
                    onClick={() => {
                      void increaseVariantQuantity(variant.id, 1)
                    }}
                    className="h-9 w-9 rounded-lg border border-ui-border-base text-lg"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    disabled={isMutatingCart || isCartLoading}
                    onClick={() => {
                      void increaseVariantQuantity(variant.id, 5)
                    }}
                    className="rounded-lg border border-ui-border-base px-3 py-1.5 text-sm"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    disabled={isMutatingCart || isCartLoading}
                    onClick={() => {
                      void increaseVariantQuantity(variant.id, 10)
                    }}
                    className="rounded-lg border border-ui-border-base px-3 py-1.5 text-sm"
                  >
                    +10
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {isDrawerOpen && (
        <button
          type="button"
          onClick={() => setIsDrawerOpen(false)}
          className="fixed inset-0 z-[45] bg-black/20"
          aria-label="Close cart drawer"
        />
      )}

      <aside
        className={clx(
          "fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-2xl border border-ui-border-base transition-transform duration-300",
          "max-h-[70vh] overflow-hidden",
          {
            "translate-y-0": isDrawerOpen,
            "translate-y-full": !isDrawerOpen,
          }
        )}
        aria-hidden={!isDrawerOpen}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ui-border-base">
          <p className="text-base font-semibold text-ui-fg-base">
            Cart ({totalCartItems})
          </p>
          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="text-sm text-ui-fg-subtle hover:text-ui-fg-base"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4 max-h-[calc(70vh-140px)]">
          {cartItems.length ? (
            <div className="space-y-3">
              {cartItems.map((item) => {
                const lineTotal =
                  typeof item.total === "number"
                    ? item.total
                    : item.quantity * (item.unit_price ?? 0)

                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-ui-border-base pb-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ui-fg-base break-words">
                        {item.variant?.title || item.title}
                      </p>
                      <p className="text-sm text-ui-fg-subtle">Qty: {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-ui-fg-base whitespace-nowrap">
                        {convertToLocale({
                          amount: lineTotal,
                          currency_code: cart?.currency_code ?? currencyCode,
                        })}
                      </p>
                      <button
                        type="button"
                        disabled={isMutatingCart}
                        onClick={() => {
                          void (async () => {
                            setIsMutatingCart(true)
                            try {
                              await deleteLineItem(item.id)
                              await syncCart()
                              router.refresh()
                            } finally {
                              setIsMutatingCart(false)
                            }
                          })()
                        }}
                        className="text-sm text-ui-fg-subtle hover:text-ui-fg-base disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-ui-fg-subtle">Your cart is empty.</p>
          )}
        </div>

        <div className="border-t border-ui-border-base px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ui-fg-base">Subtotal</p>
            <p className="text-base font-semibold text-ui-fg-base">
              {convertToLocale({
                amount: cart?.subtotal ?? 0,
                currency_code: cart?.currency_code ?? currencyCode,
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={!canCheckout}
            className={clx("h-11 w-full rounded-lg px-6 text-sm font-medium", {
              "bg-ui-fg-base text-ui-bg-base": canCheckout,
              "bg-ui-bg-disabled text-ui-fg-muted cursor-not-allowed":
                !canCheckout,
            })}
          >
            {canCheckout ? "Continue Order" : "Minimum 30 empanadas"}
          </button>
        </div>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ui-border-base bg-white/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
            <button
              type="button"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className="space-y-2 text-left"
            >
              <p className="text-sm font-semibold tracking-wide text-ui-fg-base uppercase">
                {totalEmpanadas} / {MIN_ORDER} Empanadas
              </p>
              <div className="h-2 w-full bg-ui-bg-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-ui-fg-base transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-ui-fg-subtle">
                Estimated total: {convertToLocale({ amount: totalPrice, currency_code: currencyCode })}
              </p>
              {!canCheckout && (
                <p className="text-sm text-ui-fg-muted">Minimum 30 empanadas</p>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsDrawerOpen((prev) => !prev)}
              className="h-11 rounded-lg px-6 text-sm font-medium transition-colors bg-ui-fg-base text-ui-bg-base"
            >
              {isDrawerOpen ? "Hide Order" : "Review Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
