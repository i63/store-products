# store-products

```sh
oc new-app openshift/mongodb:2.6 -e MONGODB_ADMIN_PASSWORD=password -l app=mongo
oc new-app https://github.com/i63/store-products
oc env dc store-frontend MONGO_USER=admin MONGO_PASSWORD=password MONGO_SERVER=mongodb MONGO_PORT=27017 MONGO_DB=store
```
