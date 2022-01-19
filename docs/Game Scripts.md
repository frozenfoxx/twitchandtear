# Game Scripts

There are a number of scripts that allow you to control the game state.

## CheckSecrets

* **Description**: announces when a Secret is found.
* **Invocation**: `pukename "Zandromon CheckSecrets"`
* **Trigger**: immediately after level is first loaded.
* **Output**: `"Secret found!"`

## EnteredGame

* **Description**: player enters the game announcement.
* **Invocation**: `pukename "Zandromon EnteredGame"`
* **Trigger**: on player entering the map.
* **Output**: `[Player Name] has entered the game.`

## LevelStats

* **Description**: end of level stats.
* **Invocation**: `pukename "Zandromon LevelStats"`
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
* **Invocation**: `pukename "Zandromon PlayerDied"`
* **Trigger**: on player death.
* **Output**: `[Player Name] has died`

## SpawnEnemy

* **Description**: spawns a monster.
* **Invocation**: `pukename "Zandromon SpawnEnemy [SpawnID]"`
* **Trigger**: on demand.
* **Output**: `"A monster has been summoned!"`

## SpawnFollower

* **Description**: spawns a follower.
* **Invocation**: `pukename "Zandromon SpawnFollower"`
* **Trigger**: on demand.
* **Output**: `"A follower has been summoned!"`

## SpawnPowerUp

* **Description**: spawns a .
* **Invocation**: `pukename "Zandromon SpawnPowerUp [SpawnID]"`
* **Trigger**: on demand.
* **Output**: `"PowerUp Spawned!"`

## Welcome

* **Description**: player enters the game announcement.
* **Invocation**: `pukename "Zandromon Welcome"`
* **Trigger**: immediately after level is first loaded.
* **Output**: `TwitchAndTear loaded.`
