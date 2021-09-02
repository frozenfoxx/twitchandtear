require_relative './gameevent.rb'

# ExternalCommand is for events originating outside the game
class ExternalCommand < GameEvent
  def initialize
    @commands = { 'killfollower'  => 'KillFollower',
                  'spawnenemy'    => 'SpawnEnemy',
                  'spawnfollower' => 'SpawnFollower',
                  'spawnpowerup'  => 'SpawnPowerUp' }
  end
  
  # Translate the requested text into a command
  def command (request)
    failure = false

    # Determine in-game command to run with arguments
    case request[0]
      when "killfollower"
        failure = true if request.size < 3
        if request[3] == nil then request[3] = '' end

      when "spawnenemy"
        failure = true if request.size < 3
        if request[3] == nil then request[3] = 0 end

      when "spawnfollower"
        failure = true if request.size < 3
        if request[3] == nil then request[3] = '' end

      when "spawnpowerup"
        failure = true if request.size < 2
  
      else
        raise ArgumentError, "Unknown command"
    end

    # Run the command
    if failure
      return "echo Not enough arguments"
    else
      transCommand = request.shift
      return "pukename \"TwitchAndTear #{@commands[transCommand]}\" #{request.join(" ")}"
    end
  end
end
