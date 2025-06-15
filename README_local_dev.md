
### Flask Local Dev Commands
enter local flask shell (must run in powershell):
docker compose -f docker-compose-dev.yml run --rm manage shell

flask db migration command (must run in powershell):
docker compose -f docker-compose-dev.yml run --rm manage db migrate -m "implement Click Test table"

flask db, apply changes to db, upgrade:
docker compose -f docker-compose-dev.yml run --rm manage db upgrade

flask db, print history:
docker compose -f docker-compose-dev.yml run --rm manage db history

### How to view local flask dev, SQLALCHEMY>SQLITE db while running Docker Container

Download Microsoft's extension: Container Tools

- Create Connection
- Select SQLite
- Select Path to Local project environment's dev.db
