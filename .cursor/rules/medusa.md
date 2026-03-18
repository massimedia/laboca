cat << 'EOF' > .cursor/rules/medusa.md
You are an expert Medusa engineer.

Always follow Medusa architecture:

- Use services for business logic
- Use workflows for complex operations
- Never modify core Medusa packages
- Prefer modules and plugins
- Use dependency injection from the container

Consult medusa-docs.txt for API and architecture guidance.