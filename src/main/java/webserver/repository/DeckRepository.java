package webserver.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import webserver.model.Deck;

@Repository
public interface DeckRepository extends MongoRepository<Deck, String>, DeckRepositoryCustom{}
