const API_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const API_KEY = process.env.MEDUSA_ADMIN_API_KEY

const data: any = {
  "Aubergine napolitana": {
    diet: "vegan",
    description: "Roasted aubergine with semi dried tomatoes, basil and vegan cheese",
  },
  "Caramelized red onion and triple cheese": {
    diet: "vegetarian",
    description: "Caramelized red onions with balsamico, camembert, gouda, parmesan and walnuts",
  },
  "Chicken and chorizo": {
    diet: "meat",
    description: "Roasted chicken thighs with spanish chorizo, roasted red peppers and basil",
  },
  "Chilli sin carne": {
    diet: "vegan",
    description: "Lentils and black beans in a spicy red mole sauce with coriander",
  },
  "Ham and smoked cheese": {
    diet: "meat",
    description: "Chunks of danish country ham with provolone, smoked Vesterhavs cheese, mozzarella and chives",
  },
  "Malbec steak": {
    diet: "meat",
    description: "Beef chuck steak slowly braised in malbec wine, portobello mushrooms, caramelized onions and truffle",
  },
  "Peruvian lamb": {
    diet: "meat",
    description: "Slowly braised lamb shoulder in cusquena beer with carrots, potatoes, aji amarillo and coriander",
  },
  "Spicy BBQ pulled pork": {
    diet: "meat",
    description: "Pork neck fillets slowly cooked for 12 hours in orange juice with BBQ sauce, achiote, chipotle chilli and roasted peppers",
  },
  "Spicy beef barbacoa": {
    diet: "meat",
    description: "Beef rump cooked for 12 hours with smoked ancho chilli, barbecue sauce, cinnamon, spices and onions",
  },
  "Spinach and goats cheese": {
    diet: "vegetarian",
    description: "Spinach with goats cheese and smoked paprika",
  },
  "Sweet potato": {
    diet: "vegetarian",
    description: "Roasted sweet potato with feta cheese and semi dried tomatoes",
  },
  "Traditional beef": {
    diet: "meat",
    description: "Slowly roasted minced beef cooked with smoked paprika, manzana olives, egg, raisins and chunks of potato",
  },
}

async function run() {
  const res = await fetch(`${API_URL}/admin/products?limit=100`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  })

  const json: any = await res.json()

  if (!json.products) {
    console.error("❌ Could not fetch products")
    console.log(json)
    return
  }

  const empanada = json.products.find(
    (p: any) => p.title && p.title.toLowerCase() === "empanada"
  )

  if (!empanada) {
    console.error("❌ Could not find product named 'Empanada'")
    return
  }

  for (const variant of empanada.variants) {
    const flavor = variant.title.split(" / ")[0]

    if (data[flavor]) {
      await fetch(`${API_URL}/admin/product-variants/${variant.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...(variant.metadata || {}),
            description: data[flavor].description,
            diet: data[flavor].diet,
          },
        }),
      })

      console.log("✅ Updated:", variant.title)
    }
  }

  console.log("🎉 Done updating empanadas")
}

run()

