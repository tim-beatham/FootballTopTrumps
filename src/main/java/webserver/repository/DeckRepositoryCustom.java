package webserver.repository;

import webserver.model.Deck;

import java.util.List;

public interface DeckRepositoryCustom {

    List<Deck> searchDecks(String name);


}
