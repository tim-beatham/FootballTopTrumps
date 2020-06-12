import org.codehaus.jackson.map.ObjectMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import java.io.FileWriter;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author tim-beatham.github.io
 */
public class GenChampData {

    // Links to all of the teams in the championship.
    private static Map<String, String> teams = new HashMap<>();

    // Map of links to players in each team.
    private static Map<String, List<String>> squads = new HashMap<>();

    // The URL of the championship table.
    private static final String CHAMPIONSHIP_TABLE = "https://fbref.com/en/comps/10/Championship-Stats";
    private static final String CHAMPIONSHIP_TABLE_ID = "results32331_overall";
    private static final String FBREF_URL = "https://fbref.com/";
    private static final String SQUAD_TABLE_ID = "stats_standard_ks_3233";
    private static final String PLAYER_SEASONS_ID = "stats_standard_ks_dom_lg";
    private static final String MISC_TABLE_ID = "stats_misc_ks_dom_lg";

    // Regex used to extract information from the player.
    private static final String POSITION_REGEX = "Position: *([A-Z]+)";


    /**
     * Gets the links to each team in the championship.
     */
    public static void getTeams() throws IOException {
        // Get the HTML document.
        Document doc = Jsoup.connect(CHAMPIONSHIP_TABLE).userAgent("Mozilla").get();
        // Get every team in the championship.
        Elements teamsLink = doc.getElementById(CHAMPIONSHIP_TABLE_ID).select("a[href~=/en/squads/(.+)]");

        // Clear the list of teams first of all.
        teams.clear();

        teamsLink.forEach(e -> {
            teams.put(e.text(), e.attr("href"));
        });

        System.out.println(teams);
    }

    /**
     * Retrieves links to each player in each squad.
     * @param url of the squad.
     */
    public static void getSquad(String url, String squad) throws IOException {

        url = FBREF_URL + url;

        Document doc = Jsoup.connect(url).userAgent("Mozilla").get();

        // Now we need to get links to each player.
        Elements players = doc.getElementById(SQUAD_TABLE_ID)
                .select("th.left").select("a[href~=/en/players/(.+)]");

        List<String> playerURLs = new ArrayList<>();

        players.forEach(e -> {
            playerURLs.add(e.attr("href"));
        });

        squads.put(squad, playerURLs);
    }

    /**
     * Creates an instance of a Player based on the url
     * supplied.
     * @param url of the profile of the player.
     */
    public static Player genPlayer(String url, String club) throws Exception {
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
                Integer.parseInt(redCards), Integer.parseInt(minsPlayed), Integer.parseInt(matchesPlayed), imageURL);

    }



    /**
     * @param args command line arguments
     */
    public static void main(String[] args) throws Exception {
        getTeams();

        Set<String> squadKeys = teams.keySet();

        for (String team : squadKeys) {
            getSquad(teams.get(team), team);
        }

        List<Player> players = new ArrayList<>();
        squadKeys = squads.keySet();
        for (String squad : squadKeys) {
            // Get a list of the player urls in the current squad.
            List<String> playerURLs = squads.get(squad);

            for (String playerURL : playerURLs) {
                try {
                    Player player = genPlayer(playerURL, squad);
                    System.out.println(player);
                    players.add(player);

                } catch (Exception e) {
                }
            }
        }

        Players playersObj = new Players(players);
        ObjectMapper playersMapper = new ObjectMapper();
        playersMapper.writerWithDefaultPrettyPrinter().writeValue(new FileWriter("players.json"), playersObj);
    }
}
