# Exercise Tracker REST API Microservice

### User Stories

#### 1. Create a user

I can create a user by posting form data `username` to:
```
POST /api/exercise/new-user
```
and returned will be an object with: 
```
{ username: <username>, _id: <_id> }
```

#### 2. Get all users

I can get an array of *all* users by getting:
```
GET api/exercise/users
```
with the same info returned as when creating a user, i.e.:
```
[
  { username: <username>, _id: <_id> },
  { username: <username>, _id: <_id> },
  ...
]
```

#### 3. Add an exercise

I can add an exercise to any user by posting form data `userId(_id)`, `description`, `duration` and optionally `date` to: 
```
POST /api/exercise/add
```
If no date is supplied it will use the current date. Returned will be the user object also with the exercise fields added:
```
{
  username: <username>, 
  _id: <_id>,
  description: <desc>,
  duration: <mins>,
  date: "Tue Aug 25 2020"
}
```

#### 4. Get full exercise log

I can retrieve a full exercise log of any user by getting:
```
GET /api/exercise/log?{userId}
```
with a parameter of `userId(_id)`. Returned will be the user object with the added array exercise log and count (total exercise count):
```
{ 
  username: <username>, 
  _id: <_id>,
  log: [
    { description: <desc>, duration: <mins>, date: <date> },
    { description: <desc>, duration: <mins>, date: <date> },
    ...
  ],
  count: <total exercise count>
}
```

#### 5. Get partial exercise log

I can retrieve a part of the log of any user by also passing along optional parameters of `from`, `to` or `limit` (date format = yyyy-mm-dd, limit = int):
```
GET /api/exercise/log?{userId}[&from][&to][&limit]
```
