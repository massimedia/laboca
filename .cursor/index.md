# LABOCA Repository Structure

Root project for the LABOCA ecommerce platform.

## Backend

Location: /backend

The backend is a Medusa server.

Responsibilities:
- Product management
- Order processing
- Payment workflows
- Inventory
- Custom services and plugins

Business logic should live in services or workflows.

---

## Frontend

Location: /frontend

The frontend is a React storefront that communicates with the Medusa backend API.

Responsibilities:
- Product browsing
- Cart
- Checkout
- Customer accounts
- Storefront UI

Keep UI components modular and reusable.

---

## Scripts

start-laboca.sh  
Starts backend and frontend development servers.

stop-laboca.sh  
Stops development services.

---

## AI Configuration

.cursor/

Contains AI configuration:

- rules → architecture rules
- skills → Claude agent skills
- context → Medusa documentation
- project.md → architecture description
- commands.md → custom AI commands
