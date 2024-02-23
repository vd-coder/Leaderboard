The project demanded real-time leaderboard for 1 million users where there can be 100 transactions per second.<br>
So, first point of design was a normal web server using a database to register transactions of user and fetching top 50 and rank of logged in user whenever asked but due to size of users this design would cause significant lag in fetching results to user and hence the result seen by user would not be real time or rather faulty.<br>
So seeing this, I thought of using a in store database which produces top 50 and rank of logged in user at a more efficiently and the changes in main database can be made in background.<br>
# Using Redis
So after this entire analysis, <b>redis</b> was used as in store database due to sorted set data structure it provides. This data structures allows to fetch top k users in logarithmic time.<br>
As soon as the user made a transaction, this was first changed in sorted set and updates in database were carried in background. This allowed to keep leaderboard real-time. When a user enquire for latest realboard, a api request was made from client side using javascript and a specific route on server sent the required array as a response and leaderboard was refreshed without refreshing the entire page leading to more efficiency.(Use of AJAJ)<br>
# MySQL over MongoDB
I used MySQL (SQL) as a database over MongoDB(NoSQL) because in this the data was easily representable in a tabular form and there was no need to modify it later on.Secondly this application was scaled using in store database(Redis in this case) and not using main database so did not felt need of using MongoDB. Also transactions were made , so ACID properties can be useful if number of users are small and in store database is to be eliminated.
INSTRUCTION TO RUN PROJECT:
1)First configure the .env file
2)Enter npm start into terminal opened in project directory
FUTURE GOALS:
We can add css to beautify the application and add error handling to provide proper information to user if something goes wrong.
# Environment Variables

Redis Server Details
```bash
REDIS_HOST, REDIS_PASSWORD, REDIS_PORT
```
SQL Server Details
```bash
SQL_HOST, SQL_USER, SQL_PASSWORD, DATABASE
```
Secret for session configuration
```bash
SECRET
```
Port for Express Server
```bash
PORT
```
