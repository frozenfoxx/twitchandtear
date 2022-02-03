require_relative './gameevent.rb'

# ExternalCommand is for events originating outside the game
class ExternalCommand < GameEvent
  def initialize
    @commands = [ 'KillFollower',
                  'SpawnEnemy',
                  'SpawnFollower',
                  'SpawnPowerUp' ]
  end
  
  # Run a command
  def command (request)
    failure = false

    # Determine in-game command to run with arguments
    case request[0]
      when "KillFollower"
        failure = true if request.size < 3
        if request[3] == nil then request[3] = '' end

      when "SpawnEnemy"
        failure = true if request.size < 3
        if request[3] == nil then request[3] = 0 end

      when "SpawnFollower"
        failure = true if request.size < 3
        if request[3] == nil then request[3] = '' end

      when "SpawnPowerup"
        failure = true if request.size < 2

      else
        raise ArgumentError, "Unknown command"
    end

    # Run the command
    if failure
      return "echo Not enough arguments"
    else
      extCommand = request.shift
      return "pukename \"TwitchAndTear #{extCommand}\" #{request.join(" ")}"
    end
  end
end
