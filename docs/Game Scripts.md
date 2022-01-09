# Game Scripts

There are a number of scripts that allow you to control the game state.

## CheckSecrets

* **Description**: announces when a Secret is found.
* **Invocation**: `pukename "TwitchAndTear CheckSecrets"`
* **Trigger**: immediately after level is first loaded.
* **Output**: `"Secret found!"`

## EnteredGame

* **Description**: player enters the game announcement.
* **Invocation**: `pukename "TwitchAndTear EnteredGame"`
* **Trigger**: on player entering the map.
* **Output**: `[Player Name] has entered the game.`

## LevelStats

* **Description**: end of level stats.
* **Invocation**: `pukename "TwitchAndTear LevelStats"`
* **Trigger**: after level exit but before next level loads.
* **Output**:

```
"Level stat: time [time taken]"
"Level stat: kills [killed monsters]"
"Level stat: secrets [number of secrets]"
"Level stat: end"
```

## PlayerDied

* **Description**: player death announcement.
* **Invocation**: `pukename "TwitchAndTear PlayerDied"`
* **Trigger**: on player death.
* **Output**: `[Player Name] has died`

## SpawnEnemy

* **Description**: spawns a monster.
* **Invocation**: `pukename "TwitchAndTear SpawnEnemy [SpawnID]"`
* **Trigger**: on demand.
* **Output**: `"A monster has been summoned!"`

## SpawnFollower

* **Description**: spawns a follower.
* **Invocation**: `pukename "TwitchAndTear SpawnFollower"`
* **Trigger**: on demand.
* **Output**: `"A follower has been summoned!"`

## SpawnPowerUp

* **Description**: spawns a .
* **Invocation**: `pukename "TwitchAndTear SpawnPowerUp [SpawnID]"`
* **Trigger**: on demand.
* **Output**: `"PowerUp Spawned!"`

## Welcome

* **Description**: player enters the game announcement.
* **Invocation**: `pukename "TwitchAndTear Welcome"`
* **Trigger**: immediately after level is first loaded.
* **Output**: `TwitchAndTear loaded.`
