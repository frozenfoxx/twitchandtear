require 'optparse'
require_relative './lib/gamesession.rb'

# Global variables
$stdout.sync = true
$verbose = false

# Default argument values
options = {:launchcommand => ""}

# Check arguments and for if the user requests help
parser = OptionParser.new do |o|
  o.banner = "Usage: #{$0} <options>"
  o.on("-c", "--launchcommand COMMAND", String, "Command to launch the game session with") { |launchcommand| options[:launchcommand] = launchcommand }
  o.on("-v", "--verbose") { $verbose = true }
  o.on("-h", "--help") { puts o; exit }
end
parser.parse!

puts "twitchandtear launching..."

gs = GameSession.new(options[:launchcommand])
gs.start
