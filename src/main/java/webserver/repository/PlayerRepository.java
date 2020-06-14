package webserver.repository;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import webserver.model.Player;

import java.util.List;

@Repository
public interface PlayerRepository extends MongoRepository<Player, String>, PlayerRepositoryCustom {}
