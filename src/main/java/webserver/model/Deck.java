package webserver.model;

import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Id;
import java.util.List;
import java.util.Objects;

@Document(collection = "decks")
public class Deck {

    @Id
    private String id;

    private String deckName;
    private List<String> players;

    public Deck() {}

    public Deck(String deckName, List<String> players) {
        this.deckName = deckName;
        this.players = players;
    }

    public String getDeckName() {
        return deckName;
    }

    public void setDeckName(String deckName) {
        this.deckName = deckName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getPlayers() {
        return players;
    }

    public void setPlayers(List<String> players) {
        this.players = players;
    }

    @Override
    public String toString() {
        return "Deck{" +
                "id='" + id + '\'' +
                ", players=" + players +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Deck deck = (Deck) o;
        return Objects.equals(id, deck.id) &&
                Objects.equals(players, deck.players);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, players);
    }
}
