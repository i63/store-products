# store-products

```sh
oc new-app centos/mongodb-26-centos7 --name=mongodb -e MONGODB_ADMIN_PASSWORD=password -l app=mongodb
oc new-app https://github.com/i63/store-products --name=products
oc env dc products MONGO_USER=admin MONGO_PASSWORD=password MONGO_SERVER=mongodb MONGO_PORT=27017 MONGO_DB=store
```
