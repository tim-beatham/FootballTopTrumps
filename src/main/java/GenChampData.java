import com.mongodb.MongoClient;
import com.mongodb.MongoClientURI;
import com.mongodb.client.MongoDatabase;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.List;

/**
 *
 * @author tim-beatham.github.io
 */
public class GenChampData {

    // Links to all of the teams in the championship.
    private static List<String> teams;

    // The URL of the championship table.
    private static final String CHAMPIONSHIP_TABLE = "https://fbref.com/en/comps/10/Championship-Stats";
    private static final String CHAMPIONSHIP_TABLE_ID = "results32331_overall";

    /**
     * Gets the links to each team in the championship.
     */
    public static void connect() throws IOException {
        // Get the HTML document.
        Document doc = Jsoup.connect(CHAMPIONSHIP_TABLE).userAgent("Mozilla").get();
        // Get every team in the championship.
        Elements teamsLink = doc.getElementById(CHAMPIONSHIP_TABLE_ID).select("a[href~=/en/squads/(.+)]");

        // Clear the list of teams first of all.
        teams.clear();

        teamsLink.forEach(e -> {
            teams.add(e.attr("href"));
        });
    }






    /**
     * @param args command line arguments
     */
    public static void main(String[] args) throws IOException {
        connect();
    }
}
