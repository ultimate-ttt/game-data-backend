# save-game-data
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ultimate-ttt/save-game-data/issues)

Data of finished games from the [ultimate tic-tac-toe app](https://github.com/ultimate-ttt/ultimate-ttt) is passed to this Azure Function and then saved to a MongoDB instance.

This allows us to get insights into how our users play this game. 

Once we gathered data from at least a few hundred games we will start to give this data back to the open source community.

## Privacy
Only the following data is saved about a game: 

```
{
  date
  winner
  gameState
  moves
  isReplay
}
```

## Deploy yourself
- Setup a new Azure Function App 
- Setup Continuous Deployment
- Deploy the code
- Setup your MongoDB
  - if you don't want to change any code choose the following parameters:
    - ultimatettt-analytics -> database name
    - gameData -> collection name
- Set an appsetting in the Azure Function for the connection to the MongoDB
  - name it "mongoDbConnection" if you don't want to change the code

## Contribute
Any type of feedback, pull request or issue is welcome.

## License
[MIT](https://tldrlegal.com/license/mit-license)
