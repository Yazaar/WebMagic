<h1>"Terrible" auto gambling bot for twitch chatbots, for example StreamElements</h1>
It does actually work, but watch out. Different channels have different winrates... (lower winrate higher of a risk)
<h3>How it works:</h3>
You specify a start gamble value<br><br>
Each time that you lose is the value multiplied by 2<br>
Each time that you win is the value set to your start value (or start value +1)<br>
(pretty solid strategy to increase your points, but still at risk of losing it all!)
<br><br>
<h3><a href="https://yazaar.github.io/Twitch-Auto-Gamble-Bot/">PROJECT URL</a></h3>
<h3>Setup:</h3>
<ol>
  <li>Open up the URL (<a href="https://yazaar.github.io/Twitch-Auto-Gamble-Bot/">THIS URL</a>)</li>
  <li>Open up the TMI URL, found on the top of the webpage. Login with twitch and paste the result in the TMI-box</li>
  <li>Type your twitch username in the second box (match the TMI user)</li>
  <li>Type the twitch channel that you wish to connect to in the third box</li>
  <li>Type the command execution cooldown in the 4:th box.</li>
  <li>Type the bots username in the 5:th box, capitalization does not matter</li>
  <li>Type the commandname in the 6:th box, for example "!gamble"</li>
  <li>Type something that can be recognized as a gamble by you. This can be custructed pretty complicated because of the power of RegEx. Here is an example:<br>Bot response: Yazaar won 100 points in roulette and now has 4947 points!  FeelsGoodMan<br>RegEx: Yazaar [^ ]+ \d+ points in roulette and now has \d+ points!</li>
  <li>Type something that can be recognized as a win in the 8:th box, for example "Yazaar won" if the response is "Yazaar won ... ..."</li>
  <li>Type the start value for gamble in the 9:th box</li>
  <li>Type the value where you would like to quit gambling in the 10:th box (when the balance becomes something lower than the input it quits, for example -25000)</li>
</ol>
To see outputs, open up the console in your browser (F12 or CTRL+SHIFT+I or rightclick >> inspect >> console)
