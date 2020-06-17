package webserver.loader;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import webserver.generatedata.Players;
import webserver.model.Player;
import webserver.repository.DeckRepository;
import webserver.repository.PlayerRepository;

import java.io.File;

/**
 * @author timbeatham
 */
@Component
public class DatabaseLoader {

    @Autowired
    private PlayerRepository repository;

    @Bean
    CommandLineRunner init(PlayerRepository repository, DeckRepository deckRepository) {
        return args -> {
            // Empty the repository to begin with.
            //repository.deleteAll();
            //ObjectMapper objectMapper = new ObjectMapper();
            //Players players = objectMapper.readValue(new File("players.json"), Players.class);
            //repository.saveAll(players.getPlayerList()); // Insert all of the players to the database.

            for (Player player : repository.findAll()) {
                System.out.println(player);
            }

        };
    }

}
