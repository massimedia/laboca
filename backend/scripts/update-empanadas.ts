export default async function updateEmpanadas({ container }) {
  const productService = container.resolve("productService")

  const data = {
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

  const products = await productService.list({}, { relations: ["variants"] })

  const empanada = products.find((p) => p.title === "Empanada")

  if (!empanada) {
    console.log("❌ Empanada product not found")
    return
  }

  for (const variant of empanada.variants) {
    const flavor = variant.title.split(" / ")[0]

    if (data[flavor]) {
      await productService.updateVariant(variant.id, {
        metadata: {
          ...(variant.metadata || {}),
          description: data[flavor].description,
          diet: data[flavor].diet,
        },
      })

      console.log("✅ Updated:", variant.title)
    }
  }

  console.log("🎉 Empanadas updated")
}

