package webserver.generatedata;

import org.codehaus.jackson.map.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import webserver.model.Player;

import java.io.FileWriter;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author tim-beatham.github.io
 */
public class GenData {

    // The URL of the championship table.
    private static final String CHAMPIONSHIP_TABLE = "https://fbref.com/en/comps/10/Championship-Stats";
    private static final String PREMIER_LEAGUE_TABLE = "https://fbref.com/en/comps/9/Premier-League-Stats";
    private static final String BUNDESLIGA_TABLE = "https://fbref.com/en/comps/20/Bundesliga-Stats";
    private static final String SERIE_A_TABLE = "https://fbref.com/en/comps/11/Serie-A-Stats";

    // Get the tables that we want to process.
    private static final Map<String, String> tables = new HashMap<>();

    private static final String FBREF_URL = "https://fbref.com/";
    private static final String PLAYER_SEASONS_ID = "stats_standard_ks_dom_lg";

    // Regex used to extract information from the player.
    private static final String POSITION_REGEX = "Position: *([A-Z]+)";


    /**
     * Initialises the the tables hash map.
     * This unfortunately has to be hard coded.
     */
    public static void initTablesMap() {
        tables.put("Championship", CHAMPIONSHIP_TABLE);
        //tables.put("Premier League", PREMIER_LEAGUE_TABLE);
        //tables.put("Bundesliga", BUNDESLIGA_TABLE);
        //tables.put("Serie A", SERIE_A_TABLE);
    }


    /**
     * Gets the links to each team in the championship.
     * @return A map mapping a team to the corresponding team URL.
     */
    public static Map<String, String> getTeams(String division) throws IOException {
        // Get the HTML document.
        Document doc = Jsoup.connect(division).userAgent("Mozilla").get();
        // Get every team in the championship.
        Elements teamsLink = doc.select("table[id~=results\\d*_overall]").select("a[href~=/en/squads/(.+)]");

        Map<String, String> teams = new HashMap<>();

        teamsLink.forEach(e -> {
            teams.put(e.text(), e.attr("href"));
        });

        return teams;
    }

    /**
     * Retrieves links to each player in each squad.
     * @param url of the squad.
     */
    public static List<String> getSquad(String url, String squad) throws IOException {

        url = FBREF_URL + url;

        Document doc = Jsoup.connect(url).userAgent("Mozilla").get();

        // Now we need to get links to each player.
        Elements players = doc.select("table[id~=stats_standard_ks_\\d+]")
                .select("th.left").select("a[href~=/en/players/(.+)]");

        List<String> playerURLs = new ArrayList<>();

        players.forEach(e -> {
            playerURLs.add(e.attr("href"));
        });

        return playerURLs;
    }

    /**
     * Creates an instance of a webserver.model.Player based on the url
     * supplied.
     * @param url of the profile of the player.
     */
    public static Player genPlayer(String url, String club, String division) throws Exception {
        url = FBREF_URL + url;
        Document doc = Jsoup.connect(url).userAgent("Mozilla").get();

        // Get information about the player
        Element playerInfo = doc.getElementById("meta");

        // Get the name of the player
        String name = playerInfo.select("h1[itemprop=name]").text();

        // Get the position of the player.
        Elements position = playerInfo.select("p:contains(Position)");

        // Use Regular Expressions to extract the position of the player.
        Pattern positionPattern = Pattern.compile(POSITION_REGEX);

        Matcher m = positionPattern.matcher(position.text());
        String posString;
        if (m.find())
            posString = m.group(1);
        else
            throw new Exception(name + " - the web page is not in the correct format");

        // Get the DoB of the player
        String dOB = playerInfo.getElementById("necro-birth").text();

        // Get the link to the player profile picture.
        String imageURL = playerInfo.select("div.media-item > img").attr("src");

        if (imageURL.equals(""))
            throw new Exception("no image linked with the player");

        if (doc.select("strong:contains(Dom Lg)") == null)
            throw new NoDomesticLeagueException("this player has no starts in the domestic league");

        // Get MP, Min, Gls, Ast
        String matchesPlayed = doc.select("h4[data-tip~=Matches Played by the player .*] ~ p").get(0).text();
        String minsPlayed = doc.select("h4[data-tip=Minutes] ~ p").get(0).text();
        String goalsScored = doc.select("h4[data-tip=Goals scored or allowed] ~ p").get(0).text();
        String assists = doc.select("h4[data-tip=Assists] ~ p").get(0).text();


        // Get the standard stats table.
        Elements seasonsStandard = doc.getElementById(PLAYER_SEASONS_ID).select("tbody").select("tr");

        // Get the most recent season the player has played in
        Element recentSeason = seasonsStandard.get(seasonsStandard.size() - 1);
        String yellowCards = recentSeason.select("td[data-stat=cards_yellow]").text();
        String redCards = recentSeason.select("td[data-stat=cards_red]").text();

        return new Player(name, club, dOB, posString, Integer.parseInt(goalsScored), Integer.parseInt(assists), Integer.parseInt(yellowCards),
                Integer.parseInt(redCards), Integer.parseInt(minsPlayed), Integer.parseInt(matchesPlayed), imageURL, division);

    }

    public static List<Player> getPlayers(String division) throws Exception {
        Map<String, String> teams = getTeams(tables.get(division));

        List<Player> playerList = new ArrayList<>();

        // Iterate over the teams
        for (String team : teams.keySet()) {
            List<String> players = getSquad(teams.get(team), team);

            for (String playerURL : players) {
                try {
                    Player player = genPlayer(playerURL, team, division);
                    System.out.println(player);
                    playerList.add(player);
                } catch (Exception e) {}

            }
        }

        return playerList;
    }



    /**
     * @param args command line arguments
     */
    public static void main(String[] args) throws Exception {
        initTablesMap();

        List<Player> players = new ArrayList<>();

        for (String division : tables.keySet()) {
            players.addAll(getPlayers(division));
        }

        Players playersObj = new Players(players);
        ObjectMapper playersMapper = new ObjectMapper();
        playersMapper.writerWithDefaultPrettyPrinter().writeValue(new FileWriter("players.json"), playersObj);
    }
}
