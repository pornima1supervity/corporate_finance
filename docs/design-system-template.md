# Frontend Design System Template

## 1. Design Philosophy

The design should be **professional, data-centric, and trustworthy**. The target user is a business professional who requires clarity, efficiency, and confidence in the application. The UI must handle complex information (tables, forms, charts, documents) without feeling cluttered.

The core principles are:

*   **Clarity First:** Prioritize readability and intuitive navigation. Users must be able to find and interpret complex data quickly.
*   **Modern & Clean:** Utilize negative space, clean lines, and a sophisticated color palette to create a modern, uncluttered interface that feels efficient.
*   **Authoritative & Trustworthy:** The visual language should feel stable, secure, and reliable, reinforcing the accuracy of the AI-driven insights.
*   **Contextual Theming:** Each major section or module should have a subtle, unique visual identity to help users orient themselves within the application.

## 2. Core Color Palette

This palette is designed to be professional and accessible, with clear roles for each color. It expands on the variables defined in `frontend/src/app/globals.css`.

| Role                  | Color                                                              | CSS Variable         | Rationale & Usage                                                                                                                              |
| --------------------- | ------------------------------------------------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primary**           | <span style="color:#000b37">█</span> `#000b37`                      | `--primary`          | A deep, corporate blue. Establishes a professional and trustworthy tone. Used for primary buttons, active navigation, and key headings. |
| **Accent / Success**  | <span style="color:#85c20b">█</span> `#85c20b`                      | `--accent`           | A vibrant, modern green. Provides high contrast for calls-to-action, success states, focus rings, and positive indicators.      |
| **Background**        | <span style="background:linear-gradient(135deg, #f0f5ff, #fafafa)">█</span> Gradient | `--background`       | A very light, airy blue-to-white gradient. Softer than pure white, adds depth and sophistication to the overall UI.                      |
| **Foreground**        | <span style="color:#020617">█</span> `#020617`                      | `--foreground`       | A soft black for primary text. Easier on the eyes for long reading sessions than pure `#000000`.                                           |
| **Cards & Popovers**  | <span style="background:rgba(255,255,255,0.6)">█</span> `rgba(255,255,255,0.6)` | `--card`             | A semi-transparent white with a backdrop blur (glassmorphism). Creates a modern, layered feel for UI surfaces like cards and dialogs.         |
| **Borders & Inputs**  | <span style="color:#e5e7eb">█</span> `#e5e7eb`                      | `--border`, `--input` | Light gray for subtle separation and input fields. Keeps the UI clean and structured without being visually heavy.                           |
| **Muted Text**        | <span style="color:#474747">█</span> `#474747`                      | `--muted-foreground` | Dark gray for secondary information, descriptions, and placeholders. Provides clear visual hierarchy for text.                               |
| **Destructive/Error** | <span style="color:#ef4444">█</span> `#ef4444`                      | `--destructive`      | A standard, unambiguous red for error messages, delete buttons, and critical alerts.                                                           |
| **Warning/Info**      | <span style="color:#f59e0b">█</span> `#f59e0b` (Amber 500)         | *N/A (Suggestion)*   | A warm amber color should be used for non-critical warnings, such as low-confidence AI scores or informational alerts.                        |

### Chart Palette
Used for data visualizations in the dashboard and reports.
- **Chart 1 (Blue):** `#000b37` (`--chart-1`)
- **Chart 2 (Light Blue):** `#8289ec` (`--chart-2`)
- **Chart 3 (Green):** `#85c20b` (`--chart-3`)
- **Chart 4 (Light Green):** `#c3fb54` (`--chart-4`)
- **Chart 5 (Orange):** `#ff9a5a` (`--chart-5`)

## 3. Typography

-   **Font:** **Inter** (as configured in `layout.tsx`). It's a highly readable and modern sans-serif font, perfect for UIs that require clarity across various sizes and weights.
-   **Hierarchy:** Use font weight (`font-medium`, `font-semibold`) and color (`--foreground`, `--muted-foreground`) to establish a clear visual hierarchy for titles, labels, and body text.

## 4. Component Styling

Your use of `shadcn/ui` provides an excellent, consistent component base. The color scheme should be applied as follows:

-   **Cards:** Use the glassmorphism style defined in `globals.css`. Add a subtle `hover:-translate-y-1` and `hover:shadow-xl` transition to make interactive cards feel more responsive.
-   **Buttons:**
    -   **Primary actions** (e.g., "Create", "Save", "Submit") use the `default` variant (Primary Blue).
    -   **Secondary actions** (e.g., "Cancel", "View Details") use the `outline` or `ghost` variants.
    -   **Destructive actions** (e.g., "Delete") use the `destructive` variant.
-   **Badges:** Use variants to communicate status clearly (`success` for "Active/Complete", `destructive` for "Error/Inactive", `secondary` for neutral states).
-   **Inputs & Forms:** Use the `--border` and `--input` colors for a clean look, with the `--accent` green as the focus ring (`--ring`) to draw attention.

## 5. Module Theming

To give each major section or module a distinct feel and improve user orientation, you can introduce subtle theming using accent colors on key elements like page headers, icons, or specific component borders.

| Module/Section              | Key Function          | Proposed Accent         | Implementation Example                                                                                                  |
| --------------------------- | --------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**               | Overview & Analytics  | **Neutral / Balanced**  | Use the core palette as-is. This is the neutral home base.                                                              |
| **Content Manager**         | Creation & Editing    | **Accent Green**        | Use the vibrant `--accent` green more prominently for step indicators, section headers, and primary "Save/Publish" buttons. |
| **Review Workbench**        | Detailed Review       | **Focused Teal**        | Introduce a calm Teal accent (`#14b8a6`) for progress bars, active item borders, and control panel buttons. Fosters focus. |
| **Analytics Module**        | Data & Reports        | **Primary Blue**        | Emphasize the deep `--primary` blue and the full chart palette. UI should feel analytical and data-driven.                 |
| **Settings/Admin**          | Configuration         | **Neutral Purple**      | Use a subtle Purple accent (`#7c3aed`) for headers, icons, and tab triggers to signify "configuration" and "admin."    |