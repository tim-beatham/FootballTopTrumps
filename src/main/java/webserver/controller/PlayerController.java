package webserver.controller;

import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;
import webserver.model.Deck;
import webserver.model.Player;
import webserver.repository.DeckRepository;
import webserver.repository.PlayerRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping(value = "/api/v1/")
public class PlayerController {

    private final PlayerRepository playerRepository;
    private final DeckRepository deckRepository;

    private static final String OPERATORS = "([a-zA-Z0-9/-]+)(=|>|<)([a-zA-Z0-9/-]+)";

    private static final List<String> NUMERICAL_PROPERTIES = Arrays.asList("goals", "assists", "yellowCards",
            "redCards", "minsPlayed", "starts");

    public PlayerController(PlayerRepository playerRepository,
                            DeckRepository deckRepository) {
        this.playerRepository = playerRepository;
        this.deckRepository = deckRepository;
    }

    @GetMapping("players/")
    public List<Player> all() {
        return playerRepository.findAll();
    }

    @GetMapping("players/{id}")
    public Player one(@PathVariable String id) {
        return playerRepository.findById(id)
                .orElseThrow(null);
    }

    @GetMapping("players/search")
    @ResponseBody
    public List<Player> queryPlayers(@RequestParam(value = "query") String search){
        String[] subQueries = search.split(",");

        Pattern pattern = Pattern.compile(OPERATORS);
        Matcher m;

        List<Player> players = new ArrayList<>();

        for (int i = 0; i < subQueries.length; i++) {
            String subQuery = subQueries[i];

            m = pattern.matcher(subQuery);


            if (m.find()) {
                String opcode = m.group(1).trim();
                char operator = m.group(2).charAt(0);
                Object operand = m.group(3).trim();

                if (NUMERICAL_PROPERTIES.contains(opcode)) {
                    try {
                        operand = Integer.parseInt((String) operand);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                }

                if (i == 0) {
                    players.addAll(playerRepository.playerQuery(opcode, operator, operand));
                } else {
                    players.retainAll(playerRepository.playerQuery(opcode, operator, operand));
                }

            } else {
                return null;
            }
        }

        return players;
    };

    @GetMapping("decks/")
    @ResponseBody
    public List<Deck> getDecks() {
        return deckRepository.findAll();
    }

    @PostMapping("decks/")
    public Deck addDeck(@RequestBody Deck newDeck) {
        return deckRepository.save(newDeck);
    }
}
