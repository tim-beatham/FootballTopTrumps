package webserver.repository;

import webserver.model.Player;

import java.util.List;

public interface PlayerRepositoryCustom {

    List<Player> playerQuery(String attribute, char operator, Object value);
}
