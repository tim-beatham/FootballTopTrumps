package webserver.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import webserver.model.Deck;

import java.util.*;

public class DeckRepositoryImpl implements DeckRepositoryCustom{

    private final MongoTemplate mongoTemplate;

    @Autowired
    public DeckRepositoryImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public List<Deck> searchDecks(String name) {

        String[] nameArray = name.split("");
        Set<String> nameSet = new HashSet<>(Arrays.asList(nameArray));

        // Find all the decks
        List<Deck> decks = mongoTemplate.findAll(Deck.class);

        // Order by the Jaccard score.
        // Store a map of each deck along with the jaccard score.
        Map<Deck, Float> jaccardMap = new HashMap<>();

        // Iterate over each element in the deck
        // Calculate the jaccard score of the search item and the element of interest.
        decks.forEach(deck -> {
            String[] deckNameArray = deck.getDeckName().split("");
            Set<String> deckNameSet = new HashSet<>(Arrays.asList(deckNameArray));

            Set<String> intersection = new HashSet<>(deckNameSet);
            intersection.retainAll(nameSet);

            Set<String> union = new HashSet<>(deckNameSet);
            union.addAll(nameSet);

            float jaccardScore = (float) intersection.size() / union.size();
            jaccardMap.put(deck, jaccardScore);
        });

        // Now we need to sort the decks.
        List<Deck> sortDecksList = new ArrayList<>(jaccardMap.keySet());

        sortDecksList.sort((d1, d2) -> {

           float jaccardD1 = jaccardMap.get(d1);
           float jaccardD2 = jaccardMap.get(d2);

           if (jaccardD1 < jaccardD2)
                return 1;
           else if (jaccardD1 > jaccardD2)
                return -1;

            return 0;
        });

        return sortDecksList;
    }
}
