import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;

public class Test {
    public static void main(String[] args) throws IOException {

        // Get elements from the football database site.
        Document doc = Jsoup.connect("https://fbref.com/en/squads/5bfb9659/Leeds-United").get();

        // Get the tbody.
        Element table = doc.select("table.stats_table").select("tbody").get(0);

        // Get each element in the table.
        Elements rows = table.select("tr");

        for (int i = 0; i < rows.size(); i++){
            Element row = rows.get(i);
            Elements player = row.select("th.left");

            for (int j = 0; j < player.size(); j++){
                System.out.println("Player: " + player.select("a[href]").text());
            }
        }

    }
}