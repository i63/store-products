# store-products

```sh
oc new-app centos/mongodb-26-centos7 -l app=mongodb --name=mongodb \
 -e MONGODB_ADMIN_PASSWORD=password  -e MONGODB_USER=app_user \
  -e MONGODB_DATABASE=store  -e MONGODB_PASSWORD=password
  
oc new-app https://github.com/i63/store-products --name=products
oc env dc products MONGO_USER=admin MONGO_PASSWORD=password MONGO_SERVER=mongodb MONGO_PORT=27017 MONGO_DB=store
```
