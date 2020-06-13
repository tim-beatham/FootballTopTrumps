package webserver.generatedata;

import webserver.model.Player;

import java.util.List;

public class Players {

    private List<Player> playerList;

    public Players(List<Player> playerList) {
        this.playerList = playerList;
    }

    public Players() {}

    public List<Player> getPlayerList() {
        return playerList;
    }

    public void setPlayerList(List<Player> playerList) {
        this.playerList = playerList;
    }
}
