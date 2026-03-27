#!/bin/bash
# ──────────────────────────────────────────
# Atomverse — Post-Deploy Helper Script
# Jalankan di server setelah upload file
# Usage: bash deploy.sh [migrate|cache|setup|full]
# ──────────────────────────────────────────

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

echo "📁 Project dir: $PROJECT_DIR"
echo ""

cmd_migrate() {
    echo "🔄 Running database migrations..."
    php artisan migrate --force
    echo "✅ Migrations complete."
}

cmd_cache() {
    echo "🔄 Caching config, routes, views..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
    echo "✅ Cache complete."
}

cmd_clear() {
    echo "🧹 Clearing all caches..."
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    php artisan view:clear
    echo "✅ Caches cleared."
}

cmd_setup() {
    echo "🔧 First-time setup..."
    composer install --no-dev --optimize-autoloader
    php artisan key:generate
    chmod -R 775 storage bootstrap/cache
    php artisan storage:link
    php artisan migrate --force
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    echo "✅ Setup complete."
}

cmd_full() {
    cmd_clear
    cmd_migrate
    cmd_cache
    echo ""
    echo "🎉 Full deploy complete!"
}

case "${1:-full}" in
    migrate) cmd_migrate ;;
    cache)   cmd_cache ;;
    clear)   cmd_clear ;;
    setup)   cmd_setup ;;
    full)    cmd_full ;;
    *)
        echo "Usage: bash deploy.sh [migrate|cache|clear|setup|full]"
        echo ""
        echo "  migrate  — Run database migrations"
        echo "  cache    — Cache config, routes, views"
        echo "  clear    — Clear all caches"
        echo "  setup    — First-time setup (install, key, permissions, migrate, cache)"
        echo "  full     — Clear + migrate + cache (default)"
        exit 1
        ;;
esac
