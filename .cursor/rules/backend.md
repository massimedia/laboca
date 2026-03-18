This directory contains a Medusa backend.

Follow Medusa backend architecture:

- Business logic goes in services
- Use workflows for complex operations
- Use Medusa dependency injection container
- Do not modify Medusa core packages
- Prefer modules and plugins

When implementing features:
- Add services instead of putting logic in routes
- Use subscribers for events
- Follow Medusa module structure

Always reference medusa-docs.txt for correct APIs and architecture.