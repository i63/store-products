# store-products

```sh
oc new-app mongodb -l app=mongodb --name=productsdb \
  -e MONGODB_ADMIN_PASSWORD=password  -e MONGODB_USER=app_user \
  -e MONGODB_DATABASE=store  -e MONGODB_PASSWORD=password
  
oc new-app https://github.com/i63/store-products --name=products

oc env dc products MONGO_USER=app_user MONGO_PASSWORD=password MONGO_SERVER=productsdb MONGO_PORT=27017 MONGO_DB=store

```
