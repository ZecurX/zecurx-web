---
description: Generate a UI/UX design system using the UI/UX Pro Max skill.
---

1.  **Analyze Request**: Identify the product type, industry, and style keywords from the user's request. If missing, ask the user for them.
2.  **Generate Design System**: Run the search script to generate the design system.
    ```bash
    python3 .agent/skills/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system
    ```
    *Replace `<product_type> <industry> <keywords>` with the actual values.*
3.  **Refine (Optional)**: If the user needs specific details (e.g., charts, typography), run the domain-specific search.
    ```bash
    python3 .agent/skills/ui-ux-pro-max/scripts/search.py "<keywords>" --domain <domain>
    ```
