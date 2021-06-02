b# Techbase Code Challenge

**Requisites**
- node version >= 12 (tested and run on **v12.18.3**)
- npm

**Steps to run:**
- Run `yarn install` to install packages
- Run `yarn start` to start server. (*default port is **1111***)

**Details of project**
 
1. API server supports the following endpoints:
    - `/api/users`: Get list of current users - must have `user-view` permission, token will be validated when call
        - Support the following queries:
            - page: page number
            - pageSize: number of items per page
            - email: email of user to query (query type will be `contain`)
            - name: name of user to query (query type will be `contain`)
            - lastAccess: last time user login to system (query type will be equal `year, month and date`)
            - Sample query url: `http://localhost:1111/api/users?page=1&pageSize=10&email=example&name=example&lastAccess=2020-05-10`
        - Request's header:
            ```
            {
                ... Other headers,
                "uuid": "token-uuid-string"
            }
            ```
            
    - `/api/users/login`: Login a user - no permission check, no token needed 
        - **Note**: assume that password is already hashed when send request
        - Body data:
            ```
            {
                "email": "example@example.com", // require, check if email is valid
                "password": "samplePassword", // require
                "name": "exampleName" // require
            } 
            ```
        - Response:
            ```
            {
                "data": {
                    "email": "asd2@asd.com",
                    "password": "111",
                    "name": "123",
                    "role": "c1afbe9f-11d5-4b8f-b229-9e73245b9170",
                    "id": "a95c97bc-945c-4e98-999f-c0731b6cbeee",
                    "created": "2020-08-07T11:47:05.361Z",
                    "lastAccess": "2020-08-07T11:47:10.847Z"
                },
                "meta": {
                    "resource": "users"
                }
            }
            ```
        - Response's header:
            ```
            {
                ... Other headers,
                "uuid": "token-uuid-string"
            }
            ```      
              
    - `/api/users/logout`: Expire a token - must have `user-logout` permission, token will be validated when call
        - Request's header:
            ```
            {
                ... Other headers,
                "uuid": "token-uuid-string"
            }
            ```
        - Response: empty string with status 200 OK or error returned in JSON
        
    - `/api/users/register`: Create a new user - no permission check, no token needed
        - Body data:
            ```
            {
                "email": "example@example.com", // require, check if email is valid
                "password": "samplePassword", // require
                "name": "exampleName" // require
            } 
            ```
        - Response:
            ```
            {
                "data": {
                    "email": "asd2@asd.com",
                    "password": "111",
                    "name": "123",
                    "role": "c1afbe9f-11d5-4b8f-b229-9e73245b9170",
                    "id": "a95c97bc-945c-4e98-999f-c0731b6cbeee",
                    "created": "2020-08-07T11:47:05.361Z"
                },
                "meta": {
                    "resource": "users"
                }
            }
            ```
            
    - GET `/api/medicines/`: get list of medicines
        - Support the following queries:
                - page: page number
                - pageSize: number of items per page
                - price: price of medicine to query (query type will be `equal`)
                - name: name of medicine to query (query type will be `contain`)
                - Sample query url: `http://localhost:1111/api/medicines?page=1&pageSize=10&price=1&name=example`
        - Request's header:
            ```
            {
                ... Other headers,
                "uuid": "token-uuid-string"
            }
            ```
            
    - POST `/api/medicines/`: create a new medicine
        - Request's header:
            ```
            {
                ... Other headers,
                "uuid": "token-uuid-string"
            }
            ```
        - Body data:
            ```
            {
                "name": "sample", // require
                "price": 1, // require
            } 
            ```
        - Response:
            ```
            {
                "data": {
                    "name": "tra",
                    "price": 1,
                    "id": "1da3f490-9d53-4234-9ad2-7284a8783f27",
                    "created": "2020-08-07T11:52:45.813Z"
                },
                "meta": {
                    "resource": "medicines"
                }
            }
            ```          
            
    - `/api/health`: to check if API is running or not
    
2. API server use role-based access control (RBAC):
    - Permissions will belong to roles and role will be assign to user when register.
    - When user login:
        - A token will be created for that user with **2 hours expiry**
        - A set of permissions will be assigned to that token.
    - System will based on that token's permissions to check if a user can access an endpoint or not.
    - Token's expiry **cannot be extended**, user can login to get a new token.
    
3. JSON files are used to store data, system has 4 files:
    - medicines.json
    - users.json
    - roles.json
    - tokens.json