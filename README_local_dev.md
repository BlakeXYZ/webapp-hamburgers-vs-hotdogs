
# Flask Local Dev Commands
### enter local flask shell (must run in powershell):
    docker compose -f docker-compose-dev.yml run --rm manage shell

### flask db, unit testing commands:
    docker compose -f docker-compose-dev.yml run --rm manage test
###### only run tests whose names match ClickTest
    docker compose -f docker-compose-dev.yml run --rm manage test -k ClickTest 
###### only run tests inside test_models.py
    docker compose -f docker-compose-dev.yml run --rm manage test -k test_models.py 

--- 

##### flask db migration command (must run in powershell):
    docker compose -f docker-compose-dev.yml run --rm manage db migrate -m "implement Click Test table"

##### flask db, apply changes to db, upgrade (must run in powershell):
    docker compose -f docker-compose-dev.yml run --rm manage db upgrade

##### flask db, print history (must run in powershell):
    docker compose -f docker-compose-dev.yml run --rm manage db history

--- 
### How to view local flask dev, SQLALCHEMY>SQLITE db while running Docker Container
Download Microsoft's extension: Container Tools

- Create Connection
- Select SQLite
- Select Path to Local project environment's dev.db
