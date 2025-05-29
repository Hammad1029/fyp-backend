#!/bin/bash

docker exec -it institutions npm run db:deploy
docker exec -it institutions npm run seed
docker exec -it users npm run db:deploy
docker exec -it users npm run seed
docker exec -it games npm run db:deploy
docker exec -it games npm run seed
docker exec -it attempts npm run db:deploy
docker exec -it attempts npm run seed