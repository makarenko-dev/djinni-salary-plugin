# djinni-salary-plugin
## Description

Chrome extension that helps to find what is salary for a vacancy on [Djinni](https://djinni.co/).

You can download already built release from [Chrome store](https://chromewebstore.google.com/detail/djinni-salary/lgcmjfabbfbbnjdbemmnbedmlofkcdaf)

| So instead this  |  you can have this |
|---|---|
|  ![](screens/orig.png) |  ![Demo animation](screens/updated.gif) |


This extension do support caching. It interacts with [Backend](https://github.com/makarenko-dev/djinni-salary-back), which scraps vacancies and return result. Your Ip is not involved in any way. All work is done on backend

## Build and install from source
Fill the values in .env.stub and rename to .env

API_HOST - should point to backend address. Curent prod on https://djinni.makarenko-dev.com
```
npm ci
npm run build

```

