require_relative './gameevent.rb'

# GameCommand is for events originating within a game
class GameCommand < GameEvent
  def initialize
    # Union of regular expressions matching valid commands in the server log
    @commands = Regexp.union [ /^Secret\ found!$/,
                  /^.+\ has\ entered\ the\ game\.$/,
                  /^.+\ has\ died\.$/,
                  /^Level\ stat:.*$/ ]
  end
  
  # Translate the requested text into a command
  def command (request)
    tokens = request.split(/\s+/)
    raise ArgumentError, "Not a command" if tokens.empty?
  end
end