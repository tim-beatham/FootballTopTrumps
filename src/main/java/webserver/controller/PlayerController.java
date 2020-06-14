package webserver.controller;

import org.springframework.web.bind.annotation.*;
import webserver.model.Player;
import webserver.repository.PlayerRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping(value = "/api/v1/players")
public class PlayerController {

    private final PlayerRepository repository;

    private static final String OPERATORS = "(.*)(=|>|<)(.*)";

    private static final List<String> NUMERICAL_PROPERTIES = Arrays.asList("goals", "assists", "yellowCards",
            "redCards", "minsPlayed", "starts");

    public PlayerController(PlayerRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public List<Player> all() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public Player one(@PathVariable String id) {
        return repository.findById(id)
                .orElseThrow(null);
    }

    @GetMapping("/search")
    @ResponseBody
    public List<Player> queryPlayers(@RequestParam(value = "query") String search){
        String[] subQueries = search.split(",");

        Pattern pattern = Pattern.compile(OPERATORS);
        Matcher m;

        List<Player> players = new ArrayList<>();

        for (String subQuery : subQueries) {
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

                if (players.isEmpty()) {
                    players.addAll(repository.playerQuery(opcode, operator, operand));
                } else {
                    players.retainAll(repository.playerQuery(opcode, operator, operand));
                }

            } else {
                return null;
            }
        }

        return players;
    };


}
