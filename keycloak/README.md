# Keycloak Configuration

This directory contains the configuration for the Keycloak identity and access management service.

## Automatic Realm Import

The `docker-compose.yml` file is configured to automatically import any realm configuration files found in the `keycloak/import/` directory when Keycloak starts for the first time.

*   **File:** `supervity-realm.json` contains the complete configuration for the `supervity` realm.

This setup includes:
*   A pre-configured client: `super-client-dnh-dev-0001`
*   Two pre-configured users for testing:
    *   **Username:** `admin` / **Password:** `password` (has the `admin` realm role)
    *   **Username:** `user` / **Password:** `password` (has no special roles)

### Important Notes

*   **First Run Only:** The import only happens if the realm does not already exist.
*   **To Re-Import:** If you need to reset the Keycloak configuration, you must stop the services (`make down`), delete the `keycloak/keycloak_data` directory, and start the services again (`make up`).
*   **Client Secret:** The client secret in the exported JSON is a placeholder. A new secret is generated on the first import. You must retrieve this new secret from the Keycloak Admin UI and update your `.env` file accordingly.