# GameEvent is the base class that defines communication to and from a game in progress
class GameEvent
  def intialize
    # List of valid commands
    @commands = Hash.new
  end

  attr_reader :commands
end