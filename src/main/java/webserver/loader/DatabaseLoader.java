package webserver.loader;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import webserver.generatedata.Players;
import webserver.model.Player;
import webserver.repository.ChampionshipRepository;

import java.io.File;

/**
 * @author timbeatham
 */
@Component
public class DatabaseLoader {

    @Bean
    CommandLineRunner init(ChampionshipRepository repository) {
        return args -> {

            // Load from the JSON file.
            ObjectMapper objectMapper = new ObjectMapper();
            File file = new File("players.json");
            Players players = objectMapper.readValue(file, Players.class);

            for (Player player : players.getPlayerList()){
                repository.save(player);
            }
        };
    }

}
