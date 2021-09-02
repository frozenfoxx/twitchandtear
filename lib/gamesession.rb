require 'pty'
require 'open3'
require_relative './externalcommand.rb'
require_relative './gamecommand.rb'

# GameSession defines a running game session
class GameSession
  def initialize(launchcommand)
    @lncCmd = launchcommand
    @extCmd = ExternalCommand.new
    @gamCmd = GameCommand.new
  end

  def start
    if $verbose then puts "Launching with command:  \"#{@lncCmd}\"" end

    i, o = Open3.popen2 "#{@lncCmd}"
    
    # Begin command loop
    Thread.new do
      # FIXME: currently this is taking from stdin. This needs to be changed to the Twitch handler object, but for testing will work to verify the ACS scripting
      ARGF.each_line do |line|
        stop && exit if line =~ /quit/
        request = line.split(/\s+/)
        if request.empty?
          puts "No command"
        elsif !@extCmd.commands.has_key? request[0]
          puts "Command not recognized"
        else
          i.puts @extCmd.command(request)
        end
      end
    
      i.close
    end

    # Parse output from the game session
    while res = o.gets
      # Output only recognized commands
      puts res if res =~ @gamCmd.commands
    end
  end

  def stop
    `ps aux | grep #{@lncCmd} | grep -v grep | awk '{print $2}' | xargs kill`
  end
end
