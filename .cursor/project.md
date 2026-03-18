Project: LABOCA ecommerce platform

Architecture:

- backend/ → Medusa backend server
- frontend/ → React storefront
- .cursor/ → AI configuration (rules, context, skills)

Backend:

The backend is built using Medusa.

Guidelines:
- Business logic must live in services
- Complex flows should use Medusa workflows
- Avoid modifying Medusa core packages
- Prefer modules and plugins for extensibility
- Use the dependency injection container

Frontend:

The frontend is a React storefront that communicates with the Medusa backend.

Guidelines:
- Use modular React components
- Keep UI and business logic separated
- Use Medusa storefront APIs
- Optimize for performance and SEO

AI Context:

The AI assistant should reference:
- medusa-docs.txt for official Medusa documentation
- project rules inside .cursor/rules/
- skills inside .cursor/skills/

Goal:

Maintain a clean, scalable ecommerce architecture using Medusa for backend services and React for the storefront.